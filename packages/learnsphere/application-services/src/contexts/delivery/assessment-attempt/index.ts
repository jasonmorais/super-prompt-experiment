import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface AssessmentSubmitCommand { assessmentId: string; learningRecordId: string; courseId: string; activityKey: string; timeSpentMinutes: number; responses: Domain.Contexts.Learning.Assessment.AssessmentResponse[]; }
export const AssessmentAttempt = (dataSources: DataSources, learnerId: string) => ({
	myAttempts: () => dataSources.readonlyDataSource.Delivery.AssessmentAttempt.AssessmentAttemptReadRepo.listForLearner({ learnerId }),
	submit: async (command: AssessmentSubmitCommand) => {
		const assessmentRef = await dataSources.readonlyDataSource.Learning.Assessment.AssessmentReadRepo.getById(command.assessmentId);
		if (!assessmentRef) throw new Error('Assessment was not found');
		const course = await dataSources.readonlyDataSource.Learning.Course.CourseReadRepo.getById(command.courseId, { organizationId: assessmentRef.organizationId, learnerId });
		const activity = course?.modules.flatMap((module) => module.lessons).find((lesson) => lesson.key === command.activityKey);
		if (!course || activity?.type !== 'ASSESSMENT' || activity.assessment?.id !== assessmentRef.id) throw new Error('Assessment is not attached to this course activity');
		const attemptCount = await dataSources.readonlyDataSource.Delivery.AssessmentAttempt.AssessmentAttemptReadRepo.count({ organizationId: assessmentRef.organizationId, learnerId, assessmentId: assessmentRef.id, courseId: command.courseId, activityKey: command.activityKey });
		if (attemptCount >= assessmentRef.maxAttempts) throw new Error('Maximum assessment attempts reached');
		let result: Domain.Contexts.Delivery.AssessmentAttempt.AssessmentAttemptEntityReference | undefined;
		await dataSources.domainDataSource.Learning.Assessment.AssessmentUnitOfWork.withScopedTransaction(async (assessmentRepository) => {
			const assessment = await assessmentRepository.getById(command.assessmentId);
			const score = assessment.grade(command.responses);
			await dataSources.domainDataSource.Delivery.AssessmentAttempt.AssessmentAttemptUnitOfWork.withScopedTransaction(async (attemptRepository) => { const attempt = await attemptRepository.getNewInstance({ assessment, learnerId, courseId: command.courseId, activityKey: command.activityKey, responses: command.responses, result: score, attemptNumber: attemptCount + 1 }); result = await attemptRepository.save(attempt); });
			if (score.passed) await dataSources.domainDataSource.Delivery.LearningRecord.LearningRecordUnitOfWork.withScopedTransaction(async (recordRepository) => { const record = await recordRepository.get(command.learningRecordId); if (record.courseId !== command.courseId || record.learnerId !== learnerId) throw new Error('Learning record does not match this assessment attempt'); record.recordActivity(command.activityKey, command.timeSpentMinutes, score.score); await recordRepository.save(record); });
		});
		if (!result) throw new Error('Assessment attempt was not saved');
		return result;
	},
});
export type AssessmentAttemptApplicationService = ReturnType<typeof AssessmentAttempt>;

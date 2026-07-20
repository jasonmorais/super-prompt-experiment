import crypto from 'node:crypto';
import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface EnrollCommand {
	organizationId: string;
	learnerId: string;
	learnerDisplayName: string;
	learnerEmail: string;
	teamName: string;
	courseId: string;
	source: Domain.Contexts.Delivery.LearningRecord.EnrollmentSource;
	assignedBy: string | null;
	assignmentId?: string | null;
	dueAt: Date | null;
}

export const enroll = async (dataSources: DataSources, command: EnrollCommand): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference> => {
	const course = await dataSources.readonlyDataSource.Learning.Course.CourseReadRepo.getById(command.courseId, {
		organizationId: command.organizationId,
		...(command.source === 'SELF_ENROLLED' ? { learnerId: command.learnerId } : {}),
	});
	if (!course) throw new Error(`Course ${command.courseId} was not found`);
	if (course.status !== 'PUBLISHED') throw new Error('Only published courses can be assigned or enrolled');
	if (course.discoverability === 'ASSIGNED_ONLY' && command.source === 'SELF_ENROLLED') throw new Error('This course is available by assignment only');
	const requiredActivityKeys: string[] = course.modules.flatMap((module) => module.lessons.filter((lesson) => lesson.required).map((lesson) => lesson.key));
	let result: Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | undefined;
	await dataSources.domainDataSource.Delivery.LearningRecord.LearningRecordUnitOfWork.withScopedTransaction(async (repo) => {
		const existing = await repo.findByLearnerAndCourse(command.organizationId, command.learnerId, course.id);
		if (existing) {
			if (existing.status === 'COMPLETED') {
				result = existing;
				return;
			}
			existing.reassign({ teamName: command.teamName, assignedBy: command.assignedBy ?? '', assignmentId: command.assignmentId ?? crypto.randomUUID(), dueAt: command.dueAt });
			result = await repo.save(existing);
			return;
		}
		const record = await repo.getNewInstance({
			organizationId: command.organizationId,
			learnerId: command.learnerId,
			learnerDisplayName: command.learnerDisplayName,
			learnerEmail: command.learnerEmail,
			teamName: command.teamName,
			courseId: course.id,
			courseTitle: course.title,
			courseCategory: course.category,
			requiresCompletionScreenshot: course.requiresCompletionScreenshot,
			requiredActivityKeys,
			completionScreenshot: null,
			source: command.source,
			assignedBy: command.assignedBy,
			assignmentId: command.assignmentId ?? null,
			dueAt: command.dueAt,
		});
		result = await repo.save(record);
	});
	if (!result) throw new Error('Learning record was not created');
	return result;
};

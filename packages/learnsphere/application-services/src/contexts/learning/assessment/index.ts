import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface AssessmentCreateCommand { organizationId: string; title: string; description: string; passingScore: number; maxAttempts: number; questions: Domain.Contexts.Learning.Assessment.AssessmentQuestion[]; }
export interface AssessmentUpdateCommand extends Omit<AssessmentCreateCommand, 'organizationId'> { id: string; }
export const Assessment = (dataSources: DataSources, createdBy: string) => ({
	list: async (organizationId: string) => dataSources.readonlyDataSource.Learning.Assessment.AssessmentReadRepo.list(organizationId),
	queryById: async (id: string) => dataSources.readonlyDataSource.Learning.Assessment.AssessmentReadRepo.getById(id),
	queryForAuthoring: async (id: string) => dataSources.readonlyDataSource.Learning.Assessment.AssessmentReadRepo.getById(id),
	create: async (command: AssessmentCreateCommand) => { let result: Domain.Contexts.Learning.Assessment.AssessmentEntityReference | undefined; await dataSources.domainDataSource.Learning.Assessment.AssessmentUnitOfWork.withScopedTransaction(async (repository) => { const assessment = await repository.getNewInstance({ ...command, createdBy }); for (const question of command.questions) assessment.addQuestion(question); result = await repository.save(assessment); }); if (!result) throw new Error('Assessment was not created'); return result; },
	update: async (command: AssessmentUpdateCommand) => { let result: Domain.Contexts.Learning.Assessment.AssessmentEntityReference | undefined; await dataSources.domainDataSource.Learning.Assessment.AssessmentUnitOfWork.withScopedTransaction(async (repository) => { const assessment = await repository.getById(command.id); assessment.update(command); result = await repository.save(assessment); }); if (!result) throw new Error('Assessment was not updated'); return result; },
	publish: async (id: string) => { let result: Domain.Contexts.Learning.Assessment.AssessmentEntityReference | undefined; await dataSources.domainDataSource.Learning.Assessment.AssessmentUnitOfWork.withScopedTransaction(async (repository) => { const assessment = await repository.getById(id); assessment.publish(); result = await repository.save(assessment); }); if (!result) throw new Error('Assessment was not published'); return result; },
});
export type AssessmentApplicationService = ReturnType<typeof Assessment>;

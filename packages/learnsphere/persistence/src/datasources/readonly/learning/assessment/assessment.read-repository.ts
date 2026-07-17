import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { AssessmentConverter } from '../../../domain/learning/assessment/assessment.domain-adapter.ts';
export interface AssessmentReadRepository { getById(id: string): Promise<Domain.Contexts.Learning.Assessment.AssessmentEntityReference | null>; list(organizationId: string, options?: { status?: Domain.Contexts.Learning.Assessment.AssessmentStatus }): Promise<Domain.Contexts.Learning.Assessment.AssessmentEntityReference[]>; }
export const getAssessmentReadRepository = (models: ModelsContext, passport: Domain.Passport): AssessmentReadRepository => { const converter = new AssessmentConverter(); return {
	getById: async (id) => { const document = await models.Assessment.findById(id).exec(); return document ? converter.toDomain(document, passport) : null; },
	list: async (organizationId, options) => (await models.Assessment.find({ organizationId, ...(options?.status ? { status: options.status } : {}) }).sort({ updatedAt: -1 }).exec()).map((document) => converter.toDomain(document, passport)),
}; };

import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { AssessmentConverter } from '../../../domain/learning/assessment/assessment.domain-adapter.ts';
export interface AssessmentReadRepository {
	getById(id: string): Promise<Domain.Contexts.Learning.Assessment.AssessmentEntityReference | null>;
	list(organizationId: string, options?: { status?: Domain.Contexts.Learning.Assessment.AssessmentStatus }): Promise<Domain.Contexts.Learning.Assessment.AssessmentEntityReference[]>;
}
export const getAssessmentReadRepository = (models: ModelsContext, passport: Domain.Passport): AssessmentReadRepository => {
	const converter = new AssessmentConverter();
	const canRead = (assessment: Domain.Contexts.Learning.Assessment.AssessmentEntityReference): boolean =>
		passport.learning.forAssessment(assessment).determineIf((permissions) => permissions.isSystemAccount || permissions.canManageAssessments || (permissions.canTakeAssessments && assessment.status === 'PUBLISHED'));
	return {
		getById: async (id) => {
			const document = await models.Assessment.findById(id).exec();
			if (!document || !passport.canAccessOrganization(document.organizationId)) return null;
			const assessment = converter.toDomain(document, passport);
			return canRead(assessment) ? assessment : null;
		},
		list: async (organizationId, options) => {
			if (!passport.canAccessOrganization(organizationId)) throw new Error('You do not have access to this organization');
			const documents = await models.Assessment.find({ organizationId, ...(options?.status ? { status: options.status } : {}) })
				.sort({ updatedAt: -1 })
				.exec();
			return documents.map((document) => converter.toDomain(document, passport)).filter(canRead);
		},
	};
};

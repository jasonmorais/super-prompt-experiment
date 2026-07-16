import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { LearnerUserConverter } from '../../../domain/user/learner-user/learner-user.domain-adapter.ts';

export interface LearnerUserReadRepository {
	getAll(): Promise<Domain.Contexts.User.LearnerUser.LearnerUserEntityReference[]>;
	getById(id: string): Promise<Domain.Contexts.User.LearnerUser.LearnerUserEntityReference | null>;
	getByExternalId(externalId: string): Promise<Domain.Contexts.User.LearnerUser.LearnerUserEntityReference | null>;
}
export const getLearnerUserReadRepository = (models: ModelsContext, passport: Domain.Passport): LearnerUserReadRepository => {
	const converter = new LearnerUserConverter();
	return {
		getAll: async () => (await models.LearnerUser.find({}).exec()).map((doc) => converter.toDomain(doc, passport)),
		getById: async (id) => { const doc = await models.LearnerUser.findById(id).exec(); return doc ? converter.toDomain(doc, passport) : null; },
		getByExternalId: async (externalId) => { const doc = await models.LearnerUser.findOne({ externalId }).exec(); return doc ? converter.toDomain(doc, passport) : null; },
	};
};

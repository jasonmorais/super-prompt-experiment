import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { LearnerUser as LearnerUserDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import type { LearnerUserDomainAdapter } from './learner-user.domain-adapter.ts';

export class LearnerUserRepository
	extends MongooseSeedwork.MongoRepositoryBase<LearnerUserDocument, LearnerUserDomainAdapter, Domain.Passport, Domain.Contexts.User.LearnerUser.LearnerUser<LearnerUserDomainAdapter>>
	implements Domain.Contexts.User.LearnerUser.LearnerUserRepository<LearnerUserDomainAdapter>
{
	async getByExternalId(externalId: string) {
		const document = await this.model.findOne({ externalId }).exec();
		if (!document) throw new Error(`LearnerUser with externalId ${externalId} not found`);
		return this.typeConverter.toDomain(document, this.passport);
	}
	getNewInstance(externalId: string, lastName: string, restOfName: string | undefined, email: string) {
		return Promise.resolve(Domain.Contexts.User.LearnerUser.LearnerUser.getNewInstance<LearnerUserDomainAdapter>(this.typeConverter.toAdapter(new this.model()), this.passport, externalId, lastName, restOfName, email));
	}
}

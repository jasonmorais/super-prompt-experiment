import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { TeamOperation as TeamOperationDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import type { TeamOperationDomainAdapter } from './team-operation.domain-adapter.ts';

export class TeamOperationRepository
	extends MongooseSeedwork.MongoRepositoryBase<TeamOperationDocument, TeamOperationDomainAdapter, Domain.Passport, Domain.Contexts.Operations.TeamOperation.TeamOperation<TeamOperationDomainAdapter>>
	implements Domain.Contexts.Operations.TeamOperation.TeamOperationRepository<TeamOperationDomainAdapter>
{
	getNewInstance(input: Domain.Contexts.Operations.TeamOperation.NewTeamOperationInput) {
		return Promise.resolve(Domain.Contexts.Operations.TeamOperation.TeamOperation.getNewInstance(this.typeConverter.toAdapter(new this.model()), input, this.passport));
	}
}

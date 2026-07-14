import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { TeamOperationModelType } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import { TeamOperationConverter } from './team-operation.domain-adapter.ts';
import { TeamOperationRepository } from './team-operation.repository.ts';

export const getTeamOperationUnitOfWork = (model: TeamOperationModelType, passport: Domain.Passport): Domain.Contexts.Operations.TeamOperation.TeamOperationUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new TeamOperationConverter(), TeamOperationRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};

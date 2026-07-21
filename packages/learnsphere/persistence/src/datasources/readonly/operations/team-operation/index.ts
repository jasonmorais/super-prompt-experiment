import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getTeamOperationReadRepository } from './team-operation.read-repository.ts';

export type { TeamOperationReadRepository } from './team-operation.read-repository.ts';

export const TeamOperationContext = (models: ModelsContext, passport: Domain.Passport) => ({ TeamOperationReadRepo: getTeamOperationReadRepository(models, passport) });

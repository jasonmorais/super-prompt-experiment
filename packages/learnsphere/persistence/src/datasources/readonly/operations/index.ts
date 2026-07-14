import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { TeamOperationContext } from './team-operation/index.ts';

export const OperationsContext = (models: ModelsContext, passport: Domain.Passport) => ({ TeamOperation: TeamOperationContext(models, passport) });
export type { TeamOperationReadRepository } from './team-operation/index.ts';

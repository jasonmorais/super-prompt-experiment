import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../../passport-factory.ts';
import type { TeamOperation, TeamOperationProps } from './team-operation.ts';
import type { TeamOperationRepository } from './team-operation.repository.ts';

export interface TeamOperationUnitOfWork extends UnitOfWork<Passport, TeamOperationProps, TeamOperation, TeamOperationRepository>, InitializedUnitOfWork<Passport, TeamOperationProps, TeamOperation, TeamOperationRepository> {}

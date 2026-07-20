import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { getOrganizationUnitOfWork } from './organization.uow.ts';
export const OrganizationPersistence = (models: ModelsContext, passport: Domain.Passport) => ({ OrganizationUnitOfWork: getOrganizationUnitOfWork(models.Organization, passport) });

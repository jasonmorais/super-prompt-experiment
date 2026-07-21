import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport-factory.ts';
import type { Organization, OrganizationProps } from './organization.ts';
import type { OrganizationRepository } from './organization.repository.ts';
export interface OrganizationUnitOfWork extends UnitOfWork<Passport, OrganizationProps, Organization<OrganizationProps>, OrganizationRepository<OrganizationProps>>, InitializedUnitOfWork<Passport, OrganizationProps, Organization<OrganizationProps>, OrganizationRepository<OrganizationProps>> {}

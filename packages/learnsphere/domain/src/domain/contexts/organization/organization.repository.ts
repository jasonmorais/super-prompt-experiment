import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Organization, OrganizationProps } from './organization.ts';
export interface OrganizationRepository<Props extends OrganizationProps = OrganizationProps> extends Repository<Organization<Props>> { getByExternalId(externalId: string): Promise<Organization<Props>>; getNewInstance(input: { externalId: string; name: string; parentOrganizationId: string | null; ancestorOrganizationIds: string[]; createdBy: string }): Promise<Organization<Props>>; }

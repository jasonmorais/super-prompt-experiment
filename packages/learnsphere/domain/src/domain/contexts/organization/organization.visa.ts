import type { OrganizationDomainPermissions } from './organization.domain-permissions.ts';
export interface OrganizationVisa { determineIf(predicate: (permissions: OrganizationDomainPermissions) => boolean): boolean; }

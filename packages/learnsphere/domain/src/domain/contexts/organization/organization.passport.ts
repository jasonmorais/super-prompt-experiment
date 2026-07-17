import type { OrganizationEntityReference } from './organization.ts';
import type { OrganizationVisa } from './organization.visa.ts';
export interface OrganizationPassport { forOrganization(organization: OrganizationEntityReference): OrganizationVisa; }

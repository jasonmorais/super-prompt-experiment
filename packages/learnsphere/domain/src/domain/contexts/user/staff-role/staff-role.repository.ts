import type { Repository } from '@cellix/domain-seedwork/repository';
import type { StaffRole, StaffRoleProps } from './staff-role.ts';

export interface StaffRoleRepository<props extends StaffRoleProps = StaffRoleProps> extends Repository<StaffRole<props>> {
	getById(id: string): Promise<StaffRole<props>>;
	getByRoleName(roleName: string): Promise<StaffRole<props>>;
	getDefaultRoleByEnterpriseAppRole(enterpriseAppRole: string): Promise<StaffRole<props>>;
	getNewInstance(roleName: string): Promise<StaffRole<props>>;
}

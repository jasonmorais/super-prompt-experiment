import type { Domain, Passport } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { createDefaultStaffRoles } from './default-staff-roles.ts';

export interface StaffRolePermissionCommand { staffPortalPermissions?: Partial<Domain.Contexts.User.StaffRole.StaffPortalPermissionsProps>; userPermissions?: Partial<Domain.Contexts.User.StaffRole.StaffRoleUserPermissionsProps>; staffRolePermissions?: Partial<Domain.Contexts.User.StaffRole.StaffRoleRolePermissionsProps>; }
export interface StaffRoleCreateCommand { roleName: string; enterpriseAppRole: Domain.Contexts.User.StaffRole.StaffEnterpriseAppRole; permissions?: StaffRolePermissionCommand; }
export interface StaffRoleUpdateCommand extends StaffRoleCreateCommand { roleId: string; }
const canManage = (passport: Passport): boolean => passport.user.forStaffRole({ id: '' } as Domain.Contexts.User.StaffRole.StaffRoleEntityReference).determineIf((permissions) => permissions.canManageStaffRolesAndPermissions);

export const StaffRole = (dataSources: DataSources, passport: Passport) => ({
	createDefaultRoles: createDefaultStaffRoles(dataSources),
	list: () => { if (!canManage(passport)) throw new Error('You do not have permission to view staff roles'); return dataSources.readonlyDataSource.User.StaffRole.StaffRoleReadRepo.getAll(); },
	queryById: (roleId: string) => { if (!canManage(passport)) throw new Error('You do not have permission to view staff roles'); return dataSources.readonlyDataSource.User.StaffRole.StaffRoleReadRepo.getById(roleId); },
	create: async (command: StaffRoleCreateCommand) => { if (!canManage(passport)) throw new Error('You do not have permission to create staff roles'); let result: Domain.Contexts.User.StaffRole.StaffRoleEntityReference | undefined; await dataSources.domainDataSource.User.StaffRole.StaffRoleUnitOfWork.withScopedTransaction(async (repository) => { const role = await repository.getNewInstance(command.roleName); role.enterpriseAppRole = command.enterpriseAppRole; role.updatePermissions(command.permissions ?? {}); result = await repository.save(role); }); if (!result) throw new Error('Unable to create staff role'); return result; },
	update: async (command: StaffRoleUpdateCommand) => { if (!canManage(passport)) throw new Error('You do not have permission to update staff roles'); let result: Domain.Contexts.User.StaffRole.StaffRoleEntityReference | undefined; await dataSources.domainDataSource.User.StaffRole.StaffRoleUnitOfWork.withScopedTransaction(async (repository) => { const role = await repository.getById(command.roleId); role.roleName = command.roleName; role.enterpriseAppRole = command.enterpriseAppRole; role.updatePermissions(command.permissions ?? {}); result = await repository.save(role); }); if (!result) throw new Error('Unable to update staff role'); return result; },
});

export type StaffRoleApplicationService = ReturnType<typeof StaffRole>;

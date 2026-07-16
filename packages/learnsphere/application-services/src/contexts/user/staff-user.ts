import type { Domain, Passport } from '@learnsphere/domain';
import { Domain as DomainRuntime } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { createDefaultStaffRoles } from './default-staff-roles.ts';

export interface StaffUserCreateIfNotExistsCommand { externalId: string; firstName: string; lastName: string; email: string; aadRoles: string[]; }
const normalizeClaim = (value: string): string => value.toLowerCase().replace(/[._ -]/g, '');
const roleForClaims = (roles: readonly Domain.Contexts.User.StaffRole.StaffRoleEntityReference[], claims: readonly string[]) => roles.find((role) => claims.some((claim) => { const value = normalizeClaim(claim); return value === normalizeClaim(role.roleName) || value === normalizeClaim(role.enterpriseAppRole); }));
const canManageStaffUsers = (passport: Passport): boolean => passport.user.forStaffUser({ externalId: '' } as Domain.Contexts.User.StaffUser.StaffUserEntityReference).determineIf((permissions) => permissions.canManageStaffUsers);
const canManageStaffRoles = (passport: Passport): boolean => passport.user.forStaffRole({ id: '' } as Domain.Contexts.User.StaffRole.StaffRoleEntityReference).determineIf((permissions) => permissions.canManageStaffRolesAndPermissions);

export const StaffUser = (dataSources: DataSources, passport: Passport) => ({
	createIfNotExists: async (command: StaffUserCreateIfNotExistsCommand): Promise<Domain.Contexts.User.StaffUser.StaffUserEntityReference> => {
		const existing = await dataSources.readonlyDataSource.User.StaffUser.StaffUserReadRepo.getByExternalId(command.externalId);
		if (existing) return existing;
		await createDefaultStaffRoles(dataSources)();
		const roles = await dataSources.readonlyDataSource.User.StaffRole.StaffRoleReadRepo.getAll();
		const matchingRole = roleForClaims(roles, command.aadRoles);
		let created: Domain.Contexts.User.StaffUser.StaffUserEntityReference | undefined;
		await dataSources.domainDataSource.User.StaffUser.StaffUserUnitOfWork.withTransaction(DomainRuntime.PassportFactory.forSystem(), async (repository) => { const user = await repository.getNewInstance(command.externalId, command.firstName, command.lastName, command.email); user.requestCreate(user.id); if (matchingRole) user.requestRoleAssignment(matchingRole, user.id); created = await repository.save(user); });
		if (!created) throw new Error('Unable to create staff user');
		return created;
	},
	queryByExternalId: (externalId: string) => dataSources.readonlyDataSource.User.StaffUser.StaffUserReadRepo.getByExternalId(externalId),
	list: () => { if (!canManageStaffUsers(passport)) throw new Error('You do not have permission to view staff users'); return dataSources.readonlyDataSource.User.StaffUser.StaffUserReadRepo.getAll(); },
	assignRole: async (input: { staffUserId: string; roleId: string; actorStaffUserId: string }) => {
		if (!canManageStaffRoles(passport)) throw new Error('You do not have permission to assign staff roles');
		let result: Domain.Contexts.User.StaffUser.StaffUserEntityReference | undefined;
		await dataSources.domainDataSource.User.StaffUser.StaffUserUnitOfWork.withScopedTransaction(async (staffUserRepository) => { const user = await staffUserRepository.getById(input.staffUserId); let role: Domain.Contexts.User.StaffRole.StaffRoleEntityReference | undefined; await dataSources.domainDataSource.User.StaffRole.StaffRoleUnitOfWork.withScopedTransaction(async (roleRepository) => { role = await roleRepository.getById(input.roleId); }); if (!role) throw new Error(`StaffRole with id ${input.roleId} not found`); user.requestRoleAssignment(role, input.actorStaffUserId); result = await staffUserRepository.save(user); });
		if (!result) throw new Error('Unable to assign staff role');
		return result;
	},
});

export type StaffUserApplicationService = ReturnType<typeof StaffUser>;

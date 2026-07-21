import { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const defaultStaffRoleDefinitions: ReadonlyArray<{ name: string; appRole: Domain.Contexts.User.StaffRole.StaffEnterpriseAppRole; permissions: Domain.Contexts.User.StaffRole.StaffRolePermissionsProps }> = [
	{
		name: 'Manager',
		appRole: 'Staff.Manager',
		permissions: {
			staffPortalPermissions: {
				canViewTeamLearning: true,
				canManageCourses: true,
				canPublishCourses: true,
				canDeleteCourses: true,
				canManageTeams: true,
				canManageTeamOperations: true,
				canConfirmTeamOperations: true,
				canManageAssessments: true,
				canViewOrganization: true,
				canManageOrganizationStructure: true,
			},
			userPermissions: { canManageUsers: true, canAssignStaffRoles: true, canViewStaffUsers: true },
			staffRolePermissions: { canViewRoles: true, canAddRole: false, canEditRole: false, canRemoveRole: false },
		},
	},
	{
		name: 'Team Lead',
		appRole: 'Staff.TeamLead',
		permissions: {
			staffPortalPermissions: {
				canViewTeamLearning: true,
				canManageCourses: false,
				canPublishCourses: false,
				canDeleteCourses: false,
				canManageTeams: false,
				canManageTeamOperations: true,
				canConfirmTeamOperations: false,
				canManageAssessments: false,
				canViewOrganization: true,
				canManageOrganizationStructure: false,
			},
			userPermissions: { canManageUsers: false, canAssignStaffRoles: false, canViewStaffUsers: false },
			staffRolePermissions: { canViewRoles: false, canAddRole: false, canEditRole: false, canRemoveRole: false },
		},
	},
];

export const createDefaultStaffRoles = (dataSources: DataSources) => async (): Promise<Domain.Contexts.User.StaffRole.StaffRoleEntityReference[]> => {
	const created: Domain.Contexts.User.StaffRole.StaffRoleEntityReference[] = [];
	for (const definition of defaultStaffRoleDefinitions) {
		let saved: Domain.Contexts.User.StaffRole.StaffRoleEntityReference | undefined;
		await dataSources.domainDataSource.User.StaffRole.StaffRoleUnitOfWork.withTransaction(Domain.PassportFactory.forSystem(), async (repository) => {
			try {
				const existing = await repository.getDefaultRoleByEnterpriseAppRole(definition.appRole);
				existing.updatePermissions(definition.permissions);
				saved = await repository.save(existing);
				return;
			} catch (error) {
				if (!(error instanceof Error) || !error.message.toLowerCase().includes('not found')) throw error;
			}
			const role = await repository.getNewInstance(definition.name);
			role.enterpriseAppRole = definition.appRole;
			role.isDefault = true;
			role.updatePermissions(definition.permissions);
			saved = await repository.save(role);
		});
		if (saved) created.push(saved);
	}
	return created;
};

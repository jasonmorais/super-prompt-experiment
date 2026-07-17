import { type Model, Schema, type SchemaDefinition } from 'mongoose';
import { type Role, type RoleModelType, roleOptions } from './role.model.ts';

export const StaffEnterpriseAppRoles = ['Staff.Manager', 'Staff.TeamLead'] as const;
export type StaffEnterpriseAppRole = (typeof StaffEnterpriseAppRoles)[number];

export interface StaffRolePortalPermissions {
	canViewTeamLearning: boolean;
	canManageCourses: boolean;
	canPublishCourses: boolean;
	canDeleteCourses: boolean;
	canManageTeams: boolean;
	canManageTeamOperations: boolean;
	canConfirmTeamOperations: boolean;
	canManageAssessments: boolean;
	canViewOrganization: boolean;
	canManageOrganizationStructure: boolean;
}
export interface StaffRoleUserPermissions {
	canManageUsers: boolean;
	canAssignStaffRoles: boolean;
	canViewStaffUsers: boolean;
}
export interface StaffRoleRolePermissions {
	canViewRoles: boolean;
	canAddRole: boolean;
	canEditRole: boolean;
	canRemoveRole: boolean;
}
export interface StaffRolePermissions {
	staffPortalPermissions: StaffRolePortalPermissions;
	userPermissions: StaffRoleUserPermissions;
	staffRolePermissions: StaffRoleRolePermissions;
}
export interface StaffRole extends Role {
	roleName: string;
	enterpriseAppRole: string;
	isDefault: boolean;
	permissions: StaffRolePermissions;
}

const portalPermissions: SchemaDefinition<StaffRolePortalPermissions> = {
	canViewTeamLearning: { type: Boolean, required: true, default: false },
	canManageCourses: { type: Boolean, required: true, default: false },
	canPublishCourses: { type: Boolean, required: true, default: false },
	canDeleteCourses: { type: Boolean, required: true, default: false },
	canManageTeams: { type: Boolean, required: true, default: false },
	canManageTeamOperations: { type: Boolean, required: true, default: false },
	canConfirmTeamOperations: { type: Boolean, required: true, default: false },
	canManageAssessments: { type: Boolean, required: true, default: false },
	canViewOrganization: { type: Boolean, required: true, default: false },
	canManageOrganizationStructure: { type: Boolean, required: true, default: false },
};
const userPermissions: SchemaDefinition<StaffRoleUserPermissions> = {
	canManageUsers: { type: Boolean, required: true, default: false },
	canAssignStaffRoles: { type: Boolean, required: true, default: false },
	canViewStaffUsers: { type: Boolean, required: true, default: false },
};
const rolePermissions: SchemaDefinition<StaffRoleRolePermissions> = {
	canViewRoles: { type: Boolean, required: true, default: false },
	canAddRole: { type: Boolean, required: true, default: false },
	canEditRole: { type: Boolean, required: true, default: false },
	canRemoveRole: { type: Boolean, required: true, default: false },
};

const StaffRoleSchema = new Schema<StaffRole, Model<StaffRole>, StaffRole>({
	schemaVersion: { type: String, default: '1.0.0', immutable: true },
	roleName: { type: String, required: true, maxlength: 256 },
	enterpriseAppRole: { type: String, required: true, maxlength: 256 },
	isDefault: { type: Boolean, required: true, default: false },
	permissions: {
		staffPortalPermissions: { type: portalPermissions, required: true, default: () => ({}) },
		userPermissions: { type: userPermissions, required: true, default: () => ({}) },
		staffRolePermissions: { type: rolePermissions, required: true, default: () => ({}) },
	} as SchemaDefinition<StaffRolePermissions>,
}, roleOptions).index({ roleName: 1 }, { unique: true });

export const StaffRoleModelName = 'staff-user-role';
export const StaffRoleModelFactory = (RoleModel: RoleModelType) => RoleModel.discriminator(StaffRoleModelName, StaffRoleSchema);
export type StaffRoleModelType = ReturnType<typeof StaffRoleModelFactory>;

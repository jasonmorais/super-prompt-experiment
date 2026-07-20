import type { StaffUserEntityReference } from '../../../contexts/user/staff-user/staff-user.ts';
import type { Passport } from '../../../passport-factory.ts';
import { StaffUserAssessmentVisa } from './contexts/staff-user.assessment.visa.ts';
import { StaffUserCourseVisa } from './contexts/staff-user.course.visa.ts';
import { StaffUserLearningRecordVisa } from './contexts/staff-user.learning-record.visa.ts';
import { StaffUserOrganizationVisa } from './contexts/staff-user.organization.visa.ts';
import { StaffUserTeamOperationVisa } from './contexts/staff-user.team-operation.visa.ts';
import { StaffUserUserVisa } from './contexts/staff-user.user.visa.ts';

/**
 * A staff user actor. Permissions are derived from the staff user's assigned
 * role (its "staff portal permissions") and scoped to the organizations the
 * staff user has been granted access to.
 */
export const StaffUserPassport = {
	create(staffUser: StaffUserEntityReference, accessibleOrganizationIds: readonly string[] = staffUser.organizationScopes.map((scope) => scope.organizationId)): Passport {
		const role = staffUser.role;
		const portal = role?.permissions.staffPortalPermissions;
		const staffPermissions = role?.permissions.userPermissions;
		const canManageTeams = role?.enterpriseAppRole === 'Staff.Manager' && (portal?.canManageTeams ?? false);
		const canManageStaffRolesAndPermissions = (role?.permissions.userPermissions.canAssignStaffRoles ?? false) || (role?.permissions.staffRolePermissions.canEditRole ?? false);
		const inScope = (organizationId: string): boolean => accessibleOrganizationIds.includes(organizationId);
		const isOwnAccount = (rootExternalId: string): boolean => rootExternalId === staffUser.externalId;

		return {
			isGuest: false,
			canViewTeamLearning: portal?.canViewTeamLearning ?? false,
			canManageTeams,
			canAccessOrganization: (organizationId) => Boolean(organizationId && (accessibleOrganizationIds.includes('*') || accessibleOrganizationIds.includes(organizationId))),
			user: {
				forLearnerUser: (root) => new StaffUserUserVisa(canManageStaffRolesAndPermissions, staffPermissions?.canManageUsers ?? false, isOwnAccount(root.externalId)),
				forStaffUser: (root) => new StaffUserUserVisa(canManageStaffRolesAndPermissions, staffPermissions?.canManageUsers ?? false, isOwnAccount(root.externalId)),
				// A staff user's own-account status never carries over to staff-role visas.
				forStaffRole: () => new StaffUserUserVisa(canManageStaffRolesAndPermissions, staffPermissions?.canManageUsers ?? false, false),
			},
			learning: {
				forCourse: (course) => new StaffUserCourseVisa(course, portal, inScope),
				forAssessment: (assessment) => new StaffUserAssessmentVisa(assessment, portal, inScope),
			},
			organization: {
				forOrganization: (organization) => new StaffUserOrganizationVisa(organization, portal, inScope),
			},
			delivery: {
				forLearningRecord: (record) => new StaffUserLearningRecordVisa(record, portal, inScope),
			},
			operations: {
				forTeamOperation: (operation) => new StaffUserTeamOperationVisa(operation, portal, inScope),
			},
		};
	},
};

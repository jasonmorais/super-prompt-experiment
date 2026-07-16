export interface LearnSphereProfile {
	sub?: string;
	email?: string;
	given_name?: string;
	family_name?: string;
	tid?: string;
	organization_id?: string;
	organization_name?: string;
	roles?: string[] | string;
	[key: string]: unknown;
}

export interface LearnSphereIdentity {
	sub: string;
	email: string;
	givenName: string;
	familyName: string;
	organizationId: string;
	organizationName: string;
}

export interface LearnSphereStaffCapabilities {
	canViewTeamLearning: boolean;
	canManageCourses: boolean;
	canPublishCourses: boolean;
	canDeleteCourses: boolean;
	canManageTeams: boolean;
	canManageTeamOperations: boolean;
	canConfirmTeamOperations: boolean;
}

/** The persisted StaffRole permission group returned by the staff API. */
export interface LearnSphereStaffPortalPermissions {
	canViewTeamLearning?: boolean;
	canManageCourses?: boolean;
	canPublishCourses?: boolean;
	canDeleteCourses?: boolean;
	canManageTeams?: boolean;
	canManageTeamOperations?: boolean;
	canConfirmTeamOperations?: boolean;
}

const claimString = (profile: LearnSphereProfile | undefined, key: keyof LearnSphereProfile): string => {
	const value = profile?.[key];
	return typeof value === 'string' ? value.trim() : '';
};

const titleCase = (value: string): string =>
	value
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
		.join(' ');

export const readLearnSphereIdentity = (profile: LearnSphereProfile | undefined): LearnSphereIdentity => {
	const organizationId = claimString(profile, 'organization_id') || claimString(profile, 'tid');
	const givenName = claimString(profile, 'given_name');
	const familyName = claimString(profile, 'family_name');
	return {
		sub: claimString(profile, 'sub'),
		email: claimString(profile, 'email'),
		givenName,
		familyName,
		organizationId,
		organizationName: claimString(profile, 'organization_name') || titleCase(organizationId) || 'Learning workspace',
	};
};

export const getStaffCapabilities = (permissions: LearnSphereStaffPortalPermissions | undefined, enterpriseAppRole?: string): LearnSphereStaffCapabilities => {
	return {
		canViewTeamLearning: permissions?.canViewTeamLearning ?? false,
		canManageCourses: permissions?.canManageCourses ?? false,
		canPublishCourses: permissions?.canPublishCourses ?? false,
		canDeleteCourses: permissions?.canDeleteCourses ?? false,
		canManageTeams: enterpriseAppRole === 'Staff.Manager' && (permissions?.canManageTeams ?? false),
		canManageTeamOperations: permissions?.canManageTeamOperations ?? false,
		canConfirmTeamOperations: permissions?.canConfirmTeamOperations ?? false,
	};
};

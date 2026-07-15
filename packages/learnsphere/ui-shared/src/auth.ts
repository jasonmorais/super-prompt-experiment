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
	roles: string[];
}

export const STAFF_ACCESS_ROLES = ['Manager', 'LearningAdmin', 'ManagerLearningAdmin', 'Instructor'] as const;

export interface LearnSphereStaffCapabilities {
	canViewTeamLearning: boolean;
	canManageCourses: boolean;
	canPublishCourses: boolean;
	canDeleteCourses: boolean;
	canManageTeams: boolean;
	canManageTeamOperations: boolean;
	canConfirmTeamOperations: boolean;
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
	const rolesClaim = profile?.roles;
	const roles = Array.isArray(rolesClaim) ? rolesClaim.map(String) : typeof rolesClaim === 'string' ? rolesClaim.split(/[ ,]/).filter(Boolean) : [];
	return {
		sub: claimString(profile, 'sub'),
		email: claimString(profile, 'email'),
		givenName,
		familyName,
		organizationId,
		organizationName: claimString(profile, 'organization_name') || titleCase(organizationId) || 'Learning workspace',
		roles,
	};
};

export const hasStaffAccess = (roles: readonly string[]): boolean => roles.some((role) => STAFF_ACCESS_ROLES.includes(role as (typeof STAFF_ACCESS_ROLES)[number]));

export const getStaffCapabilities = (roles: readonly string[]): LearnSphereStaffCapabilities => {
	const isManager = roles.includes('Manager');
	const isLearningAdmin = roles.includes('LearningAdmin');
	const isManagerLearningAdmin = roles.includes('ManagerLearningAdmin') || (isManager && isLearningAdmin);
	const isInstructor = roles.includes('Instructor');
	const canViewTeamLearning = isManager || isLearningAdmin || isManagerLearningAdmin;
	const canManageTeams = isManager || isManagerLearningAdmin;
	return {
		canViewTeamLearning,
		canManageCourses: isInstructor || isLearningAdmin || isManagerLearningAdmin,
		canPublishCourses: isLearningAdmin || isManagerLearningAdmin,
		canDeleteCourses: isLearningAdmin || isManagerLearningAdmin,
		canManageTeams,
		canManageTeamOperations: canViewTeamLearning,
		canConfirmTeamOperations: isManager || isManagerLearningAdmin,
	};
};

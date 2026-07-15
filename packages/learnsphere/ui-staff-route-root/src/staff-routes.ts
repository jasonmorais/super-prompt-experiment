import type { LearnSphereStaffCapabilities } from '@learnsphere/ui-shared';

export type StaffRoutePermission = keyof LearnSphereStaffCapabilities;

export interface StaffRouteDefinition {
	key: 'overview' | 'courses' | 'operations' | 'teams';
	path: string;
	permission: StaffRoutePermission;
}

export const STAFF_ROUTE_DEFINITIONS: readonly StaffRouteDefinition[] = [
	{ key: 'overview', path: '/staff/overview', permission: 'canViewTeamLearning' },
	{ key: 'operations', path: '/staff/operations', permission: 'canManageTeamOperations' },
	{ key: 'courses', path: '/staff/courses', permission: 'canManageCourses' },
	{ key: 'teams', path: '/staff/teams', permission: 'canManageTeams' },
];

export const getDefaultStaffPath = (capabilities: LearnSphereStaffCapabilities): string => {
	if (capabilities.canViewTeamLearning) return '/staff/overview';
	const preferredRoutes = STAFF_ROUTE_DEFINITIONS.filter((route) => route.key !== 'overview');
	return preferredRoutes.find((route) => capabilities[route.permission])?.path ?? '/unauthorized';
};

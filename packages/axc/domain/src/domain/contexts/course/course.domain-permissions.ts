/**
 * Domain permissions for the Course context. Mirrors the Community context's
 * `community.domain-permissions.ts`: a flat set of booleans a visa resolves
 * against when the aggregate guards a mutation.
 */
export interface CourseDomainPermissions {
	// course aggregate root permissions
	canManageCourses: boolean;
	canViewCourses: boolean;

	// other permissions
	isSystemAccount: boolean;
}

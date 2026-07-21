import type { AssessmentDomainPermissions } from '../../../../contexts/learning/assessment/assessment.domain-permissions.ts';
import type { AssessmentEntityReference } from '../../../../contexts/learning/assessment/assessment.ts';
import type { AssessmentVisa } from '../../../../contexts/learning/assessment/assessment.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';

/** A staff user may manage assessments in organizations they're assigned to, per their role's portal permissions. */
export class StaffUserAssessmentVisa implements AssessmentVisa {
	private readonly assessment: AssessmentEntityReference;
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(assessment: AssessmentEntityReference, portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.assessment = assessment;
		this.portal = portal;
		this.inScope = inScope;
	}

	determineIf(predicate: (permissions: AssessmentDomainPermissions) => boolean): boolean {
		return predicate({
			canManageAssessments: this.inScope(this.assessment.organizationId) && (this.portal?.canManageAssessments ?? false),
			canTakeAssessments: false,
			isSystemAccount: false,
		});
	}
}

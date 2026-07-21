import type { AssessmentDomainPermissions } from '../../../contexts/learning/assessment/assessment.domain-permissions.ts';
import type { AssessmentEntityReference } from '../../../contexts/learning/assessment/assessment.ts';
import type { AssessmentVisa } from '../../../contexts/learning/assessment/assessment.visa.ts';

/** A member may take assessments that belong to the organization they're scoped to. */
export class MemberAssessmentVisa implements AssessmentVisa {
	private readonly assessment: AssessmentEntityReference;
	private readonly organizationId: string | undefined;

	constructor(assessment: AssessmentEntityReference, organizationId: string | undefined) {
		this.assessment = assessment;
		this.organizationId = organizationId;
	}

	determineIf(predicate: (permissions: AssessmentDomainPermissions) => boolean): boolean {
		return predicate({ canManageAssessments: false, canTakeAssessments: this.assessment.organizationId === this.organizationId, isSystemAccount: false });
	}
}

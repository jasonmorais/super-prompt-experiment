import type { AssessmentDomainPermissions } from '../../../contexts/learning/assessment/assessment.domain-permissions.ts';
import type { AssessmentVisa } from '../../../contexts/learning/assessment/assessment.visa.ts';

/** A guest holds no assessment permissions. */
export class GuestAssessmentVisa implements AssessmentVisa {
	determineIf(predicate: (permissions: AssessmentDomainPermissions) => boolean): boolean {
		return predicate({ canManageAssessments: false, canTakeAssessments: false, isSystemAccount: false });
	}
}

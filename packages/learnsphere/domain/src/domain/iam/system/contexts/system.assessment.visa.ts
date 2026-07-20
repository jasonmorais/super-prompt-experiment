import type { AssessmentDomainPermissions } from '../../../contexts/learning/assessment/assessment.domain-permissions.ts';
import type { AssessmentVisa } from '../../../contexts/learning/assessment/assessment.visa.ts';

/** The system account holds full assessment permissions everywhere. */
export class SystemAssessmentVisa implements AssessmentVisa {
	determineIf(predicate: (permissions: AssessmentDomainPermissions) => boolean): boolean {
		return predicate({ canManageAssessments: true, canTakeAssessments: true, isSystemAccount: true });
	}
}

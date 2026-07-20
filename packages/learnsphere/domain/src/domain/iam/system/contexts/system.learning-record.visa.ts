import type { LearningRecordDomainPermissions } from '../../../contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordVisa } from '../../../contexts/delivery/learning-record/learning-record.visa.ts';

/** The system account holds full learning-record permissions everywhere. */
export class SystemLearningRecordVisa implements LearningRecordVisa {
	determineIf(predicate: (permissions: Readonly<LearningRecordDomainPermissions>) => boolean): boolean {
		return predicate({ canSelfEnroll: true, canAssignLearning: true, canViewTeamLearning: true, canRecordProgress: true, canWaiveAssignments: true });
	}
}

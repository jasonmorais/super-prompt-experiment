import type { LearningRecordDomainPermissions } from '../../../contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordVisa } from '../../../contexts/delivery/learning-record/learning-record.visa.ts';

/** A guest holds no learning-record permissions. */
export class GuestLearningRecordVisa implements LearningRecordVisa {
	determineIf(predicate: (permissions: Readonly<LearningRecordDomainPermissions>) => boolean): boolean {
		return predicate({ canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false });
	}
}

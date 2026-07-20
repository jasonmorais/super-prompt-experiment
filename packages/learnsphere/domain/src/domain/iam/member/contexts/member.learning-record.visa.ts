import type { LearningRecordDomainPermissions } from '../../../contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordEntityReference } from '../../../contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordVisa } from '../../../contexts/delivery/learning-record/learning-record.visa.ts';

/** A member may self-enroll and record progress only against their own learning records. */
export class MemberLearningRecordVisa implements LearningRecordVisa {
	private readonly record: LearningRecordEntityReference;
	private readonly learnerId: string;

	constructor(record: LearningRecordEntityReference, learnerId: string) {
		this.record = record;
		this.learnerId = learnerId;
	}

	determineIf(predicate: (permissions: Readonly<LearningRecordDomainPermissions>) => boolean): boolean {
		return predicate({ canSelfEnroll: true, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: this.record.learnerId === this.learnerId, canWaiveAssignments: false });
	}
}

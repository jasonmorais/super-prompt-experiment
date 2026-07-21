import type { LearningRecordDomainPermissions } from '../../../../contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordEntityReference } from '../../../../contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordVisa } from '../../../../contexts/delivery/learning-record/learning-record.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';

/** A staff user may view and manage team learning records in organizations they're assigned to. */
export class StaffUserLearningRecordVisa implements LearningRecordVisa {
	private readonly record: LearningRecordEntityReference;
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(record: LearningRecordEntityReference, portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.record = record;
		this.portal = portal;
		this.inScope = inScope;
	}

	determineIf(predicate: (permissions: Readonly<LearningRecordDomainPermissions>) => boolean): boolean {
		if (!this.inScope(this.record.organizationId)) {
			return predicate({ canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false });
		}
		return predicate({
			canSelfEnroll: false,
			canAssignLearning: this.portal?.canViewTeamLearning ?? false,
			canViewTeamLearning: this.portal?.canViewTeamLearning ?? false,
			canRecordProgress: false,
			canWaiveAssignments: this.portal?.canManageTeamOperations ?? false,
		});
	}
}

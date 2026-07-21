import type { DeliveryPassport } from '../../../../contexts/delivery/delivery.passport.ts';
import type { LearningRecordEntityReference } from '../../../../contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordVisa } from '../../../../contexts/delivery/learning-record/learning-record.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';
import { StaffUserLearningRecordVisa } from './staff-user.learning-record.visa.ts';

export class StaffUserDeliveryPassport implements DeliveryPassport {
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.portal = portal;
		this.inScope = inScope;
	}

	forLearningRecord(record: LearningRecordEntityReference): LearningRecordVisa {
		return new StaffUserLearningRecordVisa(record, this.portal, this.inScope);
	}
}

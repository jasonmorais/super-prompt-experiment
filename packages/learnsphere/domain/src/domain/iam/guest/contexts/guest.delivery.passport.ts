import type { DeliveryPassport } from '../../../contexts/delivery/delivery.passport.ts';
import type { LearningRecordEntityReference } from '../../../contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordVisa } from '../../../contexts/delivery/learning-record/learning-record.visa.ts';
import { GuestLearningRecordVisa } from './guest.learning-record.visa.ts';

export class GuestDeliveryPassport implements DeliveryPassport {
	forLearningRecord(_record: LearningRecordEntityReference): LearningRecordVisa {
		return new GuestLearningRecordVisa();
	}
}

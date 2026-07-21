import type { DeliveryPassport } from '../../../contexts/delivery/delivery.passport.ts';
import type { LearningRecordEntityReference } from '../../../contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordVisa } from '../../../contexts/delivery/learning-record/learning-record.visa.ts';
import { MemberLearningRecordVisa } from './member.learning-record.visa.ts';

export class MemberDeliveryPassport implements DeliveryPassport {
	private readonly learnerId: string;

	constructor(learnerId: string) {
		this.learnerId = learnerId;
	}

	forLearningRecord(record: LearningRecordEntityReference): LearningRecordVisa {
		return new MemberLearningRecordVisa(record, this.learnerId);
	}
}

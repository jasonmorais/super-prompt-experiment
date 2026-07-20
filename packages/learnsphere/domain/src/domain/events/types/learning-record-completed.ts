import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface LearningRecordCompletedProps {
	learningRecordId: string;
	organizationId: string;
	learnerId: string;
	courseId: string;
}

export class LearningRecordCompletedEvent extends CustomDomainEventImpl<LearningRecordCompletedProps> {}

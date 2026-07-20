import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface LearningRecordCreatedProps {
	learningRecordId: string;
	organizationId: string;
	learnerId: string;
	courseId: string;
}

export class LearningRecordCreatedEvent extends CustomDomainEventImpl<LearningRecordCreatedProps> {}

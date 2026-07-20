import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface LearningRecordUnassignedProps {
	learningRecordId: string;
	organizationId: string;
	learnerId: string;
	courseId: string;
}

export class LearningRecordUnassignedEvent extends CustomDomainEventImpl<LearningRecordUnassignedProps> {}

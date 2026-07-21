import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface AssessmentCreatedProps {
	assessmentId: string;
	organizationId: string;
}

export class AssessmentCreatedEvent extends CustomDomainEventImpl<AssessmentCreatedProps> {}

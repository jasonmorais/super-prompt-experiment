import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface AssessmentPublishedProps {
	assessmentId: string;
	organizationId: string;
}

export class AssessmentPublishedEvent extends CustomDomainEventImpl<AssessmentPublishedProps> {}

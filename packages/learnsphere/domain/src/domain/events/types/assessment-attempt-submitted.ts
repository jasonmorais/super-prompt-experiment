import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface AssessmentAttemptSubmittedProps {
	assessmentAttemptId: string;
	organizationId: string;
	learnerId: string;
	courseId: string;
	passed: boolean;
}

export class AssessmentAttemptSubmittedEvent extends CustomDomainEventImpl<AssessmentAttemptSubmittedProps> {}

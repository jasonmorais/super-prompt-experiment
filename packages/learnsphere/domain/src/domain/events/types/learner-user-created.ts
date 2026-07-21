import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface LearnerUserCreatedProps {
	learnerUserId: string;
	externalId: string;
}

export class LearnerUserCreatedEvent extends CustomDomainEventImpl<LearnerUserCreatedProps> {}

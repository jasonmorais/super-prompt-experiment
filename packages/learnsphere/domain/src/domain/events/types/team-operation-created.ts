import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface TeamOperationCreatedProps {
	teamOperationId: string;
	organizationId: string;
	assigneeId: string;
}

export class TeamOperationCreatedEvent extends CustomDomainEventImpl<TeamOperationCreatedProps> {}

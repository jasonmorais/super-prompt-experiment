import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface TeamOperationCompletedProps {
	teamOperationId: string;
	organizationId: string;
	assigneeId: string;
}

export class TeamOperationCompletedEvent extends CustomDomainEventImpl<TeamOperationCompletedProps> {}

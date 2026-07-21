import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface StaffUserCreatedProps {
	staffUserId: string;
	externalId: string;
}

export class StaffUserCreatedEvent extends CustomDomainEventImpl<StaffUserCreatedProps> {}

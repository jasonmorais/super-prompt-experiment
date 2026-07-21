import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface OrganizationCreatedProps {
	organizationId: string;
}

export class OrganizationCreatedEvent extends CustomDomainEventImpl<OrganizationCreatedProps> {}

import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface StaffRoleCreatedProps {
	staffRoleId: string;
	roleName: string;
}

export class StaffRoleCreatedEvent extends CustomDomainEventImpl<StaffRoleCreatedProps> {}

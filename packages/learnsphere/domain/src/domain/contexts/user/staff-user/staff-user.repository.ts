import type { Repository } from '@cellix/domain-seedwork/repository';
import type { StaffUser, StaffUserProps } from './staff-user.ts';

export interface StaffUserRepository<props extends StaffUserProps = StaffUserProps> extends Repository<StaffUser<props>> {
	getById(id: string): Promise<StaffUser<props>>;
	getByExternalId(externalId: string): Promise<StaffUser<props>>;
	getNewInstance(externalId: string, firstName: string, lastName: string, email: string): Promise<StaffUser<props>>;
}

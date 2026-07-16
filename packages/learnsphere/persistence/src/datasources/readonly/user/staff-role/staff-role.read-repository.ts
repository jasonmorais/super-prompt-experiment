import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { StaffRoleConverter } from '../../../domain/user/staff-role/staff-role.domain-adapter.ts';

export interface StaffRoleReadRepository { getAll(): Promise<Domain.Contexts.User.StaffRole.StaffRoleEntityReference[]>; getById(id: string): Promise<Domain.Contexts.User.StaffRole.StaffRoleEntityReference | null>; }
export const getStaffRoleReadRepository = (models: ModelsContext, passport: Domain.Passport): StaffRoleReadRepository => {
	const converter = new StaffRoleConverter();
	return { getAll: async () => (await models.StaffRole.find({}).sort({ roleName: 1 }).exec()).map((doc) => converter.toDomain(doc, passport)), getById: async (id) => { const doc = await models.StaffRole.findById(id).exec(); return doc ? converter.toDomain(doc, passport) : null; } };
};

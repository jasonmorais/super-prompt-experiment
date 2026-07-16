import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { StaffUserConverter } from '../../../domain/user/staff-user/staff-user.domain-adapter.ts';

export interface StaffUserReadRepository { getAll(): Promise<Domain.Contexts.User.StaffUser.StaffUserEntityReference[]>; getById(id: string): Promise<Domain.Contexts.User.StaffUser.StaffUserEntityReference | null>; getByExternalId(externalId: string): Promise<Domain.Contexts.User.StaffUser.StaffUserEntityReference | null>; getByEmail(email: string): Promise<Domain.Contexts.User.StaffUser.StaffUserEntityReference | null>; }
export const getStaffUserReadRepository = (models: ModelsContext, passport: Domain.Passport): StaffUserReadRepository => {
	const converter = new StaffUserConverter();
	return {
		getAll: async () => (await models.StaffUser.find({}).populate('role').sort({ displayName: 1 }).exec()).map((doc) => converter.toDomain(doc, passport)),
		getById: async (id) => { const doc = await models.StaffUser.findById(id).populate('role').exec(); return doc ? converter.toDomain(doc, passport) : null; },
		getByExternalId: async (externalId) => { const doc = await models.StaffUser.findOne({ externalId }).populate('role').exec(); return doc ? converter.toDomain(doc, passport) : null; },
		getByEmail: async (email) => { const doc = await models.StaffUser.findOne({ email }).populate('role').exec(); return doc ? converter.toDomain(doc, passport) : null; },
	};
};

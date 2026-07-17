import type { Domain } from '@learnsphere/domain'; import type { ModelsContext } from '../../../index.ts'; import { OrganizationConverter } from '../../domain/organization/organization.domain-adapter.ts';
export interface OrganizationReadRepository {
	getByExternalId(externalId: string): Promise<Domain.Contexts.Organization.OrganizationEntityReference | null>;
	listAccessible(organizationIds: readonly string[]): Promise<Domain.Contexts.Organization.OrganizationEntityReference[]>;
	resolveAccessibleIds(scopes: readonly Domain.Contexts.User.StaffUser.StaffOrganizationScope[]): Promise<string[]>;
}
export const getOrganizationReadRepository = (models: ModelsContext, passport: Domain.Passport): OrganizationReadRepository => { const converter = new OrganizationConverter(); return {
	getByExternalId: async (externalId) => { const document = await models.Organization.findOne({ externalId }).exec(); return document && passport.canAccessOrganization(document.externalId) ? converter.toDomain(document, passport) : null; },
	listAccessible: async (organizationIds) => (await models.Organization.find({ externalId: { $in: organizationIds } }).sort({ ancestorOrganizationIds: 1, name: 1 }).exec()).map((document) => converter.toDomain(document, passport)),
	resolveAccessibleIds: async (scopes) => { const exact = scopes.map((scope) => scope.organizationId); const inheritedRoots = scopes.filter((scope) => scope.includeDescendants).map((scope) => scope.organizationId); const documents = await models.Organization.find({ $or: [{ externalId: { $in: exact } }, { ancestorOrganizationIds: { $in: inheritedRoots } }] }).select({ externalId: 1 }).lean().exec(); return [...new Set([...exact, ...documents.map((document) => document.externalId)])]; },
}; };

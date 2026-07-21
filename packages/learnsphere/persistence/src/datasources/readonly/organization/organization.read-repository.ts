import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { OrganizationConverter } from '../../domain/organization/organization.domain-adapter.ts';
import { OrganizationDataSourceImpl } from './organization.data.ts';

export interface OrganizationReadRepository {
	getByExternalId(externalId: string): Promise<Domain.Contexts.Organization.OrganizationEntityReference | null>;
	listAccessible(organizationIds: readonly string[]): Promise<Domain.Contexts.Organization.OrganizationEntityReference[]>;
	resolveAccessibleIds(scopes: readonly Domain.Contexts.User.StaffUser.StaffOrganizationScope[]): Promise<string[]>;
}
export const getOrganizationReadRepository = (models: ModelsContext, passport: Domain.Passport): OrganizationReadRepository => {
	const mongoDataSource = new OrganizationDataSourceImpl(models.Organization);
	const converter = new OrganizationConverter();
	return {
		getByExternalId: async (externalId) => {
			const document = await mongoDataSource.findOne({ externalId });
			return document && passport.canAccessOrganization(document.externalId) ? converter.toDomain(document, passport) : null;
		},
		listAccessible: async (organizationIds) => {
			const documents = await mongoDataSource.aggregate([{ $match: { externalId: { $in: [...organizationIds] } } }, { $sort: { ancestorOrganizationIds: 1, name: 1 } }]);
			return documents.map((document) => converter.toDomain(document, passport));
		},
		resolveAccessibleIds: async (scopes) => {
			const exact = scopes.map((scope) => scope.organizationId);
			const inheritedRoots = scopes.filter((scope) => scope.includeDescendants).map((scope) => scope.organizationId);
			const documents = await mongoDataSource.aggregate([{ $match: { $or: [{ externalId: { $in: exact } }, { ancestorOrganizationIds: { $in: inheritedRoots } }] } }, { $project: { externalId: 1 } }]);
			return [...new Set([...exact, ...documents.map((document) => document.externalId)])];
		},
	};
};

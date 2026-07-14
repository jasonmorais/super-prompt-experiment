import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { TeamOperationConverter } from '../../../domain/operations/team-operation/team-operation.domain-adapter.ts';

export interface TeamOperationReadRepository {
	getById(id: string): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference | null>;
	getByAssignee(organizationId: string, assigneeId: string): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]>;
	listByOrganization(organizationId: string, teamName?: string): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]>;
}

export class TeamOperationReadRepositoryImpl implements TeamOperationReadRepository {
	private readonly converter = new TeamOperationConverter();
	private readonly models: ModelsContext;
	private readonly passport: Domain.Passport;
	constructor(models: ModelsContext, passport: Domain.Passport) { this.models = models; this.passport = passport; }
	async getById(id: string) {
		const document = await this.models.TeamOperation.findById(id).exec();
		return document ? this.converter.toDomain(document, this.passport) : null;
	}
	async getByAssignee(organizationId: string, assigneeId: string) {
		const documents = await this.models.TeamOperation.find({ organizationId, assigneeId }).sort({ status: 1, dueAt: 1, updatedAt: -1 }).exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}
	async listByOrganization(organizationId: string, teamName?: string) {
		const documents = await this.models.TeamOperation.find({ organizationId, ...(teamName ? { teamName } : {}) }).sort({ status: 1, dueAt: 1, updatedAt: -1 }).exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}
}

export const getTeamOperationReadRepository = (models: ModelsContext, passport: Domain.Passport): TeamOperationReadRepository => new TeamOperationReadRepositoryImpl(models, passport);

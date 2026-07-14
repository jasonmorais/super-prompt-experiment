import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { LearningRecordConverter } from '../../../domain/delivery/learning-record/learning-record.domain-adapter.ts';

export interface LearningRecordReadRepository {
	getById(id: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | null>;
	getByLearner(organizationId: string, learnerId: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
	listByOrganization(organizationId: string, teamName?: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
}

export class LearningRecordReadRepositoryImpl implements LearningRecordReadRepository {
	private readonly converter = new LearningRecordConverter();
	private readonly models: ModelsContext;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.models = models;
		this.passport = passport;
	}

	async getById(id: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | null> {
		const document = await this.models.LearningRecord.findById(id).exec();
		return document ? this.converter.toDomain(document, this.passport) : null;
	}

	async getByLearner(organizationId: string, learnerId: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]> {
		const documents = await this.models.LearningRecord.find({ organizationId, learnerId }).sort({ updatedAt: -1 }).exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}

	async listByOrganization(organizationId: string, teamName?: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]> {
		const documents = await this.models.LearningRecord.find({ organizationId, ...(teamName ? { teamName } : {}) })
			.sort({ teamName: 1, learnerDisplayName: 1, updatedAt: -1 })
			.exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}
}

export const getLearningRecordReadRepository = (models: ModelsContext, passport: Domain.Passport): LearningRecordReadRepository => new LearningRecordReadRepositoryImpl(models, passport);

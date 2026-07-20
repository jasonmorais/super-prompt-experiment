import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { LearningRecordConverter } from '../../../domain/delivery/learning-record/learning-record.domain-adapter.ts';

export interface LearningRecordReadRepository {
	getById(id: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | null>;
	getByLearner(organizationId: string, learnerId: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
	listByOrganization(organizationId: string, teamName?: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
	getTrainingLeaderboard(organizationId: string, limit?: number): Promise<Domain.Contexts.Delivery.LearningRecord.TrainingLeaderboardEntry[]>;
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
		return document && this.passport.canAccessOrganization(document.organizationId) ? this.converter.toDomain(document, this.passport) : null;
	}

	async getByLearner(organizationId: string, learnerId: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]> {
		if (!this.passport.canAccessOrganization(organizationId)) throw new Error('You do not have access to this organization');
		const documents = await this.models.LearningRecord.find({ organizationId, learnerId }).sort({ updatedAt: -1 }).exec();
		return documents
			.map((document) => this.converter.toDomain(document, this.passport))
			.filter((record) => this.passport.delivery.forLearningRecord(record).determineIf((permissions) => permissions.canRecordProgress || permissions.canViewTeamLearning));
	}

	async listByOrganization(organizationId: string, teamName?: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]> {
		if (!this.passport.canAccessOrganization(organizationId) || !this.passport.canViewTeamLearning) throw new Error('You do not have access to team learning in this organization');
		const documents = await this.models.LearningRecord.find({ organizationId, ...(teamName ? { teamName } : {}) })
			.sort({ teamName: 1, learnerDisplayName: 1, updatedAt: -1 })
			.exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}

	async getTrainingLeaderboard(organizationId: string, limit = 100): Promise<Domain.Contexts.Delivery.LearningRecord.TrainingLeaderboardEntry[]> {
		if (!this.passport.canAccessOrganization(organizationId)) throw new Error('You do not have access to this organization');
		type AggregateEntry = Omit<Domain.Contexts.Delivery.LearningRecord.TrainingLeaderboardEntry, 'rank'> & { _id: string };
		const entries = await this.models.LearningRecord.aggregate<AggregateEntry>([
			{ $match: { organizationId } },
			{ $sort: { updatedAt: -1 } },
			{
				$group: {
					_id: '$learnerId',
					learnerId: { $first: '$learnerId' },
					learnerDisplayName: { $first: '$learnerDisplayName' },
					teamName: { $first: '$teamName' },
					completedTrainings: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
					totalTrainings: { $sum: 1 },
					totalLearningMinutes: { $sum: { $sum: '$activityProgress.timeSpentMinutes' } },
					lastCompletedAt: { $max: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$completedAt', null] } },
				},
			},
			{ $sort: { completedTrainings: -1, totalLearningMinutes: -1, learnerDisplayName: 1 } },
			{ $limit: Math.min(Math.max(limit, 1), 100) },
		]).exec();
		let displayedRank = 0;
		let previousCompleted: number | undefined;
		return entries.map(({ _id: _ignored, ...entry }, index) => {
			if (entry.completedTrainings !== previousCompleted) displayedRank = index + 1;
			previousCompleted = entry.completedTrainings;
			return { ...entry, rank: displayedRank };
		});
	}
}

export const getLearningRecordReadRepository = (models: ModelsContext, passport: Domain.Passport): LearningRecordReadRepository => new LearningRecordReadRepositoryImpl(models, passport);

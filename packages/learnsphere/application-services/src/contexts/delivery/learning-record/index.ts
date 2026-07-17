import type { Domain, Passport } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { type AssignLearningCommand, assign } from './assign.ts';
import { myLearning } from './my-learning.ts';
import { recordActivity } from './record-activity.ts';
import { selfEnroll } from './self-enroll.ts';
import { teamLearning } from './team-learning.ts';
import { waive } from './waive.ts';
import { unassign } from './unassign.ts';
import { trainingLeaderboard } from './training-leaderboard.ts';

export interface LearningRecordApplicationService {
	myLearning: (command: { organizationId: string }) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
	teamLearning: (command: { organizationId: string; teamName?: string }) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
	selfEnroll: (command: { organizationId: string; courseId: string }) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
	assign: (command: Omit<AssignLearningCommand, 'assignedBy'>) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
	recordActivity: (command: { id: string; activityKey: string; timeSpentMinutes: number; assessmentScore?: number; completionScreenshot?: string }) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
	waive: (command: { id: string; reason: string }) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
	unassign: (command: { id: string }) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
	trainingLeaderboard: (command: { organizationId: string; limit?: number }) => Promise<Domain.Contexts.Delivery.LearningRecord.TrainingLeaderboardEntry[]>;
}

export const LearningRecord = (dataSources: DataSources, passport: Passport, identity: { sub: string; email?: string; given_name?: string; family_name?: string }): LearningRecordApplicationService => {
	const displayName = `${identity.given_name ?? ''} ${identity.family_name ?? ''}`.trim() || identity.email || identity.sub;
	return {
		myLearning: (command) => { if (!passport.canAccessOrganization(command.organizationId)) throw new Error('You do not have access to this organization'); return myLearning(dataSources)({ ...command, learnerId: identity.sub }); },
		teamLearning: teamLearning(dataSources, passport),
		selfEnroll: (command) => selfEnroll(dataSources)({ ...command, learnerId: identity.sub, learnerDisplayName: displayName, learnerEmail: identity.email ?? `${identity.sub}@learnsphere.local` }),
		assign: (command) => { if (!passport.canAccessOrganization(command.organizationId)) throw new Error('You do not have access to this organization'); return assign(dataSources)({ ...command, assignedBy: identity.email ?? identity.sub }); },
		recordActivity: recordActivity(dataSources),
		waive: waive(dataSources),
		unassign: unassign(dataSources),
		trainingLeaderboard: trainingLeaderboard(dataSources, passport),
	};
};

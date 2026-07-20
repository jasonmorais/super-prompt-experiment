import crypto from 'node:crypto';
import { assign } from '../delivery/learning-record/assign.ts';
import type { TeamsServiceDependencies } from './types.ts';
import { actorName } from './types.ts';

export interface TeamCourseAssignmentResult {
	assignmentId: string;
	assignedCount: number;
	completedCount: number;
}

export const assignCourse =
	({ dataSources, identity }: TeamsServiceDependencies) =>
	async (input: { teamId: string; courseId: string; dueAt?: Date }): Promise<TeamCourseAssignmentResult> => {
		const team = await dataSources.teamDataSource.getById(input.teamId);
		if (!team) throw new Error('Team was not found');
		if (team.members.length === 0) throw new Error('Add people to the team before assigning a course');

		const assignmentId = crypto.randomUUID();
		const records = await dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.listByOrganization(team.organizationId, undefined);
		const completedCount = team.members.filter((member) => records.some((record) => record.learnerId === member.learnerId && record.courseId === input.courseId && record.status === 'COMPLETED')).length;
		for (const member of team.members) {
			await assign(dataSources)({
				organizationId: team.organizationId,
				learnerId: member.learnerId,
				learnerDisplayName: member.displayName,
				learnerEmail: member.email,
				teamName: team.name,
				courseId: input.courseId,
				source: 'MANAGER_ASSIGNED',
				assignedBy: actorName(identity),
				assignmentId,
				...(input.dueAt ? { dueAt: input.dueAt } : {}),
			});
		}
		return { assignmentId, assignedCount: team.members.length - completedCount, completedCount };
	};

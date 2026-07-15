import crypto from 'node:crypto';
import type { Passport } from '@learnsphere/domain';
import type { DataSources, TeamRecord } from '@learnsphere/persistence';
import { assign } from './delivery/learning-record/assign.ts';
import { unassign } from './delivery/learning-record/unassign.ts';

export interface TeamsApplicationService {
	list: (organizationId: string) => Promise<TeamRecord[]>;
	create: (input: { organizationId: string; name: string }) => Promise<TeamRecord>;
	rename: (input: { id: string; name: string }) => Promise<TeamRecord>;
	remove: (input: { id: string }) => Promise<boolean>;
	setMembers: (input: { id: string; members: readonly TeamRecord['members'][number][] }) => Promise<TeamRecord>;
	setTeamLeads: (input: { id: string; teamLeadIds: readonly string[] }) => Promise<TeamRecord>;
	assignCourse: (input: { teamId: string; courseId: string; dueAt?: Date }) => Promise<{ assignmentId: string; assignedCount: number; completedCount: number }>;
	unassignCourse: (input: { organizationId: string; assignmentId: string }) => Promise<number>;
}

export const Teams = (dataSources: DataSources, passport: Passport, identity: { sub: string; email?: string; given_name?: string; family_name?: string }): TeamsApplicationService => {
	const requireStaff = () => { if (!passport.canViewTeamLearning) throw new Error('Manager or learning administrator role required'); };
	const actor = `${identity.given_name ?? ''} ${identity.family_name ?? ''}`.trim() || identity.email || identity.sub;
	return {
		list: (organizationId) => { requireStaff(); return dataSources.teamDataSource.list(organizationId); },
		create: (input) => { requireStaff(); if (input.name.trim().length < 2) throw new Error('Team name is required'); return dataSources.teamDataSource.create({ ...input, name: input.name.trim(), createdBy: actor }); },
		rename: (input) => { requireStaff(); return dataSources.teamDataSource.rename(input.id, input.name); },
		remove: async (input) => { requireStaff(); await dataSources.teamDataSource.remove(input.id); return true; },
		setMembers: (input) => { requireStaff(); return dataSources.teamDataSource.setMembers(input.id, input.members); },
		setTeamLeads: (input) => { requireStaff(); return dataSources.teamDataSource.setTeamLeads(input.id, input.teamLeadIds); },
		assignCourse: async (input) => {
			requireStaff();
			const team = await dataSources.teamDataSource.getById(input.teamId);
			if (!team) throw new Error('Team was not found');
			if (team.members.length === 0) throw new Error('Add people to the team before assigning a course');
			const assignmentId = crypto.randomUUID();
			const records = await dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.listByOrganization(team.organizationId, undefined);
			const completedCount = team.members.filter((member) => records.some((record) => record.learnerId === member.learnerId && record.courseId === input.courseId && record.status === 'COMPLETED')).length;
			for (const member of team.members) await assign(dataSources)({ organizationId: team.organizationId, learnerId: member.learnerId, learnerDisplayName: member.displayName, learnerEmail: member.email, teamName: team.name, courseId: input.courseId, source: 'MANAGER_ASSIGNED', assignedBy: actor, assignmentId, ...(input.dueAt ? { dueAt: input.dueAt } : {}) });
			return { assignmentId, assignedCount: team.members.length - completedCount, completedCount };
		},
		unassignCourse: async (input) => {
			requireStaff();
			const records = await dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.listByOrganization(input.organizationId, undefined);
			const matching = records.filter((record) => record.assignmentId === input.assignmentId);
			for (const record of matching) await unassign(dataSources)({ id: record.id });
			return matching.length;
		},
	};
};

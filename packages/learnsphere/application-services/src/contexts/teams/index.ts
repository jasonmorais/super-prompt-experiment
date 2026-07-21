import type { DataSources } from '@learnsphere/persistence';
import { assignCourse } from './assign-course.ts';
import { unassignCourse } from './unassign-course.ts';
import { actorName, type TeamsApplicationService, type TeamsIdentity } from './types.ts';

export type { TeamsApplicationService, TeamsIdentity } from './types.ts';

export const Teams = (dataSources: DataSources, identity: TeamsIdentity): TeamsApplicationService => {
	const dependencies = { dataSources, identity };
	return {
		list: (organizationId) => dataSources.teamDataSource.list(organizationId),
		create: (input) => {
			if (input.name.trim().length < 2) throw new Error('Team name is required');
			return dataSources.teamDataSource.create({ ...input, name: input.name.trim(), createdBy: actorName(identity) });
		},
		rename: async (input) => {
			const team = await dataSources.teamDataSource.getById(input.id);
			if (!team) throw new Error('Team was not found');
			return dataSources.teamDataSource.rename(input.id, input.name);
		},
		remove: async (input) => {
			const team = await dataSources.teamDataSource.getById(input.id);
			if (!team) return true;
			await dataSources.teamDataSource.remove(input.id);
			return true;
		},
		setMembers: async (input) => {
			const team = await dataSources.teamDataSource.getById(input.id);
			if (!team) throw new Error('Team was not found');
			return dataSources.teamDataSource.setMembers(input.id, input.members);
		},
		setTeamLeads: async (input) => {
			const team = await dataSources.teamDataSource.getById(input.id);
			if (!team) throw new Error('Team was not found');
			return dataSources.teamDataSource.setTeamLeads(input.id, input.teamLeadIds);
		},
		assignCourse: assignCourse(dependencies),
		unassignCourse: unassignCourse(dependencies),
	};
};

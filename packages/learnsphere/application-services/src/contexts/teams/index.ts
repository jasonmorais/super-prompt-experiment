import type { Passport } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { assignCourse } from './assign-course.ts';
import { unassignCourse } from './unassign-course.ts';
import { actorName, requireTeamManagement, requireTeamStaff, type TeamsApplicationService, type TeamsIdentity } from './types.ts';

export type { TeamsApplicationService, TeamsIdentity } from './types.ts';

export const Teams = (dataSources: DataSources, passport: Passport, identity: TeamsIdentity): TeamsApplicationService => {
	const dependencies = { dataSources, passport, identity };
	return {
		list: (organizationId) => { requireTeamStaff(passport); return dataSources.teamDataSource.list(organizationId); },
		create: (input) => { requireTeamManagement(passport); if (input.name.trim().length < 2) throw new Error('Team name is required'); return dataSources.teamDataSource.create({ ...input, name: input.name.trim(), createdBy: actorName(identity) }); },
		rename: (input) => { requireTeamManagement(passport); return dataSources.teamDataSource.rename(input.id, input.name); },
		remove: async (input) => { requireTeamManagement(passport); await dataSources.teamDataSource.remove(input.id); return true; },
		setMembers: (input) => { requireTeamManagement(passport); return dataSources.teamDataSource.setMembers(input.id, input.members); },
		setTeamLeads: (input) => { requireTeamManagement(passport); return dataSources.teamDataSource.setTeamLeads(input.id, input.teamLeadIds); },
		assignCourse: assignCourse(dependencies),
		unassignCourse: unassignCourse(dependencies),
	};
};

import type { Passport } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { assignCourse } from './assign-course.ts';
import { unassignCourse } from './unassign-course.ts';
import { actorName, requireOrganizationAccess, requireTeamManagement, requireTeamStaff, type TeamsApplicationService, type TeamsIdentity } from './types.ts';

export type { TeamsApplicationService, TeamsIdentity } from './types.ts';

export const Teams = (dataSources: DataSources, passport: Passport, identity: TeamsIdentity): TeamsApplicationService => {
	const dependencies = { dataSources, passport, identity };
	return {
		list: (organizationId) => { requireTeamStaff(passport); requireOrganizationAccess(passport, organizationId); return dataSources.teamDataSource.list(organizationId); },
		create: (input) => { requireTeamManagement(passport); requireOrganizationAccess(passport, input.organizationId); if (input.name.trim().length < 2) throw new Error('Team name is required'); return dataSources.teamDataSource.create({ ...input, name: input.name.trim(), createdBy: actorName(identity) }); },
		rename: async (input) => { requireTeamManagement(passport); const team = await dataSources.teamDataSource.getById(input.id); if (!team) throw new Error('Team was not found'); requireOrganizationAccess(passport, team.organizationId); return dataSources.teamDataSource.rename(input.id, input.name); },
		remove: async (input) => { requireTeamManagement(passport); const team = await dataSources.teamDataSource.getById(input.id); if (!team) return true; requireOrganizationAccess(passport, team.organizationId); await dataSources.teamDataSource.remove(input.id); return true; },
		setMembers: async (input) => { requireTeamManagement(passport); const team = await dataSources.teamDataSource.getById(input.id); if (!team) throw new Error('Team was not found'); requireOrganizationAccess(passport, team.organizationId); return dataSources.teamDataSource.setMembers(input.id, input.members); },
		setTeamLeads: async (input) => { requireTeamManagement(passport); const team = await dataSources.teamDataSource.getById(input.id); if (!team) throw new Error('Team was not found'); requireOrganizationAccess(passport, team.organizationId); return dataSources.teamDataSource.setTeamLeads(input.id, input.teamLeadIds); },
		assignCourse: assignCourse(dependencies),
		unassignCourse: unassignCourse(dependencies),
	};
};

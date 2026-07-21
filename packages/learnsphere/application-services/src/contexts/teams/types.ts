import type { DataSources, TeamRecord } from '@learnsphere/persistence';

export interface TeamsIdentity {
	sub: string;
	email?: string;
	given_name?: string;
	family_name?: string;
}

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

export interface TeamsServiceDependencies {
	dataSources: DataSources;
	identity: TeamsIdentity;
}

export const actorName = (identity: TeamsIdentity): string => `${identity.given_name ?? ''} ${identity.family_name ?? ''}`.trim() || identity.email || identity.sub;

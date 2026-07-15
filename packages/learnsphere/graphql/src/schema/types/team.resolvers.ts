import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';

const requireUser = (context: GraphContext): void => { if (!context.applicationServices.verifiedUser?.verifiedJwt?.sub) throw new Error('Unauthorized'); };
const teamMutation = async <T>(work: Promise<T>): Promise<{ status: { success: boolean; errorMessage?: string }; team: T | null }> => { try { return { status: { success: true }, team: await work }; } catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The team request could not be completed' }, team: null }; } };
const assignmentMutation = async (work: Promise<{ assignmentId?: string; assignedCount?: number; completedCount?: number }>) => { try { const result = await work; return { status: { success: true }, assignmentId: result.assignmentId ?? '', assignedCount: result.assignedCount ?? 0, completedCount: result.completedCount ?? 0 }; } catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The team assignment could not be completed' }, assignmentId: '', assignedCount: 0, completedCount: 0 }; } };

const teams: Resolvers = {
	Query: { teams: (_parent, args, context) => { requireUser(context); return context.applicationServices.Teams.list(args.organizationId); } },
	Mutation: {
		teamCreate: (_parent, args, context) => { requireUser(context); return teamMutation(context.applicationServices.Teams.create(args.input)); },
		teamRename: (_parent, args, context) => { requireUser(context); return teamMutation(context.applicationServices.Teams.rename(args.input)); },
		teamDelete: (_parent, args, context) => { requireUser(context); return teamMutation(context.applicationServices.Teams.remove({ id: args.id }).then(() => null)); },
		teamSetMembers: (_parent, args, context) => { requireUser(context); return teamMutation(context.applicationServices.Teams.setMembers(args.input)); },
		teamSetLeads: (_parent, args, context) => { requireUser(context); return teamMutation(context.applicationServices.Teams.setTeamLeads(args.input)); },
		teamAssignCourse: (_parent, args, context) => { requireUser(context); return assignmentMutation(context.applicationServices.Teams.assignCourse({ teamId: args.input.teamId, courseId: args.input.courseId, ...(args.input.dueAt ? { dueAt: args.input.dueAt } : {}) })); },
		teamUnassignCourse: (_parent, args, context) => { requireUser(context); return assignmentMutation(context.applicationServices.Teams.unassignCourse(args.input).then((assignedCount) => ({ assignedCount }))); },
	},
};

export default teams;

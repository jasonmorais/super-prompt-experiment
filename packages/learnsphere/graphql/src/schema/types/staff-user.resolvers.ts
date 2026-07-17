import type { MutationStaffUserAssignRoleArgs, QueryStaffUserByIdArgs, Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';

const requireJwt = (context: GraphContext) => {
	const jwt = context.applicationServices.verifiedUser?.verifiedJwt;
	if (!jwt || context.applicationServices.verifiedUser?.openIdConfigKey !== 'StaffPortal') throw new Error('Unauthorized');
	return jwt;
};

const staffUser = {
	StaffUserActivityDetail: {
		activityByStaffUserDisplayName: async (parent: { activityByStaffUserId: string }, _args: Record<string, never>, context: GraphContext) => {
			try {
				const users = await context.applicationServices.User.StaffUser.list();
				return users.find((user) => user.id === parent.activityByStaffUserId)?.displayName ?? parent.activityByStaffUserId;
			} catch {
				return parent.activityByStaffUserId;
			}
		},
	},
	Query: {
		currentStaffUserAndCreateIfNotExists: (_parent: unknown, _args: Record<string, never>, context: GraphContext) => {
			const jwt = requireJwt(context);
			return context.applicationServices.User.StaffUser.createIfNotExists({ externalId: jwt.sub, firstName: jwt.given_name ?? '', lastName: jwt.family_name ?? '', email: jwt.email ?? '', aadRoles: jwt.roles ?? [], organizationId: jwt.tid ?? '' });
		},
		staffUsers: (_parent: unknown, _args: Record<string, never>, context: GraphContext) => { requireJwt(context); return context.applicationServices.User.StaffUser.list(); },
		staffUserById: async (_parent: unknown, args: QueryStaffUserByIdArgs, context: GraphContext) => { requireJwt(context); const users = await context.applicationServices.User.StaffUser.list(); return users.find((user) => user.id === args.id) ?? null; },
	},
	Mutation: {
		staffUserAssignRole: async (_parent: unknown, args: MutationStaffUserAssignRoleArgs, context: GraphContext) => {
			try {
				const jwt = requireJwt(context);
				const actor = await context.applicationServices.User.StaffUser.queryByExternalId(jwt.sub);
				if (!actor) throw new Error('Staff user was not found');
				const staffUser = await context.applicationServices.User.StaffUser.assignRole({ staffUserId: args.staffUserId, roleId: args.roleId, actorStaffUserId: actor.id });
				return { status: { success: true }, staffUser };
			} catch (error) {
				return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Unable to assign staff role' }, staffUser: null };
			}
		},
	},
} as unknown as Resolvers;

export default staffUser;

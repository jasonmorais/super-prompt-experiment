import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';
const requireStaff = (context: GraphContext) => {
	if (!context.applicationServices.verifiedUser?.verifiedJwt || context.applicationServices.verifiedUser.openIdConfigKey !== 'StaffPortal') throw new Error('Unauthorized');
};
const organization: Resolvers = {
	Query: {
		accessibleOrganizations: (_parent, _args, context) => {
			requireStaff(context);
			return context.applicationServices.Organization.listAccessible();
		},
	},
	Mutation: {
		organizationCreate: async (_parent, args, context) => {
			try {
				requireStaff(context);
				const organization = await context.applicationServices.Organization.create(args.input);
				return { status: { success: true }, organization };
			} catch (error) {
				return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Organization could not be created' }, organization: null };
			}
		},
		organizationRename: async (_parent, args, context) => {
			try {
				requireStaff(context);
				const organization = await context.applicationServices.Organization.rename(args.input);
				return { status: { success: true }, organization };
			} catch (error) {
				return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Organization could not be updated' }, organization: null };
			}
		},
	},
};
export default organization;

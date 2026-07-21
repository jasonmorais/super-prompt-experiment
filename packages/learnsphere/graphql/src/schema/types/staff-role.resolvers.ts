import type { MutationStaffRoleCreateArgs, MutationStaffRoleUpdateArgs, QueryStaffRoleByIdArgs, Resolvers, StaffRolePermissionsInput } from '../builder/generated.ts';
import type { Domain } from '@learnsphere/domain';
import type { GraphContext } from '../context.ts';

const requireJwt = (context: GraphContext) => {
	const jwt = context.applicationServices.verifiedUser?.verifiedJwt;
	if (!jwt || context.applicationServices.verifiedUser?.openIdConfigKey !== 'StaffPortal') throw new Error('Unauthorized');
	return jwt;
};
const mapPermissionGroup = (group: Readonly<Record<string, boolean | null | undefined>> | null | undefined): Record<string, boolean> | undefined => {
	if (!group) return undefined;
	const result: Record<string, boolean> = {};
	for (const [key, value] of Object.entries(group)) if (value !== null && value !== undefined) result[key] = value;
	return result;
};
const mapPermissions = (permissions: StaffRolePermissionsInput | null | undefined) => {
	if (!permissions) return undefined;
	const portal = mapPermissionGroup(permissions.staffPortalPermissions);
	const users = mapPermissionGroup(permissions.userPermissions);
	const roles = mapPermissionGroup(permissions.staffRolePermissions);
	return {
		...(portal ? { staffPortalPermissions: portal as Partial<Domain.Contexts.User.StaffRole.StaffPortalPermissionsProps> } : {}),
		...(users ? { userPermissions: users as Partial<Domain.Contexts.User.StaffRole.StaffRoleUserPermissionsProps> } : {}),
		...(roles ? { staffRolePermissions: roles as Partial<Domain.Contexts.User.StaffRole.StaffRoleRolePermissionsProps> } : {}),
	};
};
const staffRole: Resolvers = {
	Query: {
		staffRoles: async (_parent, _args, context: GraphContext) => {
			requireJwt(context);
			await context.applicationServices.User.StaffRole.createDefaultRoles();
			return context.applicationServices.User.StaffRole.list();
		},
		staffRoleById: (_parent, args: QueryStaffRoleByIdArgs, context: GraphContext) => {
			requireJwt(context);
			return context.applicationServices.User.StaffRole.queryById(String(args.id));
		},
	},
	Mutation: {
		staffRoleCreate: async (_parent, args: MutationStaffRoleCreateArgs, context: GraphContext) => {
			try {
				requireJwt(context);
				const input = args.input;
				const permissions = mapPermissions(input.permissions);
				const staffRole = await context.applicationServices.User.StaffRole.create({ roleName: input.roleName, enterpriseAppRole: input.enterpriseAppRole, ...(permissions ? { permissions } : {}) });
				return { status: { success: true }, staffRole };
			} catch (error) {
				return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Unable to create staff role' }, staffRole: null };
			}
		},
		staffRoleUpdate: async (_parent, args: MutationStaffRoleUpdateArgs, context: GraphContext) => {
			try {
				requireJwt(context);
				const input = args.input;
				const permissions = mapPermissions(input.permissions);
				const staffRole = await context.applicationServices.User.StaffRole.update({ roleId: String(input.roleId), roleName: input.roleName, enterpriseAppRole: input.enterpriseAppRole, ...(permissions ? { permissions } : {}) });
				return { status: { success: true }, staffRole };
			} catch (error) {
				return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Unable to update staff role' }, staffRole: null };
			}
		},
	},
};
export default staffRole;

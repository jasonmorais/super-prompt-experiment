import { useQuery } from '@apollo/client';
import { getStaffCapabilities, type LearnSphereStaffCapabilities } from '@learnsphere/ui-shared';
import { useAuth } from 'react-oidc-context';
import { CurrentStaffUserAndCreateIfNotExistsDocument } from './generated.tsx';

export interface StaffAuthorization {
	loading: boolean;
	capabilities: LearnSphereStaffCapabilities;
	roleName: string;
	displayName: string;
	error?: Error;
}

export const useStaffAuthorization = (): StaffAuthorization => {
	const auth = useAuth();
	const result = useQuery(CurrentStaffUserAndCreateIfNotExistsDocument, { skip: !auth.isAuthenticated });
	const role = result.data?.currentStaffUserAndCreateIfNotExists.role;
	return {
		loading: result.loading,
		capabilities: getStaffCapabilities(role?.permissions.staffPortalPermissions, role?.enterpriseAppRole),
		roleName: role?.roleName ?? '',
		displayName: result.data?.currentStaffUserAndCreateIfNotExists.displayName ?? '',
		...(result.error ? { error: result.error } : {}),
	};
};

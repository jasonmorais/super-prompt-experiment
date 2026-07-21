import { useQuery } from '@apollo/client';
import { useAuth } from 'react-oidc-context';
import { CurrentLearnerUserAndCreateIfNotExistsDocument } from './generated.tsx';

export const useLearnerAuthorization = () => {
	const auth = useAuth();
	return useQuery(CurrentLearnerUserAndCreateIfNotExistsDocument, { skip: !auth.isAuthenticated });
};

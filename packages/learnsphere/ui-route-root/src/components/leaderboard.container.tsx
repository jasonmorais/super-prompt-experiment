import { useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert } from 'antd';
import { useAuth } from 'react-oidc-context';
import { LearnerLeaderboardContainerTrainingLeaderboardDocument } from '../generated.tsx';
import { Leaderboard } from './leaderboard.tsx';

export const LeaderboardContainer = () => {
	const auth = useAuth();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const query = useQuery(LearnerLeaderboardContainerTrainingLeaderboardDocument, { variables: { organizationId: identity.organizationId, limit: 100 }, skip: !identity.organizationId, fetchPolicy: 'cache-and-network' });
	const view = <Leaderboard entries={query.data?.trainingLeaderboard ?? []} currentLearnerId={identity.sub} />;
	return <ComponentQueryLoader loading={query.loading} error={query.error} hasData={query.data} hasDataComponent={view} noDataComponent={view} errorComponent={<Alert type="error" showIcon message="Leaderboard could not be loaded" description={query.error?.message} />} />;
};

import { useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { LearnerDashboardContainerMyLearningDocument, type LearnerDashboardContainerMyLearningQuery } from '../generated.tsx';
import { Dashboard } from './dashboard.tsx';
import { MissingOrganizationAlert } from './shared/missing-organization-alert.tsx';

export const DashboardContainer = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const organizationId = identity.organizationId;
	const { data, loading, error } = useQuery<LearnerDashboardContainerMyLearningQuery>(LearnerDashboardContainerMyLearningDocument, { variables: { organizationId }, skip: !organizationId });
	const dashboard = (
		<Dashboard
			records={data?.myLearning ?? []}
			loading={false}
			givenName={identity.givenName || 'learner'}
			onBrowseCatalog={() => navigate('/catalog')}
			onOpenCourse={(courseId) => navigate(`/courses/${courseId}`)}
		/>
	);
	return (
		<>
			{!organizationId && <MissingOrganizationAlert />}
			<ComponentQueryLoader
				loading={loading}
				error={error}
				hasData={data}
				hasDataComponent={dashboard}
				noDataComponent={dashboard}
				errorComponent={
					<Alert
						showIcon
						type="error"
						message="Your learning record could not be loaded"
						description={error?.message}
						style={{ marginBottom: 24 }}
					/>
				}
			/>
		</>
	);
};

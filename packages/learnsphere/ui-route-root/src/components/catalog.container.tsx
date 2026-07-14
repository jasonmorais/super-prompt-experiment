import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { CatalogSelfEnrollDocument, LearnerCatalogDocument, type LearnerCatalogQuery } from '../generated.tsx';
import { Catalog, CatalogEmptyState } from './catalog.tsx';
import { MissingOrganizationAlert } from './shared/missing-organization-alert.tsx';

export const CatalogContainer = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	const organizationId = readLearnSphereIdentity(auth.user?.profile).organizationId;
	const { data, loading, error, refetch } = useQuery<LearnerCatalogQuery>(LearnerCatalogDocument, { variables: { organizationId }, skip: !organizationId });
	const [selfEnroll, enrollment] = useMutation(CatalogSelfEnrollDocument);
	const enroll = async (courseId: string) => {
		const result = await selfEnroll({ variables: { input: { organizationId, courseId } } });
		if (!result.data?.selfEnroll.status.success) {
			message.error(result.data?.selfEnroll.status.errorMessage ?? 'Enrollment could not be completed');
			return;
		}
		message.success('Course added to My learning');
		await refetch();
		navigate(`/courses/${courseId}`);
	};
	const catalog = (
		<Catalog
			courses={data?.courses ?? []}
			enrollments={data?.myLearning ?? []}
			loading={false}
			enrolling={enrollment.loading}
			onEnroll={(courseId) => void enroll(courseId)}
			onOpenCourse={(courseId) => navigate(`/courses/${courseId}`)}
		/>
	);
	return (
		<>
			{!organizationId && <MissingOrganizationAlert />}
			<ComponentQueryLoader
				loading={loading}
				error={error}
				hasData={data?.courses.length ? data : null}
				hasDataComponent={catalog}
				noDataComponent={data ? <CatalogEmptyState /> : catalog}
				errorComponent={
					<Alert
						type="error"
						showIcon
						message="The catalog could not be loaded"
						description={error?.message}
						style={{ marginBottom: 20 }}
					/>
				}
			/>
		</>
	);
};

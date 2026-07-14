import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { type EnrollmentSource, StaffAssignLearningDocument, StaffTeamOverviewDocument, type StaffTeamOverviewQuery } from '../generated.tsx';
import { TeamDashboard } from './team-dashboard.tsx';

type LearnerRow = { learnerId: string; name: string; email: string; teamName: string };
type AssignmentValues = { courseId: string; dueAt?: { toISOString(): string }; source: EnrollmentSource };

export const TeamDashboardContainer = () => {
	const auth = useAuth();
	const organizationId = readLearnSphereIdentity(auth.user?.profile).organizationId;
	const { data, loading, error, refetch } = useQuery<StaffTeamOverviewQuery>(StaffTeamOverviewDocument, { variables: { organizationId, teamName: null }, skip: !organizationId });
	const [assignLearning, assignment] = useMutation(StaffAssignLearningDocument);
	const assign = async (values: AssignmentValues, learner: LearnerRow) => {
		const result = await assignLearning({
			variables: {
				input: {
					organizationId,
					learnerId: learner.learnerId,
					learnerDisplayName: learner.name,
					learnerEmail: learner.email,
					teamName: learner.teamName,
					courseId: values.courseId,
					dueAt: values.dueAt?.toISOString(),
					source: values.source,
				},
			},
		});
		if (!result.data?.assignLearning.status.success) {
			message.error(result.data?.assignLearning.status.errorMessage ?? 'Assignment could not be created');
			return;
		}
		message.success(`Learning assigned to ${learner.name}. It will now appear in their My learning dashboard.`);
		await refetch();
	};
	const dashboard = (
		<TeamDashboard
			records={data?.teamLearning ?? []}
			courses={data?.courses ?? []}
			loading={false}
			assignmentLoading={assignment.loading}
			onAssign={assign}
		/>
	);
	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data}
			hasDataComponent={dashboard}
			noDataComponent={dashboard}
			errorComponent={
				<Alert
					type="error"
					showIcon
					message="Team progress could not be loaded"
					description={error?.message}
				/>
			}
		/>
	);
};

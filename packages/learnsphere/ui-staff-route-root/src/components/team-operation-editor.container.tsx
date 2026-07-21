import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffTeamOperationEditorCreateDocument, StaffTeamOperationEditorDataDocument, StaffTeamOperationEditorUpdateDocument } from '../generated.tsx';
import { TeamOperationEditor, type TeamOperationEditorValues } from './team-operation-editor.tsx';

export const TeamOperationEditorContainer = () => {
	const { operationId } = useParams<{ operationId: string }>();
	const navigate = useNavigate();
	const identity = readLearnSphereIdentity(useAuth().user?.profile);
	const query = useQuery(StaffTeamOperationEditorDataDocument, { variables: { organizationId: identity.organizationId }, skip: !identity.organizationId, fetchPolicy: 'network-only' });
	const [create, createState] = useMutation(StaffTeamOperationEditorCreateDocument);
	const [update, updateState] = useMutation(StaffTeamOperationEditorUpdateDocument);
	const operation = query.data?.teamOperations.find((candidate) => candidate.id === operationId);
	const save = async (values: TeamOperationEditorValues) => {
		const learner = query.data?.teams.flatMap((team) => team.members.map((member) => ({ ...member, teamName: team.name }))).find((candidate) => candidate.learnerId === values.assigneeId);
		if (!learner) { message.error('Select a learner from an active team'); return; }
		const common = { title: values.title, description: values.description, category: values.category, priority: values.priority, assigneeId: learner.learnerId, assigneeDisplayName: learner.displayName, assigneeEmail: learner.email, teamName: learner.teamName, ...(values.dueAt ? { dueAt: new Date(`${values.dueAt}T12:00:00`).toISOString() } : {}) };
		const status = operationId
			? (await update({ variables: { input: { id: operationId, ...common } } })).data?.teamOperationUpdate.status
			: (await create({ variables: { input: { organizationId: identity.organizationId, ...common } } })).data?.teamOperationCreate.status;
		if (!status?.success) { message.error(status?.errorMessage ?? 'The operation could not be saved'); return; }
		message.success(operationId ? 'Team operation updated' : 'Team operation assigned');
		navigate('/staff/operations');
	};
	const view = <TeamOperationEditor operation={operation} teams={query.data?.teams ?? []} saving={createState.loading || updateState.loading} onSave={(values) => void save(values)} onCancel={() => navigate('/staff/operations')} />;
	return (
		<ComponentQueryLoader
			loading={query.loading}
			error={query.error}
			hasData={operationId ? operation : (query.data ?? {})}
			hasDataComponent={view}
			noDataComponent={<Alert type="warning" showIcon message="Team operation not found" />}
			errorComponent={<Alert type="error" showIcon message="Team operation editor could not be loaded" description={query.error?.message} />}
		/>
	);
};

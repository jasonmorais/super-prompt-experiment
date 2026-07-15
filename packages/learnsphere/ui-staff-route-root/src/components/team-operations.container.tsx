import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, Button, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffAttachTeamOperationDocument, StaffCancelTeamOperationDocument, StaffCommentTeamOperationDocument, StaffConfirmTeamOperationDocument, StaffCreateTeamOperationDocument, StaffTeamOperationsDocument, StaffUpdateTeamOperationDocument, type StaffTeamOperationsQuery } from '../generated.tsx';
import { StaffTeamGoalDetail, TeamOperations } from './team-operations.tsx';

type Operation = StaffTeamOperationsQuery['teamOperations'][number];
type CreateValues = { title: string; description: string; category: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; assigneeId: string; dueAt?: { toISOString(): string } };
type UpdateValues = Omit<CreateValues, 'assigneeId' | 'dueAt'> & { dueAt?: string };

export const TeamOperationsContainer = () => {
	const auth = useAuth();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const navigate = useNavigate();
	const { operationId } = useParams<{ operationId: string }>();
	const organizationId = identity.organizationId;
	const canConfirm = identity.roles.includes('Manager') || identity.roles.includes('ManagerLearningAdmin');
	const { data, loading, error, refetch } = useQuery<StaffTeamOperationsQuery>(StaffTeamOperationsDocument, { variables: { organizationId, teamName: null }, skip: !organizationId });
	const [createOperation, creating] = useMutation(StaffCreateTeamOperationDocument);
	const [confirmOperation, confirming] = useMutation(StaffConfirmTeamOperationDocument);
	const [cancelOperation, cancelling] = useMutation(StaffCancelTeamOperationDocument);
	const [commentOperation, commenting] = useMutation(StaffCommentTeamOperationDocument);
	const [attachOperation, attaching] = useMutation(StaffAttachTeamOperationDocument);
	const [updateOperation, updating] = useMutation(StaffUpdateTeamOperationDocument);
	const learners = [...new Map([
		...(data?.teamLearning ?? []),
		...(data?.teams.flatMap((team) => team.members.map((member) => ({ learnerId: member.learnerId, learnerDisplayName: member.displayName, learnerEmail: member.email, teamName: team.name }))) ?? []),
	].map((learner) => [learner.learnerId, learner])).values()];
	const create = async (values: CreateValues) => {
		const learner = learners.find((candidate) => candidate.learnerId === values.assigneeId);
		if (!learner) return;
		const result = await createOperation({ variables: { input: { organizationId, title: values.title, description: values.description, category: values.category, priority: values.priority, assigneeId: learner.learnerId, assigneeDisplayName: learner.learnerDisplayName, assigneeEmail: learner.learnerEmail, teamName: learner.teamName, dueAt: values.dueAt?.toISOString() } } });
		const status = result.data?.teamOperationCreate.status;
		if (!status?.success) { message.error(status?.errorMessage ?? 'The operation could not be created'); return; }
		message.success(`Operation assigned to ${learner.learnerDisplayName}`);
		await refetch();
	};
	const confirm = async (operation: Operation, note?: string) => {
		const result = await confirmOperation({ variables: { input: { id: operation.id, note } } });
		const status = result.data?.teamOperationConfirm.status;
		if (!status?.success) { message.error(status?.errorMessage ?? 'The operation could not be confirmed'); return; }
		message.success('Operation marked complete.');
		await refetch();
	};
	const cancel = async (operation: Operation, reason: string) => {
		const result = await cancelOperation({ variables: { input: { id: operation.id, reason } } });
		const status = result.data?.teamOperationCancel.status;
		if (!status?.success) { message.error(status?.errorMessage ?? 'The operation could not be cancelled'); return; }
		message.success('Operation cancelled.');
		await refetch();
	};
	const comment = async (operation: Operation, body: string) => {
		const result = await commentOperation({ variables: { input: { id: operation.id, body } } });
		const status = result.data?.teamOperationComment.status;
		if (!status?.success) { message.error(status?.errorMessage ?? 'The comment could not be saved'); return; }
		await refetch();
	};
	const attach = async (operation: Operation, file: File) => {
		if (file.size > 8 * 1024 * 1024) { message.error('Attachments must be smaller than 8 MB'); return; }
		const contentBase64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.addEventListener('load', () => resolve(String(reader.result).split(',')[1] ?? '')); reader.addEventListener('error', () => reject(reader.error)); reader.readAsDataURL(file); });
		const result = await attachOperation({ variables: { input: { id: operation.id, fileName: file.name, contentType: file.type || 'application/octet-stream', contentBase64 } } });
		const status = result.data?.teamOperationAttach.status;
		if (!status?.success) { message.error(status?.errorMessage ?? 'The attachment could not be saved'); return; }
		message.success('File attached to the thread');
		await refetch();
	};
	const update = async (operation: Operation, values: UpdateValues) => { const result = await updateOperation({ variables: { input: { id: operation.id, title: values.title, description: values.description, category: values.category, priority: values.priority, ...(values.dueAt ? { dueAt: new Date(`${values.dueAt}T00:00:00`).toISOString() } : {}) } } }); const status = result.data?.teamOperationUpdate.status; if (!status?.success) { message.error(status?.errorMessage ?? 'The team goal could not be updated'); return; } message.success('Team goal updated.'); await refetch(); };
	const operation = data?.teamOperations.find((candidate) => candidate.id === operationId);
	const view = operationId ? operation ? <StaffTeamGoalDetail operation={operation} commenting={commenting.loading} attaching={attaching.loading} onComment={(candidate, body) => void comment(candidate, body)} onAttach={(candidate, file) => void attach(candidate, file)} onBack={() => navigate('/staff/operations')} /> : <Alert type="warning" showIcon message="Team goal not found" description="This team goal may have been completed, cancelled, or removed." action={<Button type="link" onClick={() => navigate('/staff/operations')}>Back to team operations</Button>} /> : <TeamOperations operations={data?.teamOperations ?? []} learners={learners} canConfirm={canConfirm} loading={false} creating={creating.loading} confirming={confirming.loading} cancelling={cancelling.loading} commenting={commenting.loading} attaching={attaching.loading} updating={updating.loading} onCreate={(values) => void create(values)} onConfirm={(operation, note) => void confirm(operation, note)} onCancel={(operation, reason) => void cancel(operation, reason)} onComment={(operation, body) => void comment(operation, body)} onAttach={(operation, file) => void attach(operation, file)} onUpdate={(operation, values) => void update(operation, values)} onOpenGoal={(id) => navigate(`/staff/operations/${id}`)} />;
	return <ComponentQueryLoader loading={loading} error={error} hasData={data} hasDataComponent={view} noDataComponent={view} errorComponent={<Alert type="error" showIcon message="Team operations could not be loaded" description={error?.message} />} />;
};

import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { LearnerOperationsContainerAttachDocument, LearnerOperationsContainerCommentDocument, LearnerOperationsContainerMyTeamOperationsDocument, LearnerOperationsContainerSubmitDocument, type LearnerOperationsContainerMyTeamOperationsQuery } from '../generated.tsx';
import { Operations } from './operations.tsx';

type Operation = LearnerOperationsContainerMyTeamOperationsQuery['myTeamOperations'][number];

export const OperationsContainer = () => {
	const auth = useAuth();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const navigate = useNavigate();
	const organizationId = identity.organizationId;
	const { data, loading, error, refetch } = useQuery<LearnerOperationsContainerMyTeamOperationsQuery>(LearnerOperationsContainerMyTeamOperationsDocument, { variables: { organizationId }, skip: !organizationId });
	const [submitOperation, submitting] = useMutation(LearnerOperationsContainerSubmitDocument);
	const [commentOperation, commenting] = useMutation(LearnerOperationsContainerCommentDocument);
	const [attachOperation, attaching] = useMutation(LearnerOperationsContainerAttachDocument);
	const submit = async (operation: Operation, completionNote: string, completionEvidence?: string) => {
		const result = await submitOperation({ variables: { input: { id: operation.id, completionNote, completionEvidence } } });
		const status = result.data?.teamOperationSubmit.status;
		if (!status?.success) { message.error(status?.errorMessage ?? 'The operation could not be submitted'); return; }
		message.success('Submitted for manager confirmation.');
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
	const view = <Operations operations={data?.myTeamOperations ?? []} learnerId={identity.sub} loading={false} submitting={submitting.loading} commenting={commenting.loading} attaching={attaching.loading} onSubmit={(operation, note, evidence) => void submit(operation, note, evidence)} onComment={(operation, body) => void comment(operation, body)} onAttach={(operation, file) => void attach(operation, file)} onOpenGoal={(operationId) => navigate(`/operations/${operationId}`)} />;
	return <ComponentQueryLoader loading={loading} error={error} hasData={data} hasDataComponent={view} noDataComponent={view} errorComponent={<Alert type="error" showIcon message="Team operations could not be loaded" description={error?.message} />} />;
};

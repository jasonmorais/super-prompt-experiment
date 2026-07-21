import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import { LearnerTeamGoalContainerAttachDocument, LearnerTeamGoalContainerCommentDocument, LearnerTeamGoalContainerRemoveAttachmentDocument, LearnerTeamGoalContainerSubmitDocument, LearnerTeamGoalContainerTeamGoalDocument, type LearnerTeamGoalContainerTeamGoalQuery } from '../generated.tsx';
import { TeamGoalDetail } from './operations/team-goal-detail.tsx';

type Operation = LearnerTeamGoalContainerTeamGoalQuery['myTeamOperations'][number];

export const TeamGoalContainer = () => {
	const auth = useAuth();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const navigate = useNavigate();
	const { operationId } = useParams<{ operationId: string }>();
	const { data, loading, error, refetch } = useQuery<LearnerTeamGoalContainerTeamGoalQuery>(LearnerTeamGoalContainerTeamGoalDocument, { variables: { organizationId: identity.organizationId }, skip: !identity.organizationId });
	const [submitOperation, submitting] = useMutation(LearnerTeamGoalContainerSubmitDocument);
	const [commentOperation, commenting] = useMutation(LearnerTeamGoalContainerCommentDocument);
	const [attachOperation, attaching] = useMutation(LearnerTeamGoalContainerAttachDocument);
	const [removeAttachmentOperation, removingAttachment] = useMutation(LearnerTeamGoalContainerRemoveAttachmentDocument);
	const operation = data?.myTeamOperations.find((candidate) => candidate.id === operationId);
	const submit = async (candidate: Operation, completionNote: string, completionEvidence?: string) => { const result = await submitOperation({ variables: { input: { id: candidate.id, completionNote, completionEvidence } } }); const status = result.data?.teamOperationSubmit.status; if (!status?.success) { message.error(status?.errorMessage ?? 'The operation could not be submitted'); return; } message.success('Submitted for manager confirmation.'); await refetch(); };
	const comment = async (candidate: Operation, body: string) => { const result = await commentOperation({ variables: { input: { id: candidate.id, body } } }); const status = result.data?.teamOperationComment.status; if (!status?.success) { message.error(status?.errorMessage ?? 'The comment could not be saved'); return; } await refetch(); };
	const attach = async (candidate: Operation, file: File) => { if (file.size > 8 * 1024 * 1024) { message.error('Attachments must be smaller than 8 MB'); return; } const contentBase64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.addEventListener('load', () => resolve(String(reader.result).split(',')[1] ?? '')); reader.addEventListener('error', () => reject(reader.error)); reader.readAsDataURL(file); }); const result = await attachOperation({ variables: { input: { id: candidate.id, fileName: file.name, contentType: file.type || 'application/octet-stream', contentBase64 } } }); const status = result.data?.teamOperationAttach.status; if (!status?.success) { message.error(status?.errorMessage ?? 'The attachment could not be saved'); return; } message.success('File attached to the discussion.'); await refetch(); };
	const removeAttachment = async (candidate: Operation, attachmentId: string) => { const result = await removeAttachmentOperation({ variables: { input: { id: candidate.id, attachmentId } } }); const status = result.data?.teamOperationRemoveAttachment.status; if (!status?.success) { message.error(status?.errorMessage ?? 'The attachment could not be removed'); return; } message.success('Attachment removed.'); await refetch(); };
	const view = operation ? <TeamGoalDetail operation={operation} learnerId={identity.sub} submitting={submitting.loading} commenting={commenting.loading} attaching={attaching.loading} removingAttachment={removingAttachment.loading} onSubmit={(candidate, note, evidence) => void submit(candidate, note, evidence)} onComment={(candidate, body) => void comment(candidate, body)} onAttach={(candidate, file) => void attach(candidate, file)} onRemoveAttachment={(candidate, attachmentId) => void removeAttachment(candidate, attachmentId)} onBack={() => navigate('/operations')} /> : <Alert type="warning" showIcon message="Team goal not found" description="This team goal may have been completed, cancelled, or removed." action={<button type="button" onClick={() => navigate('/operations')}>Back to team operations</button>} />;
	return <ComponentQueryLoader loading={loading} error={error} hasData={data} hasDataComponent={view} noDataComponent={view} errorComponent={<Alert type="error" showIcon message="Team goal could not be loaded" description={error?.message} />} />;
};

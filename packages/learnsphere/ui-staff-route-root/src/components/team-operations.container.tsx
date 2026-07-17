import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, Button, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import {
	StaffTeamOperationsContainerAttachTeamOperationDocument,
	StaffTeamOperationsContainerCancelTeamOperationDocument,
	StaffTeamOperationsContainerCommentTeamOperationDocument,
	StaffTeamOperationsContainerConfirmTeamOperationDocument,
	StaffTeamOperationsContainerTeamOperationsDocument,
	type StaffTeamOperationsContainerTeamOperationsQuery,
} from '../generated.tsx';
import { TeamOperations } from './team-operations.tsx';
import { StaffTeamGoalDetail } from './team-operations/team-goal-detail.tsx';
import type { Operation } from './team-operations/types.ts';
import { useStaffAuthorization } from '../staff-authorization.tsx';

export const TeamOperationsContainer = () => {
	const auth = useAuth();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const capabilities = useStaffAuthorization().capabilities;
	const navigate = useNavigate();
	const { operationId } = useParams<{ operationId: string }>();
	const organizationId = identity.organizationId;
	const canConfirm = capabilities.canConfirmTeamOperations;
	const { data, loading, error, refetch } = useQuery<StaffTeamOperationsContainerTeamOperationsQuery>(StaffTeamOperationsContainerTeamOperationsDocument, { variables: { organizationId, teamName: null }, skip: !organizationId });
	const [confirmOperation, confirming] = useMutation(StaffTeamOperationsContainerConfirmTeamOperationDocument);
	const [cancelOperation, cancelling] = useMutation(StaffTeamOperationsContainerCancelTeamOperationDocument);
	const [commentOperation, commenting] = useMutation(StaffTeamOperationsContainerCommentTeamOperationDocument);
	const [attachOperation, attaching] = useMutation(StaffTeamOperationsContainerAttachTeamOperationDocument);
	const confirm = async (operation: Operation, note?: string) => {
		const result = await confirmOperation({ variables: { input: { id: operation.id, note } } });
		const status = result.data?.teamOperationConfirm.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'The operation could not be confirmed');
			return;
		}
		message.success('Operation marked complete.');
		await refetch();
	};
	const cancel = async (operation: Operation, reason: string) => {
		const result = await cancelOperation({ variables: { input: { id: operation.id, reason } } });
		const status = result.data?.teamOperationCancel.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'The operation could not be cancelled');
			return;
		}
		message.success('Operation cancelled.');
		await refetch();
	};
	const comment = async (operation: Operation, body: string) => {
		const result = await commentOperation({ variables: { input: { id: operation.id, body } } });
		const status = result.data?.teamOperationComment.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'The comment could not be saved');
			return;
		}
		await refetch();
	};
	const attach = async (operation: Operation, file: File) => {
		if (file.size > 8 * 1024 * 1024) {
			message.error('Attachments must be smaller than 8 MB');
			return;
		}
		const contentBase64 = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.addEventListener('load', () => resolve(String(reader.result).split(',')[1] ?? ''));
			reader.addEventListener('error', () => reject(reader.error));
			reader.readAsDataURL(file);
		});
		const result = await attachOperation({ variables: { input: { id: operation.id, fileName: file.name, contentType: file.type || 'application/octet-stream', contentBase64 } } });
		const status = result.data?.teamOperationAttach.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'The attachment could not be saved');
			return;
		}
		message.success('File attached to the thread');
		await refetch();
	};
	const operation = data?.teamOperations.find((candidate) => candidate.id === operationId);
	const view = operationId ? (
		operation ? (
			<StaffTeamGoalDetail
				operation={operation}
				commenting={commenting.loading}
				attaching={attaching.loading}
				onComment={(candidate, body) => void comment(candidate, body)}
				onAttach={(candidate, file) => void attach(candidate, file)}
				onBack={() => navigate('/staff/operations')}
			/>
		) : (
			<Alert
				type="warning"
				showIcon
				message="Team goal not found"
				description="This team goal may have been completed, cancelled, or removed."
				action={
					<Button
						type="link"
						onClick={() => navigate('/staff/operations')}
					>
						Back to team operations
					</Button>
				}
			/>
		)
	) : (
		<TeamOperations
			operations={data?.teamOperations ?? []}
			canConfirm={canConfirm}
			loading={false}
			confirming={confirming.loading}
			cancelling={cancelling.loading}
			onConfirm={(operation, note) => void confirm(operation, note)}
			onCancel={(operation, reason) => void cancel(operation, reason)}
			onOpenGoal={(id) => navigate(`/staff/operations/${id}`)}
			onCreateOperation={() => navigate('/staff/operations/new')}
			onEditOperation={(id) => navigate(`/staff/operations/${id}/edit`)}
		/>
	);
	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data}
			hasDataComponent={view}
			noDataComponent={view}
			errorComponent={
				<Alert
					type="error"
					showIcon
					message="Team operations could not be loaded"
					description={error?.message}
				/>
			}
		/>
	);
};

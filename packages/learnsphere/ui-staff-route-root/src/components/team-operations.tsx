import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Typography } from 'antd';
import { useState } from 'react';
import { OperationsTable } from './team-operations/operations-table.tsx';
import { OperationModals } from './team-operations/operation-modals.tsx';
import type { CreateValues, Learner, Operation, UpdateValues } from './team-operations/types.ts';

const { Title, Paragraph, Text } = Typography;

export interface TeamOperationsProps {
	operations: Operation[];
	learners: Learner[];
	canConfirm: boolean;
	loading: boolean;
	creating: boolean;
	confirming: boolean;
	cancelling: boolean;
	updating: boolean;
	onCreate: (values: CreateValues) => void;
	onConfirm: (operation: Operation, note?: string) => void;
	onCancel: (operation: Operation, reason: string) => void;
	onUpdate: (operation: Operation, values: UpdateValues) => void;
	onOpenGoal: (operationId: string) => void;
}

export const TeamOperations = ({ operations, learners, canConfirm, loading, creating, confirming, cancelling, updating, onCreate, onConfirm, onCancel, onUpdate, onOpenGoal }: TeamOperationsProps) => {
	const [createOpen, setCreateOpen] = useState(false);
	const [confirmingOperation, setConfirmingOperation] = useState<Operation>();
	const [cancellingOperation, setCancellingOperation] = useState<Operation>();
	const [editingOperation, setEditingOperation] = useState<Operation>();
	return (
		<>
			<div className="mb-7 flex items-end justify-between gap-5">
				<div>
					<Text className="text-xs font-bold uppercase tracking-[.08em] text-[#6d4aff]">Team operations</Text>
					<Title className="my-[6px]">Team operations</Title>
					<Paragraph
						className="m-0"
						type="secondary"
					>
						Shape team-wide goals, assign ownership, review outcomes, and confirm completion as a manager.
					</Paragraph>
				</div>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setCreateOpen(true)}
				>
					Assign operation
				</Button>
			</div>
			<Alert
				type="info"
				showIcon
				message="Completion control"
				description={
					canConfirm ? 'Team members can submit their work. You can confirm an operation only after reviewing the submitted outcome.' : 'Team members can submit their work, but only a manager can confirm an operation as complete.'
				}
				className="mb-[22px]"
			/>
			<OperationsTable
				operations={operations}
				loading={loading}
				canConfirm={canConfirm}
				onOpenGoal={onOpenGoal}
				onEdit={setEditingOperation}
				onConfirm={setConfirmingOperation}
				onCancel={setCancellingOperation}
			/>
			<OperationModals
				createOpen={createOpen}
				confirmingOperation={confirmingOperation}
				cancellingOperation={cancellingOperation}
				editingOperation={editingOperation}
				learners={learners}
				creating={creating}
				confirming={confirming}
				cancelling={cancelling}
				updating={updating}
				onCloseCreate={() => setCreateOpen(false)}
				onCloseConfirm={() => setConfirmingOperation(undefined)}
				onCloseCancel={() => setCancellingOperation(undefined)}
				onCloseEdit={() => setEditingOperation(undefined)}
				onCreate={(values) => {
					onCreate(values);
					setCreateOpen(false);
				}}
				onConfirm={(operation, note) => {
					onConfirm(operation, note);
					setConfirmingOperation(undefined);
				}}
				onCancel={(operation, reason) => {
					onCancel(operation, reason);
					setCancellingOperation(undefined);
				}}
				onUpdate={(operation, values) => {
					onUpdate(operation, values);
					setEditingOperation(undefined);
				}}
			/>
		</>
	);
};

export { StaffTeamGoalDetail } from './team-operations/team-goal-detail.tsx';

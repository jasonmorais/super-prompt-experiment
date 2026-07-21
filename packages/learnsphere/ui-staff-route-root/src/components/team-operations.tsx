import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Tabs, Typography } from 'antd';
import { useState } from 'react';
import { OperationsTable } from './team-operations/operations-table.tsx';
import { OperationWorkflowModals } from './team-operations/operation-workflow-modals.tsx';
import type { Operation } from './team-operations/types.ts';

const { Title, Paragraph, Text } = Typography;
export interface TeamOperationsProps { operations: Operation[]; canConfirm: boolean; loading: boolean; confirming: boolean; cancelling: boolean; deleting: boolean; onConfirm: (operation: Operation, note?: string) => void; onCancel: (operation: Operation, reason: string) => void; onDelete: (operation: Operation) => void; onOpenGoal: (operationId: string) => void; onCreateOperation: () => void; onEditOperation: (operationId: string) => void; }

export const TeamOperations = ({ operations, canConfirm, loading, confirming, cancelling, deleting, onConfirm, onCancel, onDelete, onOpenGoal, onCreateOperation, onEditOperation }: TeamOperationsProps) => {
	const [confirmingOperation, setConfirmingOperation] = useState<Operation>();
	const [cancellingOperation, setCancellingOperation] = useState<Operation>();
	const activeOperations = operations.filter((operation) => !['COMPLETED', 'CANCELLED'].includes(operation.status));
	const historyOperations = operations.filter((operation) => ['COMPLETED', 'CANCELLED'].includes(operation.status));
	const table = (items: Operation[]) => <OperationsTable operations={items} loading={loading} canConfirm={canConfirm} deleting={deleting} onOpenGoal={onOpenGoal} onEdit={(operation) => onEditOperation(operation.id)} onConfirm={setConfirmingOperation} onCancel={setCancellingOperation} onDelete={onDelete} />;
	return <>
		<div className="mb-7 flex items-end justify-between gap-5"><div><Text className="text-xs font-bold uppercase tracking-[.08em] text-[#6d4aff]">Team operations</Text><Title className="my-[6px]">Team operations</Title><Paragraph className="m-0" type="secondary">Shape goals, assign ownership, manage delivery details, and review outcomes.</Paragraph></div><Button type="primary" icon={<PlusOutlined />} onClick={onCreateOperation}>Assign operation</Button></div>
		<Alert type="info" showIcon message="Completion control" description={canConfirm ? 'Team members submit their work for your review. Use the editor to manage operation details and ownership.' : 'You can manage operation details, but only a manager can confirm submitted work.'} className="mb-[22px]" />
		<Tabs items={[{ key: 'active', label: `Active (${activeOperations.length})`, children: table(activeOperations) }, { key: 'history', label: `History (${historyOperations.length})`, children: table(historyOperations) }]} />
		<OperationWorkflowModals confirmingOperation={confirmingOperation} cancellingOperation={cancellingOperation} confirming={confirming} cancelling={cancelling} onCloseConfirm={() => setConfirmingOperation(undefined)} onCloseCancel={() => setCancellingOperation(undefined)} onConfirm={(operation, note) => { onConfirm(operation, note); setConfirmingOperation(undefined); }} onCancel={(operation, reason) => { onCancel(operation, reason); setCancellingOperation(undefined); }} />
	</>;
};

export { StaffTeamGoalDetail } from './team-operations/team-goal-detail.tsx';

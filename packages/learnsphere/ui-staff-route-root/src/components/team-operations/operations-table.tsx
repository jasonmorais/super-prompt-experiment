import { CheckCircleOutlined, DeleteOutlined, EditOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Space, Statistic, Table, Tag, Typography, type TableProps } from 'antd';
import type { Operation } from './types.ts';

const { Paragraph, Text } = Typography;
const statusColor = (status: string) => (status === 'COMPLETED' ? 'green' : status === 'SUBMITTED' ? 'gold' : status === 'CANCELLED' ? 'default' : status === 'IN_PROGRESS' ? 'blue' : 'purple');

export interface OperationsTableProps {
	operations: Operation[];
	loading: boolean;
	canConfirm: boolean;
	onOpenGoal: (operationId: string) => void;
	onEdit: (operation: Operation) => void;
	onConfirm: (operation: Operation) => void;
	onCancel: (operation: Operation) => void;
}

export const OperationsTable = ({ operations, loading, canConfirm, onOpenGoal, onEdit, onConfirm, onCancel }: OperationsTableProps) => {
	const submitted = operations.filter((operation) => operation.status === 'SUBMITTED').length;
	const overdue = operations.filter((operation) => operation.isOverdue).length;
	const columns: TableProps<Operation>['columns'] = [
		{
			title: 'Team goal',
			render: (_, operation) => (
				<Button
					type="link"
					className="h-auto p-0 text-left text-[#28305d]"
					onClick={() => onOpenGoal(operation.id)}
				>
					<div className="font-bold">{operation.title}</div>
					<Text type="secondary">
						{operation.category} · {operation.priority.toLowerCase()}
					</Text>
				</Button>
			),
		},
		{ title: 'Owner', dataIndex: 'assigneeDisplayName' },
		{ title: 'Due', render: (_, operation) => (operation.dueAt ? new Date(operation.dueAt).toLocaleDateString() : 'No due date') },
		{ title: 'Status', render: (_, operation) => <Tag color={statusColor(operation.status)}>{operation.status.replaceAll('_', ' ')}</Tag> },
		{
			title: 'Actions',
			render: (_, operation) => (
				<Space
					size={[8, 8]}
					wrap
				>
					<Button
						className="rounded-[10px] border-[#cfc5ff] bg-[#f7f4ff] font-semibold text-[#6d4aff]"
						icon={<EditOutlined />}
						onClick={() => onEdit(operation)}
					>
						Edit
					</Button>
					{canConfirm && operation.status === 'SUBMITTED' && (
						<Button
							type="primary"
							className="rounded-[10px] font-semibold"
							onClick={() => onConfirm(operation)}
						>
							Confirm complete
						</Button>
					)}
					{!['COMPLETED', 'CANCELLED'].includes(operation.status) && (
						<Button
							className="rounded-[10px] border-[#cfc5ff] bg-[#f7f4ff] font-semibold text-[#6d4aff]"
							icon={<DeleteOutlined />}
							onClick={() => onCancel(operation)}
						>
							Cancel
						</Button>
					)}
				</Space>
			),
		},
	];
	return (
		<>
			<div className="mb-6 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
				<Card loading={loading}>
					<Statistic
						title="Open operations"
						value={operations.filter((operation) => !['COMPLETED', 'CANCELLED'].includes(operation.status)).length}
						prefix={<ThunderboltOutlined />}
					/>
				</Card>
				<Card loading={loading}>
					<Statistic
						title="Awaiting confirmation"
						value={submitted}
						prefix={<CheckCircleOutlined />}
					/>
				</Card>
				<Card loading={loading}>
					<Statistic
						title="Overdue"
						value={overdue}
						valueStyle={{ color: overdue ? '#c43d4b' : undefined }}
					/>
				</Card>
			</div>
			<Card>
				<Table<Operation>
					loading={loading}
					rowKey="id"
					dataSource={operations}
					pagination={{ pageSize: 8 }}
					expandable={{
						expandedRowRender: (operation) => (
							<Space
								direction="vertical"
								className="w-full"
							>
								<Paragraph className="m-0">{operation.description}</Paragraph>
								<Text type="secondary">
									Created by {operation.createdBy} · {operation.statusHistory.length} status events
								</Text>
							</Space>
						),
					}}
					columns={columns}
				/>
			</Card>
		</>
	);
};

import { Button, Card, Image, Table, Tag, Typography } from 'antd';
import type { RecordView } from './types.ts';

const { Text } = Typography;

export interface AssignmentDetailTableProps {
	records: RecordView[];
	loading: boolean;
	onUnassign: (id: string) => Promise<void>;
}

const actorLabel = (value: string | null | undefined): string => {
	if (!value) return '—';
	const username = (value.includes('@') ? value.split('@')[0] : value) ?? value;
	return username.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const AssignmentDetailTable = ({ records, loading, onUnassign }: AssignmentDetailTableProps) => (
	<Card title="Assignment detail">
		<Table<RecordView>
			loading={loading}
			rowKey="id"
			dataSource={records}
			pagination={{ pageSize: 8 }}
			columns={[
				{ title: 'Learner', dataIndex: 'learnerDisplayName' },
				{
					title: 'Course',
					render: (_, row) => (
						<div>
							<div>{row.courseTitle}</div>
							<Text
								type="secondary"
								className="text-xs"
							>
								{row.courseCategory}
							</Text>
						</div>
					),
				},
				{
					title: 'Source',
					render: (_, row) =>
						row.source
							.replaceAll('_', ' ')
							.toLowerCase()
							.replace(/^./, (letter) => letter.toUpperCase()),
				},
				{ title: 'Assigned by', render: (_, row) => actorLabel(row.assignedBy) },
				{ title: 'Due', render: (_, row) => (row.dueAt ? new Date(row.dueAt).toLocaleDateString() : 'Self-paced') },
				{ title: 'Status', render: (_, row) => <Tag color={row.status === 'COMPLETED' ? 'green' : row.isOverdue ? 'red' : 'blue'}>{row.isOverdue ? 'OVERDUE' : row.status.replaceAll('_', ' ')}</Tag> },
				{
					title: 'Evidence',
					render: (_, row) =>
						row.completionScreenshot ? (
							<Image
								width={44}
								height={44}
								preview={{ mask: 'View' }}
								src={row.completionScreenshot}
								className="rounded-md object-cover"
							/>
						) : row.requiresCompletionScreenshot ? (
							<Tag color="orange">Required</Tag>
						) : (
							<Text type="secondary">Optional</Text>
						),
				},
				{ title: 'Progress', render: (_, row) => `${row.progressPercent}%` },
				{
					title: 'Undo',
					render: (_, row) =>
						row.status !== 'COMPLETED' ? (
							<Button
								type="link"
								onClick={() => void onUnassign(row.id)}
							>
								Unassign
							</Button>
						) : (
							<Text type="secondary">Completed</Text>
						),
				},
			]}
		/>
	</Card>
);

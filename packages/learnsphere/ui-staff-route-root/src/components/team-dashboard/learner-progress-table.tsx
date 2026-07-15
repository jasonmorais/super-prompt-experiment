import { Avatar, Card, Progress, Space, Table, Tag, Typography } from 'antd';
import type { LearnerRow } from './types.ts';

const { Text } = Typography;

export interface LearnerProgressTableProps {
	learners: LearnerRow[];
	loading: boolean;
}

export const LearnerProgressTable = ({ learners, loading }: LearnerProgressTableProps) => (
	<Card title="Learner progress">
		<Table<LearnerRow>
			loading={loading}
			rowKey="key"
			dataSource={learners}
			pagination={false}
			columns={[
				{
					title: 'Learner',
					render: (_, row) => (
						<Space>
							<Avatar className="bg-[#ddd6ff] text-[#432a9b]">
								{row.name
									.split(' ')
									.map((part) => part[0])
									.join('')
									.slice(0, 2)}
							</Avatar>
							<div>
								<div className="font-semibold">{row.name}</div>
								<Text
									type="secondary"
									className="text-xs"
								>
									{row.email}
								</Text>
							</div>
						</Space>
					),
				},
				{ title: 'Team', dataIndex: 'teamName' },
				{ title: 'Assigned', dataIndex: 'assignments', align: 'center' },
				{ title: 'Completed', render: (_, row) => `${row.completed}/${row.assignments}`, align: 'center' },
				{
					title: 'Average progress',
					render: (_, row) => (
						<div className="min-w-[150px]">
							<Progress
								percent={row.averageProgress}
								size="small"
							/>
						</div>
					),
				},
				{ title: 'Tracked time', render: (_, row) => `${(row.learningMinutes / 60).toFixed(1)} hrs` },
				{ title: 'Risk', render: (_, row) => (row.overdue ? <Tag color="red">{row.overdue} overdue</Tag> : <Tag color="green">On track</Tag>) },
			]}
		/>
	</Card>
);

import { ClockCircleOutlined, TrophyFilled } from '@ant-design/icons';
import { Avatar, Card, Empty, Progress, Space, Table, Tag, Typography, type TableProps } from 'antd';
import type { LearnerLeaderboardContainerTrainingLeaderboardQuery } from '../generated.tsx';

type Entry = LearnerLeaderboardContainerTrainingLeaderboardQuery['trainingLeaderboard'][number];
const { Title, Paragraph, Text } = Typography;
const medalColor = (rank: number) => rank === 1 ? '#d9a514' : rank === 2 ? '#82909c' : '#ae6f3b';

export const Leaderboard = ({ entries, currentLearnerId }: { entries: Entry[]; currentLearnerId: string }) => {
	const columns: TableProps<Entry>['columns'] = [
		{ title: 'Rank', width: 90, render: (_, entry) => entry.rank <= 3 ? <Tag icon={<TrophyFilled />} color={medalColor(entry.rank)}>#{entry.rank}</Tag> : <Text strong>#{entry.rank}</Text> },
		{ title: 'Learner', render: (_, entry) => <Space><Avatar>{entry.learnerDisplayName.slice(0, 2).toUpperCase()}</Avatar><div><Text strong>{entry.learnerDisplayName}{entry.learnerId === currentLearnerId ? ' (you)' : ''}</Text><div><Text type="secondary">{entry.teamName}</Text></div></div></Space> },
		{ title: 'Completed', sorter: (a, b) => a.completedTrainings - b.completedTrainings, render: (_, entry) => <div><Text strong>{entry.completedTrainings} training{entry.completedTrainings === 1 ? '' : 's'}</Text><Progress percent={entry.totalTrainings ? Math.round((entry.completedTrainings / entry.totalTrainings) * 100) : 0} showInfo={false} size="small" strokeColor="#176c5b" /></div> },
		{ title: 'Learning time', render: (_, entry) => <Text><ClockCircleOutlined /> {Math.floor(entry.totalLearningMinutes / 60)}h {entry.totalLearningMinutes % 60}m</Text> },
		{ title: 'Latest completion', render: (_, entry) => entry.lastCompletedAt ? new Date(entry.lastCompletedAt).toLocaleDateString() : 'Not yet' },
	];
	return <>
		<div className="mb-7"><Text className="text-xs font-bold uppercase tracking-[.08em] text-[#176c5b]">Training leaderboard</Text><Title className="my-[6px]">Learning leaders</Title><Paragraph type="secondary">Rankings are based on completed trainings across your organization. Learning time breaks completion ties.</Paragraph></div>
		<Card>{entries.length ? <Table rowKey="learnerId" dataSource={entries} columns={columns} pagination={{ pageSize: 20 }} rowClassName={(entry) => entry.learnerId === currentLearnerId ? 'bg-[#f1f8f5]' : ''} /> : <Empty description="No training completions have been recorded yet" />}</Card>
	</>;
};

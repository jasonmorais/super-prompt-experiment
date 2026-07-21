import { ArrowRightOutlined, BookOutlined } from '@ant-design/icons';
import { Button, Card, Progress, Tag, Typography } from 'antd';
import type { LearnerDashboardContainerMyLearningQuery } from '../../generated.tsx';

const { Title, Text } = Typography;
type LearningRecord = LearnerDashboardContainerMyLearningQuery['myLearning'][number];

const actorLabel = (value: string | null | undefined): string => {
	if (!value) return 'your organization';
	const username = value.includes('@') ? (value.split('@')[0] ?? value) : value;
	return username.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export interface LearningCardProps {
	record: LearningRecord;
	color: string;
	onOpen: () => void;
}

export const LearningCard = ({ record, color, onOpen }: LearningCardProps) => (
	<Card
		className="overflow-hidden rounded-[18px] border border-[#e5eae6] shadow-[0_8px_28px_rgba(24,55,48,.05)]"
		styles={{ body: { padding: 0 } }}
	>
		<div
			className="relative h-[116px] p-5"
			style={{ background: color }}
		>
			<div className="flex flex-wrap gap-1.5">
				<Tag
					bordered={false}
					style={{ background: 'rgba(255,255,255,.78)', color: '#18362f' }}
				>
					{record.courseCategory}
				</Tag>
				{(record.isOverdue || record.status === 'OVERDUE') && <Tag bordered={false} color="red">Late</Tag>}
				{record.source !== 'SELF_ENROLLED' && (
					<Tag
						bordered={false}
						color="orange"
					>
						Assigned to me
					</Tag>
				)}
			</div>
			<BookOutlined className="absolute bottom-4 right-5 text-[42px] text-[rgba(16,47,42,.25)]" />
		</div>
		<div className="p-5">
			<Title
				level={4}
				className="mb-[18px] min-h-[54px]"
			>
				{record.courseTitle}
			</Title>
			<Progress
				percent={record.progressPercent}
				showInfo={false}
				strokeColor="#277f6c"
				trailColor="#e9eeeb"
			/>
			<div className="flex justify-between text-xs text-[#6d7975]">
				<span>{record.completedActivityCount} activities completed</span>
				<span className={record.isOverdue || record.status === 'OVERDUE' ? 'font-semibold text-[#c43d4b]' : ''}>{record.isOverdue || record.status === 'OVERDUE' ? `Late · due ${new Date(record.dueAt ?? '').toLocaleDateString()}` : record.dueAt ? `Due ${new Date(record.dueAt).toLocaleDateString()}` : 'Self-paced'}</span>
			</div>
			{record.source !== 'SELF_ENROLLED' && (
				<Text
					type="secondary"
					className="mt-2 block text-xs"
				>
					Assigned by {actorLabel(record.assignedBy)}
				</Text>
			)}
			<Button
				type="primary"
				block
				onClick={onOpen}
				className="mt-4"
				style={{ background: '#176c5b' }}
			>
				{record.progressPercent > 0 ? 'Continue course' : 'Start course'} <ArrowRightOutlined />
			</Button>
		</div>
	</Card>
);

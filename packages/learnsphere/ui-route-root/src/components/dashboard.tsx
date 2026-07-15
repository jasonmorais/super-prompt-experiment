import { ArrowRightOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Tag, Typography } from 'antd';
import type { LearnerDashboardContainerMyLearningQuery } from '../generated.tsx';
import { LearningCard } from './dashboard/learning-card.tsx';
import { LearningMetric } from './dashboard/learning-metric.tsx';

const { Title, Text, Paragraph } = Typography;
type LearningRecord = LearnerDashboardContainerMyLearningQuery['myLearning'][number];

const sourceLabel = (source: LearningRecord['source']): string =>
	source === 'SELF_ENROLLED'
		? 'Self-enrolled'
		: source
				.replaceAll('_', ' ')
				.toLowerCase()
				.replace(/^./, (letter) => letter.toUpperCase());

const cardStyle = { border: '1px solid #e5eae6', boxShadow: '0 8px 28px rgba(24,55,48,.05)', borderRadius: 18 } as const;

export interface DashboardProps {
	records: LearningRecord[];
	loading: boolean;
	givenName: string;
	onBrowseCatalog: () => void;
	onOpenCourse: (courseId: string) => void;
}

export const Dashboard = ({ records, loading, givenName, onBrowseCatalog, onOpenCourse }: DashboardProps) => {
	const activeRecords = records.filter((record) => !['COMPLETED', 'WAIVED'].includes(record.status));
	const completedRecords = records.filter((record) => record.status === 'COMPLETED');
	const assignedRecords = records.filter((record) => record.source !== 'SELF_ENROLLED');
	const assignedActiveRecords = assignedRecords.filter((record) => !['COMPLETED', 'WAIVED'].includes(record.status));
	const selfActiveRecords = activeRecords.filter((record) => record.source === 'SELF_ENROLLED');
	const learningMinutes = records.flatMap((record) => record.activityProgress).reduce((total, progress) => total + progress.timeSpentMinutes, 0);
	const palette = ['linear-gradient(135deg,#afd9cf,#d8eee5)', 'linear-gradient(135deg,#e8cfb3,#f5e6d3)', 'linear-gradient(135deg,#c9c3e8,#e8e5f5)'];

	return (
		<>
			<section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, marginBottom: 30 }}>
				<div>
					<Text style={{ color: '#277f6c', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 12 }}>My learning record</Text>
					<Title style={{ margin: '6px 0 4px', color: '#173b33', letterSpacing: '-1.2px' }}>Welcome back, {givenName}</Title>
					<Paragraph style={{ color: '#687670', fontSize: 16, margin: 0 }}>Continue active learning or review assignments from your organization.</Paragraph>
				</div>
				<Button
					type="primary"
					size="large"
					onClick={onBrowseCatalog}
					style={{ borderRadius: 10, background: '#176c5b', borderColor: '#176c5b', color: 'white', fontWeight: 650, boxShadow: '0 8px 18px rgba(23,108,91,.18)' }}
				>
					Browse catalog <ArrowRightOutlined />
				</Button>
			</section>
			<Row
				gutter={[20, 20]}
				style={{ marginBottom: 34 }}
			>
				{[
					{ title: 'Courses in progress', value: activeRecords.length, icon: <BookOutlined />, background: '#dcefe9', color: '#176c5b' },
					{ title: 'Tracked learning', value: `${(learningMinutes / 60).toFixed(1)} hrs`, icon: <ClockCircleOutlined />, background: '#edf4cf', color: '#607515' },
					{ title: 'Courses completed', value: completedRecords.length, icon: <CheckCircleOutlined />, background: '#e7e5f5', color: '#5b5296' },
					{ title: 'Assigned learning', value: assignedRecords.length, icon: <ArrowRightOutlined />, background: '#fde8da', color: '#a25326' },
				].map((metric) => (
					<Col
						key={metric.title}
						xs={24}
						sm={12}
						xl={6}
					>
						<LearningMetric
							{...metric}
							loading={loading}
						/>
					</Col>
				))}
			</Row>
			<Title
				level={3}
				style={{ margin: '0 0 16px', color: '#173b33' }}
			>
				Assigned to me
			</Title>
			<Paragraph
				type="secondary"
				style={{ marginTop: -8, marginBottom: 16 }}
			>
				These courses were assigned by your organization and are the work expected from you.
			</Paragraph>
			<Row
				gutter={[20, 20]}
				style={{ marginBottom: 38 }}
			>
				{assignedActiveRecords.map((record, index) => (
					<Col
						key={record.id}
						xs={24}
						md={12}
						xl={8}
					>
						<LearningCard
							record={record}
							color={palette[index] ?? palette[0] ?? ''}
							onOpen={() => onOpenCourse(record.courseId)}
						/>
					</Col>
				))}
				{!loading && assignedActiveRecords.length === 0 && (
					<Col span={24}>
						<Card>
							<Text type="secondary">Nothing has been assigned to you right now.</Text>
						</Card>
					</Col>
				)}
			</Row>
			<Title
				level={3}
				style={{ margin: '0 0 16px', color: '#173b33' }}
			>
				Continue learning
			</Title>
			<Row
				gutter={[20, 20]}
				style={{ marginBottom: 38 }}
			>
				{selfActiveRecords.slice(0, 3).map((record, index) => (
					<Col
						key={record.id}
						xs={24}
						md={12}
						xl={8}
					>
						<LearningCard
							record={record}
							color={palette[index] ?? palette[0] ?? ''}
							onOpen={() => onOpenCourse(record.courseId)}
						/>
					</Col>
				))}
				{!loading && selfActiveRecords.length === 0 && (
					<Col span={24}>
						<Card>
							<Text type="secondary">No self-enrolled learning in progress.</Text>
						</Card>
					</Col>
				)}
			</Row>
			<Card
				loading={loading}
				style={cardStyle}
				title={
					<Title
						level={3}
						style={{ margin: 0, color: '#173b33' }}
					>
						Learning history
					</Title>
				}
			>
				{records.map((record, index) => (
					<div
						key={record.id}
						style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 20, alignItems: 'center', padding: '17px 0', borderBottom: index < records.length - 1 ? '1px solid #edf0ee' : 0 }}
					>
						<div>
							<div style={{ fontWeight: 650, color: '#203d36' }}>{record.courseTitle}</div>
							<Text
								type="secondary"
								style={{ fontSize: 12 }}
							>
								{sourceLabel(record.source)} · assigned {new Date(record.assignedAt).toLocaleDateString()}
								{record.assignedBy ? ` · by ${record.assignedBy}` : ''}
							</Text>
						</div>
						<Tag color={record.status === 'COMPLETED' ? 'green' : record.status === 'OVERDUE' ? 'red' : 'blue'}>{record.status.replaceAll('_', ' ')}</Tag>
						<Text strong>{record.progressPercent}%</Text>
					</div>
				))}
				{!loading && records.length === 0 && <Text type="secondary">No learning history yet.</Text>}
			</Card>
		</>
	);
};

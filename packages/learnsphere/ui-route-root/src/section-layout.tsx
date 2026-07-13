import { ArrowRightOutlined, BookOutlined, CalendarOutlined, CheckCircleFilled, ClockCircleOutlined, PlayCircleFilled, RiseOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { AppLayout } from '@learnsphere/ui-shared';
import { gql, useQuery } from '@apollo/client';
import { Alert, Avatar, Button, Card, Col, Progress, Row, Space, Tag, Typography } from 'antd';
import { useAuth } from 'react-oidc-context';

const { Title, Text, Paragraph } = Typography;
const cardStyle = { border: '1px solid #e5eae6', boxShadow: '0 8px 28px rgba(24, 55, 48, 0.05)', borderRadius: 18 } as const;

const MY_LEARNING = gql`
	query MyLearningDashboard($organizationId: String!) {
		myLearning(organizationId: $organizationId) {
			id
			courseTitle
			courseCategory
			status
			progressPercent
			completedActivityCount
			dueAt
			activityProgress { timeSpentMinutes }
		}
	}
`;

interface LearningRecordView {
	id: string;
	courseTitle: string;
	courseCategory: string;
	status: string;
	progressPercent: number;
	completedActivityCount: number;
	dueAt?: string | null;
	activityProgress: Array<{ timeSpentMinutes: number }>;
}

const LearningCard = ({ title, category, progress, color, next }: { title: string; category: string; progress: number; color: string; next: string }) => (
	<Card style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden', borderRadius: 18 } }}>
		<div style={{ height: 116, background: color, padding: 20, position: 'relative' }}>
			<Tag bordered={false} style={{ background: 'rgba(255,255,255,.78)', color: '#18362f' }}>{category}</Tag>
			<BookOutlined style={{ position: 'absolute', right: 20, bottom: 15, fontSize: 42, color: 'rgba(16,47,42,.25)' }} />
		</div>
		<div style={{ padding: 20 }}>
			<Title level={4} style={{ margin: '0 0 18px', minHeight: 54 }}>{title}</Title>
			<Progress percent={progress} showInfo={false} strokeColor="#277f6c" trailColor="#e9eeeb" />
			<div style={{ display: 'flex', justifyContent: 'space-between', color: '#6d7975', fontSize: 12 }}><span>{progress}% complete</span><span>{next}</span></div>
			<Button type="text" icon={<PlayCircleFilled />} style={{ color: '#176c5b', fontWeight: 700, paddingLeft: 0, marginTop: 12 }}>Continue learning</Button>
		</div>
	</Card>
);

export const SectionLayout = () => {
	const auth = useAuth();
	const { data, loading, error } = useQuery<{ myLearning: LearningRecordView[] }>(MY_LEARNING, {
		variables: { organizationId: 'northstar-digital' },
		skip: !auth.isAuthenticated,
	});
	const records = data?.myLearning ?? [];
	const activeRecords = records.filter((record) => !['COMPLETED', 'WAIVED'].includes(record.status));
	const learningMinutes = records.flatMap((record) => record.activityProgress).reduce((total, progress) => total + progress.timeSpentMinutes, 0);
	const palette = ['linear-gradient(135deg,#afd9cf,#d8eee5)', 'linear-gradient(135deg,#e8cfb3,#f5e6d3)', 'linear-gradient(135deg,#c9c3e8,#e8e5f5)'];

	return <AppLayout>
		<section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, marginBottom: 30 }}>
			<div><Text style={{ color: '#277f6c', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 12 }}>Monday, 13 July</Text><Title style={{ margin: '6px 0 4px', color: '#173b33', letterSpacing: '-1.2px' }}>Good morning, {auth.user?.profile.given_name?.toString() ?? 'learner'}</Title><Paragraph style={{ color: '#687670', fontSize: 16, margin: 0 }}>You’re making great progress. Pick up where you left off.</Paragraph></div>
			<Button size="large" style={{ borderRadius: 10, borderColor: '#b9c8c2', fontWeight: 650 }}>Browse catalog <ArrowRightOutlined /></Button>
		</section>
		{!auth.isAuthenticated && <Alert showIcon type="info" message="Sign in to load your personal learning record" action={<Button size="small" type="primary" onClick={() => void auth.signinRedirect()}>Sign in</Button>} style={{ marginBottom: 24 }} />}
		{error && <Alert showIcon type="error" message="Your learning record could not be loaded" description={error.message} style={{ marginBottom: 24 }} />}

		<Row gutter={[20, 20]} style={{ marginBottom: 34 }}>
			<Col xs={24} sm={12} xl={6}><Card loading={loading} style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#dcefe9', color: '#176c5b' }} icon={<BookOutlined />} /><div><Text type="secondary">Courses in progress</Text><Title level={3} style={{ margin: 0 }}>{activeRecords.length}</Title></div></Space></Card></Col>
			<Col xs={24} sm={12} xl={6}><Card loading={loading} style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#edf4cf', color: '#607515' }} icon={<ClockCircleOutlined />} /><div><Text type="secondary">Tracked learning</Text><Title level={3} style={{ margin: 0 }}>{(learningMinutes / 60).toFixed(1)} hrs</Title></div></Space></Card></Col>
			<Col xs={24} sm={12} xl={6}><Card style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#fde8da', color: '#a25326' }} icon={<SafetyCertificateOutlined />} /><div><Text type="secondary">Certificates earned</Text><Title level={3} style={{ margin: 0 }}>8</Title></div></Space></Card></Col>
			<Col xs={24} sm={12} xl={6}><Card style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#e7e5f5', color: '#5b5296' }} icon={<RiseOutlined />} /><div><Text type="secondary">Quarterly goal</Text><Title level={3} style={{ margin: 0 }}>72%</Title></div></Space></Card></Col>
		</Row>

		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><Title level={3} style={{ margin: 0, color: '#173b33' }}>Continue learning</Title><Button type="link" style={{ color: '#176c5b' }}>View all</Button></div>
		<Row gutter={[20, 20]} style={{ marginBottom: 38 }}>
			{activeRecords.slice(0, 3).map((record, index) => <Col key={record.id} xs={24} md={12} xl={8}><LearningCard title={record.courseTitle} category={record.courseCategory} progress={record.progressPercent} color={palette[index] ?? 'linear-gradient(135deg,#afd9cf,#d8eee5)'} next={record.dueAt ? `Due ${new Date(record.dueAt).toLocaleDateString()}` : 'Self-paced'} /></Col>)}
			{auth.isAuthenticated && !loading && activeRecords.length === 0 && <Col span={24}><Alert message="No active learning" description="Browse the catalog to start a course." /></Col>}
		</Row>

		<Row gutter={[24, 24]}>
			<Col xs={24} xl={16}>
				<Card style={cardStyle} title={<Title level={3} style={{ margin: 0, color: '#173b33' }}>Your week</Title>} extra={<Text type="secondary">13–19 July</Text>}>
					{[
						['Today, 10:30', 'Inclusive design: forms and validation', 'Designing Accessible Digital Products', '25 min'],
						['Wednesday', 'Live workshop · Giving useful feedback', 'People & Collaboration', '60 min'],
						['Friday', 'Submit product discovery interview plan', 'Practical Product Discovery', 'Project'],
					].map(([date, task, course, duration], index) => <div key={task} style={{ display: 'grid', gridTemplateColumns: '105px 1fr auto', gap: 18, alignItems: 'center', padding: '17px 0', borderBottom: index < 2 ? '1px solid #edf0ee' : 0 }}><Text type="secondary"><CalendarOutlined /> {date}</Text><div><div style={{ fontWeight: 650, color: '#203d36' }}>{task}</div><Text type="secondary" style={{ fontSize: 12 }}>{course}</Text></div><Tag bordered={false}>{duration}</Tag></div>)}
				</Card>
			</Col>
			<Col xs={24} xl={8}>
				<Card style={{ ...cardStyle, background: '#173b33', border: 0, color: 'white' }}>
					<CheckCircleFilled style={{ fontSize: 34, color: '#d3f36b' }} />
					<Title level={3} style={{ color: 'white', marginTop: 18 }}>Professional growth plan</Title>
					<Paragraph style={{ color: '#c7d8d3' }}>Build confidence in research, accessible design, and facilitation by September.</Paragraph>
					<div style={{ display: 'flex', justifyContent: 'space-between', color: '#dce8e4', marginTop: 24 }}><span>4 of 7 milestones</span><b>57%</b></div>
					<Progress percent={57} showInfo={false} strokeColor="#d3f36b" trailColor="#315149" />
					<Button style={{ marginTop: 16, background: '#d3f36b', borderColor: '#d3f36b', color: '#173b33', fontWeight: 700 }}>View growth plan</Button>
				</Card>
			</Col>
		</Row>
	</AppLayout>;
};

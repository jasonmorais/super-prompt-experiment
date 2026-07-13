import { ArrowRightOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { AppLayout } from '@learnsphere/ui-shared';
import { gql, useQuery } from '@apollo/client';
import { Alert, Avatar, Button, Card, Col, Progress, Row, Space, Tag, Typography } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const cardStyle = { border: '1px solid #e5eae6', boxShadow: '0 8px 28px rgba(24,55,48,.05)', borderRadius: 18 } as const;

const MY_LEARNING = gql`
	query MyLearningDashboard($organizationId: String!) {
		myLearning(organizationId: $organizationId) {
			id courseTitle courseCategory source status progressPercent completedActivityCount
			assignedAt dueAt completedAt activityProgress { timeSpentMinutes }
		}
	}
`;

interface LearningRecordView {
	id: string; courseTitle: string; courseCategory: string; source: string; status: string;
	progressPercent: number; completedActivityCount: number; assignedAt: string; dueAt?: string | null;
	completedAt?: string | null; activityProgress: Array<{ timeSpentMinutes: number }>;
}

const LearningCard = ({ record, color }: { record: LearningRecordView; color: string }) => (
	<Card style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden', borderRadius: 18 } }}>
		<div style={{ height: 116, background: color, padding: 20, position: 'relative' }}><Tag bordered={false} style={{ background: 'rgba(255,255,255,.78)', color: '#18362f' }}>{record.courseCategory}</Tag><BookOutlined style={{ position: 'absolute', right: 20, bottom: 15, fontSize: 42, color: 'rgba(16,47,42,.25)' }} /></div>
		<div style={{ padding: 20 }}><Title level={4} style={{ margin: '0 0 18px', minHeight: 54 }}>{record.courseTitle}</Title><Progress percent={record.progressPercent} showInfo={false} strokeColor="#277f6c" trailColor="#e9eeeb" /><div style={{ display: 'flex', justifyContent: 'space-between', color: '#6d7975', fontSize: 12 }}><span>{record.completedActivityCount} activities completed</span><span>{record.dueAt ? `Due ${new Date(record.dueAt).toLocaleDateString()}` : 'Self-paced'}</span></div></div>
	</Card>
);

export const SectionLayout = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	// biome-ignore lint/complexity/useLiteralKeys: OIDC custom claims are exposed through an index signature.
	const organizationId = String(auth.user?.profile['tid'] ?? '');
	const { data, loading, error } = useQuery<{ myLearning: LearningRecordView[] }>(MY_LEARNING, { variables: { organizationId }, skip: !organizationId });
	const records = data?.myLearning ?? [];
	const activeRecords = records.filter((record) => !['COMPLETED', 'WAIVED'].includes(record.status));
	const completedRecords = records.filter((record) => record.status === 'COMPLETED');
	const assignedRecords = records.filter((record) => record.source !== 'SELF_ENROLLED');
	const learningMinutes = records.flatMap((record) => record.activityProgress).reduce((total, progress) => total + progress.timeSpentMinutes, 0);
	const givenName = String(auth.user?.profile.given_name ?? 'learner');
	const palette = ['linear-gradient(135deg,#afd9cf,#d8eee5)', 'linear-gradient(135deg,#e8cfb3,#f5e6d3)', 'linear-gradient(135deg,#c9c3e8,#e8e5f5)'];

	return <AppLayout>
		<section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, marginBottom: 30 }}><div><Text style={{ color: '#277f6c', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 12 }}>My learning record</Text><Title style={{ margin: '6px 0 4px', color: '#173b33', letterSpacing: '-1.2px' }}>Welcome back, {givenName}</Title><Paragraph style={{ color: '#687670', fontSize: 16, margin: 0 }}>Continue active learning or review assignments from your organization.</Paragraph></div><Button size="large" onClick={() => navigate('/catalog')} style={{ borderRadius: 10, borderColor: '#b9c8c2', fontWeight: 650 }}>Browse catalog <ArrowRightOutlined /></Button></section>
		{!organizationId && <Alert showIcon type="error" message="Your identity token does not include an organization identifier" style={{ marginBottom: 24 }} />}
		{error && <Alert showIcon type="error" message="Your learning record could not be loaded" description={error.message} style={{ marginBottom: 24 }} />}

		<Row gutter={[20, 20]} style={{ marginBottom: 34 }}>
			<Col xs={24} sm={12} xl={6}><Card loading={loading} style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#dcefe9', color: '#176c5b' }} icon={<BookOutlined />} /><div><Text type="secondary">Courses in progress</Text><Title level={3} style={{ margin: 0 }}>{activeRecords.length}</Title></div></Space></Card></Col>
			<Col xs={24} sm={12} xl={6}><Card loading={loading} style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#edf4cf', color: '#607515' }} icon={<ClockCircleOutlined />} /><div><Text type="secondary">Tracked learning</Text><Title level={3} style={{ margin: 0 }}>{(learningMinutes / 60).toFixed(1)} hrs</Title></div></Space></Card></Col>
			<Col xs={24} sm={12} xl={6}><Card loading={loading} style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#e7e5f5', color: '#5b5296' }} icon={<CheckCircleOutlined />} /><div><Text type="secondary">Courses completed</Text><Title level={3} style={{ margin: 0 }}>{completedRecords.length}</Title></div></Space></Card></Col>
			<Col xs={24} sm={12} xl={6}><Card loading={loading} style={cardStyle}><Space size="middle"><Avatar shape="square" size={46} style={{ background: '#fde8da', color: '#a25326' }} icon={<ArrowRightOutlined />} /><div><Text type="secondary">Assigned learning</Text><Title level={3} style={{ margin: 0 }}>{assignedRecords.length}</Title></div></Space></Card></Col>
		</Row>

		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><Title level={3} style={{ margin: 0, color: '#173b33' }}>Continue learning</Title></div>
		<Row gutter={[20, 20]} style={{ marginBottom: 38 }}>{activeRecords.slice(0, 3).map((record, index) => <Col key={record.id} xs={24} md={12} xl={8}><LearningCard record={record} color={palette[index] ?? palette[0] ?? ''} /></Col>)}{!loading && activeRecords.length === 0 && <Col span={24}><Alert message="No active learning" description="Browse the catalog to add a published course." action={<Button onClick={() => navigate('/catalog')}>Browse catalog</Button>} /></Col>}</Row>

		<Card loading={loading} style={cardStyle} title={<Title level={3} style={{ margin: 0, color: '#173b33' }}>Learning history</Title>}>
			{records.map((record, index) => <div key={record.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 20, alignItems: 'center', padding: '17px 0', borderBottom: index < records.length - 1 ? '1px solid #edf0ee' : 0 }}><div><div style={{ fontWeight: 650, color: '#203d36' }}>{record.courseTitle}</div><Text type="secondary" style={{ fontSize: 12 }}>{record.source.replaceAll('_', ' ').toLowerCase()} · assigned {new Date(record.assignedAt).toLocaleDateString()}</Text></div><Tag color={record.status === 'COMPLETED' ? 'green' : record.status === 'OVERDUE' ? 'red' : 'blue'}>{record.status.replaceAll('_', ' ')}</Tag><Text strong>{record.progressPercent}%</Text></div>)}
			{!loading && records.length === 0 && <Text type="secondary">No learning history yet.</Text>}
		</Card>
	</AppLayout>;
};

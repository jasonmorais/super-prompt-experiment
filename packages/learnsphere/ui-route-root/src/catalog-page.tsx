import { BookOutlined, CheckOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AppLayout } from '@learnsphere/ui-shared';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Alert, Button, Card, Col, Row, Space, Tag, Typography, message } from 'antd';
import { useAuth } from 'react-oidc-context';

const { Title, Paragraph, Text } = Typography;
const cardStyle = { height: '100%', border: '1px solid #e5eae6', boxShadow: '0 8px 28px rgba(24,55,48,.05)', borderRadius: 18 } as const;

const CATALOG = gql`
	query LearnerCatalog($organizationId: String!) {
		courses(organizationId: $organizationId, status: PUBLISHED, limit: 30) {
			id title summary category level skills lessonCount estimatedMinutes
		}
		myLearning(organizationId: $organizationId) { id courseId status }
	}
`;

const SELF_ENROLL = gql`
	mutation CatalogSelfEnroll($input: SelfEnrollInput!) {
		selfEnroll(input: $input) { status { success errorMessage } learningRecord { id courseId status } }
	}
`;

interface CourseView { id: string; title: string; summary: string; category: string; level: string; skills: string[]; lessonCount: number; estimatedMinutes: number; }
interface EnrollmentView { id: string; courseId: string; status: string; }

export const CatalogPage = () => {
	const auth = useAuth();
	// biome-ignore lint/complexity/useLiteralKeys: OIDC custom claims are exposed through an index signature.
	const organizationId = String(auth.user?.profile['tid'] ?? '');
	const { data, loading, error, refetch } = useQuery<{ courses: CourseView[]; myLearning: EnrollmentView[] }>(CATALOG, { variables: { organizationId }, skip: !organizationId });
	const [selfEnroll, enrollment] = useMutation(SELF_ENROLL);
	const enrolledCourseIds = new Set((data?.myLearning ?? []).map((record) => record.courseId));

	const enroll = async (courseId: string) => {
		const result = await selfEnroll({ variables: { input: { organizationId, courseId } } });
		const status = result.data?.selfEnroll?.status as { success: boolean; errorMessage?: string } | undefined;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'Enrollment could not be completed');
			return;
		}
		message.success('Course added to My learning');
		await refetch();
	};

	return <AppLayout>
		<div style={{ marginBottom: 30 }}><Text style={{ color: '#277f6c', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 12 }}>Published catalog</Text><Title style={{ color: '#173b33', margin: '7px 0' }}>Discover learning</Title><Paragraph style={{ color: '#687670', fontSize: 16 }}>Enroll in courses published for your organization. Enrollments immediately become part of your learning record.</Paragraph></div>
		{!organizationId && <Alert type="error" showIcon message="Your identity token does not contain an organization identifier." />}
		{error && <Alert type="error" showIcon message="The catalog could not be loaded" description={error.message} style={{ marginBottom: 20 }} />}
		<Row gutter={[20, 20]}>
			{(data?.courses ?? []).map((course) => {
				const enrolled = enrolledCourseIds.has(course.id);
				return <Col key={course.id} xs={24} md={12} xl={8}><Card loading={loading} style={cardStyle} title={<Tag bordered={false} color="green">{course.category}</Tag>}>
					<Title level={3} style={{ color: '#173b33', minHeight: 64 }}>{course.title}</Title>
					<Paragraph style={{ color: '#687670', minHeight: 66 }}>{course.summary}</Paragraph>
					<Space wrap style={{ marginBottom: 20 }}>{course.skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}</Space>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><Text type="secondary"><BookOutlined /> {course.lessonCount} activities</Text><Text type="secondary"><ClockCircleOutlined /> {course.estimatedMinutes} min</Text></div>
					<Button block type={enrolled ? 'default' : 'primary'} disabled={enrolled} loading={enrollment.loading} icon={enrolled ? <CheckOutlined /> : <PlusOutlined />} onClick={() => void enroll(course.id)} style={enrolled ? undefined : { background: '#176c5b' }}>{enrolled ? 'Already in My learning' : 'Add to My learning'}</Button>
				</Card></Col>;
			})}
		</Row>
	</AppLayout>;
};

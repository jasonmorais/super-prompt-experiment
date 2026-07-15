import { BookOutlined, CheckOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import type { LearnerCatalogContainerCatalogQuery } from '../generated.tsx';

const { Title, Paragraph, Text } = Typography;
type Course = LearnerCatalogContainerCatalogQuery['courses'][number];
type Enrollment = LearnerCatalogContainerCatalogQuery['myLearning'][number];
const cardStyle = { height: '100%', border: '1px solid #e5eae6', boxShadow: '0 8px 28px rgba(24,55,48,.05)', borderRadius: 18 } as const;

export interface CatalogProps {
	courses: Course[];
	enrollments: Enrollment[];
	loading: boolean;
	onEnroll: (courseId: string) => void;
	onOpenCourse: (courseId: string) => void;
	enrolling: boolean;
}

export const Catalog = ({ courses, enrollments, loading, onEnroll, onOpenCourse, enrolling }: CatalogProps) => {
	const enrolledCourseIds = new Set(enrollments.map((record) => record.courseId));
	return (
		<>
			<div style={{ marginBottom: 30 }}>
				<Text style={{ color: '#277f6c', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 12 }}>Published catalog</Text>
				<Title style={{ color: '#173b33', margin: '7px 0' }}>Discover learning</Title>
				<Paragraph style={{ color: '#687670', fontSize: 16 }}>Enroll in courses published for your organization. Enrollments immediately become part of your learning record.</Paragraph>
			</div>
			<Row gutter={[20, 20]}>
				{courses.map((course) => {
					const enrolled = enrolledCourseIds.has(course.id);
					return (
						<Col
							key={course.id}
							xs={24}
							md={12}
							xl={8}
						>
							<Card
								loading={loading}
								style={cardStyle}
								title={
									<Tag
										bordered={false}
										color="green"
									>
										{course.category}
									</Tag>
								}
							>
								<Title
									level={3}
									style={{ color: '#173b33', minHeight: 64 }}
								>
									{course.title}
								</Title>
								<Paragraph style={{ color: '#687670', minHeight: 66 }}>{course.summary}</Paragraph>
								<Space
									wrap
									style={{ marginBottom: 20 }}
								>
									{course.tags.map((tag) => <Tag color="geekblue" key={tag}>#{tag}</Tag>)}
									{course.skills.map((skill) => (
										<Tag key={skill}>{skill}</Tag>
									))}
								</Space>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
									<Text type="secondary">
										<BookOutlined /> {course.lessonCount} activities
									</Text>
									<Text type="secondary">
										<ClockCircleOutlined /> {course.estimatedMinutes} min
									</Text>
								</div>
								<Button
									block
									type="primary"
									loading={enrolling}
									icon={enrolled ? <CheckOutlined /> : <PlusOutlined />}
									onClick={() => (enrolled ? onOpenCourse(course.id) : onEnroll(course.id))}
									style={{ background: '#176c5b' }}
								>
									{enrolled ? 'Open course' : 'Enroll and open'}
								</Button>
							</Card>
						</Col>
					);
				})}
			</Row>
		</>
	);
};

export const CatalogEmptyState = () => (
	<Alert
		type="info"
		message="No published courses"
		description="Your organization has not published any learning courses yet."
	/>
);

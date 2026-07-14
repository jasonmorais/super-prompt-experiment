import { ArrowLeftOutlined, BookOutlined, CheckCircleFilled, CheckOutlined, ClockCircleOutlined, FileTextOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Progress, Row, Space, Tag, Typography } from 'antd';
import type { CourseExperienceQuery } from '../generated.tsx';

const { Title, Paragraph, Text } = Typography;
type Course = NonNullable<CourseExperienceQuery['courseById']>;
type Lesson = Course['modules'][number]['lessons'][number];
type LearningRecord = CourseExperienceQuery['myLearning'][number];

const activityIcon = (type: string) => (type === 'VIDEO' ? <PlayCircleOutlined /> : type === 'ARTICLE' || type === 'RESOURCE' ? <FileTextOutlined /> : <BookOutlined />);

export interface CourseProps {
	course: Course;
	record: LearningRecord;
	selectedLesson?: Lesson;
	completedKeys: Set<string>;
	mutationLoading: boolean;
	onBack: () => void;
	onSelectLesson: (lessonKey: string) => void;
	completionScreenshotRequired: boolean;
	completionScreenshotSelected: boolean;
	onSelectScreenshot: (file: File | undefined) => void;
	onComplete: () => void;
}

export const Course = ({ course, record, selectedLesson, completedKeys, mutationLoading, completionScreenshotRequired, completionScreenshotSelected, onSelectScreenshot, onBack, onSelectLesson, onComplete }: CourseProps) => (
	<>
		<Button
			type="text"
			icon={<ArrowLeftOutlined />}
			onClick={onBack}
			style={{ paddingLeft: 0, marginBottom: 18 }}
		>
			Back to My learning
		</Button>
		<Card
			style={{ border: 0, borderRadius: 20, background: 'linear-gradient(125deg,#123b33,#1f6657)', marginBottom: 24 }}
			styles={{ body: { padding: '32px 36px' } }}
		>
			<Row
				gutter={[28, 24]}
				align="middle"
			>
				<Col
					xs={24}
					lg={18}
				>
					<Space wrap>
						<Tag color="green">{course.category}</Tag>
						<Tag>{course.level.toLowerCase()}</Tag>
					</Space>
					<Title style={{ color: 'white', margin: '12px 0 8px' }}>{course.title}</Title>
					<Paragraph style={{ color: '#d5e6e1', fontSize: 16, marginBottom: 16 }}>{course.summary}</Paragraph>
					<Space
						wrap
						size="large"
					>
						<Text style={{ color: '#d5e6e1' }}>
							<BookOutlined /> {course.lessonCount} activities
						</Text>
						<Text style={{ color: '#d5e6e1' }}>
							<ClockCircleOutlined /> {course.estimatedMinutes} minutes
						</Text>
					</Space>
				</Col>
				<Col
					xs={24}
					lg={6}
				>
					<div style={{ color: 'white', fontWeight: 700, marginBottom: 8 }}>{record.progressPercent}% complete</div>
					<Progress
						percent={record.progressPercent}
						showInfo={false}
						strokeColor="#d3f36b"
						trailColor="rgba(255,255,255,.2)"
					/>
					<Text style={{ color: '#d5e6e1' }}>
						{record.completedActivityCount} of {course.lessonCount} activities
					</Text>
				</Col>
			</Row>
		</Card>
		<Row
			gutter={[24, 24]}
			align="top"
		>
			<Col
				xs={24}
				lg={8}
				xl={7}
			>
				<Card
					title="Course outline"
					style={{ borderRadius: 16, position: 'sticky', top: 96 }}
				>
					{course.modules
						.toSorted((a, b) => a.order - b.order)
						.map((module) => (
							<div
								key={module.key}
								style={{ marginBottom: 22 }}
							>
								<Text strong>
									{module.order}. {module.title}
								</Text>
								<Paragraph
									type="secondary"
									style={{ fontSize: 12, margin: '4px 0 10px' }}
								>
									{module.description}
								</Paragraph>
								<Space
									direction="vertical"
									style={{ width: '100%' }}
									size={6}
								>
									{module.lessons.map((lesson) => (
										<Button
											key={lesson.key}
											type={lesson.key === selectedLesson?.key ? 'primary' : 'text'}
											block
											icon={completedKeys.has(lesson.key) ? <CheckCircleFilled /> : activityIcon(lesson.type)}
											onClick={() => onSelectLesson(lesson.key)}
											style={{ height: 'auto', minHeight: 42, whiteSpace: 'normal', textAlign: 'left', justifyContent: 'flex-start', background: lesson.key === selectedLesson?.key ? '#176c5b' : undefined }}
										>
											{lesson.title}
										</Button>
									))}
								</Space>
							</div>
						))}
				</Card>
			</Col>
			<Col
				xs={24}
				lg={16}
				xl={17}
			>
				{selectedLesson && (
					<Card
						style={{ borderRadius: 16 }}
						styles={{ body: { padding: '34px clamp(22px,4vw,54px)' } }}
					>
						<Space wrap>
							<Tag color="blue">{selectedLesson.type.toLowerCase()}</Tag>
							{selectedLesson.required && <Tag>Required</Tag>}
							<Text type="secondary">
								<ClockCircleOutlined /> {selectedLesson.estimatedMinutes} minutes
							</Text>
						</Space>
						<Title
							level={2}
							style={{ color: '#173b33', marginTop: 14 }}
						>
							{selectedLesson.title}
						</Title>
						<Divider />
						<div style={{ maxWidth: 820 }}>
							{selectedLesson.content.split(/\n\n+/).map((paragraph) => (
								<Paragraph
									key={paragraph}
									style={{ fontSize: 16, lineHeight: 1.8, color: '#344c46' }}
								>
									{paragraph}
								</Paragraph>
							))}
						</div>
						<Divider />
						{completedKeys.has(selectedLesson.key) ? (
							<Alert
								type="success"
								showIcon
								title="Activity completed"
								description="This completion is saved in your learning record."
								action={
									<Button
										icon={<CheckOutlined />}
										disabled
									>
										Completed
									</Button>
								}
							/>
						) : (
							<div>
								{completionScreenshotRequired && (
									<Alert type="warning" showIcon message="A screenshot is required to complete this course" description="Attach an image showing your completed work before marking the final required activity complete." style={{ marginBottom: 18 }} />
								)}
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
								<div>
									<Text strong>Ready to continue?</Text>
									<br />
									<Text type="secondary">Completion adds {selectedLesson.estimatedMinutes} minutes to your learning record.</Text>
								</div>
								{completionScreenshotRequired && <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #d9e3df', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><UploadOutlined /> {completionScreenshotSelected ? 'Screenshot attached' : 'Attach screenshot'}<input type="file" accept="image/*" onChange={(event) => onSelectScreenshot(event.target.files?.[0])} style={{ display: 'none' }} /></label>}
								<Button
									type="primary"
									size="large"
									loading={mutationLoading}
									disabled={completionScreenshotRequired && !completionScreenshotSelected}
									onClick={onComplete}
									style={{ background: '#176c5b' }}
								>
									Mark activity complete
								</Button>
								</div>
							</div>
						)}
					</Card>
				)}
			</Col>
		</Row>
	</>
);

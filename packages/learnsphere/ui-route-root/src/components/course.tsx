import { ArrowLeftOutlined, BookOutlined, CheckCircleFilled, CheckOutlined, ClockCircleOutlined, FileTextOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Col, Divider, Progress, Radio, Row, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import type { LearnerCourseContainerCourseExperienceQuery } from '../generated.tsx';

const { Title, Paragraph, Text } = Typography;
type Course = NonNullable<LearnerCourseContainerCourseExperienceQuery['courseById']>;
type Lesson = Course['modules'][number]['lessons'][number];
type LearningRecord = LearnerCourseContainerCourseExperienceQuery['myLearning'][number];
type AssessmentResponse = { questionKey: string; selectedOptionKeys: string[] };

const AssessmentActivity = ({ lesson, loading, onSubmit }: { lesson: Lesson; loading: boolean; onSubmit: (responses: AssessmentResponse[]) => void }) => {
	const [answers, setAnswers] = useState<Record<string, string[]>>({});
	const assessment = lesson.assessment;
	if (!assessment) return <Alert type="error" message="Assessment definition is unavailable" />;
	return <div><Alert type="info" showIcon message={`${assessment.passingScore}% required to pass`} description={`You may submit up to ${assessment.maxAttempts} attempts.`} className="mb-5" />
		<Space direction="vertical" size="large" className="w-full">{assessment.questions.map((question, index) => <Card key={question.key} size="small" title={`${index + 1}. ${question.prompt}`}>
			{question.type === 'MULTI_SELECT' ? <Checkbox.Group options={question.options.map((option) => ({ label: option.text, value: option.key }))} value={answers[question.key] ?? []} onChange={(values) => setAnswers((current) => ({ ...current, [question.key]: values.map(String) }))} /> : <Radio.Group options={question.options.map((option) => ({ label: option.text, value: option.key }))} value={answers[question.key]?.[0]} onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: [String(event.target.value)] }))} />}
		</Card>)}</Space>
		<Button type="primary" size="large" loading={loading} disabled={assessment.questions.some((question) => !answers[question.key]?.length)} onClick={() => onSubmit(assessment.questions.map((question) => ({ questionKey: question.key, selectedOptionKeys: answers[question.key] ?? [] })))} className="mt-5">Submit assessment</Button>
	</div>;
};

const activityIcon = (type: string) => (type === 'VIDEO' ? <PlayCircleOutlined /> : type === 'ARTICLE' || type === 'RESOURCE' ? <FileTextOutlined /> : <BookOutlined />);

const videoSource = (url: string): { kind: 'video' | 'embed'; src: string } => {
	const parsed = new URL(url);
	const host = parsed.hostname.replace(/^www\./, '');
	if (host === 'youtu.be') return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}` };
	if (host === 'youtube.com' || host === 'm.youtube.com') {
		const id = parsed.searchParams.get('v') ?? parsed.pathname.match(/^\/embed\/([^/]+)/)?.[1];
		if (id) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}` };
	}
	if (host === 'vimeo.com') {
		const id = parsed.pathname.match(/^\/(\d+)/)?.[1];
		if (id) return { kind: 'embed', src: `https://player.vimeo.com/video/${id}` };
	}
	return /\.(mp4|webm|ogg)(?:$|\?)/i.test(url) ? { kind: 'video', src: url } : { kind: 'embed', src: url };
};

const EmbeddedVideo = ({ url, title }: { url: string; title: string }) => {
	const source = videoSource(url);
	if (source.kind === 'video') {
		// biome-ignore lint/a11y/useMediaCaption: Course authors control externally hosted media and its caption tracks.
		return <video controls preload="metadata" src={source.src} className="mb-6 aspect-video w-full rounded-xl bg-black" />;
	}
	return <iframe title={title} src={source.src} allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="mb-6 aspect-video w-full rounded-xl border-0 bg-black" />;
};

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
	onSubmitAssessment: (responses: AssessmentResponse[]) => void;
	assessmentLoading: boolean;
}

export const Course = ({ course, record, selectedLesson, completedKeys, mutationLoading, completionScreenshotRequired, completionScreenshotSelected, onSelectScreenshot, onBack, onSelectLesson, onComplete, onSubmitAssessment, assessmentLoading }: CourseProps) => (
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
						{selectedLesson.type === 'VIDEO' && selectedLesson.videoUrl && <EmbeddedVideo url={selectedLesson.videoUrl} title={selectedLesson.title} />}
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
						{selectedLesson.type === 'ASSESSMENT' && !completedKeys.has(selectedLesson.key) ? <AssessmentActivity lesson={selectedLesson} loading={assessmentLoading} onSubmit={onSubmitAssessment} /> : completedKeys.has(selectedLesson.key) ? (
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

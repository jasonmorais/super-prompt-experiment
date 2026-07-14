import { CheckCircleOutlined, EditOutlined, PlusOutlined, RocketOutlined, SendOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import type { CourseLevel, LessonType, StaffCourseManagementQuery } from '../generated.tsx';

const { Title, Paragraph, Text } = Typography;
type Course = StaffCourseManagementQuery['courses'][number];
type CourseValues = { title: string; summary: string; description: string; category: string; level: CourseLevel; tags?: string[]; skills?: string[] };
type ModuleValues = { moduleTitle: string; moduleDescription: string; lessonTitle: string; lessonType: LessonType; lessonContent: string; estimatedMinutes: number; required: boolean };
const statusColor = (status: string) => (status === 'PUBLISHED' ? 'green' : status === 'IN_REVIEW' ? 'gold' : status === 'ARCHIVED' ? 'default' : 'blue');

export interface CourseManagementProps {
	courses: Course[];
	loading: boolean;
	error?: string;
	creating: boolean;
	adding: boolean;
	submitting: boolean;
	publishing: boolean;
	onCreate: (values: CourseValues) => void;
	onAddContent: (course: Course, values: ModuleValues) => void;
	onTransition: (course: Course) => void;
}

export const CourseManagement = ({ courses, loading, error, creating, adding, submitting, publishing, onCreate, onAddContent, onTransition }: CourseManagementProps) => {
	const [createOpen, setCreateOpen] = useState(false);
	const [contentCourse, setContentCourse] = useState<Course>();
	const [createForm] = Form.useForm<CourseValues>();
	const [moduleForm] = Form.useForm<ModuleValues>();
	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 28 }}>
				<div>
					<Text style={{ color: '#6d4aff', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 12 }}>Learning catalogue</Text>
					<Title style={{ margin: '6px 0' }}>Course management</Title>
					<Paragraph
						type="secondary"
						style={{ margin: 0 }}
					>
						Create training, add structured activity content, and control when it becomes available to learners.
					</Paragraph>
				</div>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					size="large"
					onClick={() => setCreateOpen(true)}
				>
					Create course
				</Button>
			</div>
			{error && (
				<Alert
					type="error"
					showIcon
					message="Course management data could not be loaded"
					description={error}
					style={{ marginBottom: 20 }}
				/>
			)}
			<Row
				gutter={[18, 18]}
				style={{ marginBottom: 24 }}
			>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="All courses"
							value={courses.length}
						/>
					</Card>
				</Col>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="Drafts"
							value={courses.filter((course) => course.status === 'DRAFT').length}
						/>
					</Card>
				</Col>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="In review"
							value={courses.filter((course) => course.status === 'IN_REVIEW').length}
						/>
					</Card>
				</Col>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="Published"
							value={courses.filter((course) => course.status === 'PUBLISHED').length}
							prefix={<CheckCircleOutlined />}
						/>
					</Card>
				</Col>
			</Row>
			<Card>
				<Table<Course>
					loading={loading}
					rowKey="id"
					dataSource={courses}
					expandable={{
						expandedRowRender: (course) =>
							course.modules.length ? (
								<Space
									direction="vertical"
									style={{ width: '100%' }}
								>
									{course.modules.map((module) => (
										<Card
											size="small"
											key={module.key}
											title={`${module.order}. ${module.title}`}
										>
											<Paragraph type="secondary">{module.description}</Paragraph>
											{module.lessons.map((lesson) => (
												<div
													key={lesson.key}
													style={{ padding: '10px 0', borderTop: '1px solid #edf0f4' }}
												>
													<Space>
														<Tag>{lesson.type}</Tag>
														<Text strong>{lesson.title}</Text>
														<Text type="secondary">{lesson.estimatedMinutes} min</Text>
													</Space>
													<Paragraph
														ellipsis={{ rows: 2 }}
														style={{ margin: '8px 0 0' }}
													>
														{lesson.content}
													</Paragraph>
												</div>
											))}
										</Card>
									))}
								</Space>
							) : (
								<Alert
									type="info"
									message="No course content yet"
									description="Add a module and activity before submitting this draft for review."
								/>
							),
					}}
					columns={[
						{
							title: 'Course',
							render: (_, course) => (
								<div>
									<div style={{ fontWeight: 700 }}>{course.title}</div>
									<Text type="secondary">
										{course.category} · {course.level.toLowerCase()}
									</Text>
								</div>
							),
						},
						{ title: 'Status', render: (_, course) => <Tag color={statusColor(course.status)}>{course.status.replaceAll('_', ' ')}</Tag> },
						{ title: 'Content', render: (_, course) => `${course.lessonCount} activities · ${course.estimatedMinutes} min` },
						{ title: 'Updated', render: (_, course) => new Date(course.updatedAt).toLocaleDateString() },
						{
							title: 'Actions',
							width: 330,
							render: (_, course) => (
								<Space wrap>
									{course.status === 'DRAFT' && (
										<Button
											icon={<EditOutlined />}
											onClick={() => setContentCourse(course)}
										>
											Add content
										</Button>
									)}
									{course.status === 'DRAFT' && (
										<Button
											icon={<SendOutlined />}
											disabled={course.lessonCount === 0}
											loading={submitting}
											onClick={() => onTransition(course)}
										>
											Submit for review
										</Button>
									)}
									{course.status === 'IN_REVIEW' && (
										<Button
											type="primary"
											icon={<RocketOutlined />}
											loading={publishing}
											onClick={() => onTransition(course)}
										>
											Publish
										</Button>
									)}
								</Space>
							),
						},
					]}
				/>
			</Card>
			<Modal
				title="Create a draft course"
				open={createOpen}
				onCancel={() => setCreateOpen(false)}
				onOk={() => createForm.submit()}
				confirmLoading={creating}
				width={720}
				okText="Create draft"
			>
				<Form
					form={createForm}
					layout="vertical"
					onFinish={(values) => {
						onCreate(values);
						setCreateOpen(false);
						createForm.resetFields();
					}}
					initialValues={{ level: 'FOUNDATIONAL' }}
				>
					<Row gutter={16}>
						<Col span={16}>
							<Form.Item
								name="title"
								label="Course title"
								rules={[{ required: true, min: 4 }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="level"
								label="Level"
								rules={[{ required: true }]}
							>
								<Select options={['FOUNDATIONAL', 'INTERMEDIATE', 'ADVANCED'].map((value) => ({ value, label: value.toLowerCase() }))} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="summary"
						label="Catalog summary"
						rules={[{ required: true, min: 10, max: 300 }]}
					>
						<Input.TextArea
							rows={2}
							showCount
							maxLength={300}
						/>
					</Form.Item>
					<Form.Item
						name="description"
						label="Course description"
						rules={[{ required: true, min: 20 }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="category"
								label="Category"
								rules={[{ required: true }]}
							>
								<Input placeholder="Leadership, Product, Compliance…" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="skills"
								label="Skills"
							>
								<Select
									mode="tags"
									tokenSeparators={[',']}
									placeholder="Add skills"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="tags"
						label="Search tags"
					>
						<Select
							mode="tags"
							tokenSeparators={[',']}
							placeholder="Add catalog tags"
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title={`Add content · ${contentCourse?.title ?? ''}`}
				open={Boolean(contentCourse)}
				onCancel={() => setContentCourse(undefined)}
				onOk={() => moduleForm.submit()}
				confirmLoading={adding}
				width={780}
				okText="Add module and activity"
			>
				<Alert
					type="info"
					showIcon
					message="A module groups one or more learning activities"
					description="This first version adds one activity at a time."
					style={{ marginBottom: 20 }}
				/>
				<Form
					form={moduleForm}
					layout="vertical"
					onFinish={(values) => {
						if (contentCourse) onAddContent(contentCourse, values);
						setContentCourse(undefined);
						moduleForm.resetFields();
					}}
					initialValues={{ lessonType: 'ARTICLE', estimatedMinutes: 15, required: true }}
				>
					<Form.Item
						name="moduleTitle"
						label="Module title"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="moduleDescription"
						label="Module description"
						rules={[{ required: true }]}
					>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Row gutter={16}>
						<Col span={16}>
							<Form.Item
								name="lessonTitle"
								label="Activity title"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="lessonType"
								label="Activity type"
								rules={[{ required: true }]}
							>
								<Select options={['ARTICLE', 'VIDEO', 'QUIZ', 'PROJECT', 'RESOURCE'].map((value) => ({ value }))} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="lessonContent"
						label="Learning content"
						rules={[{ required: true, min: 40 }]}
					>
						<Input.TextArea
							rows={9}
							showCount
							maxLength={50000}
						/>
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="estimatedMinutes"
								label="Estimated minutes"
								rules={[{ required: true }]}
							>
								<InputNumber
									min={1}
									max={1440}
									style={{ width: '100%' }}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="required"
								label="Completion requirement"
							>
								<Select
									options={[
										{ value: true, label: 'Required' },
										{ value: false, label: 'Optional' },
									]}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
};

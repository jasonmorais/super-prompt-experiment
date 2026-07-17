import { ArrowDownOutlined, ArrowLeftOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Col, Divider, Form, Input, InputNumber, Row, Select, Space, Switch, Typography } from 'antd';
import type { CourseDiscoverability, CourseLevel, LessonType } from '../generated.tsx';

const { Title, Paragraph } = Typography;
const activityTypes = ['ARTICLE', 'VIDEO', 'QUIZ', 'PROJECT', 'RESOURCE'] as const;

export interface CourseEditorLessonValues { key: string; title: string; type: LessonType; content: string; videoUrl?: string; estimatedMinutes: number; required: boolean; assessmentId?: string; assessmentTitle?: string; }
export interface CourseEditorModuleValues { key: string; title: string; description: string; lessons: CourseEditorLessonValues[]; }
export interface CourseEditorValues {
	title: string; summary: string; description: string; level: CourseLevel; category: string; tags: string[]; skills: string[]; discoverability: CourseDiscoverability; requiresCompletionScreenshot: boolean; modules: CourseEditorModuleValues[];
}

interface CourseEditorProps {
	initialValues: CourseEditorValues;
	isNew: boolean;
	status?: string;
	loading: boolean;
	onSave: (values: CourseEditorValues) => void;
	onCancel: () => void;
	onAddAssessment: () => void;
	onEditAssessment: (assessmentId: string) => void;
}

const slug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 70);

export const CourseEditor = ({ initialValues, isNew, status, loading, onSave, onCancel, onAddAssessment, onEditAssessment }: CourseEditorProps) => {
	const [form] = Form.useForm<CourseEditorValues>();
	const modules = Form.useWatch('modules', form) ?? [];
	const moveModule = (from: number, to: number) => {
		if (to < 0 || to >= modules.length) return;
		const next = [...modules];
		const [item] = next.splice(from, 1);
		if (item) next.splice(to, 0, item);
		form.setFieldValue('modules', next);
	};
	return (
		<Form form={form} layout="vertical" initialValues={initialValues} onFinish={onSave}>
			<div className="mb-7 flex flex-wrap items-center justify-between gap-4">
				<div>
					<Button type="link" className="mb-2 px-0" icon={<ArrowLeftOutlined />} onClick={onCancel}>Back to courses</Button>
					<Title className="m-0">{isNew ? 'Create course' : 'Edit course'}</Title>
					<Paragraph type="secondary" className="mb-0">Manage course details, modules, ordering, and every learning activity in one workspace.</Paragraph>
				</div>
				<Space><Button onClick={onCancel}>Cancel</Button><Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>Save course</Button></Space>
			</div>
			{status === 'PUBLISHED' && <Alert className="mb-5" showIcon type="warning" message="You are editing published learning" description="Saved content changes are immediately reflected in this course. Review activities carefully before saving." />}
			<Row gutter={[20, 20]}>
				<Col xs={24} xl={9}>
					<Card title="Course details" className="sticky top-4">
						<Form.Item name="title" label="Title" rules={[{ required: true }]}><Input onBlur={(event) => { if (isNew && !form.getFieldValue(['modules', 0, 'key'])) form.setFieldValue(['modules', 0, 'key'], slug(event.target.value)); }} /></Form.Item>
						<Form.Item name="summary" label="Summary" rules={[{ required: true }]}><Input.TextArea rows={2} showCount maxLength={300} /></Form.Item>
						<Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea rows={6} /></Form.Item>
						<Row gutter={12}><Col span={12}><Form.Item name="level" label="Level" rules={[{ required: true }]}><Select options={['FOUNDATIONAL', 'INTERMEDIATE', 'ADVANCED'].map((value) => ({ value, label: value.replaceAll('_', ' ') }))} /></Form.Item></Col><Col span={12}><Form.Item name="category" label="Category" rules={[{ required: true }]}><Input /></Form.Item></Col></Row>
						<Form.Item name="tags" label="Tags"><Select mode="tags" tokenSeparators={[',']} /></Form.Item>
						<Form.Item name="skills" label="Skills"><Select mode="tags" tokenSeparators={[',']} /></Form.Item>
						<Form.Item name="discoverability" label="Availability" rules={[{ required: true }]}><Select options={[{ value: 'CATALOG', label: 'Organization catalog' }, { value: 'ASSIGNED_ONLY', label: 'Assigned only' }]} /></Form.Item>
						<Form.Item name="requiresCompletionScreenshot" valuePropName="checked"><Checkbox>Require completion evidence screenshot</Checkbox></Form.Item>
					</Card>
				</Col>
				<Col xs={24} xl={15}>
					<Card title="Course structure" extra={<Button disabled={isNew || modules.length === 0} icon={<PlusOutlined />} onClick={onAddAssessment}>Add assessment step</Button>}>
						{isNew && <Alert className="mb-4" type="info" showIcon message="Assessment steps become available after the draft is first saved." />}
						<Form.List name="modules">
							{(moduleFields, { add: addModule, remove: removeModule }) => <Space direction="vertical" size="large" className="w-full">
								{moduleFields.map((moduleField, moduleIndex) => <Card key={moduleField.key} type="inner" title={`Module ${moduleIndex + 1}`} extra={<Space><Button type="text" icon={<ArrowUpOutlined />} disabled={moduleIndex === 0} onClick={() => moveModule(moduleIndex, moduleIndex - 1)} /><Button type="text" icon={<ArrowDownOutlined />} disabled={moduleIndex === moduleFields.length - 1} onClick={() => moveModule(moduleIndex, moduleIndex + 1)} /><Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeModule(moduleField.name)} /></Space>}>
									<Row gutter={12}><Col span={8}><Form.Item name={[moduleField.name, 'key']} label="Module key" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={16}><Form.Item name={[moduleField.name, 'title']} label="Module title" rules={[{ required: true }]}><Input /></Form.Item></Col></Row>
									<Form.Item name={[moduleField.name, 'description']} label="Module description"><Input.TextArea rows={2} /></Form.Item>
									<Divider>Activities</Divider>
									<Form.List name={[moduleField.name, 'lessons']}>
										{(lessonFields, { add: addLesson, remove: removeLesson, move: moveLesson }) => <Space direction="vertical" className="w-full">
											{lessonFields.map((lessonField, lessonIndex) => {
												const lesson = modules[moduleIndex]?.lessons?.[lessonIndex];
												const isAssessment = lesson?.type === 'ASSESSMENT';
												return <Card key={lessonField.key} size="small" className="bg-slate-50" title={`Activity ${lessonIndex + 1}`} extra={<Space>{isAssessment && lesson?.assessmentId && <Button type="link" icon={<EditOutlined />} onClick={() => onEditAssessment(lesson.assessmentId ?? '')}>Edit assessment</Button>}<Button type="text" icon={<ArrowUpOutlined />} disabled={lessonIndex === 0} onClick={() => moveLesson(lessonIndex, lessonIndex - 1)} /><Button type="text" icon={<ArrowDownOutlined />} disabled={lessonIndex === lessonFields.length - 1} onClick={() => moveLesson(lessonIndex, lessonIndex + 1)} /><Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeLesson(lessonField.name)} /></Space>}>
													<Form.Item name={[lessonField.name, 'assessmentId']} hidden><Input /></Form.Item><Form.Item name={[lessonField.name, 'assessmentTitle']} hidden><Input /></Form.Item>
													<Row gutter={12}><Col span={8}><Form.Item name={[lessonField.name, 'key']} label="Activity key" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={16}><Form.Item name={[lessonField.name, 'title']} label="Title" rules={[{ required: true }]}><Input /></Form.Item></Col></Row>
													<Row gutter={12}><Col span={12}><Form.Item name={[lessonField.name, 'type']} label="Activity type" rules={[{ required: true }]}>{isAssessment ? <Input disabled value={`Assessment · ${lesson?.assessmentTitle ?? ''}`} /> : <Select options={activityTypes.map((value) => ({ value, label: value }))} />}</Form.Item></Col><Col span={12}><Form.Item name={[lessonField.name, 'estimatedMinutes']} label="Estimated minutes" rules={[{ required: true }]}><InputNumber min={1} max={1440} className="w-full" /></Form.Item></Col></Row>
											{lesson?.type === 'VIDEO' && <Form.Item name={[lessonField.name, 'videoUrl']} label="Video URL" tooltip="Paste a YouTube, Vimeo, or direct video URL. It will be embedded in the learner activity." rules={[{ type: 'url', message: 'Enter a valid video URL' }]}><Input placeholder="https://www.youtube.com/watch?v=…" /></Form.Item>}
											<Form.Item name={[lessonField.name, 'content']} label={isAssessment ? 'Learner instructions' : lesson?.type === 'VIDEO' ? 'Video notes and instructions' : 'Activity content'} rules={[{ required: true }]}><Input.TextArea rows={5} /></Form.Item>
													<Form.Item name={[lessonField.name, 'required']} label="Required" valuePropName="checked"><Switch /></Form.Item>
												</Card>;
											})}
											<Button block type="dashed" icon={<PlusOutlined />} onClick={() => addLesson({ key: `activity-${lessonFields.length + 1}`, title: '', type: 'ARTICLE', content: '', estimatedMinutes: 15, required: true })}>Add activity</Button>
										</Space>}
									</Form.List>
								</Card>)}
								<Button block type="dashed" icon={<PlusOutlined />} onClick={() => addModule({ key: `module-${moduleFields.length + 1}`, title: '', description: '', lessons: [] })}>Add module</Button>
							</Space>}
						</Form.List>
					</Card>
				</Col>
			</Row>
		</Form>
	);
};

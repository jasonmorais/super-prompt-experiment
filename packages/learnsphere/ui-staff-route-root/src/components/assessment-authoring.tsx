import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Col, Divider, Form, Input, InputNumber, Row, Select, Space, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;
export interface AssessmentOptionValues { key: string; text: string; isCorrect: boolean; }
export interface AssessmentQuestionValues { key: string; prompt: string; type: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'TRUE_FALSE'; points: number; explanation: string; options: AssessmentOptionValues[]; }
export interface AssessmentAuthoringValues {
	title: string; description: string; passingScore: number; maxAttempts: number; questions: AssessmentQuestionValues[];
	moduleKey?: string; activityKey?: string; activityTitle?: string; activityContent?: string; estimatedMinutes?: number; required?: boolean;
}
interface AssessmentAuthoringProps { initialValues: AssessmentAuthoringValues; courseTitle: string; modules: Array<{ key: string; title: string }>; isNew: boolean; status?: string; loading: boolean; onSave: (values: AssessmentAuthoringValues) => void; onCancel: () => void; }

export const AssessmentAuthoring = ({ initialValues, courseTitle, modules, isNew, status, loading, onSave, onCancel }: AssessmentAuthoringProps) => (
	<Form<AssessmentAuthoringValues> layout="vertical" initialValues={initialValues} onFinish={onSave}>
		<div className="mb-7 flex flex-wrap items-center justify-between gap-4">
			<div><Button type="link" className="mb-2 px-0" icon={<ArrowLeftOutlined />} onClick={onCancel}>Back to course</Button><Title className="m-0">{isNew ? 'Add assessment step' : 'Edit assessment'}</Title><Paragraph type="secondary" className="mb-0">{courseTitle} · Build scored questions and accepted responses.</Paragraph></div>
			<Space><Button onClick={onCancel}>Cancel</Button><Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>{isNew ? 'Create and attach assessment' : 'Save assessment'}</Button></Space>
		</div>
		{status === 'PUBLISHED' && <Alert className="mb-5" type="warning" showIcon message="This assessment is published" description="Saving changes updates the assessment used by its course activity." />}
		<Row gutter={[20, 20]}>
			<Col xs={24} xl={8}>
				<Space direction="vertical" size="large" className="w-full">
					{isNew && <Card title="Course activity"><Form.Item name="moduleKey" label="Module" rules={[{ required: true }]}><Select options={modules.map((module) => ({ value: module.key, label: module.title }))} /></Form.Item><Form.Item name="activityKey" label="Activity key" rules={[{ required: true }]}><Input placeholder="knowledge-check" /></Form.Item><Form.Item name="activityTitle" label="Activity title" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="activityContent" label="Learner instructions" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item><Row gutter={12}><Col span={12}><Form.Item name="estimatedMinutes" label="Minutes" rules={[{ required: true }]}><InputNumber min={1} max={1440} className="w-full" /></Form.Item></Col><Col span={12}><Form.Item name="required" label="Required" valuePropName="checked"><Checkbox>Required step</Checkbox></Form.Item></Col></Row></Card>}
					<Card title="Assessment settings"><Form.Item name="title" label="Assessment title" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item><Row gutter={12}><Col span={12}><Form.Item name="passingScore" label="Passing score (%)" rules={[{ required: true }]}><InputNumber min={1} max={100} className="w-full" /></Form.Item></Col><Col span={12}><Form.Item name="maxAttempts" label="Maximum attempts" rules={[{ required: true }]}><InputNumber min={1} max={100} className="w-full" /></Form.Item></Col></Row></Card>
				</Space>
			</Col>
			<Col xs={24} xl={16}>
				<Card title="Questions" extra={<Text type="secondary">Single choice, multiple choice, and true/false</Text>}>
					<Form.List name="questions" rules={[{ validator: (_, questions) => questions?.length ? Promise.resolve() : Promise.reject(new Error('Add at least one question')) }]}>
						{(questionFields, { add: addQuestion, remove: removeQuestion }) => <Space direction="vertical" size="large" className="w-full">
							{questionFields.map((questionField, questionIndex) => <Card type="inner" key={questionField.key} title={`Question ${questionIndex + 1}`} extra={<Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeQuestion(questionField.name)}>Remove</Button>}>
								<Row gutter={12}><Col span={8}><Form.Item name={[questionField.name, 'key']} label="Question key" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={10}><Form.Item name={[questionField.name, 'type']} label="Response type" rules={[{ required: true }]}><Select options={[{ value: 'SINGLE_SELECT', label: 'Single choice' }, { value: 'MULTI_SELECT', label: 'Multiple choice' }, { value: 'TRUE_FALSE', label: 'True / false' }]} /></Form.Item></Col><Col span={6}><Form.Item name={[questionField.name, 'points']} label="Points" rules={[{ required: true }]}><InputNumber min={1} max={1000} className="w-full" /></Form.Item></Col></Row>
								<Form.Item name={[questionField.name, 'prompt']} label="Question" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
								<Form.Item name={[questionField.name, 'explanation']} label="Explanation shown after submission"><Input.TextArea rows={2} /></Form.Item>
								<Divider>Response options</Divider>
								<Form.List name={[questionField.name, 'options']}>
									{(optionFields, { add: addOption, remove: removeOption }) => <Space direction="vertical" className="w-full">
										{optionFields.map((optionField) => <Row key={optionField.key} gutter={10} align="middle"><Col span={5}><Form.Item name={[optionField.name, 'key']} rules={[{ required: true }]}><Input placeholder="Key" /></Form.Item></Col><Col span={14}><Form.Item name={[optionField.name, 'text']} rules={[{ required: true }]}><Input placeholder="Response text" /></Form.Item></Col><Col span={4}><Form.Item name={[optionField.name, 'isCorrect']} valuePropName="checked"><Checkbox>Correct</Checkbox></Form.Item></Col><Col span={1}><Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeOption(optionField.name)} /></Col></Row>)}
										<Button type="dashed" block icon={<PlusOutlined />} onClick={() => addOption({ key: `option-${optionFields.length + 1}`, text: '', isCorrect: false })}>Add response option</Button>
									</Space>}
								</Form.List>
							</Card>)}
							<Button type="dashed" block icon={<PlusOutlined />} onClick={() => addQuestion({ key: `question-${questionFields.length + 1}`, prompt: '', type: 'SINGLE_SELECT', points: 1, explanation: '', options: [{ key: 'a', text: '', isCorrect: true }, { key: 'b', text: '', isCorrect: false }] })}>Add question</Button>
						</Space>}
					</Form.List>
				</Card>
			</Col>
		</Row>
	</Form>
);

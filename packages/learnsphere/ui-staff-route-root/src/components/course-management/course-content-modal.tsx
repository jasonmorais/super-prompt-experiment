import { Alert, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import type { Course, ModuleValues } from './types.ts';

export interface CourseContentModalProps {
	course?: Course;
	loading: boolean;
	onClose: () => void;
	onSubmit: (values: ModuleValues) => void;
}

export const CourseContentModal = ({ course, loading, onClose, onSubmit }: CourseContentModalProps) => {
	const [form] = Form.useForm<ModuleValues>();
	return (
		<Modal
			title={`Add content · ${course?.title ?? ''}`}
			open={Boolean(course)}
			onCancel={onClose}
			onOk={() => form.submit()}
			confirmLoading={loading}
			width={780}
			okText="Add module and activity"
		>
			<Alert
				type="info"
				showIcon
				message="A module groups one or more learning activities"
				description="This first version adds one activity at a time."
				className="mb-5"
			/>
			<Form
				form={form}
				layout="vertical"
				onFinish={(values) => {
					onSubmit(values);
					form.resetFields();
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
								className="w-full"
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
	);
};

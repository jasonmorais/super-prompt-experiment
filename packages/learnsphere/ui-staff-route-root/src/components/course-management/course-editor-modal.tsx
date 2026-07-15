import { Alert, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import type { Course, CourseValues } from './types.ts';

export interface CourseEditorModalProps {
	open: boolean;
	course?: Course;
	loading: boolean;
	onClose: () => void;
	onSubmit: (values: CourseValues) => void;
}

export const CourseEditorModal = ({ open, course, loading, onClose, onSubmit }: CourseEditorModalProps) => {
	const [form] = Form.useForm<CourseValues>();
	useEffect(() => {
		if (course)
			form.setFieldsValue({
				title: course.title,
				summary: course.summary,
				description: course.description,
				category: course.category,
				level: course.level,
				tags: course.tags,
				skills: course.skills,
				discoverability: course.discoverability,
				requiresCompletionScreenshot: course.requiresCompletionScreenshot,
			});
		else form.resetFields();
	}, [course, form]);
	return (
		<Modal
			title={course ? `Edit course · ${course.title}` : 'Create a draft course'}
			open={open}
			onCancel={onClose}
			onOk={() => form.submit()}
			confirmLoading={loading}
			width={760}
			okText={course ? 'Save changes' : 'Create draft'}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={(values) => {
					onSubmit(values);
					form.resetFields();
				}}
				initialValues={{ level: 'FOUNDATIONAL', discoverability: 'CATALOG', requiresCompletionScreenshot: false }}
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
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="discoverability"
							label="Learner visibility"
							rules={[{ required: true }]}
						>
							<Select
								options={[
									{ value: 'CATALOG', label: 'Visible in Discover' },
									{ value: 'ASSIGNED_ONLY', label: 'Assigned learners only' },
								]}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="requiresCompletionScreenshot"
							label="Completion evidence"
						>
							<Select
								options={[
									{ value: false, label: 'Screenshot optional' },
									{ value: true, label: 'Require learner screenshot' },
								]}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Alert
					type="info"
					showIcon
					message="Course tags help learners find relevant training. Assigned-only courses stay out of Discover until a staff member assigns them."
				/>
			</Form>
		</Modal>
	);
};

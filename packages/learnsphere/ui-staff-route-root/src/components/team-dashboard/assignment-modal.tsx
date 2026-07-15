import { Alert, DatePicker, Form, Modal, Select } from 'antd';
import type { AssignmentValues, CourseView, LearnerRow } from './types.ts';

export interface AssignmentModalProps {
	open: boolean;
	learners: LearnerRow[];
	courses: CourseView[];
	loading: boolean;
	onClose: () => void;
	onSubmit: (values: AssignmentValues, learner: LearnerRow) => Promise<void>;
}

export const AssignmentModal = ({ open, learners, courses, loading, onClose, onSubmit }: AssignmentModalProps) => {
	const [form] = Form.useForm<AssignmentValues>();
	return (
		<Modal
			title="Assign training"
			open={open}
			onCancel={onClose}
			onOk={() => form.submit()}
			confirmLoading={loading}
			okText="Create assignment"
		>
			<Alert
				type="info"
				showIcon
				message="What happens next"
				description="This creates a learning record for the selected learner. It will appear in their My learning dashboard with the assignment source and due date."
				className="mb-5"
			/>
			<Form
				form={form}
				layout="vertical"
				onFinish={async (values) => {
					const learner = learners.find((candidate) => candidate.learnerId === values.learnerId);
					if (learner) {
						await onSubmit(values, learner);
						form.resetFields();
					}
				}}
				initialValues={{ source: 'MANAGER_ASSIGNED' }}
			>
				<Form.Item
					name="learnerId"
					label="Learner"
					rules={[{ required: true }]}
				>
					<Select
						showSearch
						optionFilterProp="label"
						options={learners.map((learner) => ({ value: learner.learnerId, label: `${learner.name} · ${learner.teamName}` }))}
					/>
				</Form.Item>
				<Form.Item
					name="courseId"
					label="Published training"
					rules={[{ required: true }]}
				>
					<Select
						showSearch
						optionFilterProp="label"
						options={courses.map((course) => ({ value: course.id, label: `${course.title} · ${course.lessonCount} activities` }))}
					/>
				</Form.Item>
				<Form.Item
					name="source"
					label="Assignment type"
					rules={[{ required: true }]}
				>
					<Select
						options={[
							{ value: 'MANAGER_ASSIGNED', label: 'Manager assigned' },
							{ value: 'PROGRAM_ASSIGNED', label: 'Development programme' },
							{ value: 'COMPLIANCE_ASSIGNED', label: 'Required compliance' },
						]}
					/>
				</Form.Item>
				<Form.Item
					name="dueAt"
					label="Due date"
				>
					<DatePicker className="w-full" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

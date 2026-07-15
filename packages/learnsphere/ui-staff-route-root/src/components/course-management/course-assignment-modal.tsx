import { Alert, DatePicker, Form, Modal, Select } from 'antd';
import type { Course, AssignmentValues, Person } from './types.ts';

export interface CourseAssignmentModalProps {
	course?: Course;
	people: Person[];
	loading: boolean;
	onClose: () => void;
	onSubmit: (values: AssignmentValues) => void;
}

export const CourseAssignmentModal = ({ course, people, loading, onClose, onSubmit }: CourseAssignmentModalProps) => {
	const [form] = Form.useForm<AssignmentValues>();
	return (
		<Modal
			title={`Assign course · ${course?.title ?? ''}`}
			open={Boolean(course)}
			onCancel={onClose}
			onOk={() => form.submit()}
			confirmLoading={loading}
			okText="Create assignment"
		>
			<Alert
				type="info"
				showIcon
				message="Private courses are supported"
				description="Assigned-only courses remain hidden from Discover and appear in the learner's My learning after this assignment is created."
				className="mb-[18px]"
			/>
			<Form
				form={form}
				layout="vertical"
				onFinish={(values) => {
					onSubmit(values);
					form.resetFields();
				}}
			>
				<Form.Item
					name="learnerId"
					label="Assign to"
					rules={[{ required: true }]}
				>
					<Select
						showSearch
						optionFilterProp="label"
						options={people.map((person) => ({ value: person.learnerId, label: `${person.learnerDisplayName} · ${person.teamName}` }))}
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

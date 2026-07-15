import { Alert, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import type { CreateValues, Learner, Operation, UpdateValues } from './types.ts';

export interface OperationModalsProps {
	createOpen: boolean;
	confirmingOperation?: Operation;
	cancellingOperation?: Operation;
	editingOperation?: Operation;
	learners: Learner[];
	creating: boolean;
	confirming: boolean;
	cancelling: boolean;
	updating: boolean;
	onCloseCreate: () => void;
	onCloseConfirm: () => void;
	onCloseCancel: () => void;
	onCloseEdit: () => void;
	onCreate: (values: CreateValues) => void;
	onConfirm: (operation: Operation, note?: string) => void;
	onCancel: (operation: Operation, reason: string) => void;
	onUpdate: (operation: Operation, values: UpdateValues) => void;
}

export const OperationModals = ({
	createOpen,
	confirmingOperation,
	cancellingOperation,
	editingOperation,
	learners,
	creating,
	confirming,
	cancelling,
	updating,
	onCloseCreate,
	onCloseConfirm,
	onCloseCancel,
	onCloseEdit,
	onCreate,
	onConfirm,
	onCancel,
	onUpdate,
}: OperationModalsProps) => {
	const [createForm] = Form.useForm<CreateValues>();
	const [confirmForm] = Form.useForm<{ note?: string }>();
	const [cancelForm] = Form.useForm<{ reason: string }>();
	const [editForm] = Form.useForm<UpdateValues>();
	useEffect(() => {
		if (editingOperation)
			editForm.setFieldsValue({
				title: editingOperation.title,
				description: editingOperation.description,
				category: editingOperation.category,
				priority: editingOperation.priority,
				dueAt: editingOperation.dueAt ? new Date(editingOperation.dueAt).toISOString().slice(0, 10) : undefined,
			});
	}, [editForm, editingOperation]);
	return (
		<>
			<Modal
				title="Assign an operation"
				open={createOpen}
				onCancel={onCloseCreate}
				onOk={() => createForm.submit()}
				confirmLoading={creating}
				okText="Assign operation"
			>
				<Form
					form={createForm}
					layout="vertical"
					onFinish={(values) => {
						onCreate(values);
						createForm.resetFields();
					}}
					initialValues={{ priority: 'MEDIUM' }}
				>
					<Form.Item
						name="title"
						label="Operation title"
						rules={[{ required: true, min: 4 }]}
					>
						<Input placeholder="Prepare the Q3 customer research readout" />
					</Form.Item>
					<Form.Item
						name="description"
						label="What needs to happen"
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
								<Input placeholder="Planning, delivery, customer work…" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="priority"
								label="Priority"
								rules={[{ required: true }]}
							>
								<Select options={['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((value) => ({ value, label: value.toLowerCase() }))} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="assigneeId"
						label="Assign to"
						rules={[{ required: true }]}
					>
						<Select
							showSearch
							optionFilterProp="label"
							options={learners.map((learner) => ({ value: learner.learnerId, label: `${learner.learnerDisplayName} · ${learner.teamName}` }))}
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
			<Modal
				title={`Confirm completion · ${confirmingOperation?.title ?? ''}`}
				open={Boolean(confirmingOperation)}
				onCancel={onCloseConfirm}
				onOk={() => confirmForm.submit()}
				confirmLoading={confirming}
				okText="Confirm complete"
			>
				<Alert
					type="warning"
					showIcon
					message="Manager confirmation"
					description="This is the final completion decision and will be recorded against your identity."
					className="mb-[18px]"
				/>
				<Form
					form={confirmForm}
					layout="vertical"
					onFinish={(values) => {
						if (confirmingOperation) onConfirm(confirmingOperation, values.note);
						confirmForm.resetFields();
					}}
				>
					<Form.Item
						name="note"
						label="Manager note"
					>
						<Input.TextArea
							rows={3}
							placeholder="What did you verify?"
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title={`Cancel operation · ${cancellingOperation?.title ?? ''}`}
				open={Boolean(cancellingOperation)}
				onCancel={onCloseCancel}
				onOk={() => cancelForm.submit()}
				confirmLoading={cancelling}
				okText="Cancel operation"
			>
				<Form
					form={cancelForm}
					layout="vertical"
					onFinish={(values) => {
						if (cancellingOperation) onCancel(cancellingOperation, values.reason);
						cancelForm.resetFields();
					}}
				>
					<Form.Item
						name="reason"
						label="Reason"
						rules={[{ required: true, min: 5 }]}
					>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title={`Edit team goal · ${editingOperation?.title ?? ''}`}
				open={Boolean(editingOperation)}
				onCancel={onCloseEdit}
				onOk={() => editForm.submit()}
				confirmLoading={updating}
				okText="Save changes"
			>
				<Form
					form={editForm}
					layout="vertical"
					onFinish={(values) => {
						if (editingOperation) onUpdate(editingOperation, values);
						editForm.resetFields();
					}}
				>
					<Form.Item
						name="title"
						label="Title"
						rules={[{ required: true, min: 4 }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
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
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="priority"
								label="Priority"
								rules={[{ required: true }]}
							>
								<Select options={['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((value) => ({ value, label: value.toLowerCase() }))} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="dueAt"
						label="Due date"
					>
						<Input type="date" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

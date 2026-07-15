import { ArrowLeftOutlined, CheckCircleOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined, PlusOutlined, SendOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag, Typography, Upload } from 'antd';
import { useState } from 'react';
import type { StaffTeamOperationsQuery } from '../generated.tsx';

const { Title, Paragraph, Text } = Typography;
type Operation = StaffTeamOperationsQuery['teamOperations'][number];
type Learner = StaffTeamOperationsQuery['teamLearning'][number];
type CreateValues = { title: string; description: string; category: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; assigneeId: string; dueAt?: { toISOString(): string } };
type UpdateValues = Omit<CreateValues, 'assigneeId' | 'dueAt'> & { dueAt?: string };
const statusColor = (status: string) => (status === 'COMPLETED' ? 'green' : status === 'SUBMITTED' ? 'gold' : status === 'CANCELLED' ? 'default' : status === 'IN_PROGRESS' ? 'blue' : 'purple');

export interface TeamOperationsProps {
	operations: Operation[];
	learners: Learner[];
	canConfirm: boolean;
	loading: boolean;
	creating: boolean;
	confirming: boolean;
	cancelling: boolean;
	commenting: boolean;
	attaching: boolean;
	updating: boolean;
	onCreate: (values: CreateValues) => void;
	onConfirm: (operation: Operation, note?: string) => void;
	onCancel: (operation: Operation, reason: string) => void;
	onComment: (operation: Operation, body: string) => void;
	onAttach: (operation: Operation, file: File) => void;
	onUpdate: (operation: Operation, values: UpdateValues) => void;
	onOpenGoal: (operationId: string) => void;
}

const OperationThread = ({
	operation,
	commenting,
	attaching,
	onComment,
	onAttach,
}: {
	operation: Operation;
	commenting: boolean;
	attaching: boolean;
	onComment: TeamOperationsProps['onComment'];
	onAttach: TeamOperationsProps['onAttach'];
}) => {
	const [commentForm] = Form.useForm<{ body: string }>();
	return (
		<Card
			title={
				<Space>
					<span style={{ width: 34, height: 34, borderRadius: 10, background: '#e9e4ff', color: '#6d4aff', display: 'grid', placeItems: 'center' }}>
						<SendOutlined />
					</span>
					<span>Team discussion</span>
					<Tag
						bordered={false}
						color="purple"
					>
						{operation.thread.comments.length + operation.thread.attachments.length} updates
					</Tag>
				</Space>
			}
			style={{ marginTop: 24, background: '#faf9ff', border: '1px solid #ebe7ff', borderRadius: 18, boxShadow: '0 12px 30px rgba(44,31,95,.06)' }}
		>
			<Space
				direction="vertical"
				style={{ width: '100%' }}
				size="middle"
			>
				{operation.thread.comments.length + operation.thread.attachments.length === 0 && <div style={{ padding: '4px 0 2px', color: '#73718a' }}>No updates yet. Start the conversation with the team.</div>}
				{operation.thread.comments.map((comment) => (
					<div
						key={comment.id}
						style={{ display: 'flex', gap: 12, padding: 14, background: 'white', border: '1px solid #eeeaff', borderRadius: 14 }}
					>
						<div style={{ flex: '0 0 34px', height: 34, borderRadius: '50%', background: '#d9d1ff', color: '#3e278f', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{comment.authorName.slice(0, 1).toUpperCase()}</div>
						<div>
							<div>
								<Text strong>{comment.authorName}</Text>
								<Text
									type="secondary"
									style={{ marginLeft: 8, fontSize: 12 }}
								>
									{new Date(comment.createdAt).toLocaleString()}
								</Text>
							</div>
							<div style={{ marginTop: 5, color: '#3b3957', lineHeight: 1.55 }}>{comment.body}</div>
						</div>
					</div>
				))}
				{operation.thread.attachments.map((attachment) => (
					<Tag
						key={attachment.id}
						icon={<PaperClipOutlined />}
						style={{ padding: '7px 10px', borderRadius: 9, color: '#6d4aff', background: '#eeeaff', border: 0 }}
					>
						{attachment.fileName} · {Math.ceil(attachment.size / 1024)} KB
					</Tag>
				))}
				<Form
					form={commentForm}
					layout="vertical"
					onFinish={(values) => {
						onComment(operation, values.body);
						commentForm.resetFields();
					}}
					style={{ width: '100%' }}
				>
					<Form.Item
						name="body"
						rules={[{ required: true, min: 1 }]}
						style={{ marginBottom: 10 }}
					>
						<Input.TextArea
							autoSize={{ minRows: 2, maxRows: 5 }}
							placeholder="Write an update for the team…"
						/>
					</Form.Item>
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
						<Upload
							showUploadList={false}
							disabled={attaching}
							beforeUpload={(file) => {
								onAttach(operation, file);
								return false;
							}}
						>
							<Button
								icon={<PaperClipOutlined />}
								style={{ color: '#6d4aff', borderColor: '#cfc5ff' }}
							>
								{attaching ? 'Uploading…' : 'Attach file'}
							</Button>
						</Upload>
						<Button
							htmlType="submit"
							type="primary"
							icon={<SendOutlined />}
							loading={commenting}
						>
							Post update
						</Button>
					</div>
				</Form>
			</Space>
		</Card>
	);
};

export const StaffTeamGoalDetail = ({
	operation,
	commenting,
	attaching,
	onComment,
	onAttach,
	onBack,
}: {
	operation: Operation;
	commenting: boolean;
	attaching: boolean;
	onComment: TeamOperationsProps['onComment'];
	onAttach: TeamOperationsProps['onAttach'];
	onBack: () => void;
}) => (
	<>
		<Button
			type="text"
			icon={<ArrowLeftOutlined />}
			onClick={onBack}
			style={{ paddingLeft: 0, marginBottom: 18, color: '#6d4aff' }}
		>
			Back to team operations
		</Button>
		<Card
			style={{ border: 0, borderRadius: 22, background: 'linear-gradient(135deg,#272052,#5940b4)', marginBottom: 22 }}
			styles={{ body: { padding: '34px clamp(22px,5vw,54px)' } }}
		>
			<Space wrap>
				<Tag
					bordered={false}
					color={statusColor(operation.status)}
				>
					{operation.status.replaceAll('_', ' ')}
				</Tag>
				<Tag bordered={false}>{operation.category}</Tag>
				<Text style={{ color: '#e8e5ff' }}>
					{operation.priority.toLowerCase()}
					{operation.dueAt ? ` · Due ${new Date(operation.dueAt).toLocaleDateString()}` : ''}
				</Text>
			</Space>
			<Title style={{ color: 'white', margin: '14px 0 8px' }}>{operation.title}</Title>
			<Paragraph style={{ color: '#e8e5ff', fontSize: 16, margin: 0 }}>{operation.description}</Paragraph>
		</Card>
		<Card style={{ borderRadius: 18, border: '1px solid #ebe7ff' }}>
			<Text type="secondary">
				Owner: {operation.assigneeDisplayName} · Created by {operation.createdBy}
			</Text>
			{operation.completionNote && (
				<Alert
					type="success"
					showIcon
					message="Submitted completion note"
					description={operation.completionNote}
					style={{ marginTop: 18 }}
				/>
			)}
			{operation.completionEvidence && (
				<a
					href={operation.completionEvidence}
					target="_blank"
					rel="noreferrer"
					style={{ display: 'block', marginTop: 12 }}
				>
					Open submitted evidence
				</a>
			)}
		</Card>
		<OperationThread
			operation={operation}
			commenting={commenting}
			attaching={attaching}
			onComment={onComment}
			onAttach={onAttach}
		/>
	</>
);

export const TeamOperations = ({ operations, learners, canConfirm, loading, creating, confirming, cancelling, updating, onCreate, onConfirm, onCancel, onUpdate, onOpenGoal }: TeamOperationsProps) => {
	const [createOpen, setCreateOpen] = useState(false);
	const [confirmingOperation, setConfirmingOperation] = useState<Operation>();
	const [cancellingOperation, setCancellingOperation] = useState<Operation>();
	const [editingOperation, setEditingOperation] = useState<Operation>();
	const [createForm] = Form.useForm<CreateValues>();
	const [confirmForm] = Form.useForm<{ note?: string }>();
	const [cancelForm] = Form.useForm<{ reason: string }>();
	const [editForm] = Form.useForm<UpdateValues>();
	const submitted = operations.filter((operation) => operation.status === 'SUBMITTED').length;
	const overdue = operations.filter((operation) => operation.isOverdue).length;
	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 28 }}>
				<div>
					<Text style={{ color: '#6d4aff', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 12 }}>Team operations</Text>
					<Title style={{ margin: '6px 0' }}>Team operations</Title>
					<Paragraph
						type="secondary"
						style={{ margin: 0 }}
					>
						Shape team-wide goals, assign ownership, review outcomes, and confirm completion as a manager.
					</Paragraph>
				</div>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setCreateOpen(true)}
				>
					Assign operation
				</Button>
			</div>
			<Alert
				type="info"
				showIcon
				message="Completion control"
				description={
					canConfirm ? 'Team members can submit their work. You can confirm an operation only after reviewing the submitted outcome.' : 'Team members can submit their work, but only a manager can confirm an operation as complete.'
				}
				style={{ marginBottom: 22 }}
			/>
			<Row
				gutter={[18, 18]}
				style={{ marginBottom: 24 }}
			>
				<Col
					xs={24}
					sm={8}
				>
					<Card loading={loading}>
						<Statistic
							title="Open operations"
							value={operations.filter((operation) => !['COMPLETED', 'CANCELLED'].includes(operation.status)).length}
							prefix={<ThunderboltOutlined />}
						/>
					</Card>
				</Col>
				<Col
					xs={24}
					sm={8}
				>
					<Card loading={loading}>
						<Statistic
							title="Awaiting confirmation"
							value={submitted}
							prefix={<CheckCircleOutlined />}
						/>
					</Card>
				</Col>
				<Col
					xs={24}
					sm={8}
				>
					<Card loading={loading}>
						<Statistic
							title="Overdue"
							value={overdue}
							valueStyle={{ color: overdue ? '#c43d4b' : undefined }}
						/>
					</Card>
				</Col>
			</Row>
			<Card>
				<Table<Operation>
					loading={loading}
					rowKey="id"
					dataSource={operations}
					pagination={{ pageSize: 8 }}
					expandable={{
						expandedRowRender: (operation) => (
							<Space
								direction="vertical"
								style={{ width: '100%' }}
							>
								<Paragraph style={{ margin: 0 }}>{operation.description}</Paragraph>
								<Text type="secondary">
									Created by {operation.createdBy} · {operation.statusHistory.length} status events
								</Text>
							</Space>
						),
					}}
					columns={[
						{
							title: 'Team goal',
							render: (_, operation) => (
								<Button
									type="link"
									style={{ padding: 0, height: 'auto', textAlign: 'left', color: '#28305d' }}
									onClick={() => onOpenGoal(operation.id)}
								>
									<div style={{ fontWeight: 700 }}>{operation.title}</div>
									<Text type="secondary">
										{operation.category} · {operation.priority.toLowerCase()}
									</Text>
								</Button>
							),
						},
						{ title: 'Owner', dataIndex: 'assigneeDisplayName' },
						{ title: 'Due', render: (_, operation) => (operation.dueAt ? new Date(operation.dueAt).toLocaleDateString() : 'No due date') },
						{ title: 'Status', render: (_, operation) => <Tag color={statusColor(operation.status)}>{operation.status.replaceAll('_', ' ')}</Tag> },
						{
							title: 'Actions',
							render: (_, operation) => (
								<Space
									size={[8, 8]}
									wrap
								>
									<Button
										style={{ color: '#6d4aff', borderColor: '#cfc5ff', background: '#f7f4ff', borderRadius: 10, fontWeight: 650 }}
										icon={<EditOutlined />}
										onClick={() => {
											setEditingOperation(operation);
											editForm.setFieldsValue({
												title: operation.title,
												description: operation.description,
												category: operation.category,
												priority: operation.priority,
												dueAt: operation.dueAt ? new Date(operation.dueAt).toISOString().slice(0, 10) : undefined,
											});
										}}
									>
										Edit
									</Button>
									{canConfirm && operation.status === 'SUBMITTED' && (
										<Button
											type="primary"
											style={{ borderRadius: 10, fontWeight: 650 }}
											onClick={() => setConfirmingOperation(operation)}
										>
											Confirm complete
										</Button>
									)}
									{!['COMPLETED', 'CANCELLED'].includes(operation.status) && (
										<Button
											style={{ color: '#6d4aff', borderColor: '#cfc5ff', background: '#f7f4ff', borderRadius: 10, fontWeight: 650 }}
											icon={<DeleteOutlined />}
											onClick={() => setCancellingOperation(operation)}
										>
											Cancel
										</Button>
									)}
								</Space>
							),
						},
					]}
				/>
			</Card>
			<Modal
				title="Assign an operation"
				open={createOpen}
				onCancel={() => setCreateOpen(false)}
				onOk={() => createForm.submit()}
				confirmLoading={creating}
				okText="Assign operation"
			>
				<Form
					form={createForm}
					layout="vertical"
					onFinish={(values) => {
						onCreate(values);
						setCreateOpen(false);
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
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title={`Confirm completion · ${confirmingOperation?.title ?? ''}`}
				open={Boolean(confirmingOperation)}
				onCancel={() => setConfirmingOperation(undefined)}
				onOk={() => confirmForm.submit()}
				confirmLoading={confirming}
				okText="Confirm complete"
			>
				<Alert
					type="warning"
					showIcon
					message="Manager confirmation"
					description="This is the final completion decision and will be recorded against your identity."
					style={{ marginBottom: 18 }}
				/>
				<Form
					form={confirmForm}
					layout="vertical"
					onFinish={(values) => {
						if (confirmingOperation) onConfirm(confirmingOperation, values.note);
						setConfirmingOperation(undefined);
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
				onCancel={() => setCancellingOperation(undefined)}
				onOk={() => cancelForm.submit()}
				confirmLoading={cancelling}
				okText="Cancel operation"
				okButtonProps={{ style: { background: '#6d4aff', borderColor: '#6d4aff' } }}
				cancelButtonProps={{ style: { color: '#6d4aff', borderColor: '#cfc5ff' } }}
			>
				<Form
					form={cancelForm}
					layout="vertical"
					onFinish={(values) => {
						if (cancellingOperation) onCancel(cancellingOperation, values.reason);
						setCancellingOperation(undefined);
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
				onCancel={() => setEditingOperation(undefined)}
				onOk={() => editForm.submit()}
				confirmLoading={updating}
				okText="Save changes"
			>
				<Form
					form={editForm}
					layout="vertical"
					onFinish={(values) => {
						if (editingOperation) onUpdate(editingOperation, values);
						setEditingOperation(undefined);
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

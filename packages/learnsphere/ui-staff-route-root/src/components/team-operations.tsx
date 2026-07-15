import { CheckCircleOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined, PlusOutlined, SendOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { StaffTeamOperationsQuery } from '../generated.tsx';
import { useState } from 'react';

const { Title, Paragraph, Text } = Typography;
type Operation = StaffTeamOperationsQuery['teamOperations'][number];
type Learner = StaffTeamOperationsQuery['teamLearning'][number];
type CreateValues = { title: string; description: string; category: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; assigneeId: string; dueAt?: { toISOString(): string } };
type UpdateValues = Omit<CreateValues, 'assigneeId'>;
const statusColor = (status: string) => status === 'COMPLETED' ? 'green' : status === 'SUBMITTED' ? 'gold' : status === 'CANCELLED' ? 'default' : status === 'IN_PROGRESS' ? 'blue' : 'purple';

const OperationThread = ({ operation, commenting, attaching, onComment, onAttach }: { operation: Operation; commenting: boolean; attaching: boolean; onComment: TeamOperationsProps['onComment']; onAttach: TeamOperationsProps['onAttach'] }) => {
	const [commentForm] = Form.useForm<{ body: string }>();
	return <Card size="small" title={`Thread · ${operation.thread.comments.length + operation.thread.attachments.length}`} style={{ marginTop: 16, background: '#fbfaff', borderColor: '#ded6ff' }}><Space direction="vertical" style={{ width: '100%' }} size="small">{operation.thread.comments.map((comment) => <div key={comment.id} style={{ padding: '9px 11px', background: 'white', borderRadius: 8 }}><Text strong>{comment.authorName}</Text><Text type="secondary"> · {new Date(comment.createdAt).toLocaleString()}</Text><div style={{ marginTop: 3 }}>{comment.body}</div></div>)}{operation.thread.attachments.map((attachment) => <div key={attachment.id} style={{ color: '#6d4aff' }}><PaperClipOutlined /> {attachment.fileName} <Text type="secondary">({Math.ceil(attachment.size / 1024)} KB)</Text></div>)}<Form form={commentForm} layout="inline" onFinish={(values) => { onComment(operation, values.body); commentForm.resetFields(); }} style={{ width: '100%' }}><Form.Item name="body" rules={[{ required: true, min: 1 }]} style={{ flex: 1, marginBottom: 0 }}><Input placeholder="Add a comment…" /></Form.Item><Button htmlType="submit" type="primary" icon={<SendOutlined />} loading={commenting}>Comment</Button><label style={{ cursor: 'pointer', opacity: attaching ? 0.6 : 1 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6d4aff', border: '1px solid #cfc5ff', borderRadius: 6, padding: '4px 10px', height: 32 }}><PaperClipOutlined />{attaching ? 'Uploading…' : 'Attach'}</span><input type="file" hidden disabled={attaching} onChange={(event) => { const file = event.target.files?.[0]; if (file) onAttach(operation, file); event.currentTarget.value = ''; }} /></label></Form></Space></Card>;
};

export interface TeamOperationsProps {
	operations: Operation[];
	learners: Learner[];
	canConfirm: boolean;
	loading: boolean;
	creating: boolean;
	confirming: boolean;
	cancelling: boolean;
	onCreate: (values: CreateValues) => void;
	onConfirm: (operation: Operation, note?: string) => void;
	onCancel: (operation: Operation, reason: string) => void;
	commenting: boolean;
	attaching: boolean;
	updating: boolean;
	onComment: (operation: Operation, body: string) => void;
	onAttach: (operation: Operation, file: File) => void;
	onUpdate: (operation: Operation, values: UpdateValues) => void;
}

export const TeamOperations = ({ operations, learners, canConfirm, loading, creating, confirming, cancelling, commenting, attaching, updating, onCreate, onConfirm, onCancel, onComment, onAttach, onUpdate }: TeamOperationsProps) => {
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
	return <>
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 28 }}>
			<div><Text style={{ color: '#6d4aff', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 12 }}>Team operations</Text><Title style={{ margin: '6px 0' }}>Team operations</Title><Paragraph type="secondary" style={{ margin: 0 }}>Shape team-wide goals, assign ownership, review outcomes, and confirm completion as a manager.</Paragraph></div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>Assign operation</Button>
		</div>
		<Alert type="info" showIcon message="Completion control" description={canConfirm ? 'Team members can submit their work. You can confirm an operation only after reviewing the submitted outcome.' : 'Team members can submit their work, but only a manager can confirm an operation as complete.'} style={{ marginBottom: 22 }} />
		<Row gutter={[18, 18]} style={{ marginBottom: 24 }}>
			<Col xs={24} sm={8}><Card loading={loading}><Statistic title="Open operations" value={operations.filter((operation) => !['COMPLETED', 'CANCELLED'].includes(operation.status)).length} prefix={<ThunderboltOutlined />} /></Card></Col>
			<Col xs={24} sm={8}><Card loading={loading}><Statistic title="Awaiting confirmation" value={submitted} prefix={<CheckCircleOutlined />} /></Card></Col>
			<Col xs={24} sm={8}><Card loading={loading}><Statistic title="Overdue" value={overdue} valueStyle={{ color: overdue ? '#c43d4b' : undefined }} /></Card></Col>
		</Row>
		<Card>
			<Table<Operation> loading={loading} rowKey="id" dataSource={operations} pagination={{ pageSize: 8 }} expandable={{ expandedRowRender: (operation) => <Space direction="vertical" style={{ width: '100%' }}><Paragraph style={{ margin: 0 }}>{operation.description}</Paragraph><Text type="secondary">Created by {operation.createdBy} · {operation.statusHistory.length} status events</Text>{operation.completionNote && <Alert type="success" message="Submitted completion note" description={operation.completionNote} />}{operation.completionEvidence && <a href={operation.completionEvidence} target="_blank" rel="noreferrer">Open submitted evidence</a>}<OperationThread operation={operation} commenting={commenting} attaching={attaching} onComment={onComment} onAttach={onAttach} /></Space> }} columns={[{ title: 'Team goal', render: (_, operation) => <div><div style={{ fontWeight: 700 }}>{operation.title}</div><Text type="secondary">{operation.category} · {operation.priority.toLowerCase()}</Text></div> }, { title: 'Owner', dataIndex: 'assigneeDisplayName' }, { title: 'Due', render: (_, operation) => operation.dueAt ? new Date(operation.dueAt).toLocaleDateString() : 'No due date' }, { title: 'Status', render: (_, operation) => <Tag color={statusColor(operation.status)}>{operation.status.replaceAll('_', ' ')}</Tag> }, { title: 'Actions', render: (_, operation) => <Space wrap>{!['COMPLETED', 'CANCELLED'].includes(operation.status) && <Button icon={<EditOutlined />} onClick={() => { setEditingOperation(operation); editForm.setFieldsValue({ title: operation.title, description: operation.description, category: operation.category, priority: operation.priority, dueAt: operation.dueAt ? { toISOString: () => operation.dueAt as string } : undefined }); }}>Edit</Button>}{canConfirm && operation.status === 'SUBMITTED' && <Button type="primary" onClick={() => setConfirmingOperation(operation)}>Confirm complete</Button>}{!['COMPLETED', 'CANCELLED'].includes(operation.status) && <Button style={{ color: '#6d4aff', borderColor: '#cfc5ff', background: '#f7f4ff' }} icon={<DeleteOutlined />} onClick={() => setCancellingOperation(operation)}>Cancel</Button>}</Space> }]} />
		</Card>
		<Modal title="Assign an operation" open={createOpen} onCancel={() => setCreateOpen(false)} onOk={() => createForm.submit()} confirmLoading={creating} okText="Assign operation">
			<Form form={createForm} layout="vertical" onFinish={(values) => { onCreate(values); setCreateOpen(false); createForm.resetFields(); }} initialValues={{ priority: 'MEDIUM' }}>
				<Form.Item name="title" label="Operation title" rules={[{ required: true, min: 4 }]}><Input placeholder="Prepare the Q3 customer research readout" /></Form.Item>
				<Form.Item name="description" label="What needs to happen" rules={[{ required: true, min: 20 }]}><Input.TextArea rows={4} /></Form.Item>
				<Row gutter={16}><Col span={12}><Form.Item name="category" label="Category" rules={[{ required: true }]}><Input placeholder="Planning, delivery, customer work…" /></Form.Item></Col><Col span={12}><Form.Item name="priority" label="Priority" rules={[{ required: true }]}><Select options={['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((value) => ({ value, label: value.toLowerCase() }))} /></Form.Item></Col></Row>
				<Form.Item name="assigneeId" label="Assign to" rules={[{ required: true }]}><Select showSearch optionFilterProp="label" options={learners.map((learner) => ({ value: learner.learnerId, label: `${learner.learnerDisplayName} · ${learner.teamName}` }))} /></Form.Item>
				<Form.Item name="dueAt" label="Due date"><DatePicker style={{ width: '100%' }} /></Form.Item>
			</Form>
		</Modal>
		<Modal title={`Confirm completion · ${confirmingOperation?.title ?? ''}`} open={Boolean(confirmingOperation)} onCancel={() => setConfirmingOperation(undefined)} onOk={() => confirmForm.submit()} confirmLoading={confirming} okText="Confirm complete">
			<Alert type="warning" showIcon message="Manager confirmation" description="This is the final completion decision and will be recorded against your identity." style={{ marginBottom: 18 }} />
			<Form form={confirmForm} layout="vertical" onFinish={(values) => { if (confirmingOperation) onConfirm(confirmingOperation, values.note); setConfirmingOperation(undefined); confirmForm.resetFields(); }}><Form.Item name="note" label="Manager note"><Input.TextArea rows={3} placeholder="What did you verify?" /></Form.Item></Form>
		</Modal>
		<Modal title={`Cancel operation · ${cancellingOperation?.title ?? ''}`} open={Boolean(cancellingOperation)} onCancel={() => setCancellingOperation(undefined)} onOk={() => cancelForm.submit()} confirmLoading={cancelling} okText="Cancel operation" okButtonProps={{ style: { background: '#6d4aff', borderColor: '#6d4aff' } }} cancelButtonProps={{ style: { color: '#6d4aff', borderColor: '#cfc5ff' } }}>
			<Form form={cancelForm} layout="vertical" onFinish={(values) => { if (cancellingOperation) onCancel(cancellingOperation, values.reason); setCancellingOperation(undefined); cancelForm.resetFields(); }}><Form.Item name="reason" label="Reason" rules={[{ required: true, min: 5 }]}><Input.TextArea rows={3} /></Form.Item></Form>
		</Modal>
		<Modal title={`Edit team goal · ${editingOperation?.title ?? ''}`} open={Boolean(editingOperation)} onCancel={() => setEditingOperation(undefined)} onOk={() => editForm.submit()} confirmLoading={updating} okText="Save changes"><Form form={editForm} layout="vertical" onFinish={(values) => { if (editingOperation) onUpdate(editingOperation, values); setEditingOperation(undefined); editForm.resetFields(); }}><Form.Item name="title" label="Title" rules={[{ required: true, min: 4 }]}><Input /></Form.Item><Form.Item name="description" label="Description" rules={[{ required: true, min: 20 }]}><Input.TextArea rows={4} /></Form.Item><Row gutter={16}><Col span={12}><Form.Item name="category" label="Category" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="priority" label="Priority" rules={[{ required: true }]}><Select options={['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((value) => ({ value, label: value.toLowerCase() }))} /></Form.Item></Col></Row><Form.Item name="dueAt" label="Due date"><DatePicker style={{ width: '100%' }} /></Form.Item></Form></Modal>
	</>;
};

import { Alert, Form, Input, Modal } from 'antd';
import type { Operation } from './types.ts';

export const OperationWorkflowModals = ({ confirmingOperation, cancellingOperation, confirming, cancelling, onCloseConfirm, onCloseCancel, onConfirm, onCancel }: { confirmingOperation?: Operation; cancellingOperation?: Operation; confirming: boolean; cancelling: boolean; onCloseConfirm: () => void; onCloseCancel: () => void; onConfirm: (operation: Operation, note?: string) => void; onCancel: (operation: Operation, reason: string) => void }) => {
	const [confirmForm] = Form.useForm<{ note?: string }>();
	const [cancelForm] = Form.useForm<{ reason: string }>();
	return <>
		<Modal title={`Confirm completion · ${confirmingOperation?.title ?? ''}`} open={Boolean(confirmingOperation)} onCancel={onCloseConfirm} onOk={() => confirmForm.submit()} confirmLoading={confirming} okText="Confirm complete"><Alert type="warning" showIcon message="Manager confirmation" description="This final decision is recorded against your identity." className="mb-[18px]" /><Form form={confirmForm} layout="vertical" onFinish={(values) => { if (confirmingOperation) onConfirm(confirmingOperation, values.note); confirmForm.resetFields(); }}><Form.Item name="note" label="Manager note"><Input.TextArea rows={3} placeholder="What did you verify?" /></Form.Item></Form></Modal>
		<Modal title={`Cancel operation · ${cancellingOperation?.title ?? ''}`} open={Boolean(cancellingOperation)} onCancel={onCloseCancel} onOk={() => cancelForm.submit()} confirmLoading={cancelling} okText="Cancel operation"><Form form={cancelForm} layout="vertical" onFinish={(values) => { if (cancellingOperation) onCancel(cancellingOperation, values.reason); cancelForm.resetFields(); }}><Form.Item name="reason" label="Reason" rules={[{ required: true, min: 5 }]}><Input.TextArea rows={3} /></Form.Item></Form></Modal>
	</>;
};

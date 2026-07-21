import { PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Tag, Typography, Upload } from 'antd';
import type { StaffTeamOperationsContainerTeamOperationsQuery } from '../../generated.tsx';
import styles from './operation-thread.module.css';

const { Text } = Typography;
type Operation = StaffTeamOperationsContainerTeamOperationsQuery['teamOperations'][number];

export interface OperationThreadProps {
	operation: Operation;
	commenting: boolean;
	attaching: boolean;
	removingAttachment: boolean;
	onComment: (operation: Operation, body: string) => void;
	onAttach: (operation: Operation, file: File) => void;
	onRemoveAttachment: (operation: Operation, attachmentId: string) => void;
}

export const OperationThread = ({ operation, commenting, attaching, removingAttachment, onComment, onAttach, onRemoveAttachment }: OperationThreadProps) => {
	const [commentForm] = Form.useForm<{ body: string }>();
	const updateCount = operation.thread.comments.length + operation.thread.attachments.length;
	return (
		<Card
			className={styles['thread']}
			title={
				<Space>
					<span className={styles['thread-icon']}>
						<SendOutlined />
					</span>
					<span>Team discussion</span>
					<Tag
						bordered={false}
						color="purple"
					>
						{updateCount} updates
					</Tag>
				</Space>
			}
		>
			<Space
				direction="vertical"
				className="w-full"
				size="middle"
			>
				{updateCount === 0 && <div className={styles['empty']}>No updates yet. Start the conversation with the team.</div>}
				{operation.thread.comments.map((comment) => (
					<div
						className={styles['comment']}
						key={comment.id}
					>
						<div className={styles['avatar']}>{comment.authorName.slice(0, 1).toUpperCase()}</div>
						<div>
							<div>
								<Text strong>{comment.authorName}</Text>
								<Text
									type="secondary"
									className={styles['meta']}
								>
									{new Date(comment.createdAt).toLocaleString()}
								</Text>
							</div>
							<div className={styles['body']}>{comment.body}</div>
						</div>
					</div>
				))}
				{operation.thread.attachments.map((attachment) => (
					<Tag
						key={attachment.id}
						icon={<PaperClipOutlined />}
						className={styles['attachment']}
						closable
						closeIcon={removingAttachment ? false : undefined}
						onClose={(event) => {
							event.preventDefault();
							onRemoveAttachment(operation, attachment.id);
						}}
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
					className="w-full"
				>
					<Form.Item
						name="body"
						rules={[{ required: true, min: 1 }]}
						className="mb-2.5"
					>
						<Input.TextArea
							autoSize={{ minRows: 2, maxRows: 5 }}
							placeholder="Write an update for the team…"
						/>
					</Form.Item>
					<div className={styles['actions']}>
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
								className={styles['attach']}
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

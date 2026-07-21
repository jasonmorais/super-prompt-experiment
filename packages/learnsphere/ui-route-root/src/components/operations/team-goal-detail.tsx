import { ArrowLeftOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Space, Tag, Typography, Upload } from 'antd';
import { useState } from 'react';
import { OperationThread } from './operation-thread.tsx';
import type { OperationActionProps, Operation } from './types.ts';

const { Title, Paragraph, Text } = Typography;

export interface TeamGoalDetailProps extends OperationActionProps {
	learnerId: string;
	submitting: boolean;
	onSubmit: (operation: Operation, note: string, evidence?: string) => void;
	onBack: () => void;
}

export const TeamGoalDetail = ({ operation, learnerId, submitting, commenting, attaching, removingAttachment, onSubmit, onComment, onAttach, onRemoveAttachment, onBack }: TeamGoalDetailProps) => {
	const [form] = Form.useForm<{ completionNote: string; completionEvidence?: string }>();
	const [evidenceFile, setEvidenceFile] = useState<string>();
	const [evidenceName, setEvidenceName] = useState<string>();
	const canSubmit = operation.assigneeId === learnerId && !['COMPLETED', 'CANCELLED', 'SUBMITTED'].includes(operation.status);
	return (
		<>
			<Button
				type="text"
				icon={<ArrowLeftOutlined />}
				onClick={onBack}
				className="mb-[18px] pl-0 text-[#176c5b]"
			>
				Back to team operations
			</Button>
			<Card
				className="mb-[22px] rounded-[22px] border-0 bg-[linear-gradient(135deg,#123b33,#1f6657)]"
				styles={{ body: { padding: '34px clamp(22px,5vw,54px)' } }}
			>
				<Space wrap>
					<Tag
						bordered={false}
						color="green"
					>
						{operation.status.replaceAll('_', ' ')}
					</Tag>
					<Tag bordered={false}>{operation.category}</Tag>
					<Text className="text-[#d5e6e1]">
						{operation.priority.toLowerCase()}
						{operation.dueAt ? ` · Due ${new Date(operation.dueAt).toLocaleDateString()}` : ''}
					</Text>
				</Space>
				<Title
					className="my-[14px] mb-2 text-white"
					style={{ color: '#fff', fontWeight: 700 }}
				>
					{operation.title}
				</Title>
				<Paragraph className="m-0 text-base text-[#d5e6e1]">{operation.description}</Paragraph>
			</Card>
			<Card className="rounded-[18px] border border-[#e5eae6]">
				<Space
					direction="vertical"
					size="middle"
					className="w-full"
				>
					<Text type="secondary">
						Owner: {operation.assigneeDisplayName} · Assigned by {operation.createdBy}
					</Text>
					{operation.completionNote && (
						<Alert
							type="success"
							showIcon
							message="Submitted for confirmation"
							description={operation.completionNote}
						/>
					)}
					{canSubmit && (
						<Form
							form={form}
							layout="vertical"
							onFinish={(values) => {
								onSubmit(operation, values.completionNote, evidenceFile ?? values.completionEvidence);
								form.resetFields();
								setEvidenceFile(undefined);
								setEvidenceName(undefined);
							}}
						>
							<Form.Item
								name="completionNote"
								label="Ready to submit your work?"
								rules={[{ required: true, min: 10 }]}
							>
								<Input.TextArea
									rows={4}
									placeholder="Summarize the outcome and what you verified."
								/>
							</Form.Item>
							<Form.Item
								name="completionEvidence"
								label="Evidence link or file (optional)"
							>
								<Space.Compact className="w-full">
									<Input
										placeholder="https://…"
										disabled={Boolean(evidenceFile)}
									/>
									<Upload
										showUploadList={false}
										accept="image/*,.pdf"
										beforeUpload={(file) => {
											if (file.size > 6 * 1024 * 1024) return false;
											const reader = new FileReader();
											reader.onload = () => {
												setEvidenceFile(String(reader.result));
												setEvidenceName(file.name);
											};
											reader.readAsDataURL(file);
											return false;
										}}
									>
										<Button icon={<PaperClipOutlined />}>{evidenceName ? 'Replace file' : 'Attach proof'}</Button>
									</Upload>
								</Space.Compact>
								{evidenceName && <Text type="secondary">Attached proof: {evidenceName}</Text>}
							</Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								loading={submitting}
							>
								Submit for confirmation
							</Button>
						</Form>
					)}
				</Space>
			</Card>
			<OperationThread
				operation={operation}
				commenting={commenting}
				attaching={attaching}
				removingAttachment={removingAttachment}
				onComment={onComment}
				onAttach={onAttach}
				onRemoveAttachment={onRemoveAttachment}
			/>
		</>
	);
};

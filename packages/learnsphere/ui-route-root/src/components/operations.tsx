import { CheckCircleOutlined, ClockCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Progress, Row, Space, Tag, Typography } from 'antd';
import type { Operation } from './operations/types.ts';

const { Title, Paragraph, Text } = Typography;
const color = (status: string) => (status === 'COMPLETED' ? 'green' : status === 'SUBMITTED' ? 'gold' : status === 'CANCELLED' ? 'default' : 'blue');

export interface OperationsProps {
	operations: Operation[];
	learnerId: string;
	loading: boolean;
	submitting: boolean;
	commenting: boolean;
	attaching: boolean;
	onSubmit: (operation: Operation, note: string, evidence?: string) => void;
	onComment: (operation: Operation, body: string) => void;
	onAttach: (operation: Operation, file: File) => void;
	onOpenGoal: (operationId: string) => void;
}

export const Operations = ({ operations, learnerId, loading, onOpenGoal }: OperationsProps) => {
	const assigned = operations.filter((operation) => operation.assigneeId === learnerId);
	const open = assigned.filter((operation) => !['COMPLETED', 'CANCELLED'].includes(operation.status));
	const teamGoals = operations.filter((operation) => !['COMPLETED', 'CANCELLED'].includes(operation.status));
	const history = operations.filter((operation) => ['COMPLETED', 'CANCELLED'].includes(operation.status));
	return (
		<>
			<div className="mb-[30px]">
				<Text className="text-xs font-bold uppercase tracking-[.08em] text-[#277f6c]">Team operations</Text>
				<Title className="my-[7px] text-[#173b33]">Team operations</Title>
				<Paragraph className="text-base text-[#687670]">Showcase the team-wide goals your group is driving and the work assigned to you. Submit your part for manager confirmation when it is ready.</Paragraph>
			</div>
			<Alert
				type="info"
				showIcon
				message="Manager confirmation required"
				description="Submitting your work does not mark it complete. A manager must review and confirm it."
				className="mb-[22px]"
			/>
			<Title
				level={3}
				className="mt-0 text-[#173b33]"
			>
				Team goals
			</Title>
			<Row
				gutter={[20, 20]}
				className="mb-[30px]"
			>
				{teamGoals.map((operation) => (
					<Col
						key={`goal-${operation.id}`}
						xs={24}
						md={12}
						xl={8}
					>
						<Card
							loading={loading}
							className="h-full rounded-[18px] border border-[#d9eee4] bg-[#f5fbf8]"
							title={
								<Space>
									<ThunderboltOutlined />
									<Tag color={color(operation.status)}>{operation.status.replaceAll('_', ' ')}</Tag>
								</Space>
							}
						>
							<Title level={4} className="text-[#173b33]">{operation.title}</Title>
							<Text type="secondary">
								{operation.category} · {operation.priority.toLowerCase()}
							</Text>
							<Paragraph className="mt-[14px]">{operation.description}</Paragraph>
							<Space direction="vertical">
								<Text type="secondary">Owner: {operation.assigneeDisplayName}</Text>
								<Text type="secondary">
									<ClockCircleOutlined /> {operation.dueAt ? `Due ${new Date(operation.dueAt).toLocaleDateString()}` : 'No due date'}
								</Text>
								<Button
									type="link"
									className="p-0 text-[#176c5b]"
									onClick={() => onOpenGoal(operation.id)}
								>
									Open team goal <ThunderboltOutlined />
								</Button>
							</Space>
						</Card>
					</Col>
				))}
			</Row>
			<Title
				level={3}
				className="mt-0 text-[#173b33]"
			>
				Assigned to me
			</Title>
			<Row gutter={[20, 20]}>
				{open.map((operation) => (
					<Col
						key={operation.id}
						xs={24}
						md={12}
						xl={8}
					>
						<Card
							loading={loading}
							className="h-full rounded-[18px] border border-[#d9eee4] bg-[#f5fbf8]"
							title={
								<Space>
									<ThunderboltOutlined />
									<Tag color={color(operation.status)}>{operation.status.replaceAll('_', ' ')}</Tag>
								</Space>
							}
						>
							<Title level={4} className="text-[#173b33]">{operation.title}</Title>
							<Text type="secondary">
								Team goal · {operation.category} · {operation.priority.toLowerCase()}
							</Text>
							<Paragraph className="mt-[14px]">{operation.description}</Paragraph>
							<Progress
								percent={operation.status === 'SUBMITTED' ? 100 : operation.status === 'IN_PROGRESS' ? 50 : 0}
								steps={2}
								showInfo={false}
								strokeColor="#277c69"
							/>
							<Space
								direction="vertical"
								className="mt-[14px] w-full"
							>
								<Text type="secondary">
									<ClockCircleOutlined /> {operation.dueAt ? `Due ${new Date(operation.dueAt).toLocaleDateString()}` : 'No due date'}
								</Text>
								<Text type="secondary">Assigned by {operation.createdBy}</Text>
								<Button
									type="link"
									className="p-0 text-[#176c5b]"
									onClick={() => onOpenGoal(operation.id)}
								>
									Open team goal
								</Button>
								{operation.status === 'SUBMITTED' ? (
									<Alert
										type="success"
										message="Awaiting manager confirmation"
									/>
								) : (
									<Button
										type="primary"
										block
										onClick={() => onOpenGoal(operation.id)}
									>
										Open goal
									</Button>
								)}
							</Space>
						</Card>
					</Col>
				))}
			</Row>
			{history.length > 0 && (
				<Card
					title="Team operations history"
					className="mt-7"
				>
					{history.map((operation) => (
						<div
							key={operation.id}
							className="flex justify-between border-b border-[#edf0ee] py-[14px]"
						>
							<Space>
								<CheckCircleOutlined className={operation.status === 'COMPLETED' ? 'text-[#277f6c]' : 'text-[#9aa7a2]'} />
								<span>{operation.title}</span>
							</Space>
							<Tag color={color(operation.status)}>{operation.status}</Tag>
						</div>
					))}
				</Card>
			)}
			{!loading && operations.length === 0 && (
				<Card>
					<Text type="secondary">No team operations are currently assigned to you.</Text>
				</Card>
			)}
		</>
	);
};

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Tag, Typography } from 'antd';
import type { StaffTeamOperationsContainerTeamOperationsQuery } from '../../generated.tsx';
import { OperationThread } from './operation-thread.tsx';
import styles from './team-goal-detail.module.css';

const { Title, Paragraph, Text } = Typography;
type Operation = StaffTeamOperationsContainerTeamOperationsQuery['teamOperations'][number];
const statusColor = (status: string) => (status === 'COMPLETED' ? 'green' : status === 'SUBMITTED' ? 'gold' : status === 'CANCELLED' ? 'default' : status === 'IN_PROGRESS' ? 'blue' : 'purple');

export interface StaffTeamGoalDetailProps {
	operation: Operation;
	commenting: boolean;
	attaching: boolean;
	onComment: (operation: Operation, body: string) => void;
	onAttach: (operation: Operation, file: File) => void;
	onBack: () => void;
}

export const StaffTeamGoalDetail = ({ operation, commenting, attaching, onComment, onAttach, onBack }: StaffTeamGoalDetailProps) => (
	<>
		<Button
			type="text"
			icon={<ArrowLeftOutlined />}
			onClick={onBack}
			className="mb-[18px] pl-0 text-[#6d4aff]"
		>
			Back to team operations
		</Button>
		<Card
		className={styles['hero']}
			styles={{ body: { padding: 0 } }}
		>
			<div className={styles['hero-body']}>
				<Space wrap>
					<Tag
						bordered={false}
						color={statusColor(operation.status)}
					>
						{operation.status.replaceAll('_', ' ')}
					</Tag>
					<Tag bordered={false}>{operation.category}</Tag>
					<Text className={styles['hero-meta']}>
						{operation.priority.toLowerCase()}
						{operation.dueAt ? ` · Due ${new Date(operation.dueAt).toLocaleDateString()}` : ''}
					</Text>
				</Space>
				<Title className={styles['title']}>{operation.title}</Title>
				<Paragraph className={styles['description']}>{operation.description}</Paragraph>
			</div>
		</Card>
		<Card className={styles['details']}>
			<Text type="secondary">
				Owner: {operation.assigneeDisplayName} · Created by {operation.createdBy}
			</Text>
			{operation.completionNote && (
				<Alert
					type="success"
					showIcon
					message="Submitted completion note"
					description={operation.completionNote}
					className="mt-[18px]"
				/>
			)}
			{operation.completionEvidence && (
				<a
					href={operation.completionEvidence}
					target="_blank"
					rel="noreferrer"
				className={styles['evidence']}
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

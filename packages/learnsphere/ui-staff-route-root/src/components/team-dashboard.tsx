import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Select, Space, Statistic, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { AssignmentDetailTable } from './team-dashboard/assignment-detail-table.tsx';
import { AssignmentModal } from './team-dashboard/assignment-modal.tsx';
import { LearnerProgressTable } from './team-dashboard/learner-progress-table.tsx';
import type { AssignmentValues, CourseView, LearnerRow, RecordView, TeamMemberView } from './team-dashboard/types.ts';

const { Title, Paragraph, Text } = Typography;

export interface TeamDashboardProps {
	records: RecordView[];
	teamMembers: TeamMemberView[];
	courses: CourseView[];
	loading: boolean;
	error?: string;
	assignmentLoading: boolean;
	onAssign: (values: AssignmentValues, learner: LearnerRow) => Promise<void>;
	onUnassign: (id: string) => Promise<void>;
}

export const TeamDashboard = ({ records, teamMembers, courses, loading, error, assignmentLoading, onAssign, onUnassign }: TeamDashboardProps) => {
	const teams = [...new Set([...records.map((record) => record.teamName), ...teamMembers.map((member) => member.teamName)])].sort();
	const [teamName, setTeamName] = useState<string>();
	const [assignmentOpen, setAssignmentOpen] = useState(false);
	const learners = useMemo(() => {
		const grouped = new Map<string, RecordView[]>();
		for (const record of records) grouped.set(record.learnerId, [...(grouped.get(record.learnerId) ?? []), record]);
		for (const member of teamMembers) if (!grouped.has(member.learnerId)) grouped.set(member.learnerId, []);
		return [...grouped.entries()].map(([learnerId, learnerRecords]): LearnerRow => {
			const first = learnerRecords[0];
			const member = teamMembers.find((candidate) => candidate.learnerId === learnerId);
			const resolvedTeam = first?.teamName ?? member?.teamName ?? 'Unassigned';
			return {
				key: learnerId,
				learnerId,
				name: first?.learnerDisplayName ?? member?.displayName ?? learnerId,
				email: first?.learnerEmail ?? member?.email ?? '',
				teamName: resolvedTeam,
				assignments: learnerRecords.length,
				completed: learnerRecords.filter((record) => record.status === 'COMPLETED').length,
				overdue: learnerRecords.filter((record) => record.isOverdue).length,
				averageProgress: learnerRecords.length ? Math.round(learnerRecords.reduce((sum, record) => sum + record.progressPercent, 0) / learnerRecords.length) : 0,
				learningMinutes: learnerRecords.flatMap((record) => record.activityProgress).reduce((sum, activity) => sum + activity.timeSpentMinutes, 0),
			};
		});
	}, [records, teamMembers]);
	const filteredRecords = teamName ? records.filter((record) => record.teamName === teamName) : records;
	const completed = filteredRecords.filter((record) => record.status === 'COMPLETED').length;
	const overdue = filteredRecords.filter((record) => record.isOverdue).length;
	const completionRate = filteredRecords.length ? Math.round((completed / filteredRecords.length) * 100) : 0;
	return (
		<>
			<div className="mb-7 flex items-end justify-between gap-5">
				<div>
					<Text className="text-xs font-bold uppercase tracking-[.08em] text-[#6d4aff]">People and progress</Text>
					<Title className="my-[6px]">Team learning overview</Title>
					<Paragraph
						className="m-0"
						type="secondary"
					>
						Monitor assigned learning, completion, effort, and overdue work across your organization.
					</Paragraph>
				</div>
				<Space>
					<Select
						allowClear
						placeholder="All teams"
						value={teamName}
						onChange={setTeamName}
						options={teams.map((team) => ({ value: team }))}
						className="w-[190px]"
					/>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setAssignmentOpen(true)}
					>
						Assign training
					</Button>
				</Space>
			</div>
			{error && (
				<Alert
					type="error"
					showIcon
					message="Team progress could not be loaded"
					description={error}
					className="mb-5"
				/>
			)}
			<Row
				gutter={[18, 18]}
				className="mb-[26px]"
			>
				<Col
					xs={24}
					sm={12}
					xl={6}
				>
					<Card loading={loading}>
						<Statistic
							title="Active learners"
							value={learners.length}
							prefix={<TeamOutlined />}
						/>
					</Card>
				</Col>
				<Col
					xs={24}
					sm={12}
					xl={6}
				>
					<Card loading={loading}>
						<Statistic
							title="Assignments"
							value={filteredRecords.length}
							prefix={<BookOutlined />}
						/>
					</Card>
				</Col>
				<Col
					xs={24}
					sm={12}
					xl={6}
				>
					<Card loading={loading}>
						<Statistic
							title="Completion rate"
							value={completionRate}
							suffix="%"
							prefix={<CheckCircleOutlined />}
						/>
					</Card>
				</Col>
				<Col
					xs={24}
					sm={12}
					xl={6}
				>
					<Card loading={loading}>
						<Statistic
							title="Overdue"
							value={overdue}
							valueStyle={{ color: overdue ? '#c43d4b' : undefined }}
							prefix={<ClockCircleOutlined />}
						/>
					</Card>
				</Col>
			</Row>
			<LearnerProgressTable
				learners={learners.filter((learner) => !teamName || learner.teamName === teamName)}
				loading={loading}
			/>
			<AssignmentDetailTable
				records={filteredRecords}
				loading={loading}
				onUnassign={onUnassign}
			/>
			<AssignmentModal
				open={assignmentOpen}
				learners={learners}
				courses={courses}
				loading={assignmentLoading}
				onClose={() => setAssignmentOpen(false)}
				onSubmit={async (values, learner) => {
					await onAssign(values, learner);
					setAssignmentOpen(false);
				}}
			/>
		</>
	);
};

import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Col, DatePicker, Form, Modal, Progress, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import * as React from 'react';
import type { EnrollmentSource, StaffTeamOverviewQuery } from '../generated.tsx';

const { Title, Paragraph, Text } = Typography;
type RecordView = StaffTeamOverviewQuery['teamLearning'][number];
type CourseView = StaffTeamOverviewQuery['courses'][number];
interface LearnerRow {
	key: string;
	learnerId: string;
	name: string;
	email: string;
	teamName: string;
	assignments: number;
	completed: number;
	overdue: number;
	averageProgress: number;
	learningMinutes: number;
}
interface AssignmentValues {
	learnerId: string;
	courseId: string;
	dueAt?: { toISOString(): string };
	source: EnrollmentSource;
}

export interface TeamDashboardProps {
	records: RecordView[];
	courses: CourseView[];
	loading: boolean;
	error?: string;
	assignmentLoading: boolean;
	onAssign: (values: AssignmentValues, learner: LearnerRow) => void;
}

export const TeamDashboard = ({ records, courses, loading, error, assignmentLoading, onAssign }: TeamDashboardProps) => {
	const [form] = Form.useForm<AssignmentValues>();
	const teams = [...new Set(records.map((record) => record.teamName))].sort();
	const [teamName, setTeamName] = React.useState<string>();
	const [assignmentOpen, setAssignmentOpen] = React.useState(false);
	const learners = React.useMemo(() => {
		const grouped = new Map<string, RecordView[]>();
		for (const record of records) grouped.set(record.learnerId, [...(grouped.get(record.learnerId) ?? []), record]);
		return [...grouped.entries()].map(([learnerId, learnerRecords]): LearnerRow => {
			const first = learnerRecords[0];
			if (!first) throw new Error(`Learner ${learnerId} has no records`);
			return {
				key: learnerId,
				learnerId,
				name: first.learnerDisplayName,
				email: first.learnerEmail,
				teamName: first.teamName,
				assignments: learnerRecords.length,
				completed: learnerRecords.filter((record) => record.status === 'COMPLETED').length,
				overdue: learnerRecords.filter((record) => record.isOverdue).length,
				averageProgress: Math.round(learnerRecords.reduce((sum, record) => sum + record.progressPercent, 0) / learnerRecords.length),
				learningMinutes: learnerRecords.flatMap((record) => record.activityProgress).reduce((sum, activity) => sum + activity.timeSpentMinutes, 0),
			};
		});
	}, [records]);
	const filteredRecords = teamName ? records.filter((record) => record.teamName === teamName) : records;
	const completed = filteredRecords.filter((record) => record.status === 'COMPLETED').length;
	const overdue = filteredRecords.filter((record) => record.isOverdue).length;
	const completionRate = filteredRecords.length ? Math.round((completed / filteredRecords.length) * 100) : 0;
	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 28 }}>
				<div>
					<Text style={{ color: '#6d4aff', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 12 }}>People and progress</Text>
					<Title style={{ margin: '6px 0' }}>Team learning overview</Title>
					<Paragraph
						type="secondary"
						style={{ margin: 0 }}
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
						style={{ width: 190 }}
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
					style={{ marginBottom: 20 }}
				/>
			)}
			<Row
				gutter={[18, 18]}
				style={{ marginBottom: 26 }}
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
			<Card
				title="Learner progress"
				style={{ marginBottom: 24 }}
			>
				<Table<LearnerRow>
					loading={loading}
					rowKey="key"
					dataSource={learners.filter((learner) => !teamName || learner.teamName === teamName)}
					pagination={false}
					columns={[
						{
							title: 'Learner',
							render: (_, row) => (
								<Space>
									<Avatar style={{ background: '#ddd6ff', color: '#432a9b' }}>
										{row.name
											.split(' ')
											.map((part) => part[0])
											.join('')
											.slice(0, 2)}
									</Avatar>
									<div>
										<div style={{ fontWeight: 650 }}>{row.name}</div>
										<Text
											type="secondary"
											style={{ fontSize: 12 }}
										>
											{row.email}
										</Text>
									</div>
								</Space>
							),
						},
						{ title: 'Team', dataIndex: 'teamName' },
						{ title: 'Assigned', dataIndex: 'assignments', align: 'center' },
						{ title: 'Completed', render: (_, row) => `${row.completed}/${row.assignments}`, align: 'center' },
						{
							title: 'Average progress',
							render: (_, row) => (
								<div style={{ minWidth: 150 }}>
									<Progress
										percent={row.averageProgress}
										size="small"
									/>
								</div>
							),
						},
						{ title: 'Tracked time', render: (_, row) => `${(row.learningMinutes / 60).toFixed(1)} hrs` },
						{ title: 'Risk', render: (_, row) => (row.overdue ? <Tag color="red">{row.overdue} overdue</Tag> : <Tag color="green">On track</Tag>) },
					]}
				/>
			</Card>
			<Card title="Assignment detail">
				<Table<RecordView>
					loading={loading}
					rowKey="id"
					dataSource={filteredRecords}
					pagination={{ pageSize: 8 }}
					columns={[
						{ title: 'Learner', dataIndex: 'learnerDisplayName' },
						{
							title: 'Course',
							render: (_, row) => (
								<div>
									<div>{row.courseTitle}</div>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{row.courseCategory}
									</Text>
								</div>
							),
						},
						{ title: 'Source', render: (_, row) => row.source.replaceAll('_', ' ').toLowerCase() },
						{ title: 'Due', render: (_, row) => (row.dueAt ? new Date(row.dueAt).toLocaleDateString() : 'Self-paced') },
						{ title: 'Status', render: (_, row) => <Tag color={row.status === 'COMPLETED' ? 'green' : row.isOverdue ? 'red' : 'blue'}>{row.isOverdue ? 'OVERDUE' : row.status.replaceAll('_', ' ')}</Tag> },
						{ title: 'Progress', render: (_, row) => `${row.progressPercent}%` },
					]}
				/>
			</Card>
			<Modal
				title="Assign training"
				open={assignmentOpen}
				onCancel={() => setAssignmentOpen(false)}
				onOk={() => form.submit()}
				confirmLoading={assignmentLoading}
				okText="Create assignment"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={(values) => {
						const learner = learners.find((candidate) => candidate.learnerId === values.learnerId);
						if (learner) {
							onAssign(values, learner);
							setAssignmentOpen(false);
							form.resetFields();
						}
					}}
					initialValues={{ source: 'MANAGER_ASSIGNED' }}
				>
					<Form.Item
						name="learnerId"
						label="Learner"
						rules={[{ required: true }]}
					>
						<Select
							showSearch
							optionFilterProp="label"
							options={learners.map((learner) => ({ value: learner.learnerId, label: `${learner.name} · ${learner.teamName}` }))}
						/>
					</Form.Item>
					<Form.Item
						name="courseId"
						label="Published training"
						rules={[{ required: true }]}
					>
						<Select
							showSearch
							optionFilterProp="label"
							options={courses.map((course) => ({ value: course.id, label: `${course.title} · ${course.lessonCount} activities` }))}
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
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

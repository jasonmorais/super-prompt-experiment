import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Statistic, Typography } from 'antd';
import { useState } from 'react';
import { CourseAssignmentModal } from './course-management/course-assignment-modal.tsx';
import { CourseTable } from './course-management/course-table.tsx';
import type { Assignment, AssignmentValues, Course, Person } from './course-management/types.ts';

const { Title, Paragraph, Text } = Typography;

export interface CourseManagementProps {
	courses: Course[];
	loading: boolean;
	error?: string;
	submitting: boolean;
	publishing: boolean;
	deleting: boolean;
	assigning: boolean;
	unassigning: boolean;
	canDelete: boolean;
	canPublish: boolean;
	people: Person[];
	assignments: Assignment[];
	onCreate: () => void;
	onEdit: (course: Course) => void;
	onDelete: (course: Course) => void;
	onAssign: (course: Course, values: AssignmentValues) => void;
	onUnassign: (assignmentId: string) => void;
	onTransition: (course: Course) => void;
}

export const CourseManagement = ({
	courses,
	loading,
	error,
	submitting,
	publishing,
	deleting,
	assigning,
	unassigning,
	canDelete,
	canPublish,
	people,
	assignments,
	onCreate,
	onEdit,
	onDelete,
	onAssign,
	onUnassign,
	onTransition,
}: CourseManagementProps) => {
	const [assigningCourse, setAssigningCourse] = useState<Course>();
	return (
		<>
			<div className="mb-7 flex items-end justify-between gap-5">
				<div>
					<Text className="text-xs font-bold uppercase tracking-[.08em] text-[#6d4aff]">Learning catalogue</Text>
					<Title className="my-[6px]">Course management</Title>
					<Paragraph
						className="m-0"
						type="secondary"
					>
						Create training, add structured activity content, and control when it becomes available to learners.
					</Paragraph>
				</div>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					size="large"
					onClick={onCreate}
				>
					Create course
				</Button>
			</div>
			{error && (
				<Alert
					type="error"
					showIcon
					message="Course management data could not be loaded"
					description={error}
					className="mb-5"
				/>
			)}
			<Row
				gutter={[18, 18]}
				className="mb-6"
			>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="All courses"
							value={courses.length}
						/>
					</Card>
				</Col>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="Drafts"
							value={courses.filter((course) => course.status === 'DRAFT').length}
						/>
					</Card>
				</Col>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="In review"
							value={courses.filter((course) => course.status === 'IN_REVIEW').length}
						/>
					</Card>
				</Col>
				<Col
					xs={12}
					lg={6}
				>
					<Card>
						<Statistic
							title="Published"
							value={courses.filter((course) => course.status === 'PUBLISHED').length}
							prefix={<CheckCircleOutlined />}
						/>
					</Card>
				</Col>
			</Row>
			<CourseTable
				courses={courses}
				assignments={assignments}
				loading={loading}
				unassigning={unassigning}
				deleting={deleting}
				submitting={submitting}
				publishing={publishing}
				canDelete={canDelete}
				canPublish={canPublish}
				onUnassign={onUnassign}
				onEdit={onEdit}
				onAssign={setAssigningCourse}
				onDelete={onDelete}
				onTransition={onTransition}
			/>
			<CourseAssignmentModal
				course={assigningCourse}
				people={people}
				loading={assigning}
				onClose={() => setAssigningCourse(undefined)}
				onSubmit={(values) => {
					if (assigningCourse) onAssign(assigningCourse, values);
					setAssigningCourse(undefined);
				}}
			/>
		</>
	);
};

import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Statistic, Typography } from 'antd';
import { useState } from 'react';
import { CourseAssignmentModal } from './course-management/course-assignment-modal.tsx';
import { CourseContentModal } from './course-management/course-content-modal.tsx';
import { CourseEditorModal } from './course-management/course-editor-modal.tsx';
import { CourseTable } from './course-management/course-table.tsx';
import type { Assignment, AssignmentValues, Course, CourseValues, ModuleValues, Person } from './course-management/types.ts';

const { Title, Paragraph, Text } = Typography;

export interface CourseManagementProps {
	courses: Course[];
	loading: boolean;
	error?: string;
	creating: boolean;
	adding: boolean;
	submitting: boolean;
	publishing: boolean;
	updating: boolean;
	deleting: boolean;
	assigning: boolean;
	unassigning: boolean;
	canDelete: boolean;
	canPublish: boolean;
	people: Person[];
	assignments: Assignment[];
	onCreate: (values: CourseValues) => void;
	onEdit: (course: Course, values: CourseValues) => void;
	onDelete: (course: Course) => void;
	onAssign: (course: Course, values: AssignmentValues) => void;
	onUnassign: (assignmentId: string) => void;
	onAddContent: (course: Course, values: ModuleValues) => void;
	onTransition: (course: Course) => void;
}

export const CourseManagement = ({
	courses,
	loading,
	error,
	creating,
	adding,
	submitting,
	publishing,
	updating,
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
	onAddContent,
	onTransition,
}: CourseManagementProps) => {
	const [createOpen, setCreateOpen] = useState(false);
	const [editingCourse, setEditingCourse] = useState<Course>();
	const [contentCourse, setContentCourse] = useState<Course>();
	const [assigningCourse, setAssigningCourse] = useState<Course>();
	const closeEditor = () => {
		setCreateOpen(false);
		setEditingCourse(undefined);
	};
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
					onClick={() => setCreateOpen(true)}
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
				onEdit={setEditingCourse}
				onAddContent={setContentCourse}
				onAssign={setAssigningCourse}
				onDelete={onDelete}
				onTransition={onTransition}
			/>
			<CourseEditorModal
				open={createOpen || Boolean(editingCourse)}
				course={editingCourse}
				loading={editingCourse ? updating : creating}
				onClose={closeEditor}
				onSubmit={(values) => {
					if (editingCourse) onEdit(editingCourse, values);
					else onCreate(values);
					closeEditor();
				}}
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
			<CourseContentModal
				course={contentCourse}
				loading={adding}
				onClose={() => setContentCourse(undefined)}
				onSubmit={(values) => {
					if (contentCourse) onAddContent(contentCourse, values);
					setContentCourse(undefined);
				}}
			/>
		</>
	);
};

import { GlobalOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Table, Tag, Typography } from 'antd';
import type { StaffCourseManagementContainerCourseManagementQuery } from '../../generated.tsx';
import { CourseActions } from './course-actions.tsx';

const { Paragraph, Text } = Typography;
type Course = StaffCourseManagementContainerCourseManagementQuery['courses'][number];
type Assignment = StaffCourseManagementContainerCourseManagementQuery['teamLearning'][number];

export interface CourseTableProps {
	courses: Course[];
	assignments: Assignment[];
	loading: boolean;
	unassigning: boolean;
	deleting: boolean;
	submitting: boolean;
	publishing: boolean;
	canDelete: boolean;
	canPublish: boolean;
	onUnassign: (assignmentId: string) => void;
	onEdit: (course: Course) => void;
	onAssign: (course: Course) => void;
	onDelete: (course: Course) => void;
	onTransition: (course: Course) => void;
}

const statusColor = (status: string) => (status === 'PUBLISHED' ? 'green' : status === 'IN_REVIEW' ? 'gold' : status === 'ARCHIVED' ? 'default' : 'blue');

export const CourseTable = ({ courses, assignments, loading, unassigning, deleting, submitting, publishing, canDelete, canPublish, onUnassign, onEdit, onAssign, onDelete, onTransition }: CourseTableProps) => (
	<Card>
		<Table<Course>
			loading={loading}
			rowKey="id"
			dataSource={courses}
			expandable={{
				expandedRowRender: (course) =>
					course.modules.length ? (
						<Space
							direction="vertical"
							className="w-full"
						>
							{course.modules.map((module) => (
								<Card
									size="small"
									key={module.key}
									title={`${module.order}. ${module.title}`}
								>
									<Paragraph type="secondary">{module.description}</Paragraph>
									{module.lessons.map((lesson) => (
										<div
											key={lesson.key}
											className="border-t border-[#edf0f4] py-2.5"
										>
											<Space>
												<Tag>{lesson.type}</Tag>
												<Text strong>{lesson.title}</Text>
												<Text type="secondary">{lesson.estimatedMinutes} min</Text>
											</Space>
											<Paragraph
												ellipsis={{ rows: 2 }}
												className="mt-2 mb-0"
											>
												{lesson.content}
											</Paragraph>
										</div>
									))}
								</Card>
							))}
						</Space>
					) : (
						<Alert
							type="info"
							message="No course content yet"
							description="Add a module and activity before submitting this draft for review."
						/>
					),
			}}
			columns={[
				{
					title: 'Course',
					render: (_, course) => (
						<div>
							<div className="font-bold">{course.title}</div>
							<Space
								size={6}
								wrap
								className="mt-[5px]"
							>
								<Text type="secondary">
									{course.category} · {course.level.toLowerCase()}
								</Text>
								<Tag
									bordered={false}
									color={course.discoverability === 'ASSIGNED_ONLY' ? 'purple' : 'green'}
									icon={course.discoverability === 'ASSIGNED_ONLY' ? <LockOutlined /> : <GlobalOutlined />}
								>
									{course.discoverability === 'ASSIGNED_ONLY' ? 'Private · assigned only' : 'Organization catalog'}
								</Tag>
							</Space>
						</div>
					),
				},
				{
					title: 'Tags',
					render: (_, course) => (
						<Space
							size={[8, 8]}
							wrap
						>
							{course.tags.map((tag) => (
								<Tag key={tag}>{tag}</Tag>
							))}
							{course.tags.length === 0 && <Text type="secondary">None</Text>}
						</Space>
					),
				},
				{ title: 'Status', render: (_, course) => <Tag color={statusColor(course.status)}>{course.status.replaceAll('_', ' ')}</Tag> },
				{ title: 'Content', render: (_, course) => `${course.lessonCount} activities · ${course.estimatedMinutes} min` },
				{
					title: 'Assigned learners',
					render: (_, course) => {
						const courseAssignments = assignments.filter((assignment) => assignment.courseId === course.id);
						return courseAssignments.length ? (
							<Space
								direction="vertical"
								size={4}
							>
								{courseAssignments.map((assignment) => (
									<Space
										key={assignment.id}
										size={6}
									>
										{assignment.isOverdue && <Tag color="red">Late</Tag>}
										<Tag
											bordered={false}
											color="blue"
										>
											{assignment.learnerDisplayName}
										</Tag>
										{assignment.status !== 'COMPLETED' && (
											<Button
												type="link"
												danger
												size="small"
												loading={unassigning}
												onClick={() => onUnassign(assignment.id)}
											>
												Unassign
											</Button>
										)}
									</Space>
								))}
							</Space>
						) : (
							<Text type="secondary">Not assigned</Text>
						);
					},
				},
				{ title: 'Updated', render: (_, course) => new Date(course.updatedAt).toLocaleDateString() },
				{
					title: 'Actions',
					width: 330,
					render: (_, course) => (
						<CourseActions
							course={course}
							deleting={deleting}
							submitting={submitting}
							publishing={publishing}
							canDelete={canDelete}
							canPublish={canPublish}
							onEdit={() => onEdit(course)}
							onAssign={() => onAssign(course)}
							onDelete={() => onDelete(course)}
							onTransition={() => onTransition(course)}
						/>
					),
				},
			]}
		/>
	</Card>
);

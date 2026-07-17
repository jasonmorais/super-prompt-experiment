import { DeleteOutlined, EditOutlined, RocketOutlined, SendOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import type { StaffCourseManagementContainerCourseManagementQuery } from '../../generated.tsx';
import styles from './course-actions.module.css';

type Course = StaffCourseManagementContainerCourseManagementQuery['courses'][number];

export interface CourseActionsProps {
	course: Course;
	deleting: boolean;
	submitting: boolean;
	publishing: boolean;
	canDelete: boolean;
	canPublish: boolean;
	onEdit: () => void;
	onAssign: () => void;
	onDelete: () => void;
	onTransition: () => void;
}

export const CourseActions = ({ course, deleting, submitting, publishing, canDelete, canPublish, onEdit, onAssign, onDelete, onTransition }: CourseActionsProps) => (
	<Space className={styles['actions']}>
		{course.status !== 'ARCHIVED' && (
			<Button
				className={styles['secondary']}
				icon={<EditOutlined />}
				onClick={onEdit}
			>
				Edit course
			</Button>
		)}
		{course.status === 'PUBLISHED' && canPublish && (
			<Button
				type="primary"
				className={styles['primary']}
				icon={<UserAddOutlined />}
				onClick={onAssign}
			>
				Assign
			</Button>
		)}
		{course.status !== 'ARCHIVED' && canDelete && (
			<Button
				danger
				className={styles['danger']}
				icon={<DeleteOutlined />}
				loading={deleting}
				onClick={() =>
					Modal.confirm({
						title: `Delete ${course.title}?`,
						content: 'This permanently removes the course and its content. Existing learner records remain available to staff.',
						okText: 'Delete course',
						okButtonProps: { danger: true },
						onOk: onDelete,
					})
				}
			>
				Delete
			</Button>
		)}
		{course.status === 'DRAFT' && (
			<Button
				icon={<SendOutlined />}
				disabled={course.lessonCount === 0}
				loading={submitting}
				onClick={onTransition}
			>
				Submit for review
			</Button>
		)}
		{course.status === 'IN_REVIEW' && canPublish && (
			<Button
				type="primary"
				icon={<RocketOutlined />}
				loading={publishing}
				onClick={onTransition}
			>
				Publish
			</Button>
		)}
	</Space>
);

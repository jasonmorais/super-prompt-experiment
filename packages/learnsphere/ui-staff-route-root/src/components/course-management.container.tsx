import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import {
	type CourseLevel,
	type LessonType,
	StaffAddCourseModuleDocument,
	StaffCourseManagementDocument,
	type StaffCourseManagementQuery,
	StaffCreateCourseDocument,
	StaffPublishCourseDocument,
	StaffSubmitCourseDocument,
} from '../generated.tsx';
import { CourseManagement } from './course-management.tsx';

type Course = StaffCourseManagementQuery['courses'][number];
type CourseValues = { title: string; summary: string; description: string; category: string; level: CourseLevel; tags?: string[]; skills?: string[] };
type ModuleValues = { moduleTitle: string; moduleDescription: string; lessonTitle: string; lessonType: LessonType; lessonContent: string; estimatedMinutes: number; required: boolean };
const slug = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
		.slice(0, 70);

export const CourseManagementContainer = () => {
	const auth = useAuth();
	const organizationId = readLearnSphereIdentity(auth.user?.profile).organizationId;
	const { data, loading, error, refetch } = useQuery<StaffCourseManagementQuery>(StaffCourseManagementDocument, { variables: { organizationId }, skip: !organizationId });
	const [createCourse, creating] = useMutation(StaffCreateCourseDocument);
	const [addModule, adding] = useMutation(StaffAddCourseModuleDocument);
	const [submitCourse, submitting] = useMutation(StaffSubmitCourseDocument);
	const [publishCourse, publishing] = useMutation(StaffPublishCourseDocument);
	const create = async (values: CourseValues) => {
		const result = await createCourse({ variables: { input: { organizationId, ...values, tags: values.tags ?? [], skills: values.skills ?? [] } } });
		const status = result.data?.courseCreate.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'Course could not be created');
			return;
		}
		message.success('Draft course created.');
		await refetch();
	};
	const addContent = async (course: Course, values: ModuleValues) => {
		const moduleKey = slug(values.moduleTitle);
		const result = await addModule({
			variables: {
				input: {
					courseId: course.id,
					module: {
						key: moduleKey,
						title: values.moduleTitle,
						description: values.moduleDescription,
						lessons: [{ key: `${moduleKey}-${slug(values.lessonTitle)}`, title: values.lessonTitle, type: values.lessonType, content: values.lessonContent, estimatedMinutes: values.estimatedMinutes, required: values.required }],
					},
				},
			},
		});
		const status = result.data?.courseAddModule.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'Course content could not be added');
			return;
		}
		message.success('Module and learning activity added');
		await refetch();
	};
	const transition = async (course: Course) => {
		if (course.status === 'DRAFT') {
			const result = await submitCourse({ variables: { id: course.id } });
			const status = result.data?.courseSubmitForReview.status;
			if (!status?.success) {
				message.error(status?.errorMessage ?? 'Course status could not be changed');
				return;
			}
		} else {
			const result = await publishCourse({ variables: { id: course.id } });
			const status = result.data?.coursePublish.status;
			if (!status?.success) {
				message.error(status?.errorMessage ?? 'Course status could not be changed');
				return;
			}
		}
		message.success(course.status === 'DRAFT' ? 'Course submitted for review' : 'Course published to the learner catalog');
		await refetch();
	};
	const management = (
		<CourseManagement
			courses={data?.courses ?? []}
			loading={false}
			creating={creating.loading}
			adding={adding.loading}
			submitting={submitting.loading}
			publishing={publishing.loading}
			onCreate={(values) => void create(values)}
			onAddContent={(course, values) => void addContent(course, values)}
			onTransition={(course) => void transition(course)}
		/>
	);
	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data}
			hasDataComponent={management}
			noDataComponent={management}
			errorComponent={
				<Alert
					type="error"
					showIcon
					message="Course management data could not be loaded"
					description={error?.message}
				/>
			}
		/>
	);
};

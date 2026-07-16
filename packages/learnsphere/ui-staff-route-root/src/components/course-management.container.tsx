import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import {
	StaffCourseManagementContainerAddCourseModuleDocument,
	StaffCourseManagementContainerAssignCourseToLearnerDocument,
	StaffCourseManagementContainerCourseManagementDocument,
	type StaffCourseManagementContainerCourseManagementQuery,
	StaffCourseManagementContainerCreateCourseDocument,
	StaffCourseManagementContainerDeleteCourseDocument,
	StaffCourseManagementContainerPublishCourseDocument,
	StaffCourseManagementContainerSubmitCourseDocument,
	StaffCourseManagementContainerUnassignLearningDocument,
	StaffCourseManagementContainerUpdateCourseDocument,
} from '../generated.tsx';
import { CourseManagement } from './course-management.tsx';
import type { AssignmentValues, Course, CourseValues, ModuleValues, Person } from './course-management/types.ts';
import { useStaffAuthorization } from '../staff-authorization.tsx';
const slug = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
		.slice(0, 70);

export const CourseManagementContainer = () => {
	const auth = useAuth();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const capabilities = useStaffAuthorization().capabilities;
	const organizationId = identity.organizationId;
	const { data, loading, error, refetch } = useQuery<StaffCourseManagementContainerCourseManagementQuery>(StaffCourseManagementContainerCourseManagementDocument, { variables: { organizationId }, skip: !organizationId });
	const [createCourse, creating] = useMutation(StaffCourseManagementContainerCreateCourseDocument);
	const [addModule, adding] = useMutation(StaffCourseManagementContainerAddCourseModuleDocument);
	const [submitCourse, submitting] = useMutation(StaffCourseManagementContainerSubmitCourseDocument);
	const [publishCourse, publishing] = useMutation(StaffCourseManagementContainerPublishCourseDocument);
	const [updateCourse, updating] = useMutation(StaffCourseManagementContainerUpdateCourseDocument);
	const [deleteCourse, deleting] = useMutation(StaffCourseManagementContainerDeleteCourseDocument);
	const [assignCourse, assigning] = useMutation(StaffCourseManagementContainerAssignCourseToLearnerDocument);
	const [unassignCourse, unassigning] = useMutation(StaffCourseManagementContainerUnassignLearningDocument);
	const people: Person[] = data?.teams.flatMap((team) => team.members.map((member) => ({ learnerId: member.learnerId, learnerDisplayName: member.displayName, learnerEmail: member.email, teamName: team.name }))) ?? [];
	const assignments = data?.teamLearning.filter((record) => record.source !== 'SELF_ENROLLED') ?? [];
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
	const edit = async (id: string, values: CourseValues) => {
		const result = await updateCourse({
			variables: { input: { id, ...values, tags: values.tags ?? [], skills: values.skills ?? [], discoverability: values.discoverability, requiresCompletionScreenshot: values.requiresCompletionScreenshot } },
		});
		const status = result.data?.courseUpdate.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'Course could not be updated');
			return;
		}
		message.success('Course details updated.');
		await refetch();
	};
	const remove = async (id: string) => {
		const result = await deleteCourse({ variables: { id } });
		const status = result.data?.courseDelete.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'Course could not be deleted');
			return;
		}
		message.success('Course deleted.');
		await refetch();
	};
	const assign = async (course: Course, values: AssignmentValues) => {
		const person = people.find((candidate) => candidate.learnerId === values.learnerId);
		if (!person) return;
		const result = await assignCourse({
			variables: {
				input: {
					organizationId,
					learnerId: person.learnerId,
					learnerDisplayName: person.learnerDisplayName,
					learnerEmail: person.learnerEmail,
					teamName: person.teamName,
					courseId: course.id,
					dueAt: values.dueAt?.toISOString(),
					source: values.source,
				},
			},
		});
		const status = result.data?.assignLearning.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'Course could not be assigned');
			return;
		}
		message.success(`${course.title} assigned to ${person.learnerDisplayName}.`);
		await refetch();
	};
	const unassign = async (id: string) => {
		const result = await unassignCourse({ variables: { id } });
		const status = result.data?.unassignLearning.status;
		if (!status?.success) {
			message.error(status?.errorMessage ?? 'Course assignment could not be removed');
			return;
		}
		message.success('Course assignment removed.');
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
			updating={updating.loading}
			deleting={deleting.loading}
			assigning={assigning.loading}
			unassigning={unassigning.loading}
			canDelete={capabilities.canDeleteCourses}
			canPublish={capabilities.canPublishCourses}
			people={people}
			assignments={assignments}
			onCreate={(values) => void create(values)}
			onEdit={(course, values) => void edit(course.id, values)}
			onDelete={(course) => void remove(course.id)}
			onAssign={(course, values) => void assign(course, values)}
			onUnassign={(id) => void unassign(id)}
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

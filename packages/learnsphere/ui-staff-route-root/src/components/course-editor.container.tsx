import { useMutation, useQuery } from '@apollo/client';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, Spin, message } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffCourseEditorCourseDocument, StaffCourseEditorCreateDocument, StaffCourseEditorReplaceStructureDocument, StaffCourseEditorUpdateDocument } from '../generated.tsx';
import { CourseEditor, type CourseEditorValues } from './course-editor.tsx';

const emptyValues: CourseEditorValues = { title: '', summary: '', description: '', level: 'FOUNDATIONAL', category: '', tags: [], skills: [], discoverability: 'CATALOG', requiresCompletionScreenshot: false, modules: [] };

export const CourseEditorContainer = () => {
	const { courseId } = useParams<{ courseId: string }>();
	const isNew = !courseId;
	const navigate = useNavigate();
	const identity = readLearnSphereIdentity(useAuth().user?.profile);
	const query = useQuery(StaffCourseEditorCourseDocument, { variables: { id: courseId ?? '' }, skip: isNew, fetchPolicy: 'network-only' });
	const [createCourse, createState] = useMutation(StaffCourseEditorCreateDocument);
	const [updateCourse, updateState] = useMutation(StaffCourseEditorUpdateDocument);
	const [replaceStructure, structureState] = useMutation(StaffCourseEditorReplaceStructureDocument);
	const course = query.data?.courseById;
	const save = async (values: CourseEditorValues) => {
		const metadata = { title: values.title, summary: values.summary, description: values.description, level: values.level, category: values.category, tags: values.tags ?? [], skills: values.skills ?? [], discoverability: values.discoverability, requiresCompletionScreenshot: values.requiresCompletionScreenshot };
		let id = courseId;
		if (!id) {
			const created = await createCourse({ variables: { input: { organizationId: identity.organizationId, ...metadata } } });
			if (!created.data?.courseCreate.status.success || !created.data.courseCreate.course?.id) { message.error(created.data?.courseCreate.status.errorMessage ?? 'Course could not be created'); return; }
			id = created.data.courseCreate.course.id;
		} else {
			const updated = await updateCourse({ variables: { input: { id, ...metadata } } });
			if (!updated.data?.courseUpdate.status.success) { message.error(updated.data?.courseUpdate.status.errorMessage ?? 'Course details could not be saved'); return; }
		}
		const structure = await replaceStructure({ variables: { input: { courseId: id, modules: values.modules.map((module) => ({ key: module.key, title: module.title, description: module.description ?? '', lessons: module.lessons.map((lesson) => ({ key: lesson.key, title: lesson.title, type: lesson.type, content: lesson.content, ...(lesson.type === 'VIDEO' && lesson.videoUrl ? { videoUrl: lesson.videoUrl } : {}), estimatedMinutes: lesson.estimatedMinutes, required: lesson.required, ...(lesson.assessmentId ? { assessmentId: lesson.assessmentId } : {}) })) })) } } });
		if (!structure.data?.courseReplaceStructure.status.success) { message.error(structure.data?.courseReplaceStructure.status.errorMessage ?? 'Course structure could not be saved'); if (isNew) navigate(`/staff/courses/${id}/edit`, { replace: true }); return; }
		message.success(isNew ? 'Course draft created. Add assessment steps whenever you need them.' : 'Course details and structure saved.');
		navigate(`/staff/courses/${id}/edit`, { replace: true });
		await query.refetch().catch(() => undefined);
	};
	if (query.loading) return <div className="grid min-h-96 place-items-center"><Spin size="large" /></div>;
	if (query.error) return <Alert type="error" showIcon message="Course could not be loaded" description={query.error.message} />;
	if (!isNew && !course) return <Alert type="warning" showIcon message="Course not found" />;
	const initialValues: CourseEditorValues = course ? {
		title: course.title, summary: course.summary, description: course.description, level: course.level, category: course.category, tags: [...course.tags], skills: [...course.skills], discoverability: course.discoverability, requiresCompletionScreenshot: course.requiresCompletionScreenshot,
		modules: course.modules.map((module) => ({ key: module.key, title: module.title, description: module.description, lessons: module.lessons.map((lesson) => ({ key: lesson.key, title: lesson.title, type: lesson.type, content: lesson.content, ...(lesson.videoUrl ? { videoUrl: lesson.videoUrl } : {}), estimatedMinutes: lesson.estimatedMinutes, required: lesson.required, ...(lesson.assessment ? { assessmentId: lesson.assessment.id, assessmentTitle: lesson.assessment.title } : {}) })) })),
	} : emptyValues;
	return <CourseEditor key={course?.updatedAt ?? 'new'} initialValues={initialValues} isNew={isNew} status={course?.status} loading={createState.loading || updateState.loading || structureState.loading} onSave={(values) => void save(values)} onCancel={() => navigate('/staff/courses')} onAddAssessment={() => courseId && navigate(`/staff/courses/${courseId}/assessments/new`)} onEditAssessment={(assessmentId) => courseId && navigate(`/staff/courses/${courseId}/assessments/${assessmentId}/edit`)} />;
};

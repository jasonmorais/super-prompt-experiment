import { useMutation, useQuery } from '@apollo/client';
import { Alert, Button, Spin, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffAssessmentAuthoringAttachDocument, StaffAssessmentAuthoringContextDocument, StaffAssessmentAuthoringCreateDocument, StaffAssessmentAuthoringPublishDocument, StaffAssessmentAuthoringUpdateDocument, StaffAssessmentCreationContextDocument } from '../generated.tsx';
import { AssessmentAuthoring, type AssessmentAuthoringValues } from './assessment-authoring.tsx';

const emptyValues: AssessmentAuthoringValues = { title: '', description: '', passingScore: 80, maxAttempts: 3, questions: [{ key: 'question-1', prompt: '', type: 'SINGLE_SELECT', points: 1, explanation: '', options: [{ key: 'a', text: '', isCorrect: true }, { key: 'b', text: '', isCorrect: false }] }], moduleKey: undefined, activityKey: '', activityTitle: '', activityContent: 'Complete this assessment to demonstrate your understanding.', estimatedMinutes: 15, required: true };

export const AssessmentAuthoringContainer = () => {
	const { courseId = '', assessmentId } = useParams<{ courseId: string; assessmentId?: string }>();
	const isNew = !assessmentId;
	const navigate = useNavigate();
	const creationQuery = useQuery(StaffAssessmentCreationContextDocument, { variables: { courseId }, skip: !isNew });
	const editQuery = useQuery(StaffAssessmentAuthoringContextDocument, { variables: { courseId, assessmentId: assessmentId ?? '' }, skip: isNew });
	const [createAssessment, createState] = useMutation(StaffAssessmentAuthoringCreateDocument);
	const [updateAssessment, updateState] = useMutation(StaffAssessmentAuthoringUpdateDocument);
	const [publishAssessment, publishState] = useMutation(StaffAssessmentAuthoringPublishDocument);
	const [attachAssessment, attachState] = useMutation(StaffAssessmentAuthoringAttachDocument);
	const course = isNew ? creationQuery.data?.courseById : editQuery.data?.courseById;
	const assessment = editQuery.data?.assessmentForAuthoring;
	const back = () => navigate(`/staff/courses/${courseId}/edit`);
	const save = async (values: AssessmentAuthoringValues) => {
		if (!course) return;
		const questions = values.questions.map((question) => ({ ...question, options: question.options.map((option) => ({ ...option })) }));
		if (!isNew && assessmentId) {
			const result = await updateAssessment({ variables: { input: { id: assessmentId, title: values.title, description: values.description, passingScore: values.passingScore, maxAttempts: values.maxAttempts, questions } } });
			if (!result.data?.assessmentUpdate.status.success) { message.error(result.data?.assessmentUpdate.status.errorMessage ?? 'Assessment could not be saved'); return; }
			message.success('Assessment updated.'); back(); return;
		}
		if (!values.moduleKey || !values.activityKey || !values.activityTitle || !values.activityContent || !values.estimatedMinutes) { message.error('Complete the course activity details'); return; }
		const moduleKey = values.moduleKey;
		const activity = { key: values.activityKey, title: values.activityTitle, type: 'ASSESSMENT' as const, content: values.activityContent, estimatedMinutes: values.estimatedMinutes, required: values.required ?? true };
		const created = await createAssessment({ variables: { input: { organizationId: course.organizationId, title: values.title, description: values.description, passingScore: values.passingScore, maxAttempts: values.maxAttempts, questions } } });
		const id = created.data?.assessmentCreate.assessment?.id;
		if (!created.data?.assessmentCreate.status.success || !id) { message.error(created.data?.assessmentCreate.status.errorMessage ?? 'Assessment could not be created'); return; }
		const published = await publishAssessment({ variables: { id } });
		if (!published.data?.assessmentPublish.status.success) { message.error(published.data?.assessmentPublish.status.errorMessage ?? 'Assessment was created but could not be published'); return; }
		const modules = course.modules.map((module) => ({ key: module.key, title: module.title, description: module.description, lessons: [...module.lessons.map((lesson) => ({ key: lesson.key, title: lesson.title, type: lesson.type, content: lesson.content, estimatedMinutes: lesson.estimatedMinutes, required: lesson.required, ...(lesson.assessment ? { assessmentId: lesson.assessment.id } : {}) })), ...(module.key === moduleKey ? [{ ...activity, assessmentId: id }] : [])] }));
		const attached = await attachAssessment({ variables: { input: { courseId, modules } } });
		if (!attached.data?.courseReplaceStructure.status.success) { message.error(attached.data?.courseReplaceStructure.status.errorMessage ?? 'Assessment was created but could not be attached'); return; }
		message.success('Assessment created, published, and attached to the course.'); back();
	};
	const loading = creationQuery.loading || editQuery.loading;
	const error = creationQuery.error ?? editQuery.error;
	if (loading) return <div className="grid min-h-96 place-items-center"><Spin size="large" /></div>;
	if (error) return <Alert type="error" showIcon message="Assessment editor could not be loaded" description={error.message} />;
	if (!course) return <Alert type="warning" showIcon message="Course not found" />;
	if (!isNew && !assessment) return <Alert type="warning" showIcon message="Assessment not found" />;
	if (isNew && course.modules.length === 0) return <Alert type="info" showIcon message="Add a module first" description="Return to the course editor, add and save a module, then create its assessment step." action={<Button onClick={back}>Return to course</Button>} />;
	const initialValues: AssessmentAuthoringValues = assessment ? { title: assessment.title, description: assessment.description, passingScore: assessment.passingScore, maxAttempts: assessment.maxAttempts, questions: assessment.questions.map((question) => ({ key: question.key, prompt: question.prompt, type: question.type, points: question.points, explanation: question.explanation, options: question.options.map((option) => ({ ...option })) })) } : emptyValues;
	return <AssessmentAuthoring key={assessment?.id ?? 'new'} initialValues={initialValues} courseTitle={course.title} modules={course.modules.map((module) => ({ key: module.key, title: module.title }))} isNew={isNew} status={assessment?.status} loading={createState.loading || updateState.loading || publishState.loading || attachState.loading} onSave={(values) => void save(values)} onCancel={back} />;
};

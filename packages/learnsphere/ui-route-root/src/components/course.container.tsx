import { useMutation, useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Alert, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import { LearnerCourseContainerCompleteActivityDocument, LearnerCourseContainerCourseExperienceDocument, type LearnerCourseContainerCourseExperienceQuery } from '../generated.tsx';
import { Course } from './course.tsx';

export const CourseContainer = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	const { courseId = '', activityKey } = useParams();
	const organizationId = readLearnSphereIdentity(auth.user?.profile).organizationId;
	const { data, loading, error, refetch } = useQuery<LearnerCourseContainerCourseExperienceQuery>(LearnerCourseContainerCourseExperienceDocument, { variables: { courseId, organizationId }, skip: !courseId || !organizationId });
	const [recordActivity, mutation] = useMutation(LearnerCourseContainerCompleteActivityDocument);
	const [completionScreenshot, setCompletionScreenshot] = useState<string>();
	const course = data?.courseById;
	const record = data?.myLearning.find((candidate) => candidate.courseId === courseId);
	const lessons = course?.modules.toSorted((a, b) => a.order - b.order).flatMap((module) => module.lessons) ?? [];
	const completedKeys = new Set(record?.activityProgress.map((progress) => progress.activityKey) ?? []);
	const selectedLesson = lessons.find((lesson) => lesson.key === activityKey) ?? lessons.find((lesson) => !completedKeys.has(lesson.key)) ?? lessons[0];
	const completionScreenshotRequired = Boolean(record?.requiresCompletionScreenshot && selectedLesson?.required && record.requiredActivityKeys.filter((key) => key !== selectedLesson.key).every((key) => completedKeys.has(key)));
	const selectScreenshot = (file: File | undefined) => {
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			message.error('Please choose an image file');
			return;
		}
		if (file.size > 4 * 1024 * 1024) {
			message.error('Screenshots must be smaller than 4 MB');
			return;
		}
		const reader = new FileReader();
		reader.addEventListener('load', () => setCompletionScreenshot(typeof reader.result === 'string' ? reader.result : undefined));
		reader.readAsDataURL(file);
	};

	useEffect(() => {
		if (course && selectedLesson && !activityKey) navigate(`/courses/${course.id}/activities/${selectedLesson.key}`, { replace: true });
	}, [activityKey, course, navigate, selectedLesson]);

	const completeActivity = async () => {
		if (!record || !selectedLesson) return;
		try {
			const result = await recordActivity({ variables: { input: { id: record.id, activityKey: selectedLesson.key, timeSpentMinutes: selectedLesson.estimatedMinutes, ...(completionScreenshot ? { completionScreenshot } : {}) } } });
			if (!result.data?.recordActivity.status.success) {
				message.error(result.data?.recordActivity.status.errorMessage ?? 'Activity progress could not be saved');
				return;
			}
			await refetch();
			const nextLesson = lessons[lessons.findIndex((lesson) => lesson.key === selectedLesson.key) + 1];
			message.success(nextLesson ? 'Activity completed. Your next activity is ready.' : 'Course completed.');
			if (nextLesson) navigate(`/courses/${courseId}/activities/${nextLesson.key}`);
		} catch (error) {
			message.error(error instanceof Error ? error.message : 'Activity progress could not be saved');
		}
	};

	const courseExperience =
		course && record ? (
			<Course
				course={course}
				record={record}
				selectedLesson={selectedLesson}
				completedKeys={completedKeys}
				completionScreenshotRequired={completionScreenshotRequired}
				completionScreenshotSelected={Boolean(completionScreenshot)}
				onSelectScreenshot={(file) => void selectScreenshot(file)}
				mutationLoading={mutation.loading}
				onBack={() => navigate('/dashboard')}
				onSelectLesson={(lessonKey) => navigate(`/courses/${course.id}/activities/${lessonKey}`)}
				onComplete={() => void completeActivity()}
			/>
		) : null;
	const noData = course ? (
		<Alert
			type="warning"
			showIcon
			message="Enrollment required"
			description="Add this published course to My learning before opening its activities."
			action={
				<Button
					type="primary"
					onClick={() => navigate('/catalog')}
				>
					Open catalog
				</Button>
			}
		/>
	) : (
		<Alert
			type="warning"
			showIcon
			message="Course not found"
			action={<Button onClick={() => navigate('/catalog')}>Return to catalog</Button>}
		/>
	);
	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={courseExperience}
			hasDataComponent={courseExperience ?? noData}
			noDataComponent={noData}
			errorComponent={
				<Alert
					type="error"
					showIcon
					message="Course could not be loaded"
					description={error?.message}
				/>
			}
		/>
	);
};

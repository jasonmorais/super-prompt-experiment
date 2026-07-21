import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { mutate } from './mutate.ts';

export interface CourseModuleCommand {
	courseId: string;
	module: Omit<Domain.Contexts.Learning.Course.CourseModule, 'order' | 'lessons'> & { lessons: Array<Omit<Domain.Contexts.Learning.Course.Lesson, 'assessment'> & { assessmentId?: string }> };
}

export const addModule = (dataSources: DataSources) => async (command: CourseModuleCommand) => {
	const lessons: Domain.Contexts.Learning.Course.Lesson[] = [];
	for (const lesson of command.module.lessons) {
		const assessment = lesson.assessmentId ? await dataSources.readonlyDataSource.Learning.Assessment.AssessmentReadRepo.getById(lesson.assessmentId) : undefined;
		if (lesson.assessmentId && !assessment) throw new Error(`Assessment ${lesson.assessmentId} was not found`);
		lessons.push({ key: lesson.key, title: lesson.title, type: lesson.type, content: lesson.content, estimatedMinutes: lesson.estimatedMinutes, required: lesson.required, ...(assessment ? { assessment } : {}) });
	}
	return mutate(dataSources, command.courseId, (course) => course.addModule({ ...command.module, lessons }));
};

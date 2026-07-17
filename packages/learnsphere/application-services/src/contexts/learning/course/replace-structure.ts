import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { mutate } from './mutate.ts';

export interface CourseStructureCommand {
	courseId: string;
	modules: Array<Omit<Domain.Contexts.Learning.Course.CourseModule, 'order' | 'lessons'> & { lessons: Array<Omit<Domain.Contexts.Learning.Course.Lesson, 'assessment'> & { assessmentId?: string }> }>;
}

export const replaceStructure = (dataSources: DataSources) => async (command: CourseStructureCommand) => {
	const modules: Array<Omit<Domain.Contexts.Learning.Course.CourseModule, 'order'>> = [];
	for (const module of command.modules) {
		const lessons: Domain.Contexts.Learning.Course.Lesson[] = [];
		for (const lesson of module.lessons) {
			const assessment = lesson.assessmentId ? await dataSources.readonlyDataSource.Learning.Assessment.AssessmentReadRepo.getById(lesson.assessmentId) : undefined;
			if (lesson.assessmentId && !assessment) throw new Error(`Assessment ${lesson.assessmentId} was not found`);
			lessons.push({ key: lesson.key, title: lesson.title, type: lesson.type, content: lesson.content, estimatedMinutes: lesson.estimatedMinutes, required: lesson.required, ...(assessment ? { assessment } : {}) });
		}
		modules.push({ key: module.key, title: module.title, description: module.description, lessons });
	}
	return mutate(dataSources, command.courseId, (course) => course.replaceStructure(modules));
};

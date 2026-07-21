import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Course, CourseLevel, CourseProps } from './course.ts';

export interface NewCourseInput {
	organizationId: string;
	title: string;
	summary: string;
	description: string;
	level: CourseLevel;
	category: string;
	createdBy: string;
	discoverability: CourseProps['discoverability'];
	requiresCompletionScreenshot: boolean;
}

export interface CourseRepository<Props extends CourseProps = CourseProps> extends Repository<Course<Props>> {
	getNewInstance(input: NewCourseInput): Promise<Course<Props>>;
}

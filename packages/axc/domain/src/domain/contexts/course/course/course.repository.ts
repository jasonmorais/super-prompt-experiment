import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Course, CourseModality, CourseProps } from './course.ts';

/**
 * Write-side repository for the Course aggregate. Mirrors
 * `community.repository.ts`: extends the domain-seedwork `Repository` (get/save)
 * and adds a factory for new instances.
 */
export interface CourseRepository<props extends CourseProps> extends Repository<Course<props>> {
	getNewInstance(title: string, summary: string, modality: CourseModality): Promise<Course<props>>;
}

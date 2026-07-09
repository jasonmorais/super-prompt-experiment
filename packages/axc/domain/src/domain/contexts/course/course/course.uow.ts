import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { CourseRepository } from './course.repository.ts';
import type { Course, CourseProps } from './course.ts';

/**
 * Unit of work for the Course aggregate. Mirrors `community.uow.ts`.
 */
export interface CourseUnitOfWork extends UnitOfWork<Passport, CourseProps, Course<CourseProps>, CourseRepository<CourseProps>>, InitializedUnitOfWork<Passport, CourseProps, Course<CourseProps>, CourseRepository<CourseProps>> {}

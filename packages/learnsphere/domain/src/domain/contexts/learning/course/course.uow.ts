import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../../passport-factory.ts';
import type { Course, CourseProps } from './course.ts';
import type { CourseRepository } from './course.repository.ts';

export interface CourseUnitOfWork extends UnitOfWork<Passport, CourseProps, Course, CourseRepository>, InitializedUnitOfWork<Passport, CourseProps, Course, CourseRepository> {}

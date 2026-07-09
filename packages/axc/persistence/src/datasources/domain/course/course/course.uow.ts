import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { CourseModelType } from '@axc/data-sources-mongoose-models';
import type { Domain } from '@axc/domain';
import { CourseConverter } from './course.domain-adapter.ts';
import { CourseRepository } from './course.repository.ts';

/**
 * Builds the Course unit of work. Mirrors the Community context's
 * persistence `community.uow.ts`.
 */
export const getCourseUnitOfWork = (courseModel: CourseModelType, passport: Domain.Passport): Domain.Contexts.Course.Course.CourseUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, courseModel, new CourseConverter(), CourseRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};

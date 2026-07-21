import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { CourseModelType } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import { CourseConverter } from './course.domain-adapter.ts';
import { CourseRepository } from './course.repository.ts';

export const getCourseUnitOfWork = (model: CourseModelType, passport: Domain.Passport): Domain.Contexts.Learning.Course.CourseUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new CourseConverter(), CourseRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};

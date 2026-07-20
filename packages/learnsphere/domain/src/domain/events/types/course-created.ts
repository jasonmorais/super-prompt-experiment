import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface CourseCreatedProps {
	courseId: string;
	organizationId: string;
}

export class CourseCreatedEvent extends CustomDomainEventImpl<CourseCreatedProps> {}

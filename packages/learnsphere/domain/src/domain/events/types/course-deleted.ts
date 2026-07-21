import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface CourseDeletedProps {
	courseId: string;
	organizationId: string;
}

export class CourseDeletedEvent extends CustomDomainEventImpl<CourseDeletedProps> {}

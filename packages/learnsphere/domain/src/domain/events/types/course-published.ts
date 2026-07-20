import { CustomDomainEventImpl } from '@cellix/domain-seedwork/domain-event';
export interface CoursePublishedProps {
	courseId: string;
	organizationId: string;
}

export class CoursePublishedEvent extends CustomDomainEventImpl<CoursePublishedProps> {}

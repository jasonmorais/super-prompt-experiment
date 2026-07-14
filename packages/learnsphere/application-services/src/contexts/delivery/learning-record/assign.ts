import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { enroll } from './enroll.ts';

export interface AssignLearningCommand {
	organizationId: string;
	learnerId: string;
	learnerDisplayName: string;
	learnerEmail: string;
	teamName: string;
	courseId: string;
	dueAt?: Date;
	source: Exclude<Domain.Contexts.Delivery.LearningRecord.EnrollmentSource, 'SELF_ENROLLED'>;
	assignedBy: string;
}

export const assign = (dataSources: DataSources) => (command: AssignLearningCommand) => enroll(dataSources, { ...command, assignedBy: command.assignedBy, dueAt: command.dueAt ?? null });

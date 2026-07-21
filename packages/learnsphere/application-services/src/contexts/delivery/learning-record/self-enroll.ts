import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { enroll } from './enroll.ts';

export interface SelfEnrollCommand {
	organizationId: string;
	courseId: string;
	learnerId: string;
	learnerDisplayName: string;
	learnerEmail: string;
}

export const selfEnroll =
	(dataSources: DataSources): ((command: SelfEnrollCommand) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>) =>
	(command) =>
		enroll(dataSources, { ...command, teamName: 'Unassigned', source: 'SELF_ENROLLED', assignedBy: null, dueAt: null });

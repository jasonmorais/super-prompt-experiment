import { unassign } from '../delivery/learning-record/unassign.ts';
import type { TeamsServiceDependencies } from './types.ts';
import { requireTeamManagement } from './types.ts';

export const unassignCourse = ({ dataSources, passport }: TeamsServiceDependencies) => async (input: { organizationId: string; assignmentId: string }): Promise<number> => {
	requireTeamManagement(passport);
	const records = await dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.listByOrganization(input.organizationId, undefined);
	const matching = records.filter((record) => record.assignmentId === input.assignmentId);
	for (const record of matching) await unassign(dataSources)({ id: record.id });
	return matching.length;
};

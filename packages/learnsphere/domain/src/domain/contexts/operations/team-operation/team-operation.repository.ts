import type { Repository } from '@cellix/domain-seedwork/repository';
import type { TeamOperation, TeamOperationProps } from './team-operation.ts';

export interface NewTeamOperationInput {
	organizationId: string;
	title: string;
	description: string;
	category: string;
	priority: TeamOperationProps['priority'];
	assigneeId: string;
	assigneeDisplayName: string;
	assigneeEmail: string;
	teamName: string;
	createdBy: string;
	dueAt: Date | null;
}

export interface TeamOperationRepository<Props extends TeamOperationProps = TeamOperationProps> extends Repository<TeamOperation<Props>> {
	getNewInstance(input: NewTeamOperationInput): Promise<TeamOperation<Props>>;
}

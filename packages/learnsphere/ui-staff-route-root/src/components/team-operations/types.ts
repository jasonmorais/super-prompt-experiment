import type { StaffTeamOperationsContainerTeamOperationsQuery } from '../../generated.tsx';

export type Operation = StaffTeamOperationsContainerTeamOperationsQuery['teamOperations'][number];
export type Learner = StaffTeamOperationsContainerTeamOperationsQuery['teamLearning'][number];
export type CreateValues = { title: string; description: string; category: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; assigneeId: string; dueAt?: { toISOString(): string } };
export type UpdateValues = Omit<CreateValues, 'assigneeId' | 'dueAt'> & { dueAt?: string };

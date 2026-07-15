import type { LearnerOperationsContainerMyTeamOperationsQuery } from '../../generated.tsx';

export type Operation = LearnerOperationsContainerMyTeamOperationsQuery['myTeamOperations'][number];

export interface OperationActionProps {
	operation: Operation;
	commenting: boolean;
	attaching: boolean;
	onComment: (operation: Operation, body: string) => void;
	onAttach: (operation: Operation, file: File) => void;
}

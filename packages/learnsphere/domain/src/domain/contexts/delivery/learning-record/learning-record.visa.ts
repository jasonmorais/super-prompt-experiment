import type { LearningRecordDomainPermissions } from './learning-record.domain-permissions.ts';

export interface LearningRecordVisa {
	determineIf(predicate: (permissions: Readonly<LearningRecordDomainPermissions>) => boolean): boolean;
}

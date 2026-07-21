import type { AssessmentDomainPermissions } from './assessment.domain-permissions.ts';
export interface AssessmentVisa { determineIf(predicate: (permissions: AssessmentDomainPermissions) => boolean): boolean; }

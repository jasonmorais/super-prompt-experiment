import type { AssessmentEntityReference } from './assessment.ts';
import type { AssessmentVisa } from './assessment.visa.ts';
export interface AssessmentPassport { forAssessment(assessment: AssessmentEntityReference): AssessmentVisa; }

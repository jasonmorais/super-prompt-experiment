import type { Repository } from '@cellix/domain-seedwork/repository';
import type { AssessmentEntityReference, AssessmentResponse, AssessmentScore } from '../../learning/assessment/assessment.ts';
import type { AssessmentAttempt, AssessmentAttemptProps } from './assessment-attempt.ts';
export interface AssessmentAttemptRepository<Props extends AssessmentAttemptProps = AssessmentAttemptProps> extends Repository<AssessmentAttempt<Props>> {
	getNewInstance(input: { assessment: AssessmentEntityReference; learnerId: string; courseId: string; activityKey: string; responses: AssessmentResponse[]; result: AssessmentScore; attemptNumber: number }): Promise<AssessmentAttempt<Props>>;
	countAttempts(input: { assessmentId: string; learnerId: string; courseId: string; activityKey: string }): Promise<number>;
}

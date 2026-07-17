import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Assessment, AssessmentProps } from './assessment.ts';
export interface AssessmentRepository<Props extends AssessmentProps = AssessmentProps> extends Repository<Assessment<Props>> {
	getById(id: string): Promise<Assessment<Props>>;
	getNewInstance(input: { organizationId: string; title: string; description: string; passingScore: number; maxAttempts: number; createdBy: string }): Promise<Assessment<Props>>;
}

import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import { Assessment, type AssessmentEntityReference, type AssessmentProps, type AssessmentResponse, type AssessmentScore } from '../../learning/assessment/assessment.ts';
import type { Passport } from '../../../passport-factory.ts';

export interface AssessmentAttemptProps extends DomainEntityProps {
	organizationId: string;
	readonly assessment: AssessmentProps;
	setAssessmentRef(assessment: AssessmentEntityReference): void;
	learnerId: string;
	courseId: string;
	activityKey: string;
	responses: AssessmentResponse[];
	score: number;
	passed: boolean;
	attemptNumber: number;
	submittedAt: Date;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}
export interface AssessmentAttemptEntityReference extends Readonly<Omit<AssessmentAttemptProps, 'assessment' | 'setAssessmentRef'>> { readonly assessment: AssessmentEntityReference; }

export class AssessmentAttempt<Props extends AssessmentAttemptProps = AssessmentAttemptProps> extends AggregateRoot<Props, Passport> implements AssessmentAttemptEntityReference {
	static getNewInstance<Props extends AssessmentAttemptProps>(props: Props, input: { assessment: AssessmentEntityReference; learnerId: string; courseId: string; activityKey: string; responses: AssessmentResponse[]; result: AssessmentScore; attemptNumber: number }, passport: Passport): AssessmentAttempt<Props> {
		if (!passport.learning.forAssessment(input.assessment).determineIf((permissions) => permissions.canTakeAssessments || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to submit this assessment');
		const attempt = new AssessmentAttempt(props, passport);
		props.organizationId = input.assessment.organizationId;
		props.setAssessmentRef(input.assessment);
		props.learnerId = input.learnerId.trim();
		props.courseId = input.courseId.trim();
		props.activityKey = input.activityKey.trim();
		props.responses = input.responses.map((response) => ({ questionKey: response.questionKey, selectedOptionKeys: [...response.selectedOptionKeys] }));
		props.score = input.result.score;
		props.passed = input.result.passed;
		props.attemptNumber = input.attemptNumber;
		props.submittedAt = new Date();
		return attempt;
	}
	get organizationId() { return this.props.organizationId; }
	get assessment() { return new Assessment(this.props.assessment, this.passport); }
	get learnerId() { return this.props.learnerId; }
	get courseId() { return this.props.courseId; }
	get activityKey() { return this.props.activityKey; }
	get responses() { return this.props.responses.map((response) => ({ questionKey: response.questionKey, selectedOptionKeys: [...response.selectedOptionKeys] })); }
	get score() { return this.props.score; }
	get passed() { return this.props.passed; }
	get attemptNumber() { return this.props.attemptNumber; }
	get submittedAt() { return this.props.submittedAt; }
	get createdAt() { return this.props.createdAt; }
	get updatedAt() { return this.props.updatedAt; }
	get schemaVersion() { return this.props.schemaVersion; }
}

import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import { AssessmentCreatedEvent, type AssessmentCreatedProps } from '../../../events/types/assessment-created.ts';
import { AssessmentPublishedEvent, type AssessmentPublishedProps } from '../../../events/types/assessment-published.ts';
import type { Passport } from '../../../passport-factory.ts';

export type AssessmentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AssessmentQuestionType = 'SINGLE_SELECT' | 'MULTI_SELECT' | 'TRUE_FALSE';
export interface AssessmentOption {
	key: string;
	text: string;
	isCorrect: boolean;
}
export interface AssessmentQuestion {
	key: string;
	prompt: string;
	type: AssessmentQuestionType;
	options: AssessmentOption[];
	points: number;
	explanation: string;
}
export interface AssessmentResponse {
	questionKey: string;
	selectedOptionKeys: string[];
}
export interface AssessmentScore {
	score: number;
	passed: boolean;
	earnedPoints: number;
	availablePoints: number;
}

export interface AssessmentProps extends DomainEntityProps {
	organizationId: string;
	title: string;
	description: string;
	status: AssessmentStatus;
	passingScore: number;
	maxAttempts: number;
	questions: AssessmentQuestion[];
	createdBy: string;
	publishedAt: Date | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}
export type AssessmentEntityReference = Readonly<AssessmentProps>;

const requiredText = (value: string, field: string, maxLength: number): string => {
	const normalized = value.trim();
	if (!normalized) throw new Error(`${field} is required`);
	if (normalized.length > maxLength) throw new Error(`${field} cannot exceed ${maxLength} characters`);
	return normalized;
};
const sameKeys = (left: readonly string[], right: readonly string[]): boolean => left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index]);

export class Assessment<Props extends AssessmentProps = AssessmentProps> extends AggregateRoot<Props, Passport> implements AssessmentEntityReference {
	static getNewInstance<Props extends AssessmentProps>(
		props: Props,
		input: { organizationId: string; title: string; description: string; passingScore: number; maxAttempts: number; createdBy: string },
		passport: Passport,
	): Assessment<Props> {
		const assessment = new Assessment(props, passport);
		assessment.props.organizationId = requiredText(input.organizationId, 'Organization', 100);
		if (!assessment.visa.determineIf((permissions) => permissions.canManageAssessments || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to create assessments');
		assessment.title = input.title;
		assessment.description = input.description;
		assessment.passingScore = input.passingScore;
		assessment.maxAttempts = input.maxAttempts;
		assessment.props.createdBy = requiredText(input.createdBy, 'Creator', 180);
		assessment.props.status = 'DRAFT';
		assessment.props.questions = [];
		assessment.props.publishedAt = null;
		assessment.addIntegrationEvent<AssessmentCreatedProps, AssessmentCreatedEvent>(AssessmentCreatedEvent, {
			assessmentId: assessment.props.id,
			organizationId: assessment.props.organizationId,
		});
		return assessment;
	}
	private get visa() {
		return this.passport.learning.forAssessment(this);
	}
	private requireManagement() {
		if (!this.visa.determineIf((permissions) => permissions.canManageAssessments || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to manage this assessment');
	}
	get organizationId() {
		return this.props.organizationId;
	}
	get title() {
		return this.props.title;
	}
	set title(value: string) {
		this.requireManagement();
		this.props.title = requiredText(value, 'Title', 180);
	}
	get description() {
		return this.props.description;
	}
	set description(value: string) {
		this.requireManagement();
		this.props.description = requiredText(value, 'Description', 10000);
	}
	get status() {
		return this.props.status;
	}
	get passingScore() {
		return this.props.passingScore;
	}
	set passingScore(value: number) {
		this.requireManagement();
		if (!Number.isInteger(value) || value < 1 || value > 100) throw new Error('Passing score must be between 1 and 100');
		this.props.passingScore = value;
	}
	get maxAttempts() {
		return this.props.maxAttempts;
	}
	set maxAttempts(value: number) {
		this.requireManagement();
		if (!Number.isInteger(value) || value < 1 || value > 100) throw new Error('Maximum attempts must be between 1 and 100');
		this.props.maxAttempts = value;
	}
	get questions() {
		return this.props.questions.map((question) => ({ ...question, options: question.options.map((option) => ({ ...option })) }));
	}
	get createdBy() {
		return this.props.createdBy;
	}
	get publishedAt() {
		return this.props.publishedAt;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get schemaVersion() {
		return this.props.schemaVersion;
	}
	addQuestion(question: AssessmentQuestion): void {
		this.requireManagement();
		if (this.props.status === 'ARCHIVED') throw new Error('Archived assessments cannot be edited');
		if (this.props.questions.some((existing) => existing.key === question.key)) throw new Error(`Question key ${question.key} already exists`);
		const key = requiredText(question.key, 'Question key', 80);
		const prompt = requiredText(question.prompt, 'Question prompt', 5000);
		if (question.options.length < 2) throw new Error('An assessment question requires at least two options');
		const options = question.options.map((option) => ({ key: requiredText(option.key, 'Option key', 80), text: requiredText(option.text, 'Option text', 1000), isCorrect: option.isCorrect }));
		if (new Set(options.map((option) => option.key)).size !== options.length) throw new Error('Option keys must be unique within a question');
		const correctCount = options.filter((option) => option.isCorrect).length;
		if (question.type === 'MULTI_SELECT' ? correctCount < 1 : correctCount !== 1) throw new Error(question.type === 'MULTI_SELECT' ? 'At least one option must be correct' : 'Exactly one option must be correct');
		if (!Number.isInteger(question.points) || question.points < 1 || question.points > 1000) throw new Error('Question points must be between 1 and 1000');
		this.props.questions = [...this.props.questions, { ...question, key, prompt, options, explanation: question.explanation.trim() }];
	}
	update(input: { title: string; description: string; passingScore: number; maxAttempts: number; questions: AssessmentQuestion[] }): void {
		this.requireManagement();
		if (this.props.status === 'ARCHIVED') throw new Error('Archived assessments cannot be edited');
		this.title = input.title;
		this.description = input.description;
		this.passingScore = input.passingScore;
		this.maxAttempts = input.maxAttempts;
		this.props.questions = [];
		for (const question of input.questions) this.addQuestion(question);
	}
	publish(): void {
		this.requireManagement();
		if (this.props.status !== 'DRAFT') throw new Error('Only draft assessments can be published');
		if (this.props.questions.length === 0) throw new Error('An assessment must contain at least one question');
		this.props.status = 'PUBLISHED';
		this.props.publishedAt = new Date();
		this.addIntegrationEvent<AssessmentPublishedProps, AssessmentPublishedEvent>(AssessmentPublishedEvent, {
			assessmentId: this.props.id,
			organizationId: this.props.organizationId,
		});
	}
	archive(): void {
		this.requireManagement();
		if (this.props.status !== 'PUBLISHED') throw new Error('Only published assessments can be archived');
		this.props.status = 'ARCHIVED';
	}
	grade(responses: readonly AssessmentResponse[]): AssessmentScore {
		if (!this.visa.determineIf((permissions) => permissions.canTakeAssessments || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to take this assessment');
		if (this.props.status !== 'PUBLISHED') throw new Error('Only published assessments can be submitted');
		const availablePoints = this.props.questions.reduce((total, question) => total + question.points, 0);
		const earnedPoints = this.props.questions.reduce((total, question) => {
			const selected = responses.find((response) => response.questionKey === question.key)?.selectedOptionKeys ?? [];
			const correct = question.options.filter((option) => option.isCorrect).map((option) => option.key);
			return total + (sameKeys(selected, correct) ? question.points : 0);
		}, 0);
		const score = Math.round((earnedPoints / availablePoints) * 100);
		return { score, passed: score >= this.props.passingScore, earnedPoints, availablePoints };
	}
}

import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Assessment as AssessmentDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
export class AssessmentConverter extends MongooseSeedwork.MongoTypeConverter<AssessmentDocument, AssessmentDomainAdapter, Domain.Passport, Domain.Contexts.Learning.Assessment.Assessment<AssessmentDomainAdapter>> { constructor() { super(AssessmentDomainAdapter, Domain.Contexts.Learning.Assessment.Assessment); } }
export class AssessmentDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<AssessmentDocument> implements Domain.Contexts.Learning.Assessment.AssessmentProps {
	get organizationId() { return this.doc.organizationId; } set organizationId(value) { this.doc.organizationId = value; }
	get title() { return this.doc.title; } set title(value) { this.doc.title = value; }
	get description() { return this.doc.description; } set description(value) { this.doc.description = value; }
	get status() { return this.doc.status; } set status(value) { this.doc.status = value; }
	get passingScore() { return this.doc.passingScore; } set passingScore(value) { this.doc.passingScore = value; }
	get maxAttempts() { return this.doc.maxAttempts; } set maxAttempts(value) { this.doc.maxAttempts = value; }
	get questions() { return this.doc.questions.map((question) => ({ key: question.key, prompt: question.prompt, type: question.type, points: question.points, explanation: question.explanation, options: question.options.map((option) => ({ key: option.key, text: option.text, isCorrect: option.isCorrect })) })); } set questions(value) { this.doc.questions = value; }
	get createdBy() { return this.doc.createdBy; } set createdBy(value) { this.doc.createdBy = value; }
	get publishedAt() { return this.doc.publishedAt; } set publishedAt(value) { this.doc.publishedAt = value; }
}

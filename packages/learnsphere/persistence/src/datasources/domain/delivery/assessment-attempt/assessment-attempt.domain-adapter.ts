import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Assessment as AssessmentDocument, AssessmentAttempt as AttemptDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import { AssessmentDomainAdapter } from '../../learning/assessment/assessment.domain-adapter.ts';
export class AssessmentAttemptConverter extends MongooseSeedwork.MongoTypeConverter<AttemptDocument, AssessmentAttemptDomainAdapter, Domain.Passport, Domain.Contexts.Delivery.AssessmentAttempt.AssessmentAttempt<AssessmentAttemptDomainAdapter>> { constructor() { super(AssessmentAttemptDomainAdapter, Domain.Contexts.Delivery.AssessmentAttempt.AssessmentAttempt); } }
export class AssessmentAttemptDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<AttemptDocument> implements Domain.Contexts.Delivery.AssessmentAttempt.AssessmentAttemptProps {
	get organizationId() { return this.doc.organizationId; } set organizationId(value) { this.doc.organizationId = value; }
	get assessment() { if (!this.doc.assessment || this.doc.assessment instanceof MongooseSeedwork.ObjectId) throw new Error('Assessment is not populated'); return new AssessmentDomainAdapter(this.doc.assessment as AssessmentDocument); }
	setAssessmentRef(assessment: Domain.Contexts.Learning.Assessment.AssessmentEntityReference) { this.doc.set('assessment', new MongooseSeedwork.ObjectId(assessment.id)); }
	get learnerId() { return this.doc.learnerId; } set learnerId(value) { this.doc.learnerId = value; }
	get courseId() { return this.doc.courseId; } set courseId(value) { this.doc.courseId = value; }
	get activityKey() { return this.doc.activityKey; } set activityKey(value) { this.doc.activityKey = value; }
	get responses() { return this.doc.responses.map((response) => ({ questionKey: response.questionKey, selectedOptionKeys: [...response.selectedOptionKeys] })); } set responses(value) { this.doc.responses = value; }
	get score() { return this.doc.score; } set score(value) { this.doc.score = value; }
	get passed() { return this.doc.passed; } set passed(value) { this.doc.passed = value; }
	get attemptNumber() { return this.doc.attemptNumber; } set attemptNumber(value) { this.doc.attemptNumber = value; }
	get submittedAt() { return this.doc.submittedAt; } set submittedAt(value) { this.doc.submittedAt = value; }
}

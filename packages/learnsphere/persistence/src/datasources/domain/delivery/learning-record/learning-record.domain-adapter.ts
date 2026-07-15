import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { LearningRecord as LearningRecordDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';

export class LearningRecordConverter extends MongooseSeedwork.MongoTypeConverter<
	LearningRecordDocument,
	LearningRecordDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Delivery.LearningRecord.LearningRecord<LearningRecordDomainAdapter>
> {
	constructor() {
		super(LearningRecordDomainAdapter, Domain.Contexts.Delivery.LearningRecord.LearningRecord);
	}
}

export class LearningRecordDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<LearningRecordDocument> implements Domain.Contexts.Delivery.LearningRecord.LearningRecordProps {
	get organizationId() {
		return this.doc.organizationId;
	}
	set organizationId(v) {
		this.doc.organizationId = v;
	}
	get learnerId() {
		return this.doc.learnerId;
	}
	set learnerId(v) {
		this.doc.learnerId = v;
	}
	get learnerDisplayName() {
		return this.doc.learnerDisplayName;
	}
	set learnerDisplayName(v) {
		this.doc.learnerDisplayName = v;
	}
	get learnerEmail() {
		return this.doc.learnerEmail;
	}
	set learnerEmail(v) {
		this.doc.learnerEmail = v;
	}
	get teamName() {
		return this.doc.teamName;
	}
	set teamName(v) {
		this.doc.teamName = v;
	}
	get courseId() {
		return this.doc.courseId;
	}
	set courseId(v) {
		this.doc.courseId = v;
	}
	get courseTitle() {
		return this.doc.courseTitle;
	}
	set courseTitle(v) {
		this.doc.courseTitle = v;
	}
	get courseCategory() {
		return this.doc.courseCategory;
	}
	set courseCategory(v) {
		this.doc.courseCategory = v;
	}
	get requiresCompletionScreenshot() {
		return this.doc.requiresCompletionScreenshot;
	}
	set requiresCompletionScreenshot(v) {
		this.doc.requiresCompletionScreenshot = v;
	}
	get requiredActivityKeys() {
		return this.doc.requiredActivityKeys;
	}
	set requiredActivityKeys(v) {
		this.doc.requiredActivityKeys = v;
	}
	get source() {
		return this.doc.source;
	}
	set source(v) {
		this.doc.source = v;
	}
	get status() {
		return this.doc.status;
	}
	set status(v) {
		this.doc.status = v;
	}
	get assignedBy() {
		return this.doc.assignedBy;
	}
	set assignedBy(v) {
		this.doc.assignedBy = v;
	}
	get assignmentId() { return this.doc.assignmentId; }
	set assignmentId(v) { this.doc.assignmentId = v; }
	get assignedAt() {
		return this.doc.assignedAt;
	}
	set assignedAt(v) {
		this.doc.assignedAt = v;
	}
	get dueAt() {
		return this.doc.dueAt;
	}
	set dueAt(v) {
		this.doc.dueAt = v;
	}
	get startedAt() {
		return this.doc.startedAt;
	}
	set startedAt(v) {
		this.doc.startedAt = v;
	}
	get completedAt() {
		return this.doc.completedAt;
	}
	set completedAt(v) {
		this.doc.completedAt = v;
	}
	get waivedAt() {
		return this.doc.waivedAt;
	}
	set waivedAt(v) {
		this.doc.waivedAt = v;
	}
	get waiverReason() {
		return this.doc.waiverReason;
	}
	set waiverReason(v) {
		this.doc.waiverReason = v;
	}
	get activityProgress(): Domain.Contexts.Delivery.LearningRecord.ActivityProgress[] {
		return this.doc.activityProgress.map((progress) => ({
			activityKey: progress.activityKey,
			completedAt: progress.completedAt,
			timeSpentMinutes: progress.timeSpentMinutes,
			assessmentScore: progress.assessmentScore,
			attempts: progress.attempts,
		}));
	}
	set activityProgress(v: Domain.Contexts.Delivery.LearningRecord.ActivityProgress[]) {
		this.doc.activityProgress = v;
	}
	get completionScreenshot() {
		return this.doc.completionScreenshot;
	}
	set completionScreenshot(v) {
		this.doc.completionScreenshot = v;
	}
}

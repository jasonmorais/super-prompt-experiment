import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { TeamOperation as TeamOperationDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';

interface LegacyCommentFields {
	body?: unknown;
	text?: unknown;
	message?: unknown;
}

export class TeamOperationConverter extends MongooseSeedwork.MongoTypeConverter<
	TeamOperationDocument,
	TeamOperationDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Operations.TeamOperation.TeamOperation<TeamOperationDomainAdapter>
> {
	constructor() {
		super(TeamOperationDomainAdapter, Domain.Contexts.Operations.TeamOperation.TeamOperation);
	}
}

export class TeamOperationDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<TeamOperationDocument> implements Domain.Contexts.Operations.TeamOperation.TeamOperationProps {
	get organizationId() {
		return this.doc.organizationId;
	}
	set organizationId(v) {
		this.doc.organizationId = v;
	}
	get title() {
		return this.doc.title;
	}
	set title(v) {
		this.doc.title = v;
	}
	get description() {
		return this.doc.description;
	}
	set description(v) {
		this.doc.description = v;
	}
	get category() {
		return this.doc.category;
	}
	set category(v) {
		this.doc.category = v;
	}
	get priority() {
		return this.doc.priority;
	}
	set priority(v) {
		this.doc.priority = v;
	}
	get status() {
		return this.doc.status;
	}
	set status(v) {
		this.doc.status = v;
	}
	get assigneeId() {
		return this.doc.assigneeId;
	}
	set assigneeId(v) {
		this.doc.assigneeId = v;
	}
	get assigneeDisplayName() {
		return this.doc.assigneeDisplayName;
	}
	set assigneeDisplayName(v) {
		this.doc.assigneeDisplayName = v;
	}
	get assigneeEmail() {
		return this.doc.assigneeEmail;
	}
	set assigneeEmail(v) {
		this.doc.assigneeEmail = v;
	}
	get teamName() {
		return this.doc.teamName;
	}
	set teamName(v) {
		this.doc.teamName = v;
	}
	get createdBy() {
		return this.doc.createdBy;
	}
	set createdBy(v) {
		this.doc.createdBy = v;
	}
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
	get submittedAt() {
		return this.doc.submittedAt;
	}
	set submittedAt(v) {
		this.doc.submittedAt = v;
	}
	get submittedBy() {
		return this.doc.submittedBy;
	}
	set submittedBy(v) {
		this.doc.submittedBy = v;
	}
	get completionNote() {
		return this.doc.completionNote;
	}
	set completionNote(v) {
		this.doc.completionNote = v;
	}
	get completionEvidence() {
		return this.doc.completionEvidence;
	}
	set completionEvidence(v) {
		this.doc.completionEvidence = v;
	}
	get confirmedAt() {
		return this.doc.confirmedAt;
	}
	set confirmedAt(v) {
		this.doc.confirmedAt = v;
	}
	get confirmedBy() {
		return this.doc.confirmedBy;
	}
	set confirmedBy(v) {
		this.doc.confirmedBy = v;
	}
	get statusHistory(): Domain.Contexts.Operations.TeamOperation.TeamOperationStatusEvent[] {
		return this.doc.statusHistory.map((event) => ({ status: event.status, changedAt: event.changedAt, changedBy: event.changedBy, note: event.note ?? null }));
	}
	set statusHistory(v) {
		this.doc.statusHistory = v;
	}
	get comments(): Domain.Contexts.Operations.TeamOperation.TeamOperationComment[] {
		return (this.doc.comments ?? []).flatMap((comment, index) => {
			const legacy = comment as unknown as LegacyCommentFields;
			const body = [legacy.body, legacy.text, legacy.message].find((value): value is string => typeof value === 'string' && Boolean(value.trim()))?.trim();
			if (!body) return [];
			const authorId = typeof comment.authorId === 'string' && comment.authorId.trim() ? comment.authorId.trim() : 'legacy-user';
			const authorName = typeof comment.authorName === 'string' && comment.authorName.trim() ? comment.authorName.trim() : authorId;
			const createdAt = comment.createdAt instanceof Date && !Number.isNaN(comment.createdAt.getTime()) ? comment.createdAt : this.doc.createdAt;
			return [
				{
					id: typeof comment.id === 'string' && comment.id.trim() ? comment.id.trim() : `legacy-comment-${String(this.doc._id)}-${index}`,
					body,
					authorId,
					authorName,
					createdAt,
				},
			];
		});
	}
	set comments(v) {
		this.doc.comments = v;
	}
	get attachments(): Domain.Contexts.Operations.TeamOperation.TeamOperationAttachment[] {
		return (this.doc.attachments ?? []).map((attachment, index) => ({ ...attachment, id: typeof attachment.id === 'string' && attachment.id.trim() ? attachment.id.trim() : `legacy-attachment-${String(this.doc._id)}-${index}` }));
	}
	set attachments(v) {
		this.doc.attachments = v;
	}
}

import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../../passport-factory.ts';

export type TeamOperationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TeamOperationStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';

export interface TeamOperationStatusEvent {
	status: TeamOperationStatus;
	changedAt: Date;
	changedBy: string;
	note: string | null;
}

export interface TeamOperationComment {
	id: string;
	body: string;
	authorId: string;
	authorName: string;
	createdAt: Date;
}

export interface TeamOperationAttachment {
	id: string;
	fileName: string;
	contentType: string;
	size: number;
	blobName: string;
	uploadedBy: string;
	uploadedAt: Date;
}

export interface TeamOperationThread {
	comments: TeamOperationComment[];
	attachments: TeamOperationAttachment[];
}

export interface TeamOperationProps extends DomainEntityProps {
	organizationId: string;
	title: string;
	description: string;
	category: string;
	priority: TeamOperationPriority;
	status: TeamOperationStatus;
	assigneeId: string;
	assigneeDisplayName: string;
	assigneeEmail: string;
	teamName: string;
	createdBy: string;
	assignedAt: Date;
	dueAt: Date | null;
	startedAt: Date | null;
	submittedAt: Date | null;
	submittedBy: string | null;
	completionNote: string | null;
	completionEvidence: string | null;
	confirmedAt: Date | null;
	confirmedBy: string | null;
	statusHistory: TeamOperationStatusEvent[];
	comments: TeamOperationComment[];
	attachments: TeamOperationAttachment[];
	createdAt: Date;
	updatedAt: Date;
	schemaVersion: string;
}

export interface TeamOperationEntityReference extends Readonly<TeamOperationProps> {
	thread: TeamOperationThread;
	isOverdue: boolean;
}

const requiredText = (value: string, field: string, maxLength: number): string => {
	const normalized = value.trim();
	if (!normalized) throw new Error(`${field} is required`);
	if (normalized.length > maxLength) throw new Error(`${field} cannot exceed ${maxLength} characters`);
	return normalized;
};

export class TeamOperation<Props extends TeamOperationProps = TeamOperationProps> extends AggregateRoot<Props, Passport> implements TeamOperationEntityReference {
	static getNewInstance<Props extends TeamOperationProps = TeamOperationProps>(props: Props, input: import('./team-operation.repository.ts').NewTeamOperationInput, passport: Passport): TeamOperation<Props> {
		const operation = new TeamOperation(props, passport);
		props.organizationId = requiredText(input.organizationId, 'Organization', 100);
		if (!passport.operations.forTeamOperation(operation).determineIf((permissions) => permissions.canManageTeamOperations)) throw new PermissionError('You do not have permission to create team operations');
		props.title = requiredText(input.title, 'Title', 180);
		props.description = requiredText(input.description, 'Description', 10000);
		props.category = requiredText(input.category, 'Category', 100);
		props.priority = input.priority;
		props.status = 'ASSIGNED';
		props.assigneeId = requiredText(input.assigneeId, 'Assignee', 180);
		props.assigneeDisplayName = requiredText(input.assigneeDisplayName, 'Assignee name', 180);
		props.assigneeEmail = requiredText(input.assigneeEmail, 'Assignee email', 254).toLowerCase();
		props.teamName = requiredText(input.teamName, 'Team', 120);
		props.createdBy = requiredText(input.createdBy, 'Creator', 180);
		props.assignedAt = new Date();
		props.dueAt = input.dueAt;
		props.startedAt = null;
		props.submittedAt = null;
		props.submittedBy = null;
		props.completionNote = null;
		props.completionEvidence = null;
		props.confirmedAt = null;
		props.confirmedBy = null;
		props.statusHistory = [{ status: 'ASSIGNED', changedAt: new Date(), changedBy: input.createdBy, note: null }];
		props.comments = [];
		props.attachments = [];
		return operation;
	}

	private get visa() {
		return this.passport.operations.forTeamOperation(this);
	}
	private requireAssignedUser(): void {
		if (!this.visa.determineIf((permissions) => permissions.canUpdateAssignedOperations)) throw new PermissionError('Only the assigned user can update this operation');
	}
	private requireOpen(): void {
		if (['COMPLETED', 'CANCELLED'].includes(this.props.status)) throw new Error('This operation can no longer be changed');
	}
	private appendStatus(status: TeamOperationStatus, changedBy: string, note: string | null): void {
		this.props.status = status;
		this.props.statusHistory = [...this.props.statusHistory, { status, changedAt: new Date(), changedBy, note }];
	}

	get organizationId() { return this.props.organizationId; }
	get title() { return this.props.title; }
	get description() { return this.props.description; }
	get category() { return this.props.category; }
	get priority() { return this.props.priority; }
	get status() { return this.props.status; }
	get assigneeId() { return this.props.assigneeId; }
	get assigneeDisplayName() { return this.props.assigneeDisplayName; }
	get assigneeEmail() { return this.props.assigneeEmail; }
	get teamName() { return this.props.teamName; }
	get createdBy() { return this.props.createdBy; }
	get assignedAt() { return this.props.assignedAt; }
	get dueAt() { return this.props.dueAt; }
	get startedAt() { return this.props.startedAt; }
	get submittedAt() { return this.props.submittedAt; }
	get submittedBy() { return this.props.submittedBy; }
	get completionNote() { return this.props.completionNote; }
	get completionEvidence() { return this.props.completionEvidence; }
	get confirmedAt() { return this.props.confirmedAt; }
	get confirmedBy() { return this.props.confirmedBy; }
	get statusHistory() { return this.props.statusHistory.map((event) => ({ ...event })); }
	get comments() { return this.props.comments.map((comment) => ({ ...comment })); }
	get attachments() { return this.props.attachments.map((attachment) => ({ ...attachment })); }
	get thread(): TeamOperationThread { return { comments: this.comments, attachments: this.attachments }; }
	get createdAt() { return this.props.createdAt; }
	get updatedAt() { return this.props.updatedAt; }
	get schemaVersion() { return this.props.schemaVersion; }
	get isOverdue() { return Boolean(this.props.dueAt && this.props.dueAt.getTime() < Date.now() && !['COMPLETED', 'CANCELLED'].includes(this.props.status)); }

	start(actorId: string): void {
		this.requireAssignedUser();
		this.requireOpen();
		if (this.props.status !== 'ASSIGNED') return;
		this.props.startedAt = new Date();
		this.appendStatus('IN_PROGRESS', actorId, null);
	}

	submitForConfirmation(actorId: string, completionNote: string, completionEvidence?: string): void {
		this.requireAssignedUser();
		this.requireOpen();
		if (!['ASSIGNED', 'IN_PROGRESS'].includes(this.props.status)) throw new Error('Only assigned or in-progress operations can be submitted');
		if (completionNote.trim().length < 10) throw new Error('Add a meaningful completion note before submitting');
		if (completionEvidence && completionEvidence.length > 8_000_000) throw new Error('Completion evidence must be smaller than 8 MB');
		this.props.submittedAt = new Date();
		this.props.submittedBy = actorId;
		this.props.completionNote = completionNote.trim();
		this.props.completionEvidence = completionEvidence ?? null;
		this.appendStatus('SUBMITTED', actorId, this.props.completionNote);
	}

	confirm(actorId: string, note?: string): void {
		if (!this.visa.determineIf((permissions) => permissions.canConfirmTeamOperations)) throw new PermissionError('Only a manager can confirm team operations');
		if (this.props.status !== 'SUBMITTED') throw new Error('Only submitted operations can be confirmed');
		this.props.confirmedAt = new Date();
		this.props.confirmedBy = actorId;
		this.appendStatus('COMPLETED', actorId, note?.trim() || null);
	}

	cancel(actorId: string, reason: string): void {
		if (!this.visa.determineIf((permissions) => permissions.canManageTeamOperations)) throw new PermissionError('Only a manager can cancel team operations');
		this.requireOpen();
		if (reason.trim().length < 5) throw new Error('A cancellation reason is required');
		this.appendStatus('CANCELLED', actorId, reason.trim());
	}

	updateDetails(input: { title: string; description: string; category: string; priority: TeamOperationPriority; dueAt: Date | null; assigneeId: string; assigneeDisplayName: string; assigneeEmail: string; teamName: string; changedBy: string }): void {
		if (!this.visa.determineIf((permissions) => permissions.canEditTeamOperations || permissions.canManageTeamOperations)) throw new PermissionError('Only a team lead or manager can edit team goals');
		this.requireOpen();
		this.props.title = requiredText(input.title, 'Title', 180);
		this.props.description = requiredText(input.description, 'Description', 10000);
		this.props.category = requiredText(input.category, 'Category', 100);
		this.props.priority = input.priority;
		this.props.dueAt = input.dueAt;
		const reassigned = this.props.assigneeId !== input.assigneeId;
		if (reassigned && this.props.status === 'SUBMITTED') throw new Error('Submitted operations must be confirmed or returned before reassignment');
		this.props.assigneeId = requiredText(input.assigneeId, 'Assignee', 180);
		this.props.assigneeDisplayName = requiredText(input.assigneeDisplayName, 'Assignee name', 180);
		this.props.assigneeEmail = requiredText(input.assigneeEmail, 'Assignee email', 254).toLowerCase();
		this.props.teamName = requiredText(input.teamName, 'Team', 120);
		if (reassigned) {
			this.props.assignedAt = new Date();
			this.props.startedAt = null;
			this.appendStatus('ASSIGNED', input.changedBy, `Reassigned to ${this.props.assigneeDisplayName}`);
		}
	}

	private requireDiscussionAccess(): void {
		if (!this.visa.determineIf((permissions) => permissions.canDiscussTeamOperations)) throw new PermissionError('You do not have permission to use this thread');
	}

	addComment(input: { id: string; body: string; authorId: string; authorName: string; createdAt: Date }): void {
		this.requireDiscussionAccess();
		const body = requiredText(input.body, 'Comment', 10000);
		this.props.comments = [...this.props.comments, { ...input, body }];
	}

	addAttachment(input: TeamOperationAttachment): void {
		this.requireDiscussionAccess();
		if (!input.fileName.trim()) throw new Error('File name is required');
		if (input.size < 1 || input.size > 8_000_000) throw new Error('Attachments must be between 1 byte and 8 MB');
		this.props.attachments = [...this.props.attachments, { ...input, fileName: input.fileName.trim() }];
	}
}

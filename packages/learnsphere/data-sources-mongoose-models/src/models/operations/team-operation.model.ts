import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface TeamOperationStatusEvent {
	status: 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';
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

export interface TeamOperation extends MongooseSeedwork.Base {
	organizationId: string;
	title: string;
	description: string;
	category: string;
	priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
	status: 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';
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
}

const StatusHistorySchema = new Schema<TeamOperationStatusEvent>({
	status: { type: String, required: true, enum: ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELLED'] },
	changedAt: { type: Date, required: true },
	changedBy: { type: String, required: true, maxlength: 180 },
	note: { type: String, default: null, maxlength: 10000 },
}, { _id: false });

const CommentSchema = new Schema<TeamOperationComment>({
	id: { type: String, required: true },
	body: { type: String, required: true, maxlength: 10000 },
	authorId: { type: String, required: true, maxlength: 180 },
	authorName: { type: String, required: true, maxlength: 180 },
	createdAt: { type: Date, required: true },
}, { _id: false });

const AttachmentSchema = new Schema<TeamOperationAttachment>({
	id: { type: String, required: true },
	fileName: { type: String, required: true, maxlength: 255 },
	contentType: { type: String, required: true, maxlength: 180 },
	size: { type: Number, required: true, min: 1, max: 8_000_000 },
	blobName: { type: String, required: true, maxlength: 500 },
	uploadedBy: { type: String, required: true, maxlength: 180 },
	uploadedAt: { type: Date, required: true },
}, { _id: false });

const TeamOperationSchema = new Schema<TeamOperation, Model<TeamOperation>, TeamOperation>({
	schemaVersion: { type: String, default: '1.0.0' },
	organizationId: { type: String, required: true, maxlength: 100, index: true },
	title: { type: String, required: true, maxlength: 180 },
	description: { type: String, required: true, maxlength: 10000 },
	category: { type: String, required: true, maxlength: 100, index: true },
	priority: { type: String, required: true, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
	status: { type: String, required: true, enum: ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELLED'], default: 'ASSIGNED', index: true },
	assigneeId: { type: String, required: true, maxlength: 180, index: true },
	assigneeDisplayName: { type: String, required: true, maxlength: 180 },
	assigneeEmail: { type: String, required: true, maxlength: 254 },
	teamName: { type: String, required: true, maxlength: 120, index: true },
	createdBy: { type: String, required: true, maxlength: 180 },
	assignedAt: { type: Date, required: true },
	dueAt: { type: Date, default: null, index: true },
	startedAt: { type: Date, default: null },
	submittedAt: { type: Date, default: null },
	submittedBy: { type: String, default: null, maxlength: 180 },
	completionNote: { type: String, default: null, maxlength: 10000 },
	completionEvidence: { type: String, default: null, maxlength: 8000000 },
	confirmedAt: { type: Date, default: null },
	confirmedBy: { type: String, default: null, maxlength: 180 },
	statusHistory: { type: [StatusHistorySchema], default: [] },
	comments: { type: [CommentSchema], default: [] },
	attachments: { type: [AttachmentSchema], default: [] },
}, { timestamps: true, versionKey: 'version' })
	.index({ organizationId: 1, assigneeId: 1, status: 1, dueAt: 1 })
	.index({ organizationId: 1, teamName: 1, status: 1, updatedAt: -1 });

export const TeamOperationModelName = 'TeamOperation';
export const TeamOperationModelFactory = MongooseSeedwork.modelFactory<TeamOperation>(TeamOperationModelName, TeamOperationSchema);
export type TeamOperationModelType = ReturnType<typeof TeamOperationModelFactory>;

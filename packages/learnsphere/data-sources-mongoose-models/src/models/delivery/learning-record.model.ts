import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface ActivityProgress {
	activityKey: string;
	completedAt: Date;
	timeSpentMinutes: number;
	assessmentScore: number | null;
	attempts: number;
}

export interface LearningRecord extends MongooseSeedwork.Base {
	organizationId: string;
	learnerId: string;
	learnerDisplayName: string;
	learnerEmail: string;
	teamName: string;
	courseId: string;
	courseTitle: string;
	courseCategory: string;
	requiresCompletionScreenshot: boolean;
	requiredActivityKeys: string[];
	source: 'SELF_ENROLLED' | 'MANAGER_ASSIGNED' | 'PROGRAM_ASSIGNED' | 'COMPLIANCE_ASSIGNED';
	status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'WAIVED';
	assignedBy: string | null;
	assignmentId: string | null;
	assignedAt: Date;
	dueAt: Date | null;
	startedAt: Date | null;
	completedAt: Date | null;
	waivedAt: Date | null;
	waiverReason: string | null;
	activityProgress: ActivityProgress[];
	completionScreenshot: string | null;
}

const ActivityProgressSchema = new Schema<ActivityProgress>({
	activityKey: { type: String, required: true, maxlength: 100 },
	completedAt: { type: Date, required: true },
	timeSpentMinutes: { type: Number, required: true, min: 0, max: 100000 },
	assessmentScore: { type: Number, default: null, min: 0, max: 100 },
	attempts: { type: Number, required: true, min: 1 },
}, { _id: false });

const LearningRecordSchema = new Schema<LearningRecord, Model<LearningRecord>, LearningRecord>({
	schemaVersion: { type: String, default: '1.0.0' },
	organizationId: { type: String, required: true, index: true },
	learnerId: { type: String, required: true, index: true },
	learnerDisplayName: { type: String, required: true, maxlength: 180 },
	learnerEmail: { type: String, required: true, maxlength: 254 },
	teamName: { type: String, required: true, maxlength: 120, index: true },
	courseId: { type: String, required: true, index: true },
	courseTitle: { type: String, required: true, maxlength: 180 },
	courseCategory: { type: String, required: true, maxlength: 100 },
	requiresCompletionScreenshot: { type: Boolean, required: true, default: false },
	requiredActivityKeys: { type: [String], required: true },
	source: { type: String, required: true, enum: ['SELF_ENROLLED', 'MANAGER_ASSIGNED', 'PROGRAM_ASSIGNED', 'COMPLIANCE_ASSIGNED'] },
	status: { type: String, required: true, enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'WAIVED'], index: true },
	assignedBy: { type: String, default: null },
	assignmentId: { type: String, default: null, index: true },
	assignedAt: { type: Date, required: true },
	dueAt: { type: Date, default: null, index: true },
	startedAt: { type: Date, default: null },
	completedAt: { type: Date, default: null },
	waivedAt: { type: Date, default: null },
	waiverReason: { type: String, default: null, maxlength: 1000 },
	activityProgress: { type: [ActivityProgressSchema], default: [] },
	completionScreenshot: { type: String, default: null, maxlength: 8000000 },
}, { timestamps: true, versionKey: 'version' })
	.index({ organizationId: 1, learnerId: 1, courseId: 1 }, { unique: true })
	.index({ organizationId: 1, learnerId: 1, status: 1, dueAt: 1 })
	.index({ organizationId: 1, teamName: 1, status: 1 });

export const LearningRecordModelName = 'LearningRecord';
export const LearningRecordModelFactory = MongooseSeedwork.modelFactory<LearningRecord>(LearningRecordModelName, LearningRecordSchema);
export type LearningRecordModelType = ReturnType<typeof LearningRecordModelFactory>;

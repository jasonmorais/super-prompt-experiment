import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export type AssessmentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AssessmentQuestionType = 'SINGLE_SELECT' | 'MULTI_SELECT' | 'TRUE_FALSE';

export interface AssessmentOption { key: string; text: string; isCorrect: boolean; }
export interface AssessmentQuestion { key: string; prompt: string; type: AssessmentQuestionType; options: AssessmentOption[]; points: number; explanation: string; }

export interface Assessment extends MongooseSeedwork.Base {
	organizationId: string;
	title: string;
	description: string;
	status: AssessmentStatus;
	passingScore: number;
	maxAttempts: number;
	questions: AssessmentQuestion[];
	createdBy: string;
	publishedAt: Date | null;
}

const AssessmentOptionSchema = new Schema<AssessmentOption>({ key: { type: String, required: true, maxlength: 80 }, text: { type: String, required: true, maxlength: 1000 }, isCorrect: { type: Boolean, required: true, default: false } }, { _id: false });
const AssessmentQuestionSchema = new Schema<AssessmentQuestion>({
	key: { type: String, required: true, maxlength: 80 },
	prompt: { type: String, required: true, maxlength: 5000 },
	type: { type: String, required: true, enum: ['SINGLE_SELECT', 'MULTI_SELECT', 'TRUE_FALSE'] },
	options: { type: [AssessmentOptionSchema], required: true, default: [] },
	points: { type: Number, required: true, min: 1, max: 1000 },
	explanation: { type: String, maxlength: 5000, default: '' },
}, { _id: false });

const AssessmentSchema = new Schema<Assessment, Model<Assessment>, Assessment>({
	schemaVersion: { type: String, default: '1.0.0' },
	organizationId: { type: String, required: true, maxlength: 100, index: true },
	title: { type: String, required: true, maxlength: 180 },
	description: { type: String, required: true, maxlength: 10000 },
	status: { type: String, required: true, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT', index: true },
	passingScore: { type: Number, required: true, min: 1, max: 100, default: 80 },
	maxAttempts: { type: Number, required: true, min: 1, max: 100, default: 3 },
	questions: { type: [AssessmentQuestionSchema], required: true, default: [] },
	createdBy: { type: String, required: true, maxlength: 180 },
	publishedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: 'version' }).index({ organizationId: 1, title: 1 }, { unique: true });

export const AssessmentModelName = 'Assessment';
export const AssessmentModelFactory = MongooseSeedwork.modelFactory<Assessment>(AssessmentModelName, AssessmentSchema);
export type AssessmentModelType = ReturnType<typeof AssessmentModelFactory>;

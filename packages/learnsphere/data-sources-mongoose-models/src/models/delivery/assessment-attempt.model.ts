import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, type ObjectId, type PopulatedDoc, Schema } from 'mongoose';
import type { Assessment } from '../learning/assessment.model.ts';

export interface AssessmentResponse { questionKey: string; selectedOptionKeys: string[]; }
export interface AssessmentAttempt extends MongooseSeedwork.Base {
	organizationId: string;
	assessment: PopulatedDoc<Assessment> | ObjectId;
	learnerId: string;
	courseId: string;
	activityKey: string;
	responses: AssessmentResponse[];
	score: number;
	passed: boolean;
	attemptNumber: number;
	submittedAt: Date;
}

const AssessmentResponseSchema = new Schema<AssessmentResponse>({ questionKey: { type: String, required: true, maxlength: 80 }, selectedOptionKeys: { type: [String], required: true, default: [] } }, { _id: false });
const AssessmentAttemptSchema = new Schema<AssessmentAttempt, Model<AssessmentAttempt>, AssessmentAttempt>({
	schemaVersion: { type: String, default: '1.0.0' },
	organizationId: { type: String, required: true, maxlength: 100, index: true },
	assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
	learnerId: { type: String, required: true, maxlength: 180, index: true },
	courseId: { type: String, required: true, maxlength: 180 },
	activityKey: { type: String, required: true, maxlength: 80 },
	responses: { type: [AssessmentResponseSchema], required: true, default: [] },
	score: { type: Number, required: true, min: 0, max: 100 },
	passed: { type: Boolean, required: true },
	attemptNumber: { type: Number, required: true, min: 1 },
	submittedAt: { type: Date, required: true },
}, { timestamps: true, versionKey: 'version' }).index({ assessment: 1, learnerId: 1, courseId: 1, activityKey: 1, attemptNumber: 1 }, { unique: true });

export const AssessmentAttemptModelName = 'AssessmentAttempt';
export const AssessmentAttemptModelFactory = MongooseSeedwork.modelFactory<AssessmentAttempt>(AssessmentAttemptModelName, AssessmentAttemptSchema);
export type AssessmentAttemptModelType = ReturnType<typeof AssessmentAttemptModelFactory>;

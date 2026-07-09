import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { Domain } from '@axc/domain';
import { type Model, Schema } from 'mongoose';

/**
 * Mongoose persistence shape for a Course. Mirrors the Community model:
 * a document interface that extends {@link MongooseSeedwork.Base} (providing
 * `_id: ObjectId`, `schemaVersion`, `createdAt`/`updatedAt` as `Date`, and a
 * `version` key), kept deliberately separate from the domain aggregate.
 */
export interface Course extends MongooseSeedwork.Base {
	title: string;
	summary: string;
	modality: string;
	status: string;
	tags: string[];
}

const CourseSchema = new Schema<Course, Model<Course>, Course>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		title: { type: String, required: true, maxlength: 200 },
		summary: { type: String, required: true, maxlength: 2000 },
		modality: { type: String, required: true, enum: [...Domain.Contexts.Course.Course.COURSE_MODALITIES] },
		status: { type: String, required: true, enum: [...Domain.Contexts.Course.Course.COURSE_STATUSES] },
		tags: { type: [String], required: true, default: [] },
	},
	{
		timestamps: true,
		versionKey: 'version',
	},
).index({ title: 1 });

export const CourseModelName = 'Course';
export const CourseModelFactory = MongooseSeedwork.modelFactory<Course>(CourseModelName, CourseSchema);
export type CourseModelType = ReturnType<typeof CourseModelFactory>;

import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface Lesson {
	key: string;
	title: string;
	type: 'ARTICLE' | 'VIDEO' | 'QUIZ' | 'PROJECT' | 'RESOURCE';
	estimatedMinutes: number;
	required: boolean;
}

export interface CourseModule {
	key: string;
	title: string;
	description: string;
	order: number;
	lessons: Lesson[];
}

export interface Course extends MongooseSeedwork.Base {
	organizationId: string;
	title: string;
	summary: string;
	description: string;
	status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
	level: 'FOUNDATIONAL' | 'INTERMEDIATE' | 'ADVANCED';
	category: string;
	tags: string[];
	skills: string[];
	modules: CourseModule[];
	createdBy: string;
	publishedAt: Date | null;
}

const LessonSchema = new Schema<Lesson>(
	{
		key: { type: String, required: true, maxlength: 80 },
		title: { type: String, required: true, maxlength: 180 },
		type: { type: String, required: true, enum: ['ARTICLE', 'VIDEO', 'QUIZ', 'PROJECT', 'RESOURCE'] },
		estimatedMinutes: { type: Number, required: true, min: 1, max: 1440 },
		required: { type: Boolean, required: true, default: true },
	},
	{ _id: false },
);

const CourseModuleSchema = new Schema<CourseModule>(
	{
		key: { type: String, required: true, maxlength: 80 },
		title: { type: String, required: true, maxlength: 180 },
		description: { type: String, maxlength: 1000, default: '' },
		order: { type: Number, required: true, min: 1 },
		lessons: { type: [LessonSchema], required: true, default: [] },
	},
	{ _id: false },
);

const CourseSchema = new Schema<Course, Model<Course>, Course>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true, maxlength: 100, index: true },
		title: { type: String, required: true, maxlength: 180 },
		summary: { type: String, required: true, maxlength: 300 },
		description: { type: String, required: true, maxlength: 10000 },
		status: { type: String, required: true, enum: ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT', index: true },
		level: { type: String, required: true, enum: ['FOUNDATIONAL', 'INTERMEDIATE', 'ADVANCED'] },
		category: { type: String, required: true, maxlength: 100, index: true },
		tags: { type: [String], default: [] },
		skills: { type: [String], default: [] },
		modules: { type: [CourseModuleSchema], default: [] },
		createdBy: { type: String, required: true, maxlength: 150 },
		publishedAt: { type: Date, default: null },
	},
	{ timestamps: true, versionKey: 'version' },
)
	.index({ organizationId: 1, title: 1 }, { unique: true })
	.index({ organizationId: 1, status: 1, category: 1 })
	.index({ title: 'text', summary: 'text', description: 'text', tags: 'text', skills: 'text' });

export const CourseModelName = 'Course';
export const CourseModelFactory = MongooseSeedwork.modelFactory<Course>(CourseModelName, CourseSchema);
export type CourseModelType = ReturnType<typeof CourseModelFactory>;

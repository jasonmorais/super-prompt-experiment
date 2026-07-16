import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, type ObjectId, type PopulatedDoc, Schema, type Types } from 'mongoose';
import type { StaffRole } from '../role/staff-role.model.ts';
import { type User, type UserModelType, userOptions } from './user.model.ts';

export interface StaffUserActivityDetail extends MongooseSeedwork.SubdocumentBase {
	activityType: 'CREATED' | 'UPDATED' | 'ROLE_ASSIGNED' | 'ROLE_REMOVED' | 'BLOCKED' | 'UNBLOCKED';
	activityDescription: string;
	activityBy: ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

const StaffUserActivityDetailSchema = new Schema<StaffUserActivityDetail>({
	activityType: { type: String, required: true, enum: ['CREATED', 'UPDATED', 'ROLE_ASSIGNED', 'ROLE_REMOVED', 'BLOCKED', 'UNBLOCKED'] },
	activityDescription: { type: String, required: true, maxlength: 2000 },
	activityBy: { type: Schema.Types.ObjectId, ref: 'staff-user', required: true },
}, { timestamps: true, versionKey: 'version' });

export interface StaffUser extends User {
	role?: PopulatedDoc<StaffRole> | ObjectId;
	firstName: string;
	lastName: string;
	email: string;
	displayName: string;
	externalId: string;
	accessBlocked: boolean;
	tags: string[];
	activityLog: Types.DocumentArray<StaffUserActivityDetail>;
}

const StaffUserSchema = new Schema<StaffUser, Model<StaffUser>, StaffUser>({
	role: { type: Schema.Types.ObjectId, ref: 'staff-user-role' },
	firstName: { type: String, maxlength: 500, default: '' },
	lastName: { type: String, maxlength: 500, default: '' },
	email: { type: String, maxlength: 254, default: '' },
	schemaVersion: { type: String, default: '1.0.0' },
	externalId: { type: String, required: true, unique: true, index: true, maxlength: 180 },
	displayName: { type: String, required: true, maxlength: 500 },
	accessBlocked: { type: Boolean, required: true, default: false },
	tags: { type: [String], required: true, default: [] },
	activityLog: { type: [StaffUserActivityDetailSchema], default: [] },
}, userOptions).index({ email: 1 }, { sparse: true });

export const StaffUserModelName = 'staff-user';
export const StaffUserModelFactory = (UserModel: UserModelType) => UserModel.discriminator(StaffUserModelName, StaffUserSchema);
export type StaffUserModelType = ReturnType<typeof StaffUserModelFactory>;

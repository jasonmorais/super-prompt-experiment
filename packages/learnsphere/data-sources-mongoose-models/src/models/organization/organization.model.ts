import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface Organization extends MongooseSeedwork.Base {
	externalId: string;
	name: string;
	parentOrganizationId: string | null;
	ancestorOrganizationIds: string[];
	createdBy: string;
}

const OrganizationSchema = new Schema<Organization, Model<Organization>, Organization>({
	schemaVersion: { type: String, default: '1.0.0' },
	externalId: { type: String, required: true, unique: true, maxlength: 100, index: true },
	name: { type: String, required: true, maxlength: 180 },
	parentOrganizationId: { type: String, default: null, maxlength: 100, index: true },
	ancestorOrganizationIds: { type: [String], required: true, default: [], index: true },
	createdBy: { type: String, required: true, maxlength: 180 },
}, { timestamps: true, versionKey: 'version' });

export const OrganizationModelName = 'Organization';
export const OrganizationModelFactory = MongooseSeedwork.modelFactory<Organization>(OrganizationModelName, OrganizationSchema);
export type OrganizationModelType = ReturnType<typeof OrganizationModelFactory>;

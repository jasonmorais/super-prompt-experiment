import { type Model, Schema, type SchemaDefinition } from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type User, type UserModelType, userOptions } from './user.model.ts';

export interface LearnerUserContactInformation extends MongooseSeedwork.NestedPath {
	email: string;
}

export interface LearnerUserIdentityDetails extends MongooseSeedwork.NestedPath {
	lastName: string;
	legalNameConsistsOfOneName: boolean;
	restOfName?: string;
}

export interface LearnerUserPersonalInformation extends MongooseSeedwork.NestedPath {
	identityDetails: LearnerUserIdentityDetails;
	contactInformation: LearnerUserContactInformation;
}

const identityDetails: SchemaDefinition<LearnerUserIdentityDetails> = {
	lastName: { type: String, required: true, maxlength: 50 },
	legalNameConsistsOfOneName: { type: Boolean, required: true, default: false },
	restOfName: { type: String, required: false, maxlength: 50 },
};

const contactInformation: SchemaDefinition<LearnerUserContactInformation> = {
	email: { type: String, required: false, maxlength: 254 },
};

const personalInformation: SchemaDefinition<LearnerUserPersonalInformation> = {
	identityDetails: { type: identityDetails, required: true, ...MongooseSeedwork.NestedPathOptions },
	contactInformation: { type: contactInformation, required: true, ...MongooseSeedwork.NestedPathOptions },
};

export interface LearnerUser extends User {
	personalInformation: LearnerUserPersonalInformation;
	email?: string;
	displayName: string;
	externalId: string;
	accessBlocked: boolean;
	tags?: string[];
}

const LearnerUserSchema = new Schema<LearnerUser, Model<LearnerUser>, LearnerUser>({
	personalInformation: { type: personalInformation, required: true, ...MongooseSeedwork.NestedPathOptions },
	email: { type: String, maxlength: 254, required: false },
	displayName: { type: String, required: true, maxlength: 500 },
	externalId: { type: String, required: true, unique: true, index: true, maxlength: 180 },
	accessBlocked: { type: Boolean, required: true, default: false },
	tags: { type: [String], required: false },
	schemaVersion: { type: String, default: '1.0.0', immutable: true },
}, userOptions).index({ 'personalInformation.contactInformation.email': 1 }, { sparse: true });

export const LearnerUserModelName = 'learner-user';
export const LearnerUserModelFactory = (UserModel: UserModelType) => UserModel.discriminator(LearnerUserModelName, LearnerUserSchema);
export type LearnerUserModelType = ReturnType<typeof LearnerUserModelFactory>;

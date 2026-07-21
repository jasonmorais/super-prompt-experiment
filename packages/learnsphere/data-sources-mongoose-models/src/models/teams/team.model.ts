import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface TeamMember {
	learnerId: string;
	displayName: string;
	email: string;
}

export interface Team extends MongooseSeedwork.Base {
	organizationId: string;
	name: string;
	members: TeamMember[];
	teamLeadIds: string[];
	createdBy: string;
}

const MemberSchema = new Schema<TeamMember>({ learnerId: { type: String, required: true, maxlength: 180 }, displayName: { type: String, required: true, maxlength: 180 }, email: { type: String, required: true, maxlength: 254 } }, { _id: false });
const TeamSchema = new Schema<Team, Model<Team>, Team>({
	schemaVersion: { type: String, default: '1.0.0' },
	organizationId: { type: String, required: true, maxlength: 100, index: true },
	name: { type: String, required: true, maxlength: 120 },
	members: { type: [MemberSchema], default: [] },
	teamLeadIds: { type: [String], default: [] },
	createdBy: { type: String, required: true, maxlength: 180 },
}, { timestamps: true, versionKey: 'version' }).index({ organizationId: 1, name: 1 }, { unique: true });

export const TeamModelName = 'Team';
export const TeamModelFactory = MongooseSeedwork.modelFactory<Team>(TeamModelName, TeamSchema);
export type TeamModelType = ReturnType<typeof TeamModelFactory>;

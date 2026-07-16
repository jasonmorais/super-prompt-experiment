import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface Role extends MongooseSeedwork.Base {
	discriminatorKey: string;
	roleType?: string;
}

export const roleOptions = { discriminatorKey: 'roleType', timestamps: true };
const RoleSchema = new Schema<Role, Model<Role>, Role>({}, roleOptions);
export const RoleModelName = 'Role';
export const RoleModelFactory = MongooseSeedwork.modelFactory<Role>(RoleModelName, RoleSchema);
export type RoleModelType = ReturnType<typeof RoleModelFactory>;

import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { CourseModelFactory } from './models/learning/course.model.ts';
import { LearningRecordModelFactory } from './models/delivery/learning-record.model.ts';
import { TeamOperationModelFactory } from './models/operations/team-operation.model.ts';
import { TeamModelFactory } from './models/teams/team.model.ts';
import { RoleModelFactory } from './models/role/role.model.ts';
import { StaffRoleModelFactory } from './models/role/staff-role.model.ts';
import { LearnerUserModelFactory } from './models/user/learner-user.model.ts';
import { StaffUserModelFactory } from './models/user/staff-user.model.ts';
import { UserModelFactory } from './models/user/user.model.ts';

export type { Course, CourseModelType } from './models/learning/course.model.ts';
export type { LearningRecord, LearningRecordModelType } from './models/delivery/learning-record.model.ts';
export type { TeamOperation, TeamOperationModelType } from './models/operations/team-operation.model.ts';
export type { Team, TeamMember, TeamModelType } from './models/teams/team.model.ts';
export type { Role, RoleModelType } from './models/role/role.model.ts';
export type { StaffEnterpriseAppRole, StaffRole, StaffRoleModelType, StaffRolePermissions, StaffRolePortalPermissions, StaffRoleRolePermissions, StaffRoleUserPermissions } from './models/role/staff-role.model.ts';
export type { LearnerUser, LearnerUserContactInformation, LearnerUserIdentityDetails, LearnerUserModelType, LearnerUserPersonalInformation } from './models/user/learner-user.model.ts';
export type { StaffUser, StaffUserActivityDetail, StaffUserModelType } from './models/user/staff-user.model.ts';
export type { User, UserModelType } from './models/user/user.model.ts';

/**
 * Builds the map of Mongoose models used by the persistence layer.
 *
 * Each persisted aggregate is registered here for the persistence composition root.
 */
export const mongooseContextBuilder = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}
	const roleModel = RoleModelFactory(initializedService);
	const userModel = UserModelFactory(initializedService);
	return {
		Course: CourseModelFactory(initializedService),
		LearningRecord: LearningRecordModelFactory(initializedService),
		TeamOperation: TeamOperationModelFactory(initializedService),
		Team: TeamModelFactory(initializedService),
		Role: roleModel,
		StaffRole: StaffRoleModelFactory(roleModel),
		User: userModel,
		LearnerUser: LearnerUserModelFactory(userModel),
		StaffUser: StaffUserModelFactory(userModel),
	} as const;
};

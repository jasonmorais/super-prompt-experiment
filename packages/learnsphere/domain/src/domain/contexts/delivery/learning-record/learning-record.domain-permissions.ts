/** Permissions evaluated by the LearningRecord aggregate's visa. */
export interface LearningRecordDomainPermissions {
	canSelfEnroll: boolean;
	canAssignLearning: boolean;
	canViewTeamLearning: boolean;
	canRecordProgress: boolean;
	canWaiveAssignments: boolean;
}

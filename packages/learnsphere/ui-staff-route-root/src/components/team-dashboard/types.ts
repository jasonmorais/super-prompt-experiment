import type { EnrollmentSource, StaffTeamDashboardContainerTeamOverviewQuery } from '../../generated.tsx';

export type RecordView = StaffTeamDashboardContainerTeamOverviewQuery['teamLearning'][number];
export type CourseView = StaffTeamDashboardContainerTeamOverviewQuery['courses'][number];
export type TeamMemberView = { learnerId: string; displayName: string; email: string; teamName: string };
export type LearnerRow = { key: string; learnerId: string; name: string; email: string; teamName: string; assignments: number; completed: number; overdue: number; averageProgress: number; learningMinutes: number };
export type AssignmentValues = { learnerId: string; courseId: string; dueAt?: { toISOString(): string }; source: EnrollmentSource };

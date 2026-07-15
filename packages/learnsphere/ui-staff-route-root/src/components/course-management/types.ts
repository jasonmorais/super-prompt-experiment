import type { CourseLevel, LessonType, StaffCourseManagementContainerCourseManagementQuery } from '../../generated.tsx';

export type Course = StaffCourseManagementContainerCourseManagementQuery['courses'][number];
export type Assignment = StaffCourseManagementContainerCourseManagementQuery['teamLearning'][number];
export type Person = { learnerId: string; learnerDisplayName: string; learnerEmail: string; teamName: string };
export type CourseValues = {
	title: string;
	summary: string;
	description: string;
	category: string;
	level: CourseLevel;
	tags?: string[];
	skills?: string[];
	discoverability: 'CATALOG' | 'ASSIGNED_ONLY';
	requiresCompletionScreenshot: boolean;
};
export type ModuleValues = { moduleTitle: string; moduleDescription: string; lessonTitle: string; lessonType: LessonType; lessonContent: string; estimatedMinutes: number; required: boolean };
export type AssignmentValues = { learnerId: string; dueAt?: { toISOString(): string }; source: 'MANAGER_ASSIGNED' | 'PROGRAM_ASSIGNED' | 'COMPLIANCE_ASSIGNED' };

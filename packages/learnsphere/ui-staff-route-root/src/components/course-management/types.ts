import type { StaffCourseManagementContainerCourseManagementQuery } from '../../generated.tsx';

export type Course = StaffCourseManagementContainerCourseManagementQuery['courses'][number];
export type Assignment = StaffCourseManagementContainerCourseManagementQuery['teamLearning'][number];
export type Person = { learnerId: string; learnerDisplayName: string; learnerEmail: string; teamName: string };
export type AssignmentValues = { learnerId: string; dueAt?: { toISOString(): string }; source: 'MANAGER_ASSIGNED' | 'PROGRAM_ASSIGNED' | 'COMPLIANCE_ASSIGNED' };

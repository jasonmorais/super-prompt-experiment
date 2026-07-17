import type { DataSources } from '@learnsphere/persistence';
import { Course, type CourseApplicationService } from './course/index.ts';
import { Assessment, type AssessmentApplicationService } from './assessment/index.ts';

export interface LearningContextApplicationService {
	Course: CourseApplicationService;
	Assessment: AssessmentApplicationService;
}

export const Learning = (dataSources: DataSources, passport: import('@learnsphere/domain').Passport, createdBy: string): LearningContextApplicationService => ({ Course: Course(dataSources, createdBy), Assessment: Assessment(dataSources, passport, createdBy) });

import type { DataSources } from '@learnsphere/persistence';
import { Course, type CourseApplicationService } from './course/index.ts';

export interface LearningContextApplicationService {
	Course: CourseApplicationService;
}

export const Learning = (dataSources: DataSources, createdBy: string): LearningContextApplicationService => ({ Course: Course(dataSources, createdBy) });

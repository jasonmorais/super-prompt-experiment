import type { Connection } from 'mongoose';
import { seedCourses } from './courses.ts';

export const seedDatabase = async (connection: Connection) => {
	await seedCourses(connection);
};

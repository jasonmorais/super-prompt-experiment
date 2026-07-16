import type React from 'react';
import { DashboardPage } from './components/pages/dashboard.tsx';
export { CatalogPage as Catalog } from './components/pages/catalog.tsx';
export { CoursePage as Course } from './components/pages/course.tsx';
export { LoginPage as Login } from './components/pages/login.tsx';
export { OperationsPage as Operations } from './components/pages/operations.tsx';
export { TeamGoalPage as TeamGoal } from './components/pages/team-goal.tsx';
export { useLearnerAuthorization } from './learner-authorization.tsx';

/** The root route of the LearnSphere learner portal. */
export const Root: React.FC = () => {
	return <DashboardPage />;
};

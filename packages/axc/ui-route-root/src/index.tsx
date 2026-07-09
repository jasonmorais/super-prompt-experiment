import type React from 'react';
import { RouteRegistry } from './routes/route-registry.tsx';

export const Root: React.FC = () => {
	return <RouteRegistry />;
};

export { CourseListRoute } from './routes/course-list-route.tsx';
export { HomeRoute } from './routes/home-route.tsx';
export { NotFoundRoute } from './routes/not-found-route.tsx';
export { RouteRegistry, routeNavigationItems } from './routes/route-registry.tsx';

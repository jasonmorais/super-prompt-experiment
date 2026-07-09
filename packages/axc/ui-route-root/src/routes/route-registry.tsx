import { Route, Routes } from 'react-router-dom';
import { CourseListRoute } from './course-list-route.tsx';
import { HomeRoute } from './home-route.tsx';
import { NotFoundRoute } from './not-found-route.tsx';
export { routeNavigationItems } from './navigation.tsx';

export const RouteRegistry = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={<HomeRoute />}
			/>
			<Route
				path="/courses"
				element={<CourseListRoute />}
			/>
			<Route
				path="*"
				element={<NotFoundRoute />}
			/>
		</Routes>
	);
};

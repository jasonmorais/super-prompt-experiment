import { RequireAuth } from '@cellix/ui-core';
import { Catalog, Course, Login, Operations, Root, TeamGoal, useLearnerAuthorization } from '@learnsphere/ui-route-root';
import { Spin } from 'antd';
import { useAuth } from 'react-oidc-context';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ApolloConnection } from './components/ui/organisms/apollo-connection/index.tsx';

const Authenticated = ({ children }: { children: React.JSX.Element }) => {
	const auth = useAuth();
	const learner = useLearnerAuthorization();
	if (auth.isLoading || auth.activeNavigator)
		return (
			<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
				<Spin size="large" />
			</div>
		);
	return auth.isAuthenticated && !learner.loading ? (
		children
	) : (
		<Navigate
			to="/login"
			replace
		/>
	);
};

const Entry = () => {
	const auth = useAuth();
	if (auth.isLoading)
		return (
			<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
				<Spin size="large" />
			</div>
		);
	return (
		<Navigate
			to={auth.isAuthenticated ? '/dashboard' : '/login'}
			replace
		/>
	);
};

/**
 * The learner portal route table. Authoring and administration experiences can
 * be mounted alongside the dashboard as their bounded contexts grow.
 */
export default function App() {
	return (
		<ApolloConnection>
			<Routes>
				<Route
					path="/"
					element={<Entry />}
				/>
				<Route
					path="/login"
					element={<Login />}
				/>
				<Route
					path="/auth-redirect"
					element={
						<RequireAuth forceLogin={true}>
							<Navigate
								to="/dashboard"
								replace
							/>
						</RequireAuth>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<Authenticated>
							<Root />
						</Authenticated>
					}
				/>
				<Route
					path="/catalog"
					element={
						<Authenticated>
							<Catalog />
						</Authenticated>
					}
				/>
				<Route
					path="/courses/:courseId"
					element={
						<Authenticated>
							<Course />
						</Authenticated>
					}
				/>
				<Route
					path="/courses/:courseId/activities/:activityKey"
					element={
						<Authenticated>
							<Course />
						</Authenticated>
					}
				/>
				<Route path="/operations/:operationId" element={<Authenticated><TeamGoal /></Authenticated>} />
				<Route path="/operations" element={<Authenticated><Operations /></Authenticated>} />
				<Route
					path="*"
					element={
						<Navigate
							to="/"
							replace
						/>
					}
				/>
			</Routes>
		</ApolloConnection>
	);
}

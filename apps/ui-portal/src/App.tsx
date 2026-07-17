import { RequireAuth } from '@cellix/ui-core';
import { AppLayout } from '@learnsphere/ui-shared';
import { Catalog, Course, Leaderboard, Login, Operations, Root, TeamGoal, useLearnerAuthorization } from '@learnsphere/ui-route-root';
import { Alert, Button, Spin } from 'antd';
import { useEffect, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ApolloConnection } from './components/ui/organisms/apollo-connection/index.tsx';

const Reauthenticate = () => {
	const auth = useAuth();
	const started = useRef(false);
	useEffect(() => {
		if (started.current) return;
		started.current = true;
		const redirectTo = `${globalThis.location.pathname}${globalThis.location.search}`;
		void (async () => {
			await auth.removeUser();
			globalThis.sessionStorage.setItem('redirectTo', redirectTo);
			await auth.signinRedirect();
		})();
	}, [auth]);
	return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><Spin size="large" tip="Refreshing your session" /></div>;
};

const Authenticated = ({ children }: { children: React.JSX.Element }) => {
	const auth = useAuth();
	const learner = useLearnerAuthorization();
	if (auth.isLoading || auth.activeNavigator || (auth.isAuthenticated && learner.loading))
		return (
			<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
				<Spin size="large" />
			</div>
		);
	if (!auth.isAuthenticated)
		return (
		<Navigate
			to="/login"
			replace
		/>
	);
	if (learner.error)
		if (learner.error.message.toLowerCase().includes('unauthorized')) return <Reauthenticate />;
	if (learner.error)
		return (
			<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
				<Alert
					type="error"
					showIcon
					message="Your learner workspace could not be initialized"
					description={learner.error.message}
					action={<Button onClick={() => void learner.refetch()}>Try again</Button>}
				/>
			</div>
		);
	return children;
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
				<Route element={<Authenticated><AppLayout><Outlet /></AppLayout></Authenticated>}>
					<Route path="/dashboard" element={<Root />} />
					<Route path="/catalog" element={<Catalog />} />
					<Route path="/courses/:courseId" element={<Course />} />
					<Route path="/courses/:courseId/activities/:activityKey" element={<Course />} />
					<Route path="/operations/:operationId" element={<TeamGoal />} />
					<Route path="/operations" element={<Operations />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
				</Route>
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

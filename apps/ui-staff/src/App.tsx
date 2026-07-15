import { RequireAuth } from '@cellix/ui-core';
import { hasStaffAccess, readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { CourseManagement, StaffLogin, TeamDashboard, TeamManagement, TeamOperations } from '@learnsphere/ui-staff-route-root';
import { Spin } from 'antd';
import { useAuth } from 'react-oidc-context';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ApolloConnection } from './components/ui/organisms/apollo-connection/index.tsx';

const Protected = ({ children }: { children: React.JSX.Element }) => {
	const auth = useAuth();
	if (auth.isLoading || auth.activeNavigator)
		return (
			<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
				<Spin size="large" />
			</div>
		);
	const roles = readLearnSphereIdentity(auth.user?.profile).roles;
	return auth.isAuthenticated && hasStaffAccess(roles) ? (
		children
	) : (
		<Navigate
			to="/login"
			replace
		/>
	);
};

export default function App() {
	return (
		<ApolloConnection>
			<Routes>
				<Route
					path="/"
					element={
						<Navigate
							to="/staff"
							replace
						/>
					}
				/>
				<Route
					path="/login"
					element={<StaffLogin />}
				/>
				<Route
					path="/auth-redirect"
					element={
						<RequireAuth forceLogin={true}>
							<Navigate
								to="/staff"
								replace
							/>
						</RequireAuth>
					}
				/>
				<Route
					path="/staff"
					element={
						<Protected>
							<TeamDashboard />
						</Protected>
					}
				/>
				<Route
					path="/staff/courses"
					element={
						<Protected>
							<CourseManagement />
						</Protected>
					}
				/>
				<Route path="/staff/operations" element={<Protected><TeamOperations /></Protected>} />
				<Route path="/staff/teams" element={<Protected><TeamManagement /></Protected>} />
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

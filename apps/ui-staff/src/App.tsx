import { RequireAuth } from '@cellix/ui-core';
import type { LearnSphereStaffCapabilities } from '@learnsphere/ui-shared';
import { CourseManagement, getDefaultStaffPath, StaffLayout, StaffLogin, TeamDashboard, TeamOperations, useStaffAuthorization } from '@learnsphere/ui-staff-route-root';
import { TeamManagementContainer } from '@learnsphere/ui-staff-route-team-management';
import { Spin } from 'antd';
import { useAuth } from 'react-oidc-context';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ApolloConnection } from './components/ui/organisms/apollo-connection/index.tsx';

interface ProtectedProps {
	children: React.JSX.Element;
	required?: keyof LearnSphereStaffCapabilities;
}

const Protected = ({ children, required }: ProtectedProps) => {
	const auth = useAuth();
	const authorization = useStaffAuthorization();
	if (auth.isLoading || auth.activeNavigator)
		return (
			<div
				className="min-h-screen place-items-center"
				style={{ display: 'grid' }}
			>
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
	return authorization.loading ? <Spin size="large" /> : authorization.roleName && (!required || authorization.capabilities[required]) ? (
		children
	) : (
		<Navigate
			to="/unauthorized"
			replace
		/>
	);
};

const StaffEntry = () => {
	const authorization = useStaffAuthorization();
	if (authorization.loading) return <Spin size="large" />;
	return <Navigate to={getDefaultStaffPath(authorization.capabilities)} replace />;
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
							<StaffEntry />
						</Protected>
					}
				/>
				<Route
					path="/staff/overview"
					element={
						<Protected required="canViewTeamLearning">
							<TeamDashboard />
						</Protected>
					}
				/>
				<Route
					path="/staff/courses"
					element={
						<Protected required="canManageCourses">
							<CourseManagement />
						</Protected>
					}
				/>
				<Route
					path="/staff/operations/:operationId"
					element={
						<Protected required="canManageTeamOperations">
							<TeamOperations />
						</Protected>
					}
				/>
				<Route
					path="/staff/operations"
					element={
						<Protected required="canManageTeamOperations">
							<TeamOperations />
						</Protected>
					}
				/>
				<Route
					path="/staff/teams"
					element={
						<Protected required="canManageTeams">
							<StaffLayout>
								<TeamManagementContainer />
							</StaffLayout>
						</Protected>
					}
				/>
				<Route
					path="/unauthorized"
					element={<div className="grid min-h-screen place-items-center">You are not authorized to view this area.</div>}
				/>
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

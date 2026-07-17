import { RequireAuth } from '@cellix/ui-core';
import type { LearnSphereStaffCapabilities } from '@learnsphere/ui-shared';
import { AssessmentAuthoring, CourseEditor, CourseManagement, getDefaultStaffPath, StaffLayout, StaffLogin, TeamDashboard, TeamOperationEditor, TeamOperations, useStaffAuthorization } from '@learnsphere/ui-staff-route-root';
import { TeamManagementContainer } from '@learnsphere/ui-staff-route-team-management';
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
			globalThis.sessionStorage.setItem('staffRedirectTo', redirectTo);
			await auth.signinRedirect();
		})();
	}, [auth]);
	return <div className="grid min-h-screen place-items-center"><Spin size="large" tip="Refreshing your session" /></div>;
};

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
	if (authorization.error?.message.toLowerCase().includes('unauthorized')) return <Reauthenticate />;
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

const Unauthorized = () => {
	const auth = useAuth();
	const authorization = useStaffAuthorization();
	if (auth.isLoading || authorization.loading) return <div className="grid min-h-screen place-items-center"><Spin size="large" /></div>;
	if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
	if (authorization.error?.message.toLowerCase().includes('unauthorized')) return <Reauthenticate />;
	const recoveryPath = getDefaultStaffPath(authorization.capabilities);
	if (authorization.roleName && recoveryPath !== '/unauthorized') return <Navigate to={recoveryPath} replace />;
	return (
		<div className="grid min-h-screen place-items-center bg-slate-50 p-6">
			<Alert
				type="error"
				showIcon
				message="Staff access could not be initialized"
				description={authorization.error?.message ?? 'Your signed-in identity does not have a recognized staff role.'}
				action={<Button onClick={() => { void auth.removeUser(); void auth.signoutRedirect({ post_logout_redirect_uri: `${globalThis.location.origin}/login` }); }}>Sign in again</Button>}
			/>
		</div>
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
				<Route path="/staff" element={<Protected><StaffLayout><Outlet /></StaffLayout></Protected>}>
					<Route index element={<StaffEntry />} />
					<Route path="overview" element={<Protected required="canViewTeamLearning"><TeamDashboard /></Protected>} />
					<Route path="courses" element={<Protected required="canManageCourses"><CourseManagement /></Protected>} />
					<Route path="courses/new" element={<Protected required="canManageCourses"><CourseEditor /></Protected>} />
					<Route path="courses/:courseId/edit" element={<Protected required="canManageCourses"><CourseEditor /></Protected>} />
					<Route path="courses/:courseId/assessments/new" element={<Protected required="canManageAssessments"><AssessmentAuthoring /></Protected>} />
					<Route path="courses/:courseId/assessments/:assessmentId/edit" element={<Protected required="canManageAssessments"><AssessmentAuthoring /></Protected>} />
					<Route path="operations/:operationId" element={<Protected required="canManageTeamOperations"><TeamOperations /></Protected>} />
					<Route path="operations/new" element={<Protected required="canManageTeamOperations"><TeamOperationEditor /></Protected>} />
					<Route path="operations/:operationId/edit" element={<Protected required="canManageTeamOperations"><TeamOperationEditor /></Protected>} />
					<Route path="operations" element={<Protected required="canManageTeamOperations"><TeamOperations /></Protected>} />
					<Route path="teams" element={<Protected required="canManageTeams"><TeamManagementContainer /></Protected>} />
				</Route>
				<Route
					path="/unauthorized"
					element={<Unauthorized />}
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

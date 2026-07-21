import { BookOutlined, DashboardOutlined, LogoutOutlined, ThunderboltOutlined, TeamOutlined } from '@ant-design/icons';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Avatar, Button, ConfigProvider, Layout, Menu, Space, Tag, Typography, type MenuProps } from 'antd';
import type { ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './staff-layout.module.css';
import { useStaffAuthorization } from '../../staff-authorization.tsx';

const { Sider, Header, Content } = Layout;

const roleLabel = (role: string): string => {
	if (role === 'ManagerLearningAdmin') return 'Learning administrator';
	if (role === 'LearningAdmin') return 'Learning administrator';
	return role.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase());
};

export interface StaffLayoutProps {
	children: ReactNode;
}

export const StaffLayout = ({ children }: StaffLayoutProps) => {
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const authorization = useStaffAuthorization();
	const name = `${identity.givenName} ${identity.familyName}`.trim() || identity.email || 'Staff user';
	const initials = `${identity.givenName[0] ?? ''}${identity.familyName[0] ?? ''}` || name.slice(0, 2).toUpperCase();
	const capabilities = authorization.capabilities;
	const organizationName = identity.organizationName;
	const menuItems: MenuProps['items'] = [
		...(capabilities.canViewTeamLearning ? [{ key: 'team', icon: <DashboardOutlined />, label: 'Team overview' }] : []),
		...(capabilities.canManageCourses ? [{ key: 'courses', icon: <BookOutlined />, label: 'Course management' }] : []),
		...(capabilities.canManageTeamOperations ? [{ key: 'operations', icon: <ThunderboltOutlined />, label: 'Team operations' }] : []),
		...(capabilities.canManageTeams ? [{ key: 'teams', icon: <TeamOutlined />, label: 'Manage teams' }] : []),
	];
	return (
		<ConfigProvider theme={{ token: { colorPrimary: '#6d4aff', colorInfo: '#6d4aff', borderRadius: 10, colorBgLayout: '#f4f6f8' }, components: { Button: { primaryShadow: 'none' } } }}>
			<Layout className="min-h-screen bg-slate-100">
				<Sider
					width={258}
					breakpoint="lg"
					collapsedWidth="0"
					className={styles['sider']}
				>
					<div className={styles['brand']}>
						<div className={styles['brand-mark']}>L</div>
						<div>
							<div className={styles['brand-name']}>LearnSphere</div>
							<small className={styles['workspace-label']}>Staff workspace</small>
						</div>
					</div>
					<Menu
						theme="dark"
						mode="inline"
						selectedKeys={[location.pathname.includes('/courses') ? 'courses' : location.pathname.includes('/operations') ? 'operations' : location.pathname.includes('/teams') ? 'teams' : 'team']}
						onClick={({ key }) => navigate(key === 'courses' ? '/staff/courses' : key === 'operations' ? '/staff/operations' : key === 'teams' ? '/staff/teams' : '/staff/overview')}
						items={menuItems}
						className="border-0 bg-transparent"
					/>
					<div className={styles['permissions-card']}>
						<div style={{ fontWeight: 650 }}>
							<TeamOutlined /> Staff permissions
						</div>
						<small className={styles['permissions-copy']}>Create courses, assign learning, and review team progress.</small>
						<div className={styles['permission-tags']}>
							{[authorization.roleName].filter(Boolean).map((role) => (
								<Tag
									key={role}
									bordered={false}
								>
									{roleLabel(role)}
								</Tag>
							))}
						</div>
					</div>
				</Sider>
				<Layout>
					<Header className={styles['header']}>
						<Typography.Text strong>{organizationName} · Learning operations</Typography.Text>
						<Space>
							<Avatar style={{ background: '#d9d1ff', color: '#3e278f' }}>{initials}</Avatar>
							<div className={styles['identity']}>
								<div style={{ fontWeight: 650 }}>{name}</div>
								<small className={styles['email']}>{identity.email}</small>
							</div>
							<Button
								type="text"
								icon={<LogoutOutlined />}
								onClick={() => {
									void auth.removeUser();
									void auth.signoutRedirect({ post_logout_redirect_uri: `${globalThis.location.origin}/login` });
								}}
							>
								Sign out
							</Button>
						</Space>
					</Header>
					<Content className={styles['content']}>{children}</Content>
				</Layout>
			</Layout>
		</ConfigProvider>
	);
};

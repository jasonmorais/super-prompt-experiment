import { BookOutlined, DashboardOutlined, LogoutOutlined, TeamOutlined } from '@ant-design/icons';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { Avatar, Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider, Header, Content } = Layout;

export const StaffLayout = ({ children }: { children: ReactNode }) => {
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const name = `${identity.givenName} ${identity.familyName}`.trim() || identity.email || 'Staff user';
	const initials = `${identity.givenName[0] ?? ''}${identity.familyName[0] ?? ''}` || name.slice(0, 2).toUpperCase();
	const roles = identity.roles;
	const organizationName = identity.organizationName;
	return (
		<Layout style={{ minHeight: '100vh', background: '#f4f6f8' }}>
			<Sider
				width={258}
				breakpoint="lg"
				collapsedWidth="0"
				style={{ background: '#17233c', padding: '22px 12px', position: 'sticky', top: 0, height: '100vh' }}
			>
				<div style={{ color: 'white', padding: '0 14px 28px', display: 'flex', alignItems: 'center', gap: 11 }}>
					<div style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', background: '#7c5cff', borderRadius: 11, fontWeight: 900 }}>L</div>
					<div>
						<div style={{ fontSize: 19, fontWeight: 750 }}>LearnSphere</div>
						<small style={{ color: '#9facbf' }}>Staff workspace</small>
					</div>
				</div>
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={[location.pathname.includes('/courses') ? 'courses' : 'team']}
					onClick={({ key }) => navigate(key === 'courses' ? '/staff/courses' : '/staff')}
					items={[
						{ key: 'team', icon: <DashboardOutlined />, label: 'Team overview' },
						{ key: 'courses', icon: <BookOutlined />, label: 'Course management' },
					]}
					style={{ background: 'transparent', border: 0 }}
				/>
				<div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, background: '#22304a', borderRadius: 14, padding: 14, color: '#cbd4e1' }}>
					<TeamOutlined /> Manager access
					<div style={{ marginTop: 7 }}>
						{roles.map((role) => (
							<Tag
								key={role}
								bordered={false}
							>
								{role}
							</Tag>
						))}
					</div>
				</div>
			</Sider>
			<Layout>
				<Header style={{ height: 74, background: 'white', padding: '0 34px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e6eaf0' }}>
					<Typography.Text strong>{organizationName} · Learning operations</Typography.Text>
					<Space>
						<Avatar style={{ background: '#d9d1ff', color: '#3e278f' }}>{initials}</Avatar>
						<div style={{ lineHeight: 1.2 }}>
							<div style={{ fontWeight: 650 }}>{name}</div>
							<small style={{ color: '#77849a' }}>{identity.email}</small>
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
				<Content style={{ padding: '34px clamp(20px,4vw,58px) 64px', maxWidth: 1540, width: '100%', margin: '0 auto' }}>{children}</Content>
			</Layout>
		</Layout>
	);
};

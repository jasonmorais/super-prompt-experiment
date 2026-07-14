import { BookOutlined, CompassOutlined, HomeFilled, LogoutOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { readLearnSphereIdentity } from '../auth.ts';

const { Sider, Header, Content } = Layout;

export interface AppLayoutProps {
	children?: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const identity = readLearnSphereIdentity(auth.user?.profile);
	const organizationName = identity.organizationName;
	const displayName = `${identity.givenName} ${identity.familyName}`.trim() || identity.email || 'Learner';
	const initials = `${identity.givenName[0] ?? ''}${identity.familyName[0] ?? ''}` || displayName.slice(0, 2).toUpperCase();
	const selectedKey = location.pathname.startsWith('/catalog') ? 'catalog' : location.pathname.startsWith('/operations') ? 'operations' : 'dashboard';

	const logout = () => {
		void auth.removeUser();
		void auth.signoutRedirect({ post_logout_redirect_uri: `${globalThis.location.origin}/login` });
	};

	return (
		<Layout style={{ minHeight: '100vh', background: '#f5f7f4' }}>
			<Sider
				width={244}
				breakpoint="lg"
				collapsedWidth="0"
				style={{ background: '#102f2a', padding: '24px 12px', position: 'sticky', top: 0, height: '100vh' }}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 11, color: 'white', padding: '0 14px 30px' }}>
					<div style={{ width: 35, height: 35, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#d3f36b', color: '#102f2a', fontWeight: 900, fontSize: 18 }}>L</div>
					<span style={{ fontSize: 20, fontWeight: 750, letterSpacing: '-0.4px' }}>LearnSphere</span>
				</div>
				<Menu
					mode="inline"
					selectedKeys={[selectedKey]}
						onClick={({ key }) => navigate(key === 'catalog' ? '/catalog' : key === 'operations' ? '/operations' : '/dashboard')}
					items={[
						{ key: 'dashboard', icon: <HomeFilled />, label: 'My learning' },
						{ key: 'catalog', icon: <CompassOutlined />, label: 'Discover' },
						{ key: 'operations', icon: <ThunderboltOutlined />, label: 'Team operations' },
					]}
					style={{ background: 'transparent', color: '#c5d5d1', border: 0 }}
					theme="dark"
				/>
				<div style={{ position: 'absolute', bottom: 24, left: 20, right: 20, borderRadius: 14, padding: 14, color: '#d6e3df', background: '#1c4039', fontSize: 12 }}>
					<BookOutlined style={{ color: '#d3f36b', marginRight: 7 }} />
					Authenticated workspace<div style={{ color: 'white', fontWeight: 700, marginTop: 7 }}>{organizationName}</div>
				</div>
			</Sider>
			<Layout style={{ background: '#f5f7f4' }}>
				<Header style={{ height: 76, padding: '0 36px', background: 'rgba(255,255,255,.92)', borderBottom: '1px solid #e6ebe7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Typography.Text style={{ color: '#64716d' }}>{organizationName} · Learning workspace</Typography.Text>
					<Space size="middle">
						<Avatar style={{ background: '#f0b88b', color: '#462d1f', fontWeight: 700 }}>{initials}</Avatar>
						<div style={{ lineHeight: 1.25 }}>
							<div style={{ fontWeight: 650 }}>{displayName}</div>
							<small style={{ color: '#7a8682' }}>{identity.email}</small>
						</div>
						<Button
							type="text"
							icon={<LogoutOutlined />}
							onClick={logout}
						>
							Sign out
						</Button>
					</Space>
				</Header>
				<Content style={{ padding: '34px clamp(20px, 4vw, 58px) 64px', maxWidth: 1500, width: '100%', margin: '0 auto' }}>{children}</Content>
			</Layout>
		</Layout>
	);
};

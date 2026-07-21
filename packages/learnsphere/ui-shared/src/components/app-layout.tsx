import { BookOutlined, CompassOutlined, HomeFilled, LogoutOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Typography, type MenuProps } from 'antd';
import type { ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { readLearnSphereIdentity } from '../auth.ts';
import styles from './app-layout.module.css';

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
	const selectedKey = location.pathname.startsWith('/catalog') ? 'catalog' : location.pathname.startsWith('/operations') ? 'operations' : location.pathname.startsWith('/leaderboard') ? 'leaderboard' : 'dashboard';
	const menuItems: MenuProps['items'] = [
		{ key: 'dashboard', icon: <HomeFilled />, label: 'My learning' },
		{ key: 'catalog', icon: <CompassOutlined />, label: 'Discover' },
		{ key: 'operations', icon: <ThunderboltOutlined />, label: 'Team operations' },
		{ key: 'leaderboard', icon: <TrophyOutlined />, label: 'Leaderboard' },
	];
	const logout = () => {
		void auth.removeUser();
		void auth.signoutRedirect({ post_logout_redirect_uri: `${globalThis.location.origin}/login` });
	};

	return (
		<Layout className="min-h-screen bg-[#f5f7f4]">
			<Sider
				width={244}
				breakpoint="lg"
				collapsedWidth="0"
				className={styles['sider']}
			>
				<div className={styles['brand']}>
					<div className={styles['brand-mark']}>L</div>
					<span className={styles['brand-name']}>LearnSphere</span>
				</div>
				<Menu
					mode="inline"
					selectedKeys={[selectedKey]}
					onClick={({ key }) => navigate(key === 'catalog' ? '/catalog' : key === 'operations' ? '/operations' : key === 'leaderboard' ? '/leaderboard' : '/dashboard')}
					items={menuItems}
					className="border-0 bg-transparent text-[#c5d5d1]"
					theme="dark"
				/>
				<div className={styles['workspace-card']}>
					<BookOutlined className="mr-[7px] text-[#d3f36b]" />
					Authenticated workspace<div className={styles['workspace-name']}>{organizationName}</div>
				</div>
			</Sider>
			<Layout className="bg-[#f5f7f4]">
				<Header className={styles['header']}>
					<Typography.Text className="text-[#64716d]">{organizationName} · Learning workspace</Typography.Text>
					<Space size="middle">
						<Avatar className="bg-[#f0b88b] font-bold text-[#462d1f]">{initials}</Avatar>
						<div className={styles['identity']}>
							<div className="font-semibold">{displayName}</div>
							<small className={styles['email']}>{identity.email}</small>
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
				<Content className={styles['content']}>{children}</Content>
			</Layout>
		</Layout>
	);
};

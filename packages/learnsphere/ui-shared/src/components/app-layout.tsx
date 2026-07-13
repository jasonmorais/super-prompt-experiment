import { BellOutlined, BookOutlined, CompassOutlined, HomeFilled, ReadOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Layout, Menu, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

const { Sider, Header, Content } = Layout;

export interface AppLayoutProps { children?: ReactNode; }

const navigation = [
	{ key: 'home', icon: <HomeFilled />, label: 'Home' },
	{ key: 'catalog', icon: <CompassOutlined />, label: 'Discover' },
	{ key: 'learning', icon: <ReadOutlined />, label: 'My learning' },
	{ key: 'paths', icon: <BookOutlined />, label: 'Learning paths' },
	{ key: 'teams', icon: <TeamOutlined />, label: 'My team' },
	{ key: 'achievements', icon: <TrophyOutlined />, label: 'Achievements' },
];

export const AppLayout = ({ children }: AppLayoutProps) => (
	<Layout style={{ minHeight: '100vh', background: '#f5f7f4' }}>
		<Sider width={244} breakpoint="lg" collapsedWidth="0" style={{ background: '#102f2a', padding: '24px 12px', position: 'sticky', top: 0, height: '100vh' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 11, color: 'white', padding: '0 14px 30px' }}>
				<div style={{ width: 35, height: 35, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#d3f36b', color: '#102f2a', fontWeight: 900, fontSize: 18 }}>L</div>
				<span style={{ fontSize: 20, fontWeight: 750, letterSpacing: '-0.4px' }}>LearnSphere</span>
			</div>
			<Menu mode="inline" selectedKeys={['home']} items={navigation} style={{ background: 'transparent', color: '#c5d5d1', border: 0 }} theme="dark" />
			<div style={{ position: 'absolute', bottom: 24, left: 20, right: 20, borderRadius: 14, padding: 14, color: '#d6e3df', background: '#1c4039', fontSize: 12 }}>
				<div style={{ color: '#d3f36b', fontWeight: 700, marginBottom: 6 }}>Learning streak</div>
				<div style={{ fontSize: 20, color: 'white', fontWeight: 750 }}>🔥 12 days</div>
				<div style={{ marginTop: 5 }}>Keep it going — learn for 10 minutes today.</div>
			</div>
		</Sider>
		<Layout style={{ background: '#f5f7f4' }}>
			<Header style={{ height: 76, padding: '0 36px', background: 'rgba(255,255,255,.92)', borderBottom: '1px solid #e6ebe7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography.Text style={{ color: '#64716d' }}>Northstar Digital · Learning workspace</Typography.Text>
				<Space size="large">
					<Badge dot><Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18 }} />} /></Badge>
					<Space><Avatar style={{ background: '#f0b88b', color: '#462d1f', fontWeight: 700 }}>AM</Avatar><div style={{ lineHeight: 1.25 }}><div style={{ fontWeight: 650 }}>Alex Morgan</div><small style={{ color: '#7a8682' }}>Product Designer</small></div></Space>
				</Space>
			</Header>
			<Content style={{ padding: '34px clamp(20px, 4vw, 58px) 64px', maxWidth: 1500, width: '100%', margin: '0 auto' }}>{children}</Content>
		</Layout>
	</Layout>
);

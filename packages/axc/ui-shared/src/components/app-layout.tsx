import { Layout, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export type AppNavigationItem = NonNullable<MenuProps['items']>[number];

export interface AppLayoutProps {
	children?: ReactNode;
	navigationItems?: AppNavigationItem[];
	selectedNavigationKey?: string;
}

/**
 * The shared application chrome for the AgentCourses portal.
 */
export const AppLayout = ({ children, navigationItems = [], selectedNavigationKey }: AppLayoutProps) => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ alignItems: 'center', display: 'flex', gap: 24, paddingInline: 24 }}>
				<Text style={{ color: '#fff', flex: '0 0 auto', fontSize: 16, fontWeight: 700 }}>AgentCourses</Text>
				{navigationItems.length > 0 ? (
					<Menu
						items={navigationItems}
						mode="horizontal"
						selectedKeys={selectedNavigationKey ? [selectedNavigationKey] : []}
						style={{ background: 'transparent', borderBottom: 0, flex: 1, minWidth: 0 }}
						theme="dark"
					/>
				) : null}
			</Header>
			<Content style={{ background: '#f5f7f8', padding: '24px' }}>
				<Space
					direction="vertical"
					size={16}
					style={{ display: 'flex', margin: '0 auto', maxWidth: 1180 }}
				>
					{children}
				</Space>
			</Content>
			<Footer style={{ textAlign: 'center' }}>AgentCourses</Footer>
		</Layout>
	);
};

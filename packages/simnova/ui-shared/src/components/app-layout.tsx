import { Layout } from 'antd';
import type { ReactNode } from 'react';

const { Header, Content, Footer } = Layout;

export interface AppLayoutProps {
	children?: ReactNode;
}

/**
 * The shared application chrome for the Simnova portal: a header, a content
 * region, and a footer. Kept intentionally blank — add navigation, branding,
 * and the logged-in user menu here as the portal grows.
 */
export const AppLayout = ({ children }: AppLayoutProps) => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ color: '#fff', fontWeight: 600 }}>Simnova</Header>
			<Content style={{ padding: '24px' }}>{children}</Content>
			<Footer style={{ textAlign: 'center' }}>Simnova · built on the Cellix framework</Footer>
		</Layout>
	);
};

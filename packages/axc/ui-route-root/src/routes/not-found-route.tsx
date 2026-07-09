import { AppLayout } from '@axc/ui-shared';
import { Button, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { routeNavigationItems } from './navigation.tsx';

export const NotFoundRoute = () => {
	return (
		<AppLayout
			navigationItems={routeNavigationItems}
			selectedNavigationKey=""
		>
			<Empty
				description="Page not found"
				image={Empty.PRESENTED_IMAGE_SIMPLE}
			>
				<Button type="primary">
					<Link to="/">Home</Link>
				</Button>
			</Empty>
		</AppLayout>
	);
};

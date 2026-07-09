import type { AppNavigationItem } from '@axc/ui-shared';
import { Link } from 'react-router-dom';

export const routeNavigationItems: AppNavigationItem[] = [
	{
		key: 'home',
		label: <Link to="/">Home</Link>,
	},
	{
		key: 'courses',
		label: <Link to="/courses">Courses</Link>,
	},
];

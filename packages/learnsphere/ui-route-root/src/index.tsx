import type React from 'react';
import { SectionLayout } from './section-layout.tsx';
export { CatalogPage as Catalog } from './catalog-page.tsx';
export { LoginPage as Login } from './login-page.tsx';

/** The root route of the LearnSphere learner portal. */
export const Root: React.FC = () => {
	return <SectionLayout />;
};

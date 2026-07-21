import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
	title: 'LearnSphere',
	tagline: 'Learning, development, and organizational capability in one platform',
	url: 'https://learnsphere.localhost',
	baseUrl: '/',
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	i18n: { defaultLocale: 'en', locales: ['en'] },
	presets: [
		[
			'classic',
			{
				docs: { sidebarPath: './sidebars.ts', routeBasePath: '/' },
				blog: false,
				theme: { customCss: './src/css/custom.css' },
			} satisfies Preset.Options,
		],
	],
	themeConfig: {
		navbar: {
			title: 'LearnSphere',
			items: [{ type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' }],
		},
		prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
	} satisfies Preset.ThemeConfig,
};

export default config;

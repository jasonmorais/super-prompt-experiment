import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html', '../../packages/learnsphere/ui-*/src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [],
	corePlugins: {
		// antd provides its own reset; keep Tailwind's preflight off to avoid conflicts.
		preflight: false,
	},
} satisfies Config;

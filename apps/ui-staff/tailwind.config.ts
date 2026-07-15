import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html', '../../packages/learnsphere/ui-staff-route-*/src/**/*.{js,jsx,ts,tsx}', '../../packages/learnsphere/ui-shared/src/**/*.{js,jsx,ts,tsx}'],
	corePlugins: {
		preflight: false,
	},
} satisfies Config;

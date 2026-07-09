import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		// Proxy API calls to the local Azure Functions host so the browser only
		// ever talks to a single origin (the Vite dev server). This sidesteps
		// cross-origin CORS entirely for local development.
		proxy: {
			'/api': {
				target: 'http://localhost:7071',
				changeOrigin: true,
			},
		},
	},
});

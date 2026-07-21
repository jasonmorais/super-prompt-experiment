import { App as AntdApp, ConfigProvider } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { oidcConfig } from './config/oidc-config.tsx';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');
createRoot(root).render(
	<React.StrictMode>
		<ConfigProvider theme={{ token: { colorPrimary: '#6d4aff', borderRadius: 10 } }}>
			<AntdApp>
				<BrowserRouter>
					<AuthProvider {...oidcConfig}>
						<App />
					</AuthProvider>
				</BrowserRouter>
			</AntdApp>
		</ConfigProvider>
	</React.StrictMode>,
);

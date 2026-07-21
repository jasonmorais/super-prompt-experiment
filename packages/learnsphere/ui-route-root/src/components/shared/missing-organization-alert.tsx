import { Alert } from 'antd';

export const MissingOrganizationAlert = () => (
	<Alert
		showIcon
		type="error"
		message="Your identity token does not include an organization identifier"
		style={{ marginBottom: 24 }}
	/>
);

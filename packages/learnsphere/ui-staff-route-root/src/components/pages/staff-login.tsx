import { ArrowRightOutlined, BarChartOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Space, Typography } from 'antd';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

export const StaffLoginPage = () => {
	const auth = useAuth();
	if (auth.isAuthenticated)
		return (
			<Navigate
				to="/staff"
				replace
			/>
		);
	const signIn = async () => {
		globalThis.sessionStorage.setItem('staffRedirectTo', '/staff');
		await auth.signinRedirect();
	};
	return (
		<Row style={{ minHeight: '100vh', background: '#f3f5f9' }}>
			<Col
				xs={0}
				lg={13}
				style={{ padding: 'clamp(54px,8vw,112px)', background: 'linear-gradient(145deg,#17233c,#28385b)', color: 'white' }}
			>
				<Space>
					<div style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 12, background: '#7c5cff', fontWeight: 900 }}>L</div>
					<Text style={{ color: 'white', fontSize: 23, fontWeight: 750 }}>LearnSphere Staff</Text>
				</Space>
				<Title style={{ color: 'white', fontSize: 'clamp(40px,5vw,64px)', marginTop: 90, lineHeight: 1.05 }}>Turn learning activity into team capability.</Title>
				<Paragraph style={{ color: '#c5cede', fontSize: 18 }}>Create structured training, assign it to the right people, and understand progress without leaving the staff workspace.</Paragraph>
				<Space
					direction="vertical"
					size="middle"
					style={{ marginTop: 42 }}
				>
					<Text style={{ color: '#e4e8f0' }}>
						<TeamOutlined /> Team and learner progress reporting
					</Text>
					<Text style={{ color: '#e4e8f0' }}>
						<BookOutlined /> Course and activity content management
					</Text>
					<Text style={{ color: '#e4e8f0' }}>
						<BarChartOutlined /> Assignment and completion visibility
					</Text>
				</Space>
			</Col>
			<Col
				xs={24}
				lg={11}
				style={{ display: 'grid', placeItems: 'center', padding: 28 }}
			>
				<Card
					style={{ width: 'min(100%,460px)', borderRadius: 20, boxShadow: '0 24px 70px rgba(23,35,60,.12)' }}
					styles={{ body: { padding: 42 } }}
				>
					<Title level={2}>Staff sign in</Title>
					<Paragraph type="secondary">Continue with a manager or learning administrator account.</Paragraph>
					{auth.error && (
						<Alert
							type="error"
							showIcon
							message="Sign-in failed"
							description={auth.error.message}
							style={{ margin: '20px 0' }}
						/>
					)}
					<Button
						type="primary"
						size="large"
						block
						loading={auth.isLoading || Boolean(auth.activeNavigator)}
						onClick={() => void signIn()}
						style={{ marginTop: 18, height: 48 }}
					>
						Continue to staff workspace <ArrowRightOutlined />
					</Button>
				</Card>
			</Col>
		</Row>
	);
};

import { ArrowRightOutlined, BookOutlined, CheckCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Space, Spin, Typography } from 'antd';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

export const LoginPage = () => {
	const auth = useAuth();

	if (auth.isAuthenticated) return <Navigate to="/dashboard" replace />;

	const signIn = async () => {
		globalThis.sessionStorage.setItem('redirectTo', '/dashboard');
		await auth.signinRedirect();
	};

	return (
		<Row style={{ minHeight: '100vh', background: '#f4f7f4' }}>
			<Col xs={0} lg={13} style={{ background: '#102f2a', padding: 'clamp(48px,8vw,112px)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<div>
					<Space size="middle"><div style={{ width: 44, height: 44, borderRadius: 13, display: 'grid', placeItems: 'center', background: '#d3f36b', color: '#102f2a', fontWeight: 900, fontSize: 22 }}>L</div><Text style={{ color: 'white', fontSize: 24, fontWeight: 750 }}>LearnSphere</Text></Space>
					<Title style={{ color: 'white', fontSize: 'clamp(38px,5vw,66px)', lineHeight: 1.04, letterSpacing: '-2px', marginTop: 80, maxWidth: 700 }}>Learning that moves your work forward.</Title>
					<Paragraph style={{ color: '#c5d7d2', fontSize: 18, maxWidth: 620 }}>Access assigned learning, discover published courses, and keep a trustworthy record of your progress in one workspace.</Paragraph>
				</div>
				<Space direction="vertical" size="middle">
					<Text style={{ color: '#dce8e4' }}><CheckCircleOutlined style={{ color: '#d3f36b' }} /> Progress is saved against your authenticated learner identity</Text>
					<Text style={{ color: '#dce8e4' }}><SafetyCertificateOutlined style={{ color: '#d3f36b' }} /> Organization and role access comes from your identity provider</Text>
				</Space>
			</Col>
			<Col xs={24} lg={11} style={{ display: 'grid', placeItems: 'center', padding: 28 }}>
				<Card style={{ width: 'min(100%, 460px)', borderRadius: 22, border: '1px solid #e1e8e4', boxShadow: '0 24px 70px rgba(23,59,51,.10)' }} styles={{ body: { padding: '42px 38px' } }}>
					<BookOutlined style={{ fontSize: 30, color: '#277f6c' }} />
					<Title level={2} style={{ color: '#173b33', margin: '20px 0 8px' }}>Welcome to LearnSphere</Title>
					<Paragraph style={{ color: '#687670', fontSize: 16 }}>Sign in with your learning workspace account. In local development, this continues to the Cellix mock OIDC user selector.</Paragraph>
					{auth.error && <Alert type="error" showIcon message="Sign-in could not be completed" description={auth.error.message} style={{ margin: '22px 0' }} />}
					<Button type="primary" size="large" block icon={auth.isLoading || auth.activeNavigator ? <Spin size="small" /> : undefined} disabled={auth.isLoading || Boolean(auth.activeNavigator)} onClick={() => void signIn()} style={{ height: 48, marginTop: 14, background: '#176c5b', color: 'white', fontWeight: 700 }}>
						Continue to sign in <ArrowRightOutlined />
					</Button>
					<Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 20, textAlign: 'center' }}>Authentication is handled by your configured OpenID Connect provider.</Text>
				</Card>
			</Col>
		</Row>
	);
};

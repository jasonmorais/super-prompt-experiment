import { AppstoreOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { AppLayout } from '@axc/ui-shared';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import { routeNavigationItems } from './navigation.tsx';

const { Title, Text } = Typography;

export const HomeRoute = () => {
	return (
		<AppLayout
			navigationItems={routeNavigationItems}
			selectedNavigationKey="home"
		>
			<Row gutter={[16, 16]}>
				<Col xs={24}>
					<Card>
						<Space
							direction="vertical"
							size={4}
						>
							<Title
								level={2}
								style={{ margin: 0 }}
							>
								AgentCourses
							</Title>
							<Text type="secondary">Application workspace</Text>
						</Space>
					</Card>
				</Col>
				<Col
					lg={12}
					xs={24}
				>
					<Card>
						<Statistic
							prefix={<AppstoreOutlined />}
							title="Workspace"
							value="Ready"
						/>
					</Card>
				</Col>
				<Col
					lg={12}
					xs={24}
				>
					<Card>
						<Statistic
							prefix={<SafetyCertificateOutlined />}
							title="Health"
							value="Online"
						/>
					</Card>
				</Col>
			</Row>
		</AppLayout>
	);
};

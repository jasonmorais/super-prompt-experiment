import { AppLayout } from '@simnova/ui-shared';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * The landing section of the portal. Deliberately blank — this is the canvas on
 * which application features are built.
 */
export const SectionLayout = () => {
	return (
		<AppLayout>
			<Title level={2}>Welcome to Simnova</Title>
			<Paragraph>
				This is the blank application shell. Start building your features by adding routes and components to the UI packages under <code>packages/simnova</code>.
			</Paragraph>
		</AppLayout>
	);
};

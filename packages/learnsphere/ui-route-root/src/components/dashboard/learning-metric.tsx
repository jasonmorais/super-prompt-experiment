import type { ReactNode } from 'react';
import { Avatar, Card, Space, Typography } from 'antd';

const { Title, Text } = Typography;

export interface LearningMetricProps {
	title: string;
	value: string | number;
	icon: ReactNode;
	background: string;
	color: string;
	loading: boolean;
}

export const LearningMetric = ({ title, value, icon, background, color, loading }: LearningMetricProps) => (
	<Card
		loading={loading}
		className="rounded-[18px] border border-[#e5eae6] shadow-[0_8px_28px_rgba(24,55,48,.05)]"
	>
		<Space size="middle">
			<Avatar
				shape="square"
				size={46}
				style={{ background, color }}
				icon={icon}
			/>
			<div>
				<Text type="secondary">{title}</Text>
				<Title
					level={3}
					className="m-0"
				>
					{value}
				</Title>
			</div>
		</Space>
	</Card>
);

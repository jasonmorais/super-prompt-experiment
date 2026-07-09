import { gql, useQuery } from '@apollo/client';
import { BookOutlined } from '@ant-design/icons';
import { AppLayout } from '@axc/ui-shared';
import { Alert, Card, Empty, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { routeNavigationItems } from './navigation.tsx';

const { Text, Title } = Typography;

type CourseListRow = {
	id: string;
	title: string;
	summary: string;
	modality: string;
	status: string;
	tags: string[];
	updatedAt: string;
};

type CoursesQueryResult = {
	courses: CourseListRow[];
};

const COURSES_QUERY = gql`
	query Courses {
		courses {
			id
			title
			summary
			modality
			status
			tags
			updatedAt
		}
	}
`;

const columns: ColumnsType<CourseListRow> = [
	{
		dataIndex: 'title',
		title: 'Title',
		render: (title: string, row) => (
			<Typography.Text>
				{title}
				<Typography.Text
					style={{ display: 'block' }}
					type="secondary"
				>
					{row.summary}
				</Typography.Text>
			</Typography.Text>
		),
	},
	{
		dataIndex: 'modality',
		title: 'Modality',
		width: 160,
	},
	{
		dataIndex: 'status',
		title: 'Status',
		width: 140,
	},
	{
		dataIndex: 'tags',
		title: 'Tags',
		width: 220,
		render: (tags: string[]) => tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
	},
	{
		dataIndex: 'updatedAt',
		title: 'Updated',
		width: 180,
	},
];

export const CourseListRoute = () => {
	const { data, error, loading } = useQuery<CoursesQueryResult>(COURSES_QUERY);
	const courses = data?.courses ?? [];

	return (
		<AppLayout
			navigationItems={routeNavigationItems}
			selectedNavigationKey="courses"
		>
			<Card>
				<Title
					level={3}
					style={{ alignItems: 'center', display: 'flex', gap: 10, marginTop: 0 }}
				>
					<BookOutlined />
					Courses
				</Title>
				<Text type="secondary">Catalog workspace</Text>
			</Card>
			{error ? (
				<Alert
					description={error.message}
					message="Unable to load courses from the local GraphQL API"
					showIcon
					type="warning"
				/>
			) : null}
			<Card>
				<Table<CourseListRow>
					columns={columns}
					dataSource={courses}
					loading={loading}
					locale={{
						emptyText: (
							<Empty
								description="No courses loaded"
								image={Empty.PRESENTED_IMAGE_SIMPLE}
							/>
						),
					}}
					pagination={false}
					rowKey="id"
				/>
			</Card>
		</AppLayout>
	);
};

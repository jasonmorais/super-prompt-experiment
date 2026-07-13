import type { Domain } from '@axc/domain';

export const searchCatalog = () => {
	const courses = createSeedCourses();

	return (query: Domain.Contexts.Course.Course.CourseCatalogQuery): Promise<Domain.Contexts.Course.Course.CourseCatalogSearchResult> => {
		const normalizedQuery = query.q?.trim().toLowerCase();
		const normalizedTag = query.tag?.trim().toLowerCase();
		const filtered = courses.filter((course) => {
			const matchesQuery = !normalizedQuery || [course.title, course.summary, ...course.tags].some((value) => value.toLowerCase().includes(normalizedQuery));
			const matchesModality = !query.modality || course.modality === query.modality;
			const matchesStatus = !query.status || course.status === query.status;
			const matchesTag = !normalizedTag || course.tags.some((tag) => tag.toLowerCase() === normalizedTag);
			return matchesQuery && matchesModality && matchesStatus && matchesTag;
		});

		const sorted = [...filtered].sort((left, right) => {
			const leftValue = String(left[query.sort]).toLowerCase();
			const rightValue = String(right[query.sort]).toLowerCase();
			return leftValue.localeCompare(rightValue);
		});

		const pageSize = query.pageSize;
		const totalItems = sorted.length;
		const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
		const startIndex = (query.page - 1) * pageSize;

		return Promise.resolve({
			items: sorted.slice(startIndex, startIndex + pageSize),
			page: query.page,
			pageSize,
			totalItems,
			totalPages,
		});
	};
};

function createSeedCourses(): Domain.Contexts.Course.Course.CourseCatalogSearchItem[] {
	return [
		createCourse({
			id: 'course-001',
			title: 'AI Security Foundations',
			summary: 'Introductory course on secure AI-assisted development.',
			modality: 'online',
			status: 'active',
			tags: ['ai', 'security'],
			createdAt: '2026-01-15T00:00:00.000Z',
			updatedAt: '2026-06-01T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-002',
			title: 'Designing Hybrid Teams',
			summary: 'Workshop on collaboration in hybrid organizations.',
			modality: 'hybrid',
			status: 'active',
			tags: ['leadership', 'hybrid'],
			createdAt: '2026-02-10T00:00:00.000Z',
			updatedAt: '2026-06-05T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-003',
			title: 'In-Person Product Discovery',
			summary: 'Hands-on workshop for discovering product opportunities.',
			modality: 'in-person',
			status: 'draft',
			tags: ['product', 'workshop'],
			createdAt: '2026-03-02T00:00:00.000Z',
			updatedAt: '2026-06-10T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-004',
			title: 'Robotics for Beginners',
			summary: 'Intro to robotics systems and sensing.',
			modality: 'online',
			status: 'retired',
			tags: ['robotics', 'engineering'],
			createdAt: '2025-11-20T00:00:00.000Z',
			updatedAt: '2026-01-10T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-005',
			title: 'Data Privacy Essentials',
			summary: 'Learn the fundamentals of privacy by design.',
			modality: 'online',
			status: 'active',
			tags: ['privacy', 'compliance'],
			createdAt: '2026-04-01T00:00:00.000Z',
			updatedAt: '2026-06-12T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-006',
			title: 'Customer Research Labs',
			summary: 'Practical lessons for running customer interviews.',
			modality: 'in-person',
			status: 'active',
			tags: ['research', 'customer'],
			createdAt: '2026-04-15T00:00:00.000Z',
			updatedAt: '2026-06-14T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-007',
			title: 'Leadership for New Managers',
			summary: 'Guidance for leading teams through change.',
			modality: 'hybrid',
			status: 'draft',
			tags: ['leadership', 'management'],
			createdAt: '2025-10-05T00:00:00.000Z',
			updatedAt: '2026-05-24T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-008',
			title: 'Introduction to Prompt Engineering',
			summary: 'Hands-on prompt design patterns for modern assistants.',
			modality: 'online',
			status: 'active',
			tags: ['ai', 'prompting'],
			createdAt: '2026-05-01T00:00:00.000Z',
			updatedAt: '2026-06-20T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-009',
			title: 'Agile Delivery Essentials',
			summary: 'A concise primer on agile planning and execution.',
			modality: 'hybrid',
			status: 'active',
			tags: ['agile', 'delivery'],
			createdAt: '2026-05-10T00:00:00.000Z',
			updatedAt: '2026-06-18T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-010',
			title: 'Service Design Fundamentals',
			summary: 'How to map services and create better journeys.',
			modality: 'in-person',
			status: 'retired',
			tags: ['design', 'service'],
			createdAt: '2025-09-12T00:00:00.000Z',
			updatedAt: '2026-01-14T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-011',
			title: 'Cloud Security Operations',
			summary: 'Operational playbooks for secure cloud deployments.',
			modality: 'online',
			status: 'active',
			tags: ['cloud', 'security'],
			createdAt: '2026-06-01T00:00:00.000Z',
			updatedAt: '2026-06-25T00:00:00.000Z',
		}),
		createCourse({
			id: 'course-012',
			title: 'Facilitating Product Workshops',
			summary: 'Methods for leading inclusive workshop sessions.',
			modality: 'hybrid',
			status: 'draft',
			tags: ['facilitation', 'workshop'],
			createdAt: '2026-06-05T00:00:00.000Z',
			updatedAt: '2026-06-27T00:00:00.000Z',
		}),
	];
}

function createCourse(input: { id: string; title: string; summary: string; modality: Domain.Contexts.Course.Course.CourseModality; status: Domain.Contexts.Course.Course.CourseStatus; tags: string[]; createdAt: string; updatedAt: string }): Domain.Contexts.Course.Course.CourseCatalogSearchItem {
	return {
		id: input.id,
		title: input.title,
		summary: input.summary,
		modality: input.modality,
		status: input.status,
		tags: input.tags,
		createdAt: input.createdAt,
		updatedAt: input.updatedAt,
	};
}

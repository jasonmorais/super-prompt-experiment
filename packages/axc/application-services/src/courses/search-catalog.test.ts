import { describe, expect, it } from 'vitest';
import { searchCatalog } from './search-catalog.ts';

describe('searchCatalog', () => {
	it('returns a paginated catalog sorted by title by default', async () => {
		const service = searchCatalog();
		const result = await service({
			page: 1,
			pageSize: 10,
			sort: 'title',
		});

		expect(result.page).toBe(1);
		expect(result.pageSize).toBe(10);
		expect(result.totalItems).toBe(12);
		expect(result.totalPages).toBe(2);
		expect(result.items).toHaveLength(10);
		const sortedTitles = [...result.items].map((item) => item.title).sort((left, right) => left.localeCompare(right));
		expect(result.items.map((item) => item.title)).toEqual(sortedTitles);
	});

	it('matches keyword search across title, summary, and tags case-insensitively', async () => {
		const service = searchCatalog();
		const result = await service({
			q: 'security',
			page: 1,
			pageSize: 10,
			sort: 'title',
		});

		expect(result.items.map((item) => item.id)).toEqual(['course-001', 'course-011']);
	});

	it('supports combined filters and pagination', async () => {
		const service = searchCatalog();
		const result = await service({
			q: 'ai',
			modality: 'online',
			status: 'active',
			page: 1,
			pageSize: 5,
			sort: 'createdAt',
		});

		expect(result.items).toHaveLength(2);
		expect(result.items[0]?.id).toBe('course-001');
		expect(result.totalItems).toBe(2);
		expect(result.totalPages).toBe(1);
	});

	it('sorts by createdAt when requested', async () => {
		const service = searchCatalog();
		const result = await service({
			page: 1,
			pageSize: 10,
			sort: 'createdAt',
		});

		expect(result.items.map((item) => item.id)).toEqual(['course-010', 'course-007', 'course-004', 'course-001', 'course-002', 'course-003', 'course-005', 'course-006', 'course-008', 'course-009']);
	});

	it('returns an empty list with pagination metadata when no courses match', async () => {
		const service = searchCatalog();
		const result = await service({
			q: 'does-not-exist',
			page: 2,
			pageSize: 5,
			sort: 'title',
		});

		expect(result.items).toEqual([]);
		expect(result.page).toBe(2);
		expect(result.pageSize).toBe(5);
		expect(result.totalItems).toBe(0);
		expect(result.totalPages).toBe(0);
	});
});

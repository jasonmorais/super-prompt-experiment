import { describe, expect, it } from 'vitest';
import type { HttpRequest, InvocationContext } from '@azure/functions';
import type { ApplicationServices } from '@axc/application-services';
import { courseRoutes } from './index.ts';

describe('courseRoutes', () => {
	it('returns a 200 response for valid catalog query params', async () => {
		const route = courseRoutes.find((candidate) => candidate.path === '/courses' && candidate.method === 'GET');
		expect(route).toBeDefined();

		const appServices = {
			get courses() {
				return {
					queryAll: async () => [],
					queryById: async () => null,
					searchCatalog: async () => ({
						items: [],
						page: 1,
						pageSize: 10,
						totalItems: 0,
						totalPages: 0,
					}),
				};
			},
			get verifiedUser() {
				return null;
			},
		} as ApplicationServices;

		const response = await route?.handler({
			applicationServices: appServices,
			context: {} as InvocationContext,
			request: { url: 'http://localhost/api/courses?page=1&pageSize=5' } as HttpRequest,
		});

		expect(response?.status).toBe(200);
		expect(response?.jsonBody).toEqual({
			items: [],
			page: 1,
			pageSize: 10,
			totalItems: 0,
			totalPages: 0,
		});
	});

	it('returns a 400 response for invalid query params', async () => {
		const route = courseRoutes.find((candidate) => candidate.path === '/courses' && candidate.method === 'GET');
		const appServices = {
			get courses() {
				return {
					queryAll: async () => [],
					queryById: async () => null,
					searchCatalog: async () => ({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 }),
				};
			},
			get verifiedUser() {
				return null;
			},
		} as ApplicationServices;

		const response = await route?.handler({
			applicationServices: appServices,
			context: {} as InvocationContext,
			request: { url: 'http://localhost/api/courses?page=0&pageSize=60&sort=unknown' } as HttpRequest,
		});

		expect(response?.status).toBe(400);
		expect(response?.jsonBody).toEqual({
			error: {
				code: 'INVALID_QUERY_PARAMETER',
				message: 'One or more query parameters are invalid.',
				details: [
					expect.objectContaining({ field: 'page' }),
					expect.objectContaining({ field: 'pageSize' }),
					expect.objectContaining({ field: 'sort' }),
				],
			},
		});
	});
});

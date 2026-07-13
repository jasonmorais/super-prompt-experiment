import { validateCourseCatalogQuery } from '@axc/domain';
import type { RestRoute } from '../../routing/types.ts';

export const courseRoutes: RestRoute[] = [
	{
		method: 'GET',
		path: '/courses',
		handler: async ({ applicationServices, request }) => {
			const url = new URL(request.url);
			const input: Parameters<typeof validateCourseCatalogQuery>[0] = {};
			const q = url.searchParams.get('q');
			const modality = url.searchParams.get('modality');
			const status = url.searchParams.get('status');
			const tag = url.searchParams.get('tag');
			const page = url.searchParams.get('page');
			const pageSize = url.searchParams.get('pageSize');
			const sort = url.searchParams.get('sort');

			if (q !== null) {
				input.q = q;
			}
			if (modality !== null) {
				input.modality = modality;
			}
			if (status !== null) {
				input.status = status;
			}
			if (tag !== null) {
				input.tag = tag;
			}
			if (page !== null) {
				input.page = page;
			}
			if (pageSize !== null) {
				input.pageSize = pageSize;
			}
			if (sort !== null) {
				input.sort = sort;
			}

			const validation = validateCourseCatalogQuery(input);

			if (validation.errors.length > 0) {
				return {
					status: 400,
					jsonBody: {
						error: {
							code: 'INVALID_QUERY_PARAMETER',
							message: 'One or more query parameters are invalid.',
							details: validation.errors,
						},
					},
				};
			}

			const body = await applicationServices.courses.searchCatalog(validation.query);
			return { status: 200, jsonBody: body };
		},
	},
];

import type { HttpResponseInit } from '@azure/functions';
import type { RestRoute, RestRouteContext } from './types.ts';

const normalizePath = (url: string): string => {
	const { pathname } = new URL(url);
	return pathname.replace(/^\/api(?=\/|$)/, '') || '/';
};

const routeNotFound = (routeContext: RestRouteContext): HttpResponseInit => ({
	status: 404,
	jsonBody: {
		error: {
			code: 'ROUTE_NOT_FOUND',
			message: `No REST route is registered for ${routeContext.request.method} ${routeContext.request.url}.`,
			details: [],
		},
	},
});

export const createRestRouter = (routes: RestRoute[]) => ({
	handle: async (routeContext: RestRouteContext): Promise<HttpResponseInit> => {
		const method = routeContext.request.method.toUpperCase();
		const path = normalizePath(routeContext.request.url);
		const route = routes.find((candidate) => candidate.method === method && candidate.path === path);

		if (!route) {
			return routeNotFound(routeContext);
		}

		return await route.handler(routeContext);
	},
});

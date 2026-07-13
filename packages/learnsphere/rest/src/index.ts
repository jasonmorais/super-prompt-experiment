import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { ApplicationServicesFactory, PrincipalHints } from '@learnsphere/application-services';

export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

/**
 * Creates the REST health handler after establishing request-scoped application
 * services. GraphQL is the primary product API.
 */
export const restHandlerCreator = (applicationServicesFactory: ApplicationServicesFactory): HttpHandler => {
	return async (request: HttpRequest, _context: InvocationContext) => {
		const rawAuthHeader = request.headers.get('Authorization') ?? undefined;
		const hints: PrincipalHints = {
			// biome-ignore lint:useLiteralKeys — Azure Functions route params are index-accessed.
			learnerId: request.params['learnerId'] ?? undefined,
			// biome-ignore lint:useLiteralKeys — Azure Functions route params are index-accessed.
			organizationId: request.params['organizationId'] ?? undefined,
		};
		await applicationServicesFactory.forRequest(rawAuthHeader, hints);
		return {
			status: 200,
			jsonBody: { status: 'ok' },
		};
	};
};

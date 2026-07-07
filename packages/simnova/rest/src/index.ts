import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { ApplicationServicesFactory, PrincipalHints } from '@simnova/application-services';

export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

/**
 * Creates the REST HTTP handler for Azure Functions. The blank scaffold returns
 * a simple status payload after establishing request-scoped application
 * services — add your routes and controllers on top of this foundation.
 */
export const restHandlerCreator = (applicationServicesFactory: ApplicationServicesFactory): HttpHandler => {
	return async (request: HttpRequest, _context: InvocationContext) => {
		const rawAuthHeader = request.headers.get('Authorization') ?? undefined;
		const hints: PrincipalHints = {
			memberId: request.params['memberId'] ?? undefined,
			communityId: request.params['communityId'] ?? undefined,
		};
		await applicationServicesFactory.forRequest(rawAuthHeader, hints);
		return {
			status: 200,
			jsonBody: { status: 'ok' },
		};
	};
};

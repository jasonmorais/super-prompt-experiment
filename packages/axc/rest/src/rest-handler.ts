import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { ApplicationServicesFactory, PrincipalHints } from '@axc/application-services';
import { createRestRouter } from './routing/router.ts';
import { restRoutes } from './routes/index.ts';

export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

export const restHandlerCreator = (applicationServicesFactory: ApplicationServicesFactory): HttpHandler => {
	const router = createRestRouter(restRoutes);

	return async (request: HttpRequest, context: InvocationContext) => {
		const rawAuthHeader = request.headers.get('Authorization') ?? undefined;
		const hints: PrincipalHints = {
			// biome-ignore lint:useLiteralKeys -- Azure Functions route params are index-accessed.
			memberId: request.params['memberId'] ?? undefined,
			// biome-ignore lint:useLiteralKeys -- Azure Functions route params are index-accessed.
			communityId: request.params['communityId'] ?? undefined,
		};
		const applicationServices = await applicationServicesFactory.forRequest(rawAuthHeader, hints);

		return router.handle({
			applicationServices,
			context,
			request,
		});
	};
};

import type { HttpHandler } from '@azure/functions';
import type { ApplicationServicesFactory, PrincipalHints } from '@learnsphere/application-services';
import type { GraphContext } from '@learnsphere/graphql';
import type { ServiceApolloServer } from '@learnsphere/service-apollo-server';
import type { ServiceBlobStorage } from '@learnsphere/service-blob-storage';
import { type AzureFunctionsMiddlewareOptions, createHandler, type WithRequired } from './azure-functions.ts';

/**
 * Creates a GraphQL HTTP handler for Azure Functions.
 *
 * @param apolloServerService - The (already started) Apollo Server service instance.
 * @param applicationServicesFactory - Factory for request-scoped application services.
 * @returns An Azure Functions HTTP handler.
 */
export const graphHandlerCreator = (apolloServerService: ServiceApolloServer<GraphContext>, applicationServicesFactory: ApplicationServicesFactory, blobStorageService: ServiceBlobStorage): HttpHandler => {
	const functionOptions: WithRequired<AzureFunctionsMiddlewareOptions<GraphContext>, 'context'> = {
		context: async ({ req }) => {
			const authHeader = req.headers.get('Authorization') ?? undefined;
			const learnerId = req.headers.get('x-learner-id');
			const organizationId = req.headers.get('x-organization-id');
			const hints: PrincipalHints = {
				...(learnerId ? { learnerId } : {}),
				...(organizationId ? { organizationId } : {}),
			};
			return {
				applicationServices: await applicationServicesFactory.forRequest(authHeader, hints),
				blobStorageService,
			};
		},
	};
	return createHandler<GraphContext>(apolloServerService.server, functionOptions);
};

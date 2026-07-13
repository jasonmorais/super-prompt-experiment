import type { HttpHandler } from '@azure/functions';
import type { ApplicationServicesFactory, PrincipalHints } from '@learnsphere/application-services';
import type { GraphContext } from '@learnsphere/graphql';
import type { ServiceApolloServer } from '@learnsphere/service-apollo-server';
import { type AzureFunctionsMiddlewareOptions, createHandler, type WithRequired } from './azure-functions.ts';

/**
 * Creates a GraphQL HTTP handler for Azure Functions.
 *
 * @param apolloServerService - The (already started) Apollo Server service instance.
 * @param applicationServicesFactory - Factory for request-scoped application services.
 * @returns An Azure Functions HTTP handler.
 */
export const graphHandlerCreator = (apolloServerService: ServiceApolloServer<GraphContext>, applicationServicesFactory: ApplicationServicesFactory): HttpHandler => {
	const functionOptions: WithRequired<AzureFunctionsMiddlewareOptions<GraphContext>, 'context'> = {
		context: async ({ req }) => {
			const authHeader = req.headers.get('Authorization') ?? undefined;
			const hints: PrincipalHints = {
				learnerId: req.headers.get('x-learner-id') ?? undefined,
				organizationId: req.headers.get('x-organization-id') ?? undefined,
			};
			return {
				applicationServices: await applicationServicesFactory.forRequest(authHeader, hints),
			};
		},
	};
	return createHandler<GraphContext>(apolloServerService.server, functionOptions);
};

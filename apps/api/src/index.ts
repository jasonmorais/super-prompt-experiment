import './service-config/otel-starter.ts';

import type { ApplicationServices } from '@axc/application-services';
import { buildApplicationServicesFactory } from '@axc/application-services';
import type { ApiContextSpec } from '@axc/context-spec';
import { RegisterEventHandlers } from '@axc/event-handler';
import type { GraphContext } from '@axc/graphql-handler';
import { graphHandlerCreator } from '@axc/graphql-handler';
import { restHandlerCreator } from '@axc/rest';
import { ServiceApolloServer } from '@axc/service-apollo-server';
import { ServiceBlobStorage } from '@axc/service-blob-storage';
import { ServiceMongoose } from '@axc/service-mongoose';
import { ServiceQueueStorage } from '@axc/service-queue-storage';
import { ServiceTokenValidation } from '@axc/service-token-validation';
import { Cellix } from './cellix.ts';
import * as ApolloServerConfig from './service-config/apollo-server/index.ts';
import * as AzureStorageConfig from './service-config/azure-storage/index.ts';
import * as MongooseConfig from './service-config/mongoose/index.ts';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

const healthEnvironment = (): 'local' | 'test' | 'production' => {
	if (process.env.NODE_ENV === 'test') {
		return 'test';
	}
	// biome-ignore lint:useLiteralKeys -- Custom ProcessEnv keys are index-signature values.
	if (process.env['AZURE_FUNCTIONS_ENVIRONMENT'] === 'Production' || process.env.NODE_ENV === 'production') {
		return 'production';
	}
	return 'local';
};

const healthResponse = () => ({
	status: 'ok',
	service: 'agentCourses-api',
	projectCode: 'axc',
	environment: healthEnvironment(),
	timestamp: new Date().toISOString(),
});

/**
 * Application composition root.
 *
 * Follows the Cellix bootstrap sequence:
 *   register infrastructure services → build the context → initialize
 *   application services → register HTTP handlers → start up.
 *
 * The blank scaffold wires the standard infrastructure (Mongo, blob + queue
 * storage, token validation, Apollo) and exposes `graphql`, `rest`, and a
 * `health` endpoint. Add your own services and handlers as the app grows.
 */
Cellix.initializeInfrastructureServices<ApiContextSpec, ApplicationServices>((serviceRegistry) => {
	serviceRegistry
		.registerInfrastructureService(new ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions))
		.registerInfrastructureService(new ServiceBlobStorage({ accountName: AzureStorageConfig.accountName ?? '' }))
		.registerInfrastructureService(new ServiceQueueStorage())
		.registerInfrastructureService(new ServiceTokenValidation(TokenValidationConfig.portalTokens))
		.registerInfrastructureService(new ServiceApolloServer<GraphContext>(ApolloServerConfig.apolloServerOptions));
})
	.setContext((serviceRegistry) => {
		const dataSourcesFactory = MongooseConfig.mongooseContextBuilder(serviceRegistry.getInfrastructureService<ServiceMongoose>(ServiceMongoose));

		const { domainDataSource } = dataSourcesFactory.withSystemPassport();
		RegisterEventHandlers(domainDataSource);

		return {
			dataSourcesFactory,
			tokenValidationService: serviceRegistry.getInfrastructureService<ServiceTokenValidation>(ServiceTokenValidation),
			apolloServerService: serviceRegistry.getInfrastructureService<ServiceApolloServer>(ServiceApolloServer),
			blobStorageService: serviceRegistry.getInfrastructureService<ServiceBlobStorage>(ServiceBlobStorage),
			queueStorageService: serviceRegistry.getInfrastructureService<ServiceQueueStorage>(ServiceQueueStorage),
		};
	})
	.initializeApplicationServices((context) => buildApplicationServicesFactory(context))
	.registerAzureFunctionHttpHandler('graphql', { route: 'graphql/{*segments}', methods: ['GET', 'POST', 'OPTIONS'] }, (appServicesFactory, infrastructureRegistry) =>
		graphHandlerCreator(infrastructureRegistry.getInfrastructureService<ServiceApolloServer<GraphContext>>(ServiceApolloServer), appServicesFactory),
	)
	.registerAzureFunctionHttpHandler('health', { route: 'health', methods: ['GET'], authLevel: 'anonymous' }, () => () => Promise.resolve({ status: 200, jsonBody: healthResponse() }))
	.registerAzureFunctionHttpHandler('rest', { route: '{*rest}', methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'] }, restHandlerCreator)
	.startUp();

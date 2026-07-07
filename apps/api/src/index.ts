import './service-config/otel-starter.ts';

import type { ApplicationServices } from '@simnova/application-services';
import { buildApplicationServicesFactory } from '@simnova/application-services';
import type { ApiContextSpec } from '@simnova/context-spec';
import { RegisterEventHandlers } from '@simnova/event-handler';
import type { GraphContext } from '@simnova/graphql-handler';
import { graphHandlerCreator } from '@simnova/graphql-handler';
import { restHandlerCreator } from '@simnova/rest';
import { ServiceApolloServer } from '@simnova/service-apollo-server';
import { ServiceBlobStorage } from '@simnova/service-blob-storage';
import { ServiceMongoose } from '@simnova/service-mongoose';
import { ServiceQueueStorage } from '@simnova/service-queue-storage';
import { ServiceTokenValidation } from '@simnova/service-token-validation';
import { Cellix } from './cellix.ts';
import * as ApolloServerConfig from './service-config/apollo-server/index.ts';
import * as AzureStorageConfig from './service-config/azure-storage/index.ts';
import * as MongooseConfig from './service-config/mongoose/index.ts';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

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
	.registerAzureFunctionHttpHandler('rest', { route: 'rest/{*rest}' }, restHandlerCreator)
	.registerAzureFunctionHttpHandler('health', { route: 'health', methods: ['GET'], authLevel: 'anonymous' }, () => () => Promise.resolve({ status: 200, jsonBody: { status: 'ok' } }))
	.startUp();

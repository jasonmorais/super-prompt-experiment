import './service-config/otel-starter.ts';

import type { ApplicationServices } from '@learnsphere/application-services';
import { buildApplicationServicesFactory } from '@learnsphere/application-services';
import type { ApiContextSpec } from '@learnsphere/context-spec';
import { RegisterEventHandlers } from '@learnsphere/event-handler';
import type { GraphContext } from '@learnsphere/graphql-handler';
import { graphHandlerCreator } from '@learnsphere/graphql-handler';
import { restHandlerCreator } from '@learnsphere/rest';
import { ServiceApolloServer } from '@learnsphere/service-apollo-server';
import { ServiceBlobStorage } from '@learnsphere/service-blob-storage';
import { ServiceMongoose } from '@learnsphere/service-mongoose';
import { ServiceQueueStorage } from '@learnsphere/service-queue-storage';
import { ServiceTokenValidation } from '@learnsphere/service-token-validation';
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
	* LearnSphere wires Mongo, blob and queue storage, multi-portal token
	* validation, Apollo, and the GraphQL, REST, and health HTTP boundaries here.
 */
Cellix.initializeInfrastructureServices<ApiContextSpec, ApplicationServices>((serviceRegistry) => {
	serviceRegistry
		.registerInfrastructureService(new ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions))
		.registerInfrastructureService(new ServiceBlobStorage({ accountName: AzureStorageConfig.accountName, ...(AzureStorageConfig.connectionString ? { connectionString: AzureStorageConfig.connectionString } : {}) }))
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
		graphHandlerCreator(infrastructureRegistry.getInfrastructureService<ServiceApolloServer<GraphContext>>(ServiceApolloServer), appServicesFactory, infrastructureRegistry.getInfrastructureService<ServiceBlobStorage>(ServiceBlobStorage)),
	)
	.registerAzureFunctionHttpHandler('rest', { route: 'rest/{*rest}' }, restHandlerCreator)
	.registerAzureFunctionHttpHandler('health', { route: 'health', methods: ['GET'], authLevel: 'anonymous' }, () => () => Promise.resolve({ status: 200, jsonBody: { status: 'ok' } }))
	.startUp();

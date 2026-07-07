import type { DataSourcesFactory } from '@simnova/persistence';
import type { ServiceApolloServer } from '@simnova/service-apollo-server';
import type { ServiceBlobStorage } from '@simnova/service-blob-storage';
import type { ServiceQueueStorage } from '@simnova/service-queue-storage';
import type { TokenValidation } from '@simnova/service-token-validation';

/**
 * Application context specification for Simnova.
 *
 * Defines the services and data sources available throughout the application.
 * All dependencies are type-safe and narrowly scoped to their intended use.
 */
export interface ApiContextSpec {
	/** Factory for creating passport-scoped data sources (NOT an infrastructure service). */
	dataSourcesFactory: DataSourcesFactory;
	/** Validates authentication tokens presented on requests. */
	tokenValidationService: TokenValidation;
	/** Apollo Server instance backing the GraphQL API. */
	apolloServerService: ServiceApolloServer<Record<string, never>>;
	/** Blob storage service for server-side blob operations. */
	blobStorageService: ServiceBlobStorage;
	/** Queue storage service for asynchronous messaging. */
	queueStorageService: ServiceQueueStorage;
}

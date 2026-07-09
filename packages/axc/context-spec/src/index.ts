import type { DataSourcesFactory } from '@axc/persistence';
import type { ServiceApolloServer } from '@axc/service-apollo-server';
import type { ServiceBlobStorage } from '@axc/service-blob-storage';
import type { ServiceQueueStorage } from '@axc/service-queue-storage';
import type { TokenValidation } from '@axc/service-token-validation';

/**
 * Application context specification for AgentCourses.
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

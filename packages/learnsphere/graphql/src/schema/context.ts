import type { ApplicationServices } from '@learnsphere/application-services';
import type { BlobStorageOperations } from '@learnsphere/service-blob-storage';

/** GraphQL context made available to every resolver. */
export interface GraphContext {
	applicationServices: ApplicationServices;
	blobStorageService: BlobStorageOperations;
}

export type {
	BlobAddress,
	BlobListItem,
	ClientBlobStorage,
	CreateBlobSasUrlRequest,
	ListBlobsRequest,
	ServiceBlobStorageOptions,
	ServiceClientBlobStorageOptions,
	UploadTextBlobRequest,
	UploadDataBlobRequest,
} from '@cellix/service-blob-storage';
export { ServiceBlobStorage, ServiceClientBlobStorage } from '@cellix/service-blob-storage';

import type { ServiceBlobStorage } from '@cellix/service-blob-storage';

/** Narrow server-side blob operations used by LearnSphere application boundaries. */
export type BlobStorageOperations = Pick<ServiceBlobStorage, 'uploadData' | 'deleteBlob'>;

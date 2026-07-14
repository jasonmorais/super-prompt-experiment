import { DefaultAzureCredential, type TokenCredential } from '@azure/identity';
import { BlobServiceClient, type BlobUploadCommonResponse } from '@azure/storage-blob';
import type { ServiceBase } from '@cellix/api-services-spec';
import { isLocalBlobConnectionString } from './connection-string.ts';
import type { BlobAddress, BlobListItem, BlobStorage, ListBlobsRequest, ServiceBlobStorageOptions, UploadDataBlobRequest, UploadTextBlobRequest } from './interfaces.ts';

function validateOptions(options: ServiceBlobStorageOptions): void {
	if (!options.accountName?.trim()) {
		throw new Error("Provide an 'accountName' for blob client authentication");
	}
}

export class ServiceBlobStorage implements ServiceBase<BlobStorage>, BlobStorage {
	protected readonly options: ServiceBlobStorageOptions;
	private blobServiceClientInternal: BlobServiceClient | undefined;

	constructor(options: ServiceBlobStorageOptions) {
		validateOptions(options);
		this.options = options;
	}

	public async startUp(): Promise<BlobStorage> {
		await Promise.resolve();

		const { accountName, connectionString, credential } = this.options;
		if (connectionString && isLocalBlobConnectionString(connectionString)) {
			this.blobServiceClientInternal = BlobServiceClient.fromConnectionString(connectionString);
			console.info(`[ServiceBlobStorage] started (Azurite). account=${accountName}`);
			return this;
		}
		const credentialToUse: TokenCredential = credential ?? new DefaultAzureCredential();
		const url = `https://${accountName}.blob.core.windows.net`;

		this.blobServiceClientInternal = new BlobServiceClient(url, credentialToUse);
		console.info(`[ServiceBlobStorage] started (managedIdentity). account=${accountName}, endpoint=${url}`);
		return this;
	}

	public shutDown(): Promise<void> {
		if (!this.blobServiceClientInternal) {
			return Promise.resolve();
		}

		this.blobServiceClientInternal = undefined;
		return Promise.resolve();
	}

	public async uploadText(request: UploadTextBlobRequest): Promise<BlobUploadCommonResponse> {
		const containerClient = this.getContainerClient(request.containerName);
		await containerClient.createIfNotExists();
		const blockBlobClient = containerClient.getBlockBlobClient(request.blobName);
		const uploadOptions = {
			...(request.httpHeaders ? { blobHTTPHeaders: request.httpHeaders } : {}),
			...(request.metadata ? { metadata: request.metadata } : {}),
			...(request.tags ? { tags: request.tags } : {}),
		};
		return await blockBlobClient.upload(request.text, Buffer.byteLength(request.text), {
			...uploadOptions,
		});
	}

	public async uploadData(request: UploadDataBlobRequest): Promise<BlobUploadCommonResponse> {
		const containerClient = this.getContainerClient(request.containerName);
		await containerClient.createIfNotExists();
		const blockBlobClient = containerClient.getBlockBlobClient(request.blobName);
		return await blockBlobClient.uploadData(request.data, {
			...(request.httpHeaders ? { blobHTTPHeaders: request.httpHeaders } : {}),
			...(request.metadata ? { metadata: request.metadata } : {}),
			...(request.tags ? { tags: request.tags } : {}),
		});
	}

	public async deleteBlob(address: BlobAddress): Promise<void> {
		await this.getContainerClient(address.containerName).deleteBlob(address.blobName);
	}

	public async listBlobs(request: ListBlobsRequest): Promise<BlobListItem[]> {
		const containerClient = this.getContainerClient(request.containerName);
		const blobs: BlobListItem[] = [];
		const listOptions = request.prefix ? { prefix: request.prefix } : undefined;

		for await (const blob of containerClient.listBlobsFlat(listOptions)) {
			blobs.push({
				name: blob.name,
				url: containerClient.getBlockBlobClient(blob.name).url,
			});
		}

		return blobs;
	}

	protected setBlobServiceClient(client: BlobServiceClient): void {
		this.blobServiceClientInternal = client;
	}

	protected getContainerClient(containerName: string) {
		return this.requireBlobServiceClient().getContainerClient(containerName);
	}

	protected getBlobServiceUrl(): string {
		return this.requireBlobServiceClient().url;
	}

	private requireBlobServiceClient(): BlobServiceClient {
		if (!this.blobServiceClientInternal) {
			throw new Error('ServiceBlobStorage is not started - cannot access blob operations');
		}
		return this.blobServiceClientInternal;
	}
}

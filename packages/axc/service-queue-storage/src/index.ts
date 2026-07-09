import type { ServiceBase } from '@cellix/api-services-spec';

export type { QueueLoggingConfig } from '@cellix/service-queue-storage';

/**
 * Strongly-typed queue operations exposed to the application context.
 *
 * The blank scaffold registers no queues. Define queues with `defineQueue` and
 * `registerQueues` from `@cellix/service-queue-storage`, then surface their
 * `sendMessageTo<Queue>` / `receiveFrom<Queue>` operations on this interface.
 */
// biome-ignore lint:noEmptyInterface — extension point; populated as queues are registered.
export interface QueueStorageOperations {}

/**
 * Infrastructure service that owns the queue-storage lifecycle. Ships as an
 * empty placeholder that satisfies the Cellix `ServiceBase` contract.
 */
export class ServiceQueueStorage implements ServiceBase<QueueStorageOperations>, QueueStorageOperations {
	public startUp(): Promise<QueueStorageOperations> {
		return Promise.resolve(this);
	}

	public shutDown(): Promise<void> {
		return Promise.resolve();
	}
}

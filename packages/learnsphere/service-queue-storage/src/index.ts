import { createRegisteredQueueService, registerQueues } from '@cellix/service-queue-storage';

export type { QueueLoggingConfig } from '@cellix/service-queue-storage';

// Keep the service registered through Cellix even while LearnSphere has no
// application queues. Adding a queue later only changes this registry; the
// lifecycle and storage authentication remain the standard Cellix behavior.
const queues = registerQueues({ outbound: {}, inbound: {} });

export const ServiceQueueStorage = createRegisteredQueueService(queues);
export type ServiceQueueStorage = InstanceType<typeof ServiceQueueStorage>;

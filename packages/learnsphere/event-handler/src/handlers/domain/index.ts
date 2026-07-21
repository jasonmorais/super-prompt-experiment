import type { DomainDataSource } from '@learnsphere/domain';

/** Hook for handlers that react to in-process domain events. */
export const RegisterDomainEventHandlers = (_domainDataSource: DomainDataSource): void => {
	/* Register domain event handlers here as aggregates emit them. */
};

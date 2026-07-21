import type { DomainDataSource } from '@learnsphere/domain';
import { RegisterDomainEventHandlers } from './domain/index.ts';
import { RegisterIntegrationEventHandlers } from './integration/index.ts';

/** Registers all domain and integration event handlers at the composition root. */
export const RegisterEventHandlers = (domainDataSource: DomainDataSource): void => {
	RegisterDomainEventHandlers(domainDataSource);
	RegisterIntegrationEventHandlers(domainDataSource);
};

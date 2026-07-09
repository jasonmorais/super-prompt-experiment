import type { DomainDataSource } from '@axc/domain';

/**
 * Subscribes domain event handlers against the domain data source at startup.
 *
 * The blank scaffold registers none — add your handlers here (e.g. react to
 * aggregate events by enqueuing integration messages or updating read models).
 */
export const RegisterEventHandlers = (domainDataSource: DomainDataSource): void => {
	void domainDataSource;
};

export * as Domain from './domain/index.ts';
export type { Passport } from './domain/passport-factory.ts';

/**
 * Aggregate of the domain's unit-of-work data sources. It is built by the
 * persistence layer and handed to event-handler registration at startup.
 *
 * Empty in the blank scaffold — add your bounded-context unit-of-work types
 * here as the domain grows (e.g. `Community: { Community: { CommunityUnitOfWork } }`).
 */
export interface DomainDataSource {}

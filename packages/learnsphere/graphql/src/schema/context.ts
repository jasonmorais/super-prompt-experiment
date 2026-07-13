import type { ApplicationServices } from '@learnsphere/application-services';

/** GraphQL context made available to every resolver. */
export interface GraphContext {
	applicationServices: ApplicationServices;
}

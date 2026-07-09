import type { ApplicationServices } from '@axc/application-services';

/** GraphQL context made available to every resolver. */
export interface GraphContext {
	applicationServices: ApplicationServices;
}

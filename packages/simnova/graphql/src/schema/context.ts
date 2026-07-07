import type { ApplicationServices } from '@simnova/application-services';

/** GraphQL context made available to every resolver. */
export interface GraphContext {
	applicationServices: ApplicationServices;
}

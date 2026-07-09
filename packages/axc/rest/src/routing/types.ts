import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { ApplicationServices } from '@axc/application-services';

export type RestRouteContext = {
	applicationServices: ApplicationServices;
	context: InvocationContext;
	request: HttpRequest;
};

export type RestRoute = {
	method: string;
	path: string;
	handler: (context: RestRouteContext) => Promise<HttpResponseInit> | HttpResponseInit;
};

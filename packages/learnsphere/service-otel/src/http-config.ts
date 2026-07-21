import type { IncomingMessage } from 'node:http';
import type { RequestOptions } from 'node:https';
import type { HttpInstrumentationConfig } from '@opentelemetry/instrumentation-http';

export const httpInstrumentationConfig: HttpInstrumentationConfig = {
	enabled: true,
	ignoreIncomingRequestHook: (request: IncomingMessage) => request.method === 'OPTIONS',
	ignoreOutgoingRequestHook: (options: RequestOptions) => options.path?.startsWith('/api/graphql') ?? false,
};

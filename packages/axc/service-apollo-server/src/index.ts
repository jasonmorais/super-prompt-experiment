import { ApolloServer, type BaseContext } from '@apollo/server';
import type { ServiceBase } from '@cellix/api-services-spec';
import { SpanStatusCode, type Span, type Tracer, trace } from '@opentelemetry/api';
import type { GraphQLSchema } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { applyMiddleware, type IMiddleware } from 'graphql-middleware';

/** Configuration options for the Apollo Server service. */
export interface ServiceApolloServerOptions {
	/** The GraphQL schema to serve. */
	schema: GraphQLSchema;
	/** Optional middleware to apply to the schema (e.g., permissions). */
	middleware?: IMiddleware;
	/** Enable GraphQL introspection. @default false in production */
	introspection?: boolean;
	/** Allow batched HTTP requests. @default true */
	allowBatchedHttpRequests?: boolean;
	/** Maximum query depth allowed. @default 10 */
	maxDepth?: number;
}

/**
 * Apollo Server infrastructure service following the Cellix `ServiceBase`
 * pattern. Manages the Apollo Server lifecycle with `startUp`/`shutDown` hooks.
 */
export class ServiceApolloServer<TContext extends BaseContext = BaseContext> implements ServiceBase<ApolloServer<TContext>> {
	private serverInternal: ApolloServer<TContext> | undefined;
	private readonly options: ServiceApolloServerOptions;
	private readonly tracer: Tracer = trace.getTracer('service-apollo-server');

	constructor(options: ServiceApolloServerOptions) {
		this.options = options;
	}

	public async startUp(): Promise<ApolloServer<TContext>> {
		return await this.tracer.startActiveSpan('ServiceApolloServer.startUp', async (span: Span) => {
			try {
				const { NODE_ENV: nodeEnv } = process.env;
				const { schema, middleware, introspection = nodeEnv !== 'production', allowBatchedHttpRequests = true, maxDepth = 10 } = this.options;
				const finalSchema = middleware ? applyMiddleware(schema, middleware) : schema;
				this.serverInternal = new ApolloServer<TContext>({
					schema: finalSchema,
					introspection,
					allowBatchedHttpRequests,
					validationRules: [depthLimit(maxDepth)],
				});
				await this.serverInternal.start();
				span.setStatus({ code: SpanStatusCode.OK });
				return this.serverInternal;
			} catch (error) {
				span.setStatus({ code: SpanStatusCode.ERROR, message: error instanceof Error ? error.message : 'Startup failed' });
				if (error instanceof Error) {
					span.recordException(error);
				}
				throw error;
			} finally {
				span.end();
			}
		});
	}

	public async shutDown(): Promise<void> {
		if (!this.serverInternal) {
			throw new Error('ServiceApolloServer is not started - shutdown cannot proceed');
		}
		await this.serverInternal.stop();
		this.serverInternal = undefined;
	}

	public get server(): ApolloServer<TContext> {
		if (!this.serverInternal) {
			throw new Error('ServiceApolloServer is not started - cannot access server');
		}
		return this.serverInternal;
	}
}

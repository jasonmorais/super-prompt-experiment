import type { NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { AzureMonitorLogExporter, AzureMonitorMetricExporter, AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import azureOtel from '@azure/functions-opentelemetry-instrumentation';
import { DataloaderInstrumentation } from '@opentelemetry/instrumentation-dataloader';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';
import { BatchLogRecordProcessor, ConsoleLogRecordExporter, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { AlwaysOnSampler, BatchSpanProcessor, ConsoleSpanExporter, ParentBasedSampler, SamplingDecision, SimpleSpanProcessor, type Sampler } from '@opentelemetry/sdk-trace-node';
import type { Attributes, Context, Link, SpanKind } from '@opentelemetry/api';
import { httpInstrumentationConfig } from './http-config.ts';

const { AzureFunctionsInstrumentation } = azureOtel;

interface Exporters {
	traceExporter: AzureMonitorTraceExporter | ConsoleSpanExporter;
	metricExporter: AzureMonitorMetricExporter | ConsoleMetricExporter;
	logExporter: AzureMonitorLogExporter | ConsoleLogRecordExporter;
}

export class OtelBuilder {
	buildExporters(exportToConsole = false): Exporters {
		if (exportToConsole) return { traceExporter: new ConsoleSpanExporter(), metricExporter: new ConsoleMetricExporter(), logExporter: new ConsoleLogRecordExporter() };
		// biome-ignore lint/complexity/useLiteralKeys: environment variables use an index signature.
		const connectionString = process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'];
		if (!connectionString) throw new Error('Missing required environment variable: APPLICATIONINSIGHTS_CONNECTION_STRING');
		return { traceExporter: new AzureMonitorTraceExporter({ connectionString }), metricExporter: new AzureMonitorMetricExporter({ connectionString }), logExporter: new AzureMonitorLogExporter({ connectionString }) };
	}

	buildProcessors(useSimpleProcessors = false, exporters: Exporters): Partial<NodeSDKConfiguration> {
		if (useSimpleProcessors) return { spanProcessors: [new SimpleSpanProcessor(exporters.traceExporter)], logRecordProcessors: [new SimpleLogRecordProcessor(exporters.logExporter)] };
		return {
			spanProcessors: [new BatchSpanProcessor(exporters.traceExporter, { exportTimeoutMillis: 15000, maxQueueSize: 1000 })],
			logRecordProcessors: [new BatchLogRecordProcessor(exporters.logExporter, { exportTimeoutMillis: 15000, maxQueueSize: 1000 })],
		};
	}

	buildMetricReader(exporters: Exporters) {
		return new PeriodicExportingMetricReader({ exporter: exporters.metricExporter, exportIntervalMillis: 60000 });
	}

	buildSampler(): Sampler {
		const denylist = [/^graphql\.parseSchema$/, /^graphql\.parse$/, /^graphql\.validate$/];
		class NameFilterSampler implements Sampler {
			private readonly delegate: Sampler;
			constructor(delegate: Sampler) {
				this.delegate = delegate;
			}
			shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: Attributes, links: Link[]) {
				return denylist.some((re) => re.test(spanName)) ? { decision: SamplingDecision.NOT_RECORD } : this.delegate.shouldSample(context, traceId, spanName, spanKind, attributes, links);
			}
			toString() {
				return 'NameFilterSampler(deny: graphql.parse*, graphql.validate)';
			}
		}
		return new ParentBasedSampler({ root: new NameFilterSampler(new AlwaysOnSampler()) });
	}

	buildInstrumentations() {
		return [
			new HttpInstrumentation(httpInstrumentationConfig),
			new AzureFunctionsInstrumentation({ enabled: true }),
			new GraphQLInstrumentation({ allowValues: true, ignoreTrivialResolveSpans: true }),
			new DataloaderInstrumentation(),
			new MongooseInstrumentation(),
		];
	}
}

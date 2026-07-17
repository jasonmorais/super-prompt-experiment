import type { SyncServiceBase } from '@cellix/api-services-spec';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { OtelBuilder } from './otel-builder.ts';

export interface OtelConfig {
	/** Export telemetry to the console. @default false */
	exportToConsole?: boolean;
	/** Use simple (non-batched) processors — useful for debugging. @default false */
	useSimpleProcessors?: boolean;
}

export class ServiceOtel implements SyncServiceBase<void> {
	private readonly sdk: opentelemetry.NodeSDK;

	constructor(config: OtelConfig) {
		const builder = new OtelBuilder();
		const exporters = builder.buildExporters(config.exportToConsole);
		this.sdk = new opentelemetry.NodeSDK({
			...builder.buildProcessors(config.useSimpleProcessors, exporters),
			metricReader: builder.buildMetricReader(exporters),
			instrumentations: builder.buildInstrumentations(),
			resource: opentelemetry.resources.Resource.default().merge(new opentelemetry.resources.Resource({ [ATTR_SERVICE_NAME]: 'LearnSphere', [ATTR_SERVICE_VERSION]: '1.0.0' })),
			sampler: builder.buildSampler(),
		});
	}

	public startUp(): void {
		this.sdk.start();
		console.log('ServiceOtel started');
	}

	public shutDown(): void {
		void this.sdk.shutdown();
		console.log('ServiceOtel stopped');
	}
}

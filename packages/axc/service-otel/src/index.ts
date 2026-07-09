import type { SyncServiceBase } from '@cellix/api-services-spec';

export interface OtelConfig {
	/** Export telemetry to the console. @default false */
	exportToConsole?: boolean;
	/** Use simple (non-batched) processors — useful for debugging. @default false */
	useSimpleProcessors?: boolean;
}

/**
 * OpenTelemetry bootstrap service.
 *
 * The blank scaffold ships a no-op placeholder that satisfies the Cellix
 * `SyncServiceBase` lifecycle. Wire the OpenTelemetry Node SDK
 * (`@opentelemetry/sdk-node` plus the Azure Monitor exporter) here to enable
 * traces, metrics, and logs for your application.
 */
export class ServiceOtel implements SyncServiceBase<void> {
	private readonly config: OtelConfig;

	constructor(config: OtelConfig) {
		this.config = config;
	}

	public startUp(): void {
		if (this.config.exportToConsole) {
			console.log('ServiceOtel started (placeholder — configure the OpenTelemetry SDK to enable telemetry)');
		}
	}

	public shutDown(): void {
		console.log('ServiceOtel stopped');
	}
}

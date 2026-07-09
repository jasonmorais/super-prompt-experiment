import mongoose, { type ConnectOptions, type Mongoose } from 'mongoose';
import type { ServiceBase } from '@cellix/api-services-spec';
import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';

export type ServiceMongooseOptions = ConnectOptions & { debug?: boolean };

/**
 * Infrastructure service that owns the Mongoose connection lifecycle.
 *
 * Registered with the Cellix bootstrap so `startUp`/`shutDown` are managed by
 * the framework. Exposes the connected `Mongoose` instance as a
 * `MongooseContextFactory` for the persistence layer to build models from.
 */
export class ServiceMongoose implements ServiceBase<MongooseSeedwork.MongooseContextFactory>, MongooseSeedwork.MongooseContextFactory {
	private readonly uri: string;
	private readonly options: ServiceMongooseOptions;
	private serviceInternal: Mongoose | undefined;

	constructor(uri: string, options?: ServiceMongooseOptions) {
		if (!uri || uri.trim() === '') {
			throw new Error('MongoDB uri is required');
		}
		this.uri = uri;
		this.options = options ?? {};
	}

	public async startUp(): Promise<this> {
		const { debug, ...options } = this.options;
		this.serviceInternal = await mongoose.connect(this.uri, options);
		if (debug) {
			this.serviceInternal.set('debug', true);
		}
		return this;
	}

	public async shutDown(): Promise<void> {
		if (!this.serviceInternal) {
			throw new Error('ServiceMongoose is not started - shutdown cannot proceed');
		}
		await this.serviceInternal.disconnect();
		console.log('ServiceMongoose stopped');
	}

	public get service(): Mongoose {
		if (!this.serviceInternal) {
			throw new Error('ServiceMongoose is not started - cannot access service');
		}
		return this.serviceInternal;
	}
}

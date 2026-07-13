import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { Persistence } from '@learnsphere/persistence';
import type { ServiceMongooseOptions } from '@learnsphere/service-mongoose';

const { COSMOSDB_DBNAME, COSMOSDB_CONNECTION_STRING, NODE_ENV } = process.env;

const isUsingCosmosDBEmulator = NODE_ENV === 'development' || NODE_ENV === 'test';

export const mongooseConnectOptions: ServiceMongooseOptions = {
	tlsInsecure: isUsingCosmosDBEmulator, // only true for local development — required for the Azure Cosmos DB emulator
	minPoolSize: 10,
	autoIndex: true,
	autoCreate: true,
	dbName: COSMOSDB_DBNAME,
	debug: NODE_ENV !== 'production', // enables Mongoose logs for local development only
};

export const mongooseConnectionString: string = COSMOSDB_CONNECTION_STRING ?? '';

export const mongooseContextBuilder = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
	return Persistence(initializedService);
};

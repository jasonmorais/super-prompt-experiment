declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test';

		// Azure Functions / local settings
		AZURE_STORAGE_CONNECTION_STRING: string;
		AZURE_STORAGE_ACCOUNT_NAME: string;

		// Portal / OIDC (consumed by @simnova/service-token-validation)
		PORTAL_OIDC_AUDIENCE: string;
		PORTAL_OIDC_ENDPOINT: string;
		PORTAL_OIDC_ISSUER: string;
		PORTAL_OIDC_IGNORE_ISSUER: string; // 'true' | 'false' stored as string in env

		// Application Insights
		APPLICATIONINSIGHTS_CONNECTION_STRING: string;

		// Cosmos / Mongo connection
		COSMOSDB_CONNECTION_STRING: string;
		COSMOSDB_DBNAME: string;
	}
}

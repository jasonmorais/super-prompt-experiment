/**
 * Blob storage configuration for the API application.
 *
 * Uses managed identity for server-side blob operations in production and
 * SharedKey signing for non-production environments where Azurite is used for
 * local development and CI.
 */

// biome-ignore lint/complexity/useLiteralKeys: Azure Functions exposes this legacy mixed-case setting name.
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING ?? process.env['AzureWebJobsStorage'];
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME ?? 'devstoreaccount1';

export { accountName, connectionString };

import { createRemoteJWKSet, type FlattenedJWSInput, type GetKeyFunction, type JWSHeaderParameters, jwtVerify, type JWTVerifyOptions, type JWTVerifyResult, type ResolvedKey } from 'jose';

export type OpenIdConfig = {
	issuerUrl: string;
	oidcEndpoint: string;
	audience: string | string[];
	ignoreIssuer: boolean;
	clockTolerance?: string;
};

/** Maintains refreshed OIDC keystores and verifies tokens for one provider. */
export class VerifiedTokenService {
	readonly openIdConfigs: Map<string, OpenIdConfig>;
	readonly refreshInterval: number;
	readonly keyStoreCollection = new Map<string, { keyStore: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>; issuerUrl: string }>();
	timerInstance: NodeJS.Timeout | undefined;

	constructor(openIdConfigs: Map<string, OpenIdConfig>, refreshInterval = 1000 * 60 * 5) {
		if (!openIdConfigs.size) throw new Error('openIdConfigs is required');
		this.openIdConfigs = openIdConfigs;
		this.refreshInterval = refreshInterval;
	}

	start(): void {
		if (this.timerInstance) return;
		this.refreshCollection();
		this.timerInstance = setInterval(() => this.refreshCollection(), this.refreshInterval);
	}

	refreshCollection(): void {
		for (const [configKey, config] of this.openIdConfigs) {
			this.keyStoreCollection.set(configKey, {
				keyStore: createRemoteJWKSet(new URL(config.oidcEndpoint)),
				issuerUrl: config.issuerUrl,
			});
		}
	}

	getVerifiedJwt(bearerToken: string, configKey: string): Promise<JWTVerifyResult & ResolvedKey> {
		if (!this.timerInstance) throw new Error('VerifiedTokenService not started');
		const config = this.openIdConfigs.get(configKey);
		const keyStore = this.keyStoreCollection.get(configKey)?.keyStore;
		if (!config || !keyStore) throw new Error('Invalid OpenIdConfig Key');
		const options: JWTVerifyOptions = {
			audience: config.audience,
			clockTolerance: config.clockTolerance ?? '5 minutes',
		};
		if (!config.ignoreIssuer) options.issuer = config.issuerUrl;
		return jwtVerify(bearerToken, keyStore, options);
	}
}

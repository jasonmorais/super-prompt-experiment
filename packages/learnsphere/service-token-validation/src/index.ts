import type { ServiceBase } from '@cellix/api-services-spec';
import { type OpenIdConfig, VerifiedTokenService } from './verified-token-service.ts';

export { type OpenIdConfig, VerifiedTokenService } from './verified-token-service.ts';

export interface TokenValidation {
	verifyJwt<ClaimsType>(token: string): Promise<TokenValidationResult<ClaimsType> | null>;
}

export interface TokenValidationResult<ClaimsType> {
	verifiedJwt: ClaimsType;
	openIdConfigKey: string;
}

/**
 * Infrastructure service that validates portal JWTs against one or more OIDC
 * providers. Portals are supplied as a `Map<portalKey, ENV_PREFIX>`; the OIDC
 * settings for each portal are read from environment variables named
 * `${ENV_PREFIX}_OIDC_ENDPOINT`, `_OIDC_AUDIENCE`, `_OIDC_ISSUER`, and
 * `_OIDC_IGNORE_ISSUER`.
 */
export class ServiceTokenValidation implements ServiceBase<TokenValidation> {
	private readonly tokenSettings: Map<string, OpenIdConfig>;
	private readonly tokenVerifier: VerifiedTokenService;
	private readonly refreshInterval: number;

	constructor(portalTokens: Map<string, string>, refreshInterval = 1000 * 60 * 5) {
		this.tokenSettings = new Map<string, OpenIdConfig>();
		this.refreshInterval = refreshInterval;
		for (const [portalKey, envPrefix] of portalTokens) {
			this.tokenSettings.set(portalKey, {
				oidcEndpoint: this.requireEnv(`${envPrefix}_OIDC_ENDPOINT`),
				clockTolerance: process.env[`${envPrefix}_OIDC_CLOCK_TOLERANCE`] ?? '5 minutes',
				audience: this.requireEnv(`${envPrefix}_OIDC_AUDIENCE`),
				issuerUrl: this.requireEnv(`${envPrefix}_OIDC_ISSUER`),
				ignoreIssuer: (process.env[`${envPrefix}_OIDC_IGNORE_ISSUER`] ?? 'false') === 'true',
			});
		}
		this.tokenVerifier = new VerifiedTokenService(this.tokenSettings, this.refreshInterval);
	}

	public startUp(): Promise<TokenValidation> {
		this.tokenVerifier.start();
		return Promise.resolve(this);
	}

	public async verifyJwt<ClaimsType>(token: string): Promise<TokenValidationResult<ClaimsType> | null> {
		for (const key of this.tokenSettings.keys()) {
			try {
				const { payload } = await this.tokenVerifier.getVerifiedJwt(token, key);
				return { verifiedJwt: payload as unknown as ClaimsType, openIdConfigKey: key };
			} catch (error) {
				if (!this.isRetryableVerificationError(error)) throw error;
			}
		}
		return null;
	}

	public shutDown(): Promise<void> {
		if (this.tokenVerifier.timerInstance) clearInterval(this.tokenVerifier.timerInstance);
		return Promise.resolve();
	}

	private requireEnv(name: string): string {
		const value = process.env[name];
		if (value === undefined) {
			throw new Error(`Environment variable ${name} not set`);
		}
		return value;
	}

	private isRetryableVerificationError(error: unknown): boolean {
		return error instanceof Error && ['JWSSignatureVerificationFailed', 'JWTClaimValidationFailed', 'JWTExpired', 'JWTInvalid', 'JWSInvalid'].includes(error.name);
	}
}

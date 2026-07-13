import type { ServiceBase } from '@cellix/api-services-spec';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface TokenValidation {
	verifyJwt<ClaimsType>(token: string): Promise<TokenValidationResult<ClaimsType> | null>;
}

export interface TokenValidationResult<ClaimsType> {
	verifiedJwt: ClaimsType;
	openIdConfigKey: string;
}

interface OpenIdConfig {
	oidcEndpoint: string;
	audience: string;
	issuerUrl: string;
	ignoreIssuer: boolean;
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
	private readonly jwksCache: Map<string, ReturnType<typeof createRemoteJWKSet>>;

	constructor(portalTokens: Map<string, string>) {
		this.tokenSettings = new Map<string, OpenIdConfig>();
		this.jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
		for (const [portalKey, envPrefix] of portalTokens) {
			this.tokenSettings.set(portalKey, {
				oidcEndpoint: this.requireEnv(`${envPrefix}_OIDC_ENDPOINT`),
				audience: this.requireEnv(`${envPrefix}_OIDC_AUDIENCE`),
				issuerUrl: this.requireEnv(`${envPrefix}_OIDC_ISSUER`),
				ignoreIssuer: (process.env[`${envPrefix}_OIDC_IGNORE_ISSUER`] ?? 'false') === 'true',
			});
		}
	}

	public startUp(): Promise<TokenValidation> {
		for (const [key, config] of this.tokenSettings) {
			this.jwksCache.set(key, createRemoteJWKSet(new URL(config.oidcEndpoint)));
		}
		return Promise.resolve(this);
	}

	public async verifyJwt<ClaimsType>(token: string): Promise<TokenValidationResult<ClaimsType> | null> {
		for (const [key, config] of this.tokenSettings) {
			const jwks = this.jwksCache.get(key);
			if (!jwks) {
				continue;
			}
			try {
				const { payload } = await jwtVerify(token, jwks, {
					audience: config.audience,
					...(config.ignoreIssuer ? {} : { issuer: config.issuerUrl }),
				});
				return { verifiedJwt: payload as unknown as ClaimsType, openIdConfigKey: key };
			} catch {
				// Signature or claims validation failed for this portal; try the next one.
			}
		}
		return null;
	}

	public shutDown(): Promise<void> {
		return Promise.resolve();
	}

	private requireEnv(name: string): string {
		const value = process.env[name];
		if (value === undefined) {
			throw new Error(`Environment variable ${name} not set`);
		}
		return value;
	}
}

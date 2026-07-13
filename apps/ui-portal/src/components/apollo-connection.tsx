import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { type FC, type ReactNode, useMemo } from 'react';
import { useAuth } from 'react-oidc-context';

const COMMON_API_ENDPOINT = import.meta.env.VITE_COMMON_API_ENDPOINT;

export interface ApolloConnectionProps {
	children: ReactNode;
}

/**
 * Connects the portal to the LearnSphere GraphQL API. Injects the OIDC access token
 * as a bearer header on every request. This is the single place to extend the
 * Apollo link chain (batching, REST sources, custom headers) as the app grows.
 */
export const ApolloConnection: FC<ApolloConnectionProps> = ({ children }) => {
	const auth = useAuth();
	const accessToken = auth.user?.access_token;

	const client = useMemo(() => {
		const httpLink = new HttpLink({ uri: COMMON_API_ENDPOINT ?? '/api/graphql' });
		const authLink = setContext((_operation, prevContext) => {
			// biome-ignore lint:useLiteralKeys — apollo context is an index signature.
			const headers = (prevContext['headers'] as Record<string, string> | undefined) ?? {};
			return {
				headers: {
					...headers,
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
			};
		});
		return new ApolloClient({ link: from([authLink, httpLink]), cache: new InMemoryCache() });
	}, [accessToken]);

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

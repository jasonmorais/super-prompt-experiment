import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { readLearnSphereIdentity } from '@learnsphere/ui-shared';
import { type FC, useMemo, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { createApolloLink } from './apollo-client-links.tsx';

export interface ApolloConnectionProps {
	children: React.ReactNode;
}

export const ApolloConnection: FC<ApolloConnectionProps> = ({ children }) => {
	const auth = useAuth();
	const accessToken = auth.user?.access_token;
	const subject = readLearnSphereIdentity(auth.user?.profile).sub;
	const accessTokenRef = useRef<string | undefined>(accessToken);
	accessTokenRef.current = accessToken;
	const client = useMemo(
		() =>
			new ApolloClient({
				cache: new InMemoryCache(),
				link: createApolloLink(() => accessTokenRef.current),
				devtools: { enabled: !import.meta.env.PROD },
			}),
		[subject],
	);

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

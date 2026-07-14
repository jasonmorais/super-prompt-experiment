import { from, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export type AccessTokenReader = () => string | undefined;

export const createApolloLink = (readAccessToken: AccessTokenReader) => {
	const httpLink = new HttpLink({ uri: import.meta.env.VITE_COMMON_API_ENDPOINT ?? '/api/graphql' });
	const authLink = setContext((_operation, { headers }) => {
		const accessToken = readAccessToken();
		return {
			headers: {
				...headers,
				...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			},
		};
	});
	return from([authLink, httpLink]);
};

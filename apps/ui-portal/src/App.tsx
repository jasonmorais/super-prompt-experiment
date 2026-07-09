import { Root } from '@axc/ui-route-root';
import { ApolloConnection } from './components/apollo-connection.tsx';

/**
 * The portal app shell delegates route composition to @axc/ui-route-root.
 */
export default function App() {
	return (
		<ApolloConnection>
			<Root />
		</ApolloConnection>
	);
}

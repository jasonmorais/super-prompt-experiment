import { Root } from '@learnsphere/ui-route-root';
import { Route, Routes } from 'react-router-dom';
import { ApolloConnection } from './components/apollo-connection.tsx';

/**
 * The learner portal route table. Authoring and administration experiences can
 * be mounted alongside the dashboard as their bounded contexts grow.
 */
export default function App() {
	return (
		<ApolloConnection>
			<Routes>
				<Route
					path="*"
					element={<Root />}
				/>
			</Routes>
		</ApolloConnection>
	);
}

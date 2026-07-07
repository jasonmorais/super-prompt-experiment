import { Root } from '@simnova/ui-route-root';
import { Route, Routes } from 'react-router-dom';
import { ApolloConnection } from './components/apollo-connection.tsx';

/**
 * The portal's route table. The blank scaffold renders the root landing page
 * for every path — add your feature routes here.
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

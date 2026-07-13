import { ServiceOtel } from '@learnsphere/service-otel';

const Otel = new ServiceOtel({
	// biome-ignore lint:useLiteralKeys — process.env is an index signature.
	exportToConsole: process.env['NODE_ENV'] === 'development',
	// biome-ignore lint:useLiteralKeys — process.env is an index signature.
	useSimpleProcessors: process.env['NODE_ENV'] === 'development',
});
Otel.startUp();

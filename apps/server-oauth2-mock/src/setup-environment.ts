import * as dotenv from 'dotenv';

export function setupEnvironment(): void {
	dotenv.config();
	dotenv.config({ path: '.env.local', override: true });
}

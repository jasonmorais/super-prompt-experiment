import { AzureFunctionsDevRunner } from '@cellix/local-dev';
import { buildLearnSphereApiLocalSettings } from '@learnsphere/local-dev-config';

new AzureFunctionsDevRunner({
	localSettings: buildLearnSphereApiLocalSettings(),
}).start();

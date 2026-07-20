import { AzureFunctionsLocalSettings } from '@cellix/local-dev';
import { buildLearnSphereApiLocalSettings } from '@learnsphere/local-dev-config';

new AzureFunctionsLocalSettings(buildLearnSphereApiLocalSettings()).sync();

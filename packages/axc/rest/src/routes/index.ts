import type { RestRoute } from '../routing/types.ts';
import { courseRoutes } from './courses/index.ts';

export const restRoutes: RestRoute[] = [...courseRoutes];

import { published } from './collections';
import type { RouteKey } from '../i18n/routes';

/**
 * Pages that only exist when they have content. With no published projects or
 * news, those pages are not built and their links disappear from the navigation.
 */
export async function hiddenRoutes(): Promise<Set<RouteKey>> {
  const hidden = new Set<RouteKey>();
  if ((await published('projects')).length === 0) hidden.add('projects');
  if ((await published('news')).length === 0) hidden.add('news');
  return hidden;
}

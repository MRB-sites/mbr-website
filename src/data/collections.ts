import { getCollection, type CollectionEntry } from 'astro:content';
import { hasContentFiles, type ContentFolder } from './content-files';

/**
 * Published (non-draft) entries of a collection. Returns [] for an empty
 * folder without touching the content layer, so empty collections build quietly.
 */
export async function published<C extends ContentFolder>(collection: C, filter: (entry: CollectionEntry<C>) => boolean = () => true): Promise<CollectionEntry<C>[]> {
  if (!hasContentFiles(collection)) return [];
  const all = (await getCollection(collection)) as CollectionEntry<C>[];
  return all.filter((entry) => !entry.data.draft && filter(entry));
}

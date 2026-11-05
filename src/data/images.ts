import type { ImageMetadata } from 'astro';

/**
 * All images in src/assets/ addressed by their path below that folder,
 * e.g. getAsset('placeholders/hero.jpg'). Lets config files reference images by string.
 *
 * A photo in src/assets/stock/ (or your own photo saved there) with the same
 * file name as a placeholder automatically replaces that placeholder.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export function getAsset(path: string): ImageMetadata {
  const override = path.startsWith('placeholders/') ? files[`/src/assets/stock/${path.slice('placeholders/'.length)}`] : undefined;
  const file = override ?? files[`/src/assets/${path}`];
  if (!file) throw new Error(`Image not found: src/assets/${path}. Check the path in your config/content.`);
  return file.default;
}

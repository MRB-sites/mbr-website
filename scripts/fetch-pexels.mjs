/**
 * Downloads stock photos from Pexels into src/assets/stock/ and records
 * photographer credits in src/data/photo-credits.json.
 *
 * Usage:  npm run photos            (skips slots that already have a photo)
 *         npm run photos -- --force (re-download everything)
 *
 * Needs PEXELS_API_KEY in .env. A file in src/assets/stock/ automatically
 * replaces the placeholder with the same name (see src/data/images.ts).
 * To use your own photo instead, put it in src/assets/stock/ with the slot's
 * file name, or delete the stock file to fall back to the placeholder.
 *
 * Team portraits and the Instagram grid are deliberately NOT filled with stock
 * photos – they must show your real people and your real feed.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'stock');
const creditsFile = join(root, 'src', 'data', 'photo-credits.json');
const force = process.argv.includes('--force');
const key = process.env.PEXELS_API_KEY;
if (!key) {
  console.error('PEXELS_API_KEY missing. Add it to .env and run: npm run photos');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

/** slot (file name without .jpg) → search query, orientation */
const SLOTS = [
  ['hero', 'demolition excavator building', 'landscape'],
  ['service-rivning', 'building demolition', 'landscape'],
  ['service-sanering', 'worker protective suit respirator', 'landscape'],
  ['service-haltagning', 'concrete cutting saw', 'landscape'],
  ['service-nybyggnation', 'house construction site framing', 'landscape'],
  ['service-ombyggnad', 'interior renovation construction', 'landscape'],
  ['service-avfall', 'construction waste container', 'landscape'],
  ['project-1-cover', 'house demolition excavator', 'landscape'],
  ['project-1-before', 'old abandoned house', 'landscape'],
  ['project-1-after', 'new house construction', 'landscape'],
  ['project-1-gallery-1', 'demolition debris', 'landscape'],
  ['project-1-gallery-2', 'excavator demolition', 'landscape'],
  ['project-1-gallery-3', 'construction rubble pile', 'landscape'],
  ['project-2-cover', 'apartment building renovation', 'landscape'],
  ['project-2-before', 'bathroom demolition', 'landscape'],
  ['project-2-after', 'modern bathroom', 'landscape'],
  ['project-2-gallery-1', 'renovation interior walls stripped', 'landscape'],
  ['project-2-gallery-2', 'construction worker drilling wall', 'landscape'],
  ['environment', 'scrap metal recycling', 'landscape'],
  ['safety', 'construction worker hard hat safety', 'portrait'],
  ['about', 'construction site workers', 'landscape'],
  ['careers', 'construction worker', 'landscape'],
  ['machine-1', 'demolition machine', 'landscape'],
  ['machine-2', 'excavator', 'landscape'],
  ['machine-3', 'concrete saw', 'landscape'],
  ['machine-4', 'dump truck', 'landscape'],
  ['news-1', 'construction site crane', 'landscape'],
  ['news-2', 'excavator construction', 'landscape'],
];

const credits = existsSync(creditsFile) ? JSON.parse(readFileSync(creditsFile, 'utf8')) : {};
const used = new Set(Object.values(credits).map((c) => c.id));

async function search(query, orientation) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=15&size=large`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);
  return (await res.json()).photos ?? [];
}

let fetched = 0;
for (const [slot, query, orientation] of SLOTS) {
  const target = join(outDir, `${slot}.jpg`);
  if (existsSync(target) && !force) continue;
  const photos = await search(query, orientation);
  const photo = photos.find((p) => !used.has(p.id)) ?? photos[0];
  if (!photo) {
    console.warn(`No result for ${slot} ("${query}") – placeholder kept.`);
    continue;
  }
  used.add(photo.id);
  const width = orientation === 'portrait' ? 1400 : 2400;
  const img = await fetch(`${photo.src.original}?auto=compress&cs=tinysrgb&fm=jpg&w=${width}`);
  if (!img.ok) throw new Error(`Download failed for ${slot}`);
  writeFileSync(target, Buffer.from(await img.arrayBuffer()));
  credits[slot] = { id: photo.id, photographer: photo.photographer, photographerUrl: photo.photographer_url, url: photo.url, alt: photo.alt ?? '' };
  fetched++;
  console.log(`✓ ${slot} ← ${photo.photographer} (${photo.url})`);
}

writeFileSync(creditsFile, `${JSON.stringify(credits, null, 2)}\n`);
console.log(`Done: ${fetched} photo(s) downloaded. Credits in src/data/photo-credits.json`);

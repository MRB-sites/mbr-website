/**
 * Generates clearly labelled placeholder photos in src/assets/placeholders/.
 *
 * Run once with `npm run images`. Replace each file with a real photo using the
 * SAME file name (or update the path in src/config/company.ts / content files).
 * Existing files are NOT overwritten unless you pass --force.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'placeholders');
const force = process.argv.includes('--force');
mkdirSync(outDir, { recursive: true });

const TONES = {
  concrete: ['#7a7873', '#3d3c39'],
  dusk: ['#5b5550', '#2a2725'],
  before: ['#6e5a4a', '#2f2620'],
  after: ['#a7a59f', '#5f5d58'],
  steel: ['#5f6770', '#2a2f35'],
  green: ['#5f6b5a', '#2b3128'],
};

/** [file, width, height, label, tone, kind] */
const IMAGES = [
  ['hero.jpg', 2400, 1350, 'Hero: rivningsmaskin i arbete', 'dusk'],
  ['service-rivning.jpg', 1600, 1000, 'Tjänst: rivning', 'concrete'],
  ['service-sanering.jpg', 1600, 1000, 'Tjänst: sanering (asbest/PCB)', 'steel'],
  ['service-haltagning.jpg', 1600, 1000, 'Tjänst: håltagning & sågning', 'concrete'],
  ['service-nybyggnation.jpg', 1600, 1000, 'Tjänst: nybyggnation', 'after'],
  ['service-ombyggnad.jpg', 1600, 1000, 'Tjänst: ombyggnad & renovering', 'dusk'],
  ['service-avfall.jpg', 1600, 1000, 'Tjänst: avfall & containrar', 'green'],
  ['project-1-cover.jpg', 1920, 1080, 'Exempelprojekt 1: omslagsbild', 'concrete'],
  ['project-1-before.jpg', 1600, 1000, 'Exempelprojekt 1: FÖRE', 'before', 'before'],
  ['project-1-after.jpg', 1600, 1000, 'Exempelprojekt 1: EFTER', 'after', 'after'],
  ['project-1-gallery-1.jpg', 1600, 1067, 'Exempelprojekt 1: galleri 1', 'dusk'],
  ['project-1-gallery-2.jpg', 1600, 1067, 'Exempelprojekt 1: galleri 2', 'steel'],
  ['project-1-gallery-3.jpg', 1600, 1067, 'Exempelprojekt 1: galleri 3', 'concrete'],
  ['project-2-cover.jpg', 1920, 1080, 'Exempelprojekt 2: omslagsbild', 'after'],
  ['project-2-before.jpg', 1600, 1000, 'Exempelprojekt 2: FÖRE', 'before', 'before'],
  ['project-2-after.jpg', 1600, 1000, 'Exempelprojekt 2: EFTER', 'after', 'after'],
  ['project-2-gallery-1.jpg', 1600, 1067, 'Exempelprojekt 2: galleri 1', 'concrete'],
  ['project-2-gallery-2.jpg', 1600, 1067, 'Exempelprojekt 2: galleri 2', 'dusk'],
  ['environment.jpg', 1600, 1000, 'Miljö: källsortering på arbetsplats', 'green'],
  ['safety.jpg', 1600, 1000, 'Säkerhet: skyddsutrustning & avspärrning', 'steel'],
  ['about.jpg', 1600, 1000, 'Om oss: teamet på en arbetsplats', 'dusk'],
  ['careers.jpg', 1600, 900, 'Karriär: medarbetare i arbete', 'concrete'],
  ['team-1.jpg', 800, 1000, 'Porträtt: medarbetare 1', 'steel', 'portrait'],
  ['team-2.jpg', 800, 1000, 'Porträtt: medarbetare 2', 'steel', 'portrait'],
  ['team-3.jpg', 800, 1000, 'Porträtt: medarbetare 3', 'steel', 'portrait'],
  ['machine-1.jpg', 1200, 900, 'Maskin 1', 'concrete'],
  ['machine-2.jpg', 1200, 900, 'Maskin 2', 'dusk'],
  ['machine-3.jpg', 1200, 900, 'Maskin 3', 'steel'],
  ['machine-4.jpg', 1200, 900, 'Maskin 4', 'green'],
  ['instagram-1.jpg', 800, 800, 'Instagram 1', 'concrete'],
  ['instagram-2.jpg', 800, 800, 'Instagram 2', 'dusk'],
  ['instagram-3.jpg', 800, 800, 'Instagram 3', 'steel'],
  ['instagram-4.jpg', 800, 800, 'Instagram 4', 'after'],
  ['instagram-5.jpg', 800, 800, 'Instagram 5', 'green'],
  ['instagram-6.jpg', 800, 800, 'Instagram 6', 'before'],
  ['news-1.jpg', 1600, 900, 'Nyhet 1', 'concrete'],
  ['news-2.jpg', 1600, 900, 'Nyhet 2', 'steel'],
  ['map.jpg', 1200, 800, 'Kartbild – ersätt med statisk karta', 'concrete', 'map'],
  ['og-default.jpg', 1200, 630, 'Delningsbild (Open Graph)', 'dusk', 'og'],
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function hazard(w) {
  const stripes = [];
  for (let x = -60; x < w + 60; x += 48) {
    stripes.push(`<polygon points="${x},0 ${x + 24},0 ${x - 6},30 ${x - 30},30" fill="#141414"/>`);
  }
  return `<rect width="${w}" height="30" fill="#ff6a13"/>${stripes.join('')}`;
}

function mapSvg(w, h) {
  const lines = [];
  for (let i = 0; i < 14; i++) {
    const y = (h / 14) * i + ((i * 37) % 23);
    lines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y + ((i % 3) - 1) * 60}" stroke="#d6d3cc" stroke-width="${i % 4 === 0 ? 14 : 6}"/>`);
  }
  for (let i = 0; i < 18; i++) {
    const x = (w / 18) * i + ((i * 53) % 31);
    lines.push(`<line x1="${x}" y1="0" x2="${x + ((i % 3) - 1) * 80}" y2="${h}" stroke="#d6d3cc" stroke-width="${i % 5 === 0 ? 14 : 6}"/>`);
  }
  return `<rect width="${w}" height="${h}" fill="#ebe8e1"/>
    <path d="M0 ${h * 0.75} C ${w * 0.3} ${h * 0.65}, ${w * 0.5} ${h * 0.95}, ${w} ${h * 0.8} L ${w} ${h} L 0 ${h} Z" fill="#b9c9d3"/>
    ${lines.join('')}
    <circle cx="${w / 2}" cy="${h / 2 - 20}" r="22" fill="#ff6a13" stroke="#141414" stroke-width="6"/>
    <rect x="${w / 2 - 260}" y="${h / 2 + 30}" width="520" height="92" fill="#141414"/>
    <text x="${w / 2}" y="${h / 2 + 70}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff">PLATSHÅLLARE: KARTBILD</text>
    <text x="${w / 2}" y="${h / 2 + 104}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#d6d3cc">Ersätt src/assets/placeholders/map.jpg</text>`;
}

function photoSvg(file, w, h, label, tone, kind) {
  const [a, b] = TONES[tone] ?? TONES.concrete;
  const big = Math.round(Math.min(w, h) / (kind === 'portrait' ? 11 : 13));
  const small = Math.round(big * 0.42);
  const badge = kind === 'before' ? 'FÖRE' : kind === 'after' ? 'EFTER' : '';
  const grid = [];
  for (let x = 0; x < w; x += 80) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#ffffff" stroke-opacity="0.04"/>`);
  for (let y = 0; y < h; y += 80) grid.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#ffffff" stroke-opacity="0.04"/>`);
  return `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${grid.join('')}
    ${hazard(w)}
    ${badge ? `<rect x="${w * 0.06}" y="${h * 0.12}" width="${big * 3.2}" height="${big * 1.5}" fill="#ff6a13"/><text x="${w * 0.06 + big * 1.6}" y="${h * 0.12 + big * 1.08}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${big}" font-weight="700" fill="#141414">${badge}</text>` : ''}
    <text x="${w / 2}" y="${h / 2 - small}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${small}" font-weight="700" letter-spacing="4" fill="#ff6a13">PLATSHÅLLARE</text>
    <text x="${w / 2}" y="${h / 2 + big * 0.5}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${big}" font-weight="700" fill="#ffffff">${esc(label)}</text>
    <text x="${w / 2}" y="${h / 2 + big * 0.5 + small * 2}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${small}" fill="#e6e4df">Byt ut: src/assets/placeholders/${esc(file)}</text>
    <text x="${w - 24}" y="${h - 24}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(16, small * 0.8)}" fill="#e6e4df">Foto: [Namn]</text>`;
}

function ogSvg(w, h) {
  return `<rect width="${w}" height="${h}" fill="#141414"/>${hazard(w)}
    <text x="80" y="300" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-size="96" font-weight="700" fill="#ffffff">[FÖRETAGSNAMN] AB</text>
    <text x="80" y="380" font-family="Arial, Helvetica, sans-serif" font-size="40" fill="#ff6a13">Rivning · Sanering · Håltagning · Bygg</text>
    <text x="80" y="440" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#d6d3cc">Malmö och Skåne</text>
    <text x="80" y="570" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#8a8780">PLATSHÅLLARE – byt ut src/assets/placeholders/og-default.jpg</text>`;
}

let made = 0;
for (const [file, w, h, label, tone, kind] of IMAGES) {
  const target = join(outDir, file);
  if (existsSync(target) && !force) continue;
  const inner = kind === 'map' ? mapSvg(w, h) : kind === 'og' ? ogSvg(w, h) : photoSvg(file, w, h, label, tone, kind);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 72, mozjpeg: true }).toFile(target);
  made++;
}
console.log(`Placeholders: ${made} created in ${outDir}${force ? ' (forced)' : ''}`);

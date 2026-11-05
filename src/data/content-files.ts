import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export type ContentFolder = 'projects' | 'news' | 'jobs';

/** True when src/content/<folder>/ holds at least one Markdown file. */
export function hasContentFiles(folder: ContentFolder): boolean {
  const dir = join(process.cwd(), 'src', 'content', folder);
  return existsSync(dir) && readdirSync(dir, { recursive: true }).some((f) => String(f).endsWith('.md'));
}

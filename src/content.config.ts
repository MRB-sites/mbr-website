import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { hasContentFiles, type ContentFolder } from './data/content-files';
import { z } from 'astro/zod';
import { PROJECT_CATEGORIES } from './data/services';

const localized = z.object({ sv: z.string(), en: z.string() });

/** glob() that stays silent while a folder is empty (in dev it always watches, so new files appear). */
const optionalGlob = (folder: ContentFolder): Loader => {
  const inner = glob({ pattern: '**/*.md', base: `./src/content/${folder}` });
  return {
    ...inner,
    name: 'optional-glob',
    load: async (ctx) => {
      if (!ctx.watcher && !hasContentFiles(folder)) return ctx.store.clear();
      return inner.load(ctx);
    },
  };
};

/**
 * Projects: one Markdown file per project, both languages in the frontmatter.
 * The file name becomes the URL slug: /projekt/<file-name>/ and /en/projects/<file-name>/
 */
const projects = defineCollection({
  loader: optionalGlob('projects'),
  schema: ({ image }) =>
    z.object({
      title: localized,
      summary: localized,
      description: localized,
      location: z.string(),
      year: z.number().int(),
      category: z.enum(PROJECT_CATEGORIES),
      client: z.string(),
      contractType: localized,
      scope: localized,
      recycledPercent: z.string().optional(),
      cover: image(),
      images: z.array(image()).default([]),
      beforeImage: image().optional(),
      afterImage: image().optional(),
      photographer: z.string().optional(),
      featured: z.boolean().default(false),
      /** Marks example/placeholder content with a visible badge. Remove when real. */
      example: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/** News: one file per language in news/sv/ and news/en/. Same file name pairs the translations. */
const news = defineCollection({
  loader: optionalGlob('news'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      image: image().optional(),
      imageAlt: z.string().default(''),
      example: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/** Job posts: one file per language in jobs/sv/ and jobs/en/. */
const jobs = defineCollection({
  loader: optionalGlob('jobs'),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    employment: z.string(),
    deadline: z.string().optional(),
    summary: z.string(),
    example: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, news, jobs };

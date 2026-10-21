import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  projects: defineCollection({
    loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
      title: z.string(),
      tagline: z.string(),
      category: z.enum(['hobby', 'commercial', 'open-source']),
      repoUrl: z.string().url().optional(),
      apkDownloadUrl: z.string().url().optional(),
      liveUrl: z.string().url().optional(),
      stack: z.array(z.string()),
      highlights: z.array(z.string()),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      publishedDate: z.string().optional(),
      screenshots: z
        .array(
          z.object({
            url: z.string(),
            caption: z.string().optional(),
          })
        )
        .optional(),
      logo: z.string().optional(),
    }),
  }),
};

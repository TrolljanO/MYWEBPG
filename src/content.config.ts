import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
const tags = z
  .array(
    z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use tags kebab-case ASCII'),
  )
  .max(12)
  .default([])
  .transform((t) => [...new Set(t)]);
const httpUrl = z.url().refine((u) => /^https?:\/\//.test(u), 'Use HTTP(S)');
const common = {
  title: z.string().min(3).max(120),
  tags,
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
};
const loader = (name: string) =>
  glob({
    pattern: '**/*.{md,mdx}',
    base: `./src/content/${name}`,
    generateId: ({ entry }) => {
      const id = entry.replace(/\.(md|mdx)$/, '');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
        throw new Error(
          `Nome inválido: ${entry}. Use kebab-case, sem subpastas.`,
        );
      return id;
    },
  });
const blog = defineCollection({
  loader: loader('blog'),
  schema: ({ image }) =>
    z
      .object({
        ...common,
        description: z.string().min(20).max(220),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        readingTime: z.number().int().positive().optional(),
        toc: z.boolean().default(true),
        cover: z
          .object({ src: image(), alt: z.string().trim().min(1) })
          .optional(),
        canonicalUrl: httpUrl.optional(),
        social: z
          .array(
            z.object({
              platform: z.enum([
                'linkedin',
                'x',
                'instagram',
                'mastodon',
                'other',
              ]),
              url: httpUrl,
              publishedAt: z.coerce.date().optional(),
            }),
          )
          .default([]),
      })
      .strict()
      .refine((d) => !d.updatedDate || d.updatedDate >= d.pubDate, {
        message: 'updatedDate deve ser igual ou posterior a pubDate',
      }),
});
const projects = defineCollection({
  loader: loader('projects'),
  schema: ({ image }) =>
    z
      .object({
        ...common,
        summary: z.string().min(20).max(220),
        description: z.string().min(20).max(220).optional(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        role: z.string().optional(),
        status: z
          .enum(['ideia', 'em progresso', 'concluído', 'arquivado'])
          .default('em progresso'),
        repository: httpUrl.optional(),
        liveUrl: httpUrl.optional(),
        cover: z
          .object({ src: image(), alt: z.string().trim().min(1) })
          .optional(),
        metrics: z
          .array(
            z.object({ label: z.string().min(1), value: z.string().min(1) }),
          )
          .default([]),
      })
      .strict()
      .refine((d) => !d.endDate || d.endDate >= d.startDate, {
        message: 'endDate deve ser igual ou posterior a startDate',
      }),
});
export const collections = { blog, projects };

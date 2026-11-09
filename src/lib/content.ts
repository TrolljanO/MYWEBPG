import { getCollection } from 'astro:content';
import { isPublished } from './editorial';
export async function posts() {
  return (await getCollection('blog', ({ data }) => isPublished(data))).sort(
    (a, b) =>
      b.data.pubDate.getTime() - a.data.pubDate.getTime() ||
      a.id.localeCompare(b.id),
  );
}
export async function projects() {
  return (
    await getCollection(
      'projects',
      ({ data }) => !data.draft && data.startDate <= new Date(),
    )
  ).sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.startDate.getTime() - a.data.startDate.getTime() ||
      a.id.localeCompare(b.id),
  );
}
export const allTags = (entries: { data: { tags: string[] } }[]) =>
  [...new Set(entries.flatMap((e) => e.data.tags))].sort();

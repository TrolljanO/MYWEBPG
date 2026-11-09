export type Publishable = { draft: boolean; pubDate: Date };
export function isPublished(data: Publishable, now = new Date()): boolean {
  return !data.draft && data.pubDate.getTime() <= now.getTime();
}
export function readingTime(text = ''): number {
  const words = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date);
export function related<T extends { id: string; data: { tags: string[] } }>(
  entry: T,
  entries: T[],
  limit = 3,
): T[] {
  return entries
    .filter((e) => e.id !== entry.id)
    .map((e) => ({
      e,
      score: e.data.tags.filter((t) => entry.data.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.e.id.localeCompare(b.e.id))
    .slice(0, limit)
    .map((x) => x.e);
}

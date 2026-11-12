import rss from '@astrojs/rss';
import { posts } from '../lib/content';
import { site } from '../config/site';
import { absolute } from '../lib/paths';
export async function GET() {
  return rss({
    title: `${site.name} · Blog`,
    description: site.description,
    site: absolute(),
    items: (await posts()).map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      categories: p.data.tags,
      link: absolute(`blog/${p.id}/`),
    })),
    customData: '<language>pt-br</language>',
  });
}

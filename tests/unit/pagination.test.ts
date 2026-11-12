import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generatePaginateFunction } from '../../node_modules/astro/dist/core/render/paginate.js';

const blogRoute = {
  params: ['...page'],
  segments: [
    [{ content: 'blog', dynamic: false, spread: false }],
    [{ content: '...page', dynamic: true, spread: true }],
  ],
} as Parameters<typeof generatePaginateFunction>[0];

const tagRoute = {
  params: ['tag', '...page'],
  segments: [
    [{ content: 'blog', dynamic: false, spread: false }],
    [{ content: 'tag', dynamic: false, spread: false }],
    [{ content: 'tag', dynamic: true, spread: false }],
    [{ content: '...page', dynamic: true, spread: true }],
  ],
} as Parameters<typeof generatePaginateFunction>[0];

describe('paginação do blog', () => {
  it('prev e next de dois artigos carregam o base path', () => {
    const articles = [
      {
        id: 'nota-a',
        data: { title: 'Nota A', tags: ['campo'], draft: false },
      },
      {
        id: 'nota-b',
        data: { title: 'Nota B', tags: ['campo'], draft: false },
      },
    ];
    // pageSize 1 só aqui: dois artigos viram duas páginas. No site o tamanho é 12.
    const blog = generatePaginateFunction(
      blogRoute,
      '/MYWEBPG',
      'always',
    )(articles, { pageSize: 1 });
    const tag = generatePaginateFunction(
      tagRoute,
      '/MYWEBPG',
      'always',
    )(articles, { pageSize: 1, params: { tag: 'campo' } });

    expect(blog[0].props.page.url.next).toBe('/MYWEBPG/blog/2/');
    expect(blog[1].props.page.url.prev).toBe('/MYWEBPG/blog/');
    expect(tag[0].props.page.url.next).toBe('/MYWEBPG/blog/tag/campo/2/');
    expect(tag[1].props.page.url.prev).toBe('/MYWEBPG/blog/tag/campo/');

    const archive = readFileSync('src/components/blog/Archive.astro', 'utf8');
    const index = readFileSync('src/pages/blog/[...page].astro', 'utf8');
    const tagged = readFileSync(
      'src/pages/blog/tag/[tag]/[...page].astro',
      'utf8',
    );
    expect(archive).toContain('href={previous}');
    expect(archive).toContain('href={next}');
    expect(index).toContain('previous={page.url.prev}');
    expect(index).toContain('next={page.url.next}');
    expect(tagged).toContain('previous={page.url.prev}');
    expect(tagged).toContain('next={page.url.next}');

    for (const name of readdirSync('src/content/blog')) {
      expect(readFileSync(`src/content/blog/${name}`, 'utf8')).toMatch(
        /^draft:\s*true$/m,
      );
    }
  });
});

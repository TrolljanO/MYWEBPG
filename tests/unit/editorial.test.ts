import { describe, it, expect } from 'vitest';
import { isPublished, related, readingTime } from '../../src/lib/editorial';
import { withBase } from '../../src/lib/paths';
describe('regras editoriais', () => {
  const now = new Date('2026-11-09T12:00:00Z');
  it('exclui rascunhos e datas futuras; inclui o instante da publicação', () => {
    expect(
      isPublished({ draft: true, pubDate: new Date('2020-01-01') }, now),
    ).toBe(false);
    expect(
      isPublished({ draft: false, pubDate: new Date('2026-11-10') }, now),
    ).toBe(false);
    expect(isPublished({ draft: false, pubDate: now }, now)).toBe(true);
  });
  it('prioriza interseção de tags, excluindo o próprio artigo e resultados sem afinidade', () => {
    const source = { id: 'a', data: { tags: ['astro', 'mdx'] } };
    const b = { id: 'b', data: { tags: ['astro'] } };
    const c = { id: 'c', data: { tags: ['astro', 'mdx'] } };
    const d = { id: 'd', data: { tags: ['python'] } };
    expect(related(source, [source, b, d, c]).map((p) => p.id)).toEqual([
      'c',
      'b',
    ]);
  });
  it('tempo mínimo de um minuto e estimativa de 220 palavras por minuto', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime('palavra '.repeat(441))).toBe(3);
  });
  it('suporta domínio próprio e Pages sem duplicar barras', () => {
    expect(withBase('/blog/', '/MYWEBPG/')).toBe('/MYWEBPG/blog/');
    expect(withBase('blog/', '/')).toBe('/blog/');
  });
});

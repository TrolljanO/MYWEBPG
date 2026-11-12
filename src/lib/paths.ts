export function withBase(path = '', base = import.meta.env.BASE_URL): string {
  const root = '/' + base.split('/').filter(Boolean).join('/');
  return (root === '/' ? '' : root) + '/' + path.replace(/^\/+/, '');
}
export const absolute = (path = '') =>
  new URL(withBase(path), import.meta.env.SITE).href;
export const tagPath = (tag: string, collection = 'blog') =>
  withBase(`${collection}/tag/${encodeURIComponent(tag)}/`);

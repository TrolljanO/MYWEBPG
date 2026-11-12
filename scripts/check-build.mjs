import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root = resolve('dist');
const base = (process.env.BASE_PATH || '/MYWEBPG').replace(/\/$/, '');
function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(root);
let broken = 0;
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(
    /(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g,
  )) {
    const url = match[1];
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    if (base && base !== '/' && !url.startsWith(base + '/')) {
      console.error('Link sem base:', file, url);
      broken++;
      continue;
    }
    let target = join(
      root,
      decodeURIComponent(url.slice(base === '/' ? 0 : base.length)),
    );
    if (existsSync(target) && statSync(target).isDirectory())
      target = join(target, 'index.html');
    if (!existsSync(target)) {
      console.error('Link quebrado:', file, url);
      broken++;
    }
  }
}
if (broken) process.exit(1);
console.log(
  `${files.filter((f) => f.endsWith('.html')).length} páginas: links e assets locais válidos.`,
);

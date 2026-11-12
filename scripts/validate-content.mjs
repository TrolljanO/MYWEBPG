import { readdirSync } from 'node:fs';
for (const collection of ['blog', 'projects']) {
  const ids = new Set();
  for (const file of readdirSync(`src/content/${collection}`)) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const id = file.replace(/\.(md|mdx)$/, '');
    if (ids.has(id) || /^\d+$/.test(id) || ['tag', 'index'].includes(id))
      throw new Error(`Slug duplicado ou reservado: ${file}`);
    ids.add(id);
  }
}

import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const [collection, slug, ...titleParts] = process.argv.slice(2);
if (
  !['blog', 'projects'].includes(collection) ||
  !slug ||
  !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
  /^\d+$/.test(slug) ||
  ['tag', 'index'].includes(slug)
) {
  console.error(
    'Uso: npm run new:post -- meu-artigo "Título" (slug kebab-case, não numérico nem reservado)',
  );
  process.exit(1);
}
const target = resolve('src/content', collection, `${slug}.md`);
if (existsSync(target) || existsSync(target.replace(/\.md$/, '.mdx'))) {
  console.error('Já existe conteúdo com esse slug.');
  process.exit(1);
}
const title = titleParts.join(' ') || slug;
const date = new Date().toISOString().slice(0, 10);
const fields =
  collection === 'blog'
    ? `description: "Escreva aqui um resumo com pelo menos vinte caracteres."\npubDate: ${date}\nsocial: []\ntoc: true`
    : `summary: "Descreva aqui o projeto com pelo menos vinte caracteres."\nstartDate: ${date}\nstatus: "em progresso"\nrole: "Seu papel"\nmetrics: []`;
writeFileSync(
  target,
  `---\ntitle: ${JSON.stringify(title)}\n${fields}\ntags: []\ndraft: true\nfeatured: false\n---\n\n## Contexto\n\nEscreva seu conteúdo aqui.\n`,
  { flag: 'wx' },
);
console.log(`Rascunho criado: ${target}`);

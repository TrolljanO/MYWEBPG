// Build real fixtures, exercise generated routes, and always remove test content.
import { writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const files = [];
function fixture(path, text) {
  if (existsSync(path)) throw new Error(`Fixture collision: ${path}`);
  files.push(path);
  writeFileSync(path, text);
}
const run = () => execFileSync('npm', ['run', 'build'], { stdio: 'pipe' });
const html = (p) => readFileSync(`dist/${p}`, 'utf8');
try {
  for (let i = 0; i < 13; i++)
    fixture(
      `src/content/blog/qa-post-${String.fromCharCode(97 + i)}.md`,
      `---\ntitle: "Teste editorial ${i}"\ndescription: "Descrição de teste para validar o fluxo editorial."\npubDate: 2020-01-${String(i + 1).padStart(2, '0')}\ntags: [teste]\ndraft: false\n---\n\n## Seção um\n\nTexto.\n\n## Seção dois\n\nTexto.\n\n## Seção três\n\nTexto.\n\n\`\`\`ts\nconst value = 1;\n\`\`\`\n`,
    );
  fixture(
    'src/content/blog/qa-future.md',
    '---\ntitle: "Futuro invisível"\ndescription: "Artigo futuro que não deve vazar para produção."\npubDate: 2999-01-01\ndraft: false\ntags: [futuro]\n---\nAinda não.\n',
  );
  fixture(
    'src/content/blog/qa-mdx.mdx',
    readFileSync('src/content/blog/exemplo-de-artigo.mdx', 'utf8').replace(
      'draft: true',
      'draft: false',
    ),
  );
  fixture(
    'src/content/projects/qa-project.md',
    readFileSync('src/content/projects/exemplo-de-projeto.md', 'utf8').replace(
      'draft: true',
      'draft: false',
    ),
  );
  run();
  assert.ok(existsSync('dist/blog/2/index.html'));
  assert.ok(existsSync('dist/blog/tag/teste/2/index.html'));
  assert.ok(existsSync('dist/projects/tag/typescript/index.html'));
  assert.ok(html('blog/qa-mdx/index.html').includes('Modelo editorial'));
  assert.ok(html('blog/qa-post-a/index.html').includes('Neste artigo'));
  assert.ok(html('blog/qa-post-a/index.html').includes('BlogPosting'));
  assert.ok(!existsSync('dist/blog/qa-future/index.html'));
  assert.ok(!existsSync('dist/blog/exemplo-de-artigo/index.html'));
  for (const file of ['rss.xml', 'sitemap-0.xml', 'blog/index.html']) {
    assert.ok(!html(file).includes('qa-future'));
    assert.ok(!html(file).includes('exemplo-de-artigo'));
  }
  assert.ok(!html('projects/qa-project/index.html').includes('>Repositório'));
  execFileSync('node', ['scripts/check-build.mjs'], { stdio: 'inherit' });
  // Fail a build for missing alt and malformed frontmatter, not just the helper.
  fixture(
    'src/content/blog/qa-invalid.md',
    '---\ntitle: "Imagem inválida"\ndescription: "Uma imagem precisa de descrição acessível no build."\npubDate: 2020-01-01\n---\n![](/missing.png)\n',
  );
  assert.throws(run, 'Imagem sem alt deve falhar no build');
  writeFileSync(
    'src/content/blog/qa-invalid.md',
    '---\ntitle: x\ndescription: curta\npubDate: nope\n---\nTeste\n',
  );
  assert.throws(run, 'Frontmatter inválido deve falhar no build');
  console.log(
    'Conteúdo: paginação, tags, MDX, SEO, RSS, rascunhos, datas e validação passaram.',
  );
} finally {
  for (const file of files) rmSync(file, { force: true });
  run();
}

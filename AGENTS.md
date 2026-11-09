# Guia do projeto

- Este é um boilerplate. O proprietário refará o conteúdo e a direção artística.
- Não publique rascunhos, não invente experiência ou resultados e preserve `legacy/`.
- Leia README e docs/ARCHITECTURE.md antes de mudanças estruturais.
- Conteúdo deve continuar em Markdown/MDX, com schemas estritos.
- Não importe Three.js ou GSAP no layout base ou nas páginas de leitura.
- Use helpers de URL para manter suporte a GitHub Pages e domínio próprio.
- Para mudanças de código: npm run validate; para UI: npm run test:e2e após build.
- Para alterações no pipeline editorial: npm run test:content (não em paralelo com builds).
- Mantenha npm lockfile e execute npm run format:check.
- A skill de design solicitada está em .agents/skills/awwwards/SKILL.md; seu escopo deve respeitar o pedido de esqueleto, sem finalizar conteúdo ou publicar automaticamente.

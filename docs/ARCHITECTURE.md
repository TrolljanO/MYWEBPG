# Arquitetura

```text
Markdown / MDX → Content Collections + Zod → filtros editoriais → rotas estáticas
                                         ↘ RSS / sitemap / tags / relacionados
Tokens CSS → layouts e componentes → HTML legível sem JavaScript
Home → import lazy → Three.js + GSAP/ScrollTrigger → fallback SVG
```

- `src/content.config.ts`: contratos estritos e geração de IDs.
- `src/lib/content.ts`: fonte única dos filtros de publicação e ordenação.
- `src/lib/editorial.ts`: funções puras testadas de elegibilidade, leitura e relacionados.
- `src/lib/paths.ts`: base path e URLs absolutas; não espalhe `/MYWEBPG` em componentes.
- `src/pages`: home, about, resume, privacy, projects, blog, tags, paginação, 404, RSS e robots. Sitemap é integração oficial.
- `src/layouts/BaseLayout.astro`: documento, SEO e shell; não importa bibliotecas de animação.
- `src/components`: UI, listagens, ferramentas de leitura e extensões MDX.
- `legacy/`: cópia histórica não publicada pelo Astro.

## Progressive enhancement

Não há ClientRouter: páginas fazem navegação nativa, sem lifecycle global de SPA. Theme toggle e botões JS ficam ocultos até estarem prontos. Menu mobile usa details/summary e funciona sem JS; Escape fecha com foco devolvido. A leitura e as tags são links HTML. O progresso de leitura é CSS, sem loop JS no blog.

A cena de exemplo é uma integração substituível, não um design final. Import dinâmico ocorre após visibilidade e idle; GSAP é o único relógio da cena. Geometria pequena, um canvas, DPR máximo 1.5, botão de pausa, observadores de tamanho/interseção/tema, baixa bateria quando API disponível, reduced motion e Save-Data. Recursos GPU e eventos têm cleanup. Falha de WebGL conserva SVG estático. Scroll é nativo; não há Lenis, pinning ou scroll-jacking.

## Limites e segurança

Conteúdo é confiável e versionado. Não há entrada de usuário em runtime, autenticação, API, formulário ou segredo. Zod restringe URLs a HTTP(S), JSON-LD escapa `<` e scripts não concatenam HTML externo. Revisar dependências via lockfile/auditoria e PRs. Headers de cache e segurança são controlados pelo GitHub Pages; um `_headers` não teria efeito nessa hospedagem.

Analytics Plausible é opt-in e desligado por padrão. Para ativar, configure `PUBLIC_ANALYTICS_SRC` e `PUBLIC_ANALYTICS_DOMAIN` no build e revise o provedor. Nada é carregado sem consentimento salvo; DNT/GPC têm precedência. Retirar consentimento recarrega a página e impede novo carregamento. Não há garantia sobre coleta de um script de terceiros depois de alterado pelo provedor.

## Extensão artística

Troque tokens, composição e cena independentemente dos schemas/filtros. Preserve links semânticos, texto no HTML, foco visível, contraste e modo reduzido. Depois de adicionar imagens, shaders ou fontes, repita Playwright/axe e Lighthouse. As metas do PRD dependem do conteúdo e design final; o boilerplate não promete medições de um projeto ainda não preenchido.

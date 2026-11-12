# MYWEBPG · boilerplate de portfólio e blog

Esqueleto estático para Guilherme Trajano. Conteúdo e direção artística serão refeitos pelo proprietário. Os exemplos são **rascunhos** e não entram no site público. O site anterior está preservado em `legacy/`, fora do build.

## Começar

Node `>=22.23.4` (`engines.node`). O CI e o deploy usam Node 24. npm e Git.

```sh
npm ci
npm run dev
```

Abra `http://localhost:4321/MYWEBPG/`. Não é necessário banco, API, conta de CMS nem segredo.

```sh
npm run new:post -- minha-primeira-nota "Minha primeira nota"
npm run new:project -- meu-projeto "Meu projeto"
```

Edite o arquivo criado em `src/content/`, preencha os campos e altere `draft: false`. `pubDate` controla a elegibilidade no próximo build. Projetos usam `startDate`. Um arquivo `.md` ou `.mdx` basta; rotas, tags, listagens, RSS e sitemap são derivados automaticamente.

## Onde editar

| Objetivo                                | Arquivo / diretório                             |
| --------------------------------------- | ----------------------------------------------- |
| Nome, descrição, redes, e-mail opcional | `src/config/site.ts`                            |
| Home e composição das seções            | `src/pages/index.astro`                         |
| Sobre e currículo                       | `src/content/pages/`                            |
| Artigos                                 | `src/content/blog/`                             |
| Estudos de caso                         | `src/content/projects/`                         |
| Paleta, espaçamento, tipografia, motion | `src/styles/tokens.css`                         |
| Layout responsivo e componentes         | `src/styles/global.css`, `src/components/`      |
| Estilo da leitura                       | `src/styles/typography.css`                     |
| Cena da home e do blog                  | `src/components/motion/PlateStage.astro`        |
| SEO global e imagem social              | `src/layouts/BaseLayout.astro`, `public/og.png` |
| Schemas editoriais                      | `src/content.config.ts`                         |

O e-mail está vazio intencionalmente. Sobre e currículo têm apenas seções para preencher. Os links sociais existentes foram mantidos na configuração e podem ser removidos. A imagem Open Graph é uma captura provisória da home; substitua ao definir sua identidade.

## Stack

Astro 7, TypeScript strict, Content Collections + Zod 4, Markdown/MDX, Tailwind CSS 4 via Vite. Astro entrega HTML estático. Manrope e Cormorant Garamond são locais. A Manrope do corpo é um WOFF2 variável, subset Latin, pesos 400 a 700. A licença da Manrope está em `src/assets/fonts/manrope-OFL.txt`. A licença da Cormorant está em `src/assets/fonts/cormorantgaramond-OFL.txt`. ESLint, Prettier, Astro Check, Vitest, Playwright e axe cobrem qualidade.

Não há React, SPA, CMS externo, banco ou backend. GSAP não entra no layout base nem nas páginas de leitura. Navegação e leitura funcionam sem JavaScript. As pranchas são `PlateStage` em CSS. O blog tem tema próprio e um campo de papel: o canvas fica só nessa superfície, e a textura CSS entra quando o movimento está reduzido. Com `prefers-reduced-motion` ou Save-Data o diorama fica pausado e o botão de pausa não aparece. Com movimento permitido, o botão pausa a animação.

O primeiro carregamento medido em 11 de novembro de 2026 está em `docs/VALIDATION.md`. A soma de `transferSize`, com o cache desligado, foi 1591495 bytes na home em 1440×900, 806827 no blog em 1440×900, 586043 na home em 390×844 e 806827 no blog em 390×844. A Manrope transferida pesa 21792 bytes.

## Comandos de qualidade

```sh
npm run build          # gera o site estático em dist/
npm run validate       # gate: lint, tipos, unidade, build e links internos
npm run format:check
npx playwright install chromium
npm run test:e2e       # preview do build, teclado, a11y, temas, mobile, sem JS
npm run test:content   # fixtures temporárias: publicação, MDX, paginação e falhas esperadas
```

`npm run validate` é o gate. O workflow Pages roda esse gate antes de publicar `dist/`.

`test:content` escreve fixtures com prefixo `qa-`, testa builds reais e as remove em `finally`; não execute em paralelo com outro build. Ao terminar, restaura o build sem fixtures. `npm run format` formata os arquivos atuais. Os arquivos históricos e a skill vendorizada não são reformatados.

## Deploy no GitHub Pages

Configuração padrão: `https://trolljano.github.io/MYWEBPG/`.

1. No GitHub, em **Settings → Pages → Source**, selecione **GitHub Actions**.
2. Revise e faça merge do branch para `main` quando quiser substituir o site atual.
3. O workflow Pages valida o projeto e publica `dist/` somente após sucesso.

O Pages deste repositório já está configurado para GitHub Actions. Pushes no branch de trabalho validam o projeto; integrar em `main` dispara a publicação. PRs recebem build/testes e artefato `static-preview`; GitHub Pages não oferece URLs independentes de preview por PR neste boilerplate.

Para domínio próprio, configure as variáveis de repositório `SITE_URL=https://seu-dominio` e `BASE_PATH=/`. Configure o domínio no Pages e adicione `public/CNAME` quando apropriado. Localmente, use variáveis de shell: `SITE_URL=https://seu-dominio BASE_PATH=/ npm run build`. `.env.example` é referência; a configuração Astro lê `process.env`, portanto arquivos `.env` não substituem automaticamente `SITE_URL/BASE_PATH` no config.

O workflow tem rebuild horário para datas futuras; o GitHub pode atrasar/agendar com menor frequência e desativa agendas após inatividade prolongada em repositórios públicos. A publicação acontece no primeiro build bem-sucedido após a data, não em um relógio de precisão. Datas sem horário são interpretadas em UTC; use ISO com offset (`2026-11-09T09:00:00-03:00`) para horário de São Paulo.

## Documentação

- `docs/CONTENT.md`: frontmatter, imagens, MDX, redes sociais e publicação.
- `docs/BOT-PUBLISHING.md`: publicação de Markdown por um bot externo, como o Grokbot.
- `docs/ARCHITECTURE.md`: rotas, responsabilidades, segurança e extensão visual.
- `docs/VALIDATION.md`: evidências e limites da validação.
- `DESIGN.md`: direção provisória e decisões para facilitar redesign.
- `docs/PRD.md`: documento original de referência; a solicitação posterior de entregar só o esqueleto prevalece sobre conteúdo/design final.

## Skill awwwards

Skill solicitada baixada de [juliobsz/skills](https://github.com/juliobsz/skills/tree/add880bd6ec9f5592a1482846fc0dd282c9161bc/awwwards), commit `add880bd6ec9f5592a1482846fc0dd282c9161bc`, para `.agents/skills/awwwards/`, com sua licença. Foi aplicada à separação de tokens, acessibilidade e motion. A camada artística é deliberadamente provisória: não representa um design final nem uma pontuação/avaliação oficial Awwwards.

Licenças de dependências e fontes permanecem próprias. Não foi imposta nova licença ao conteúdo/código original do proprietário.

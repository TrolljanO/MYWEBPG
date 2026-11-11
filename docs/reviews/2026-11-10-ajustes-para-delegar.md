# Ajustes para delegar — 2026-11-10

Ordem de serviço para agentes executores. Base: `HEAD` `b951c09`, branch `feat/astro-content-boilerplate`. Nenhum pacote abaixo foi implementado.

Fontes: a revisão do orquestrador sobre as ondas W0–W7, os três relatórios independentes `2026-11-10-r2-*.md` desta pasta, e a palavra do dono em 2026-11-10 (cenas em hero de largura total; blog com tema, tokens e papel em shader).

Os pacotes estão em inglês ASD-STE100 (regras de escrita; o dicionário da norma não foi conferido). Cada pacote se lê sozinho.

## Como delegar

| Pacote | Assunto                                    | Agente                                   | Depende de | Arquivos em comum                             |
| ------ | ------------------------------------------ | ---------------------------------------- | ---------- | --------------------------------------------- |
| P1     | Hero de largura total                      | Forte, com capturas                      | —          | `global.css`, `diorama.css`, `PlateStage`     |
| P2     | Tema escuro de verdade                     | Custo-benefício                          | P1         | `global.css`, `tokens.css`                    |
| P3     | Blog: tema, tokens e leitura estilo Medium | Custo-benefício                          | P2         | `tokens.css`, `typography.css`, `BaseLayout`  |
| P4     | Blog: papel em shader, amassa e desamassa  | Forte, com capturas                      | P3         | componente novo, `BaseLayout`                 |
| P5     | Correções pequenas (nove itens)            | Custo-benefício                          | —          | vários; ver cada item                         |
| P6     | Fontes e peso                              | Custo-benefício                          | P1         | `global.css`, `BaseLayout`, `PlateStage`      |
| P7     | Testes e documentos                        | Custo-benefício                          | P1 a P6    | `tests/e2e/site.spec.ts`, `DESIGN.md`, outros |
| P8     | Medir de novo                              | Três agentes independentes, um por skill | P7         | só `docs/reviews/`                            |

- P1, P2, P3 e P4 mexem nos mesmos arquivos de estilo. Rode em sequência, um agente por vez.
- P5 pode rodar em paralelo com P1 só se o agente de P5 não tocar em `global.css`. O mais simples é rodar P5 depois de P2.
- Não use worktree de subagente sem conferir a branch de origem: o worktree nasce da branch padrão, não desta.

## Rules for every package

1. Read `AGENTS.md` and `DESIGN.md` before you change a file.
2. Do not import Three.js, GSAP, Lenis or an icon library.
3. Do not invent clients, metrics, testimonials, biography text or an e-mail address.
4. Do not publish a draft. Do not change `draft: true` in a content file that you did not create.
5. Use the URL helpers in `src/lib/paths.ts` for each internal link.
6. Use Node 24: `export PATH=/home/tj/.nvm/versions/node/v24.15.0/bin:$PATH`.
7. Run these commands in sequence after each package: `npm run format:check`, `npm run test:content`, `npm run validate`, `npm run test:e2e`.
8. Do not run `npm run test:content` at the same time as a build.
9. Measure only a production preview. Run `ss -ltnp | grep 432` and read `/proc/<pid>/cmdline`. Port 4321 can be a dev server.
10. Make one commit for each package. Do not push.
11. Write in the commit message what you did not do a test for.

## Decisions for the owner

These decisions stop work. The first option is the recommendation.

| ID  | Decision                         | Options                                                                                                                          | Stops     |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| O1  | Meaning of the three scenes      | Keep it private as art direction. Or show one line in the caption or on the `Sobre` page. The owner writes the text.             | none      |
| O2  | Second paper layer below a sheet | Keep the layer and accept the 6.5 limit of design-taste. Or make each sheet flat.                                                | P5 item 9 |
| O3  | Koi artwork                      | Make new artwork with five fish. Three small fish: one like the father, one like the mother, one a mix. This is not a code task. | none      |
| O4  | Inner pages and the inspector    | Record `few-pictures` and `still-page` on reading pages as exceptions. Or put an existing diorama in each page header.           | P7        |
| O5  | Paper motion on article pages    | Show the paper motion on the archive and on article pages. Or on the archive only.                                               | P4        |

## P1 — Full-width hero

**Why:** The owner wants each scene as a full-width background. At 390 px the `Cumeeira` stage is 168 px wide and the pause button covers it. All three reviewers gave this the highest severity.

**Cause:** `src/styles/global.css:604-645` (`.scene-split`, two columns) and `:794-830` (`height: calc(100svh - 5.5rem)` at 800 px or less).

**Files:** `src/components/motion/PlateStage.astro`, `src/styles/diorama.css`, `src/styles/global.css`, `src/pages/index.astro`, `src/components/blog/Archive.astro`.

**Steps:**

1. Remove the class `scene-split` from `index.astro` and `Archive.astro`. Remove its rules from `global.css`.
2. Add a property `variant?: 'full'` to `PlateStage`. Put the class `diorama--full` on the `figure` when the property is set.
3. Remove `aspect-ratio` from the inline style of the stage. The rule in `diorama.css` sets it from `--ar-w` and `--ar-h`.
4. For `.diorama--full .diorama-stage`, set `width: 100%`, `aspect-ratio: auto` and `height: var(--stage-h)`.
5. Set `--stage-h` to `min(100vw, calc(100svh - 5.5rem))` when the viewport ratio is 3/2 or more and the width is 1000 px or more.
6. Set `--stage-h` to `min(100vw, 62svh)` for all other viewports.
7. For the first plane (the sky), set `object-fit: cover`. For the other planes, set `object-fit: contain`.
8. On wide viewports, set `object-position: right center` on the contained planes. On other viewports, set `center`.
9. On wide viewports, keep `.hero-sheet` on the left with `position: absolute`. Set its width to `min(34rem, calc(100vw - var(--stage-h) - 3rem))`.
10. On other viewports, put `.hero-sheet` below the stage with `position: relative` and full width.
11. Add a property `sizes` to `PlateStage`. For the full variant, use `min(100vw, calc(100svh - 5.5rem))`. For the koi stage, use `100vw`.
12. Change `widths` to `[480, 828, 1248, 2400]`.
13. Add `white-space: nowrap` to `.diorama-stage .motion-toggle` (`src/styles/diorama.css:49`).
14. Move the pause button after the `figcaption` in the DOM. Keep its visual position with CSS.

**Acceptance:**

- At 390×844, 768×1024 and 1440×900, `.diorama-stage` is as wide as the viewport on `/` and on `/blog/`.
- In each screenshot, the full dragon and the full tree are visible. The sheet does not cover them.
- At 390 px, the pause button covers less than 15 percent of the stage.
- The Tab key moves focus to `Conheça meu trabalho` before `Pausar movimento`.
- At 1440×900 with density 1, the hero planes load the 828w files. The koi planes load the 1248w or 2400w files.
- The eager image bytes are 483 KB or less on the home and 1 198 KB or less on the blog.
- `scrollWidth` is not more than `innerWidth` from 320 px to 2560 px.

**Do not:** crop the dragon, the pagoda or the tree. Do not change the artwork files.

## P2 — Real dark theme

**Why:** In the dark theme, only the header is dark on the home. On the blog, the caption `Sakura` has a contrast of 1.02:1. The axe test did not find it because it runs in the default theme only.

**Cause:** Light hex values are fixed in `.opening` (`global.css:583`), `.koi-chapter` (`:658`), `.paper-band` (`:671`) and `.footer` (`:388`). `.plate-frame` (`:595`) sets a light background and does not set `--text`.

**Files:** `src/styles/global.css`, `src/styles/tokens.css`, `src/styles/diorama.css`.

**Steps:**

1. Remove the fixed colour blocks from `.opening`, `.koi-chapter`, `.paper-band` and `.footer`. Use `var(--bg)` and `var(--text)`.
2. Keep the light paper only on `.diorama-stage` and on `.paper-sheet`. This is the owner decision D9.
3. Put the light token block in one place: the rule `.paper-sheet`. Remove each copy.
4. Replace the hex values in `diorama.css` with tokens.
5. Make sure that the `figcaption` uses the page tokens, not the stage tokens.
6. Make the `theme-color` meta obey the theme button (`src/layouts/BaseLayout.astro:57-62`). Update it in the inline theme script.

**Acceptance:**

- With `localStorage.theme = 'dark'`, each section background outside a stage or a sheet is `#24211d` or darker, on `/` and on `/blog/`.
- Each text element has a contrast of 4.5:1 or more in the two themes. Measure the two captions on `/blog/`.
- The light theme screenshots do not change, except for the header colour.

## P3 — Blog theme, tokens and reading style

**Why:** The owner wants the blog to work like a Medium article: a colour that is easy on the eyes and a font that is easy to read. No article page has had a review, because no post is live.

**Files:** `src/styles/tokens.css`, `src/styles/typography.css`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/pages/blog/[...page].astro`, `src/pages/blog/[slug].astro`, `src/pages/blog/tag/[tag]/[...page].astro`.

**Steps:**

1. Add a property `surface?: 'blog'` to `BaseLayout`. Write it as `data-surface` on `body`.
2. Set `surface="blog"` on the three blog pages.
3. In `tokens.css`, add a block `[data-surface='blog']` for the light theme and one for the dark theme.
4. Use these start values. Change them only if a measurement fails.

   | Token           | Light     | Dark      |
   | --------------- | --------- | --------- |
   | `--bg`          | `#f2ecdf` | `#1d1b18` |
   | `--text`        | `#211d19` | `#e9e2d6` |
   | `--muted`       | `#5a5248` | `#b3a898` |
   | `--sheet`       | `#f8f4ea` | `#24211d` |
   | `--sheet-under` | `#e3dbcc` | `#141311` |
   | `--accent`      | `#7a2f2c` | `#e7b2a4` |

5. Add the reading tokens: `--measure: 42rem`, `--step-read: clamp(1.125rem, 1rem + 0.5vw, 1.3125rem)`, `--leading-read: 1.7`, `--step-article-title: clamp(2.2rem, 5vw, 3.4rem)`.
6. In blog scope, set `.reading` to `max-width: calc(var(--measure) + 6rem)`. Set `.prose` to `--step-read` and `--leading-read`.
7. In blog scope, set `.reading h1` to `--step-article-title`. The display size of 99 px is too large for an article title.
8. Keep the body text in `--text`. Use `--muted` only for the date, the reading time and captions.
9. Make links in `.prose` show an underline in the accent colour.
10. Make sure that the footer uses the blog tokens in blog scope.
11. To see an article, copy `src/content/blog/exemplo-de-artigo.mdx` to `src/content/blog/qa-leitura.mdx` with `draft: false`. Delete the copy before the commit.

**Acceptance:**

- On an article page, the text column is 60 to 75 characters wide at 1440 px.
- The body text is 18 px or more at 390 px and 20 px or more at 1440 px.
- The body text has a contrast of 7:1 or more in the two themes.
- `git status` shows no `qa-leitura.mdx` after the work.
- The home page and the project pages do not change.

## P4 — Paper shader on the blog

**Why:** The owner wants a paper texture on the blog background, with the motion of paper that crumples and then goes flat.

**Files:** new `src/components/motion/PaperField.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`.

**Steps:**

1. Make the CSS texture the default. On `body[data-surface='blog']`, set `background-color: var(--bg)` and a small SVG noise image as `background-image`.
2. Add `PaperField.astro`. It contains one `canvas` with `position: fixed`, `inset: 0`, `z-index: -1` and `aria-hidden="true"`.
3. Use raw WebGL with one fragment shader. Do not add a dependency.
4. In the shader, draw paper fibres with value noise. Draw the folds with two scales of Voronoi cells.
5. Give each cell a random tilt. Calculate the light on each cell from that tilt. Draw a thin line on each cell edge.
6. Multiply the tilt and the edge line by a uniform `u_crumple`. The value 1 is crumpled paper. The value 0.1 is flat paper.
7. Read the paper colour from `--bg` with `getComputedStyle`. Send it to the shader as a uniform.
8. On page load, change `u_crumple` from 1 to 0.1 in 1.4 seconds. Then draw one frame and stop the animation loop.
9. On a theme change, change `u_crumple` from 0.1 to 1 in 0.45 seconds. Read the new colour. Then go back to 0.1.
10. Draw one frame again after each resize.
11. Do not start the canvas when `prefers-reduced-motion` is set, when `saveData` is set, or when WebGL is not available.
12. Write `data-paper="webgl"` or `data-paper="css"` on `body`. This shows which path is in use.
13. Limit the canvas to a density of 1.5 and a width of 1600 px. Use `highp` precision.
14. Do not delay a link click for the motion. Do not crumple the paper when the visitor goes to a different page.
15. Keep the text in the DOM. Do not draw text in the canvas. Keep `.reading` on an opaque sheet.

**Acceptance:**

- The page shows the title and the text before the canvas starts.
- Two seconds after page load, no animation frame runs. Make sure of this with a counter in a test.
- In the flat state, read the canvas pixels below the title in the two themes. The darkest and the lightest pixel give a contrast of 4.5:1 or more with the text colour.
- With reduced motion, `data-paper` is `css` and no `canvas` draws.
- A screenshot at 0.2 seconds shows folds. A screenshot at 2 seconds shows flat paper with a light texture.
- The capture script makes sure that `data-paper` is `webgl` before it saves the screenshots.

**Do not:** move, bend or blur the text. Do not run the animation loop without an end.

## P5 — Small corrections

One agent, one commit. Each item has its file and its test.

1. **Placeholder role.** `src/content/projects/sdd-buddy.md:5` and `micro-rag.md:5` contain `role: Autor`. Remove the line. Test: `/projects/sdd-buddy/` does not show `Autor`.
2. **Small targets.** `RSS` (`global.css:723`) and `Início` (`global.css:434`) are 34 px wide. Add `min-width: 44px`. Test: each `a` and `button` is 44×44 px or more at 390 px.
3. **Footer title.** `global.css:423` has `line-height: 0.95`. Set `1.05`. Test: the accent of `está` does not touch the letter `q` above it at 200 percent zoom.
4. **Labels in capital letters.** `src/pages/404.astro:13` and `src/pages/projects/index.astro:15`. Write the labels in sentence case, or remove them. Test: the design-taste `lint.mjs` shows no `eyebrow`.
5. **Archive heading.** `src/components/blog/Archive.astro:84` has a fixed `h2` that repeats the hero sentence. Show `Artigos` when posts exist. Show no `h2` when the list is empty.
6. **LinkedIn search.** `src/components/layout/Footer.astro:6` finds LinkedIn by a URL that is typed two times. Find it by `label === 'LinkedIn'`.
7. **Node version.** `.nvmrc` contains `22`. CI uses 24. Set `24`.
8. **One pause control.** The pause button stops one scene only. Make one click stop all scenes on the page. Test: after one click, `document.getAnimations().length` is 0.
9. **Notebook section.** `global.css:699` gives the notebook `width: fit-content`. The right half is empty. Make the sheet as wide as the column, or remove the section. Apply decision O2 to the layer below the sheets.

## P6 — Fonts and weight

1. Make `manrope.woff2` with a Latin subset and weights 400 to 700. Update `global.css:8-13`. Remove the TTF.
2. Add a `preload` link for Manrope in `BaseLayout.astro`. The body text uses it.
3. Record the first-load bytes of `/` and `/blog/` in `docs/VALIDATION.md`, at 1440×900 and at 390×844.

**Acceptance:** `ls dist/_astro/*.ttf` shows no file. The Manrope file is smaller than 50 KB. The page has no font that changes shape after load at 1440 px.

## P7 — Tests and documents

1. Run axe on the nine routes in the two themes. Today the test uses the default theme only.
2. Add a test for `/blog/` with reduced motion: no animation runs and `data-paper` is `css`.
3. Add a test for the stage width at 390 px on `/` and on `/blog/`.
4. Update `DESIGN.md`: the blog has a theme and paper motion. Remove the text that says the blog stays static.
5. Update `DESIGN.md:52` (the layout line for the blog) and the section `Exceções ao inspetor`. Apply decision O4.
6. Update `README.md` and `docs/VALIDATION.md` with the new numbers.
7. Commit the three `r2` reports and this file.

## P8 — Measure again

1. Start one production preview. Make sure of the port and the process.
2. Run three independent reviewers, one for each skill: `build-awwwards-quality-sites`, `ui-ux-pro-max`, `design-taste-frontend`.
3. Do not give a reviewer the earlier reports or the notes of the agent that made the changes.
4. Open the eight routes in the two themes at 1440, 768 and 390.
5. Record one score table with these numbers next to the new ones.

| Skill               | 2026-11-09                                     | 2026-11-10, round 2              |
| ------------------- | ---------------------------------------------- | -------------------------------- |
| awwwards            | design 5, usability 6, creativity 6, content 7 | 7 / 7 / 8 / 5                    |
| design-taste, home  | 6.0                                            | 6.5 light, 6.0 dark              |
| design-taste, blog  | 5.3                                            | 6.15 light, 5.8 dark             |
| design-taste, inner | no measurement                                 | 5.75 to 6.0                      |
| ui-ux-pro-max       | no score                                       | 2 high, 2 medium, 3 low findings |

## O que este documento não cobre

- A arte nova da koi (decisão O3). É geração de imagem e recorte em camadas, não tarefa de código.
- Lighthouse, navegadores além do Chromium e leitor de tela. Nenhuma rodada mediu.
- A colisão do acento no rodapé foi vista em capturas reduzidas, não em recorte ampliado. O item 3 do P5 pede o teste a 200%.
- Os valores de cor do P3 são ponto de partida calculado, não medido em tela.

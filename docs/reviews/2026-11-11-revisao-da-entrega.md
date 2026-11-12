# Revisão da entrega P1–P8 — 2026-11-11

Revisão do orquestrador sobre os oito commits `78c119a`…`c1f5c50` (branch `feat/astro-content-boilerplate`). Só leitura: nada em `src/`, `tests/` ou nos documentos existentes foi alterado por esta revisão.

Medição: build de produção de `c1f5c50`, Chromium do Playwright, temas claro e escuro, em 390×844, 768×1024, 1440×900, 1920×1080 e 2560×1440. A página de artigo foi medida numa cópia fora do repositório, com um artigo de teste, porque o site não tem artigo publicado.

## Veredito

| Pedido                          | Situação                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Gate em `c1f5c50`               | Passa: `format:check`, `test:content`, `validate`, 22 testes e2e contra o preview de produção.                  |
| Tema escuro (R2, R3)            | Resolvido. Home inteira escura; legenda do blog escuro a 14:1 (era 1,02:1). Axe roda nos 2 temas.               |
| Prancha no celular (R1)         | Resolvido no tamanho: 390×390 (era 168 px). Ficaram dois defeitos de ordem; ver Q3.                             |
| Leitura estilo Medium           | Boa. Corpo 21 px, entrelinha 1,7, coluna de 672 px, contraste 15,2:1 claro e 12,5:1 escuro.                     |
| Hero de largura total, sakura   | Resolvido. A cena ocupa a largura e a arte se funde ao fundo.                                                   |
| Hero de largura total, cumeeira | **Não resolvido de 768 px para cima.** Quadrado com borda dura. Ver Q1.                                         |
| Hero de largura total, koi      | Ocupa a largura, mas a folha de trás sai do registro: uma barra azul de borda reta em 768, 1440 e 2560. Ver Q1. |
| Papel do blog                   | Resolvido no navegador real: o papel vai até o pé da janela nos dois temas. A faixa preta é só das capturas.    |
| Fontes                          | Resolvido. Manrope WOFF2 de 21 KB com preload; os acentos e a pontuação do site estão na fonte.                 |
| Nove correções pequenas         | Conferidas pelos testes novos (`corrections.spec.ts`); não revi cada uma no olho.                               |

## O que a medição de 11-11 diz de verdade

As notas ficaram paradas ou caíram. Os números de `2026-11-11-medicao.md` conferem com os três relatórios, mas a tabela não diz por quê:

- **design-taste, home 6,5.** A conta dá 7,1. O teto vem de ilustração no lugar de fotografia e dos rótulos acima do título.
- **design-taste, blog 6,0.** A conta dá 6,5. Um FAIL do inspector segura a nota: em 390 px a legenda «Sakura» fica entre a imagem e o título (Q3).
- **awwwards 7 / 7 / 7 / 6.** Criatividade caiu de 8 para 7; conteúdo subiu de 5 para 6. O revisor anotou que abaixo de 1440 px os botões saem da primeira tela (Q3).
- **ui-ux-pro-max.** Zero altos. Os dois médios são linha de prosa com 77 a 84 caracteres nas páginas internas e o salto de `h1` para `h3` em `/projects/`.
- As notas das páginas internas e do tema escuro vêm de capturas. O inspector rodou só no claro, na home e no blog.
- A independência dos três revisores é afirmação do documento. Não há como conferir daqui.

Nenhum dos três revisores viu Q1. O revisor awwwards viu a faixa de Q2 em 768 e 390, nos dois temas, e a deixou fora da nota por não ter conferido fora do headless (`2026-11-11-awwwards.md`, linhas 18 a 22, 70 e 76). A faixa também está nas capturas do revisor de gosto (`.taste-skill/states/blog-light-768x1024/fold.jpg`). O resumo `2026-11-11-medicao.md` não fala dela. Conferida depois no Comet (Chromium, Windows, com GPU), a faixa não existe: é defeito da captura sem GPU.

## Decisões que o executor tomou no lugar do dono

Estão declaradas nos commits. As três seguiram a opção recomendada.

| ID  | O que ficou                                                         | Commit    |
| --- | ------------------------------------------------------------------- | --------- |
| O2  | A segunda folha sob as folhas permanece (teto 6,5 no design-taste). | `12bf5ed` |
| O4  | `few-pictures` e `still-page` viram exceção nas páginas de leitura. | `2a7814d` |
| O5  | O papel entra no arquivo e nos artigos.                             | `5fe1cd3` |

O1 (sentido das cenas) e O3 (koi com cinco peixes) continuam abertas. A koi segue com dois peixes.

## Erro meu no pacote P1

O P1 mandava «céu em `cover`, demais folhas em `contain`» para todas as cenas. O executor fez o que estava escrito. A regra só serve à sakura, que tem um céu opaco e liso. Na cumeeira a arte é quadrada e três folhas vão até a borda do quadro. Na koi a primeira folha não é céu, é a onda de trás, e `cover` a amplia mais que as outras. Eu tinha avisado que o passo não fora visto na tela; o defeito Q1 nasce dessa especificação, não da execução.

---

Os pacotes abaixo estão em inglês ASD-STE100 (regras de escrita; o dicionário da norma não foi conferido). Cada um se lê sozinho. As «Rules for every package» de `2026-11-10-ajustes-para-delegar.md` continuam valendo.

| Pacote | Assunto                             | Agente              | Depende de |
| ------ | ----------------------------------- | ------------------- | ---------- |
| Q1     | One fit for all layers of a scene   | Forte, com capturas | —          |
| Q2     | Blog root background                | Custo-benefício     | —          |
| Q3     | Narrow screens: order and first CTA | Custo-benefício     | Q1         |
| Q4     | Small items                         | Custo-benefício     | Q2         |

## Q1 — One fit for all layers of a scene

**Defects.**

- **Cumeeira.** At 768 px and wider, the artwork is a square with a hard vertical edge. The stage is 1440×812 at 1440×900, but the artwork is an 812 px square at the right. At 768×1024 the square is 635 px, with a band on each side. Behind the sheet, the first layer shows an enlarged, pixelated part of the dragon.
- **Koi.** The first layer is larger than the other layers. A dark blue bar with a straight edge shows at the left of the wave. It is clear at 768×1024 and 2560×1440, and visible at 1440×900.

**Cause.**

- `src/styles/diorama.css:71-78` sets `contain` on each layer and `cover` on the first layer. The layers of one scene then have different scales.
- The cumeeira layers are 2400×2400. Layers `02-nuvens-atras`, `03-serras` and `06-nuvens-frente` are opaque at the left edge. `01-ceu` is not a full sky.
- The first koi layer is `01-onda-tras`, a part of the wave. It is not a background.
- The sakura sky is fully opaque and soft. Only this scene is correct with the current rule.

**Preview made for this review.** `cover` on all cumeeira layers with `object-position: 50% 12%` was injected in the browser. It was not written to the repository.

| Size      | Result                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| 768×1024  | Good. Dragon, pagoda and mountain are visible. No side band.                      |
| 1440×900  | The stage is full, but the hero sheet hides the face of the dragon.               |
| 1920×1080 | Good. The dragon and the pagoda are visible. The base of the mountain is cut.     |
| 2560×1440 | Good. Same result as 1920. The 2400 px file is 1.07 times enlarged at this width. |

**Steps.**

1. Add one prop to `src/components/motion/PlateStage.astro`: `fit: 'backdrop' | 'cover' | 'contain'`. Add one prop `focus?: string` for `object-position`.
2. `backdrop` is the current rule. Use it only for the sakura.
3. `cover` sets `object-fit: cover` and the same `object-position` on all layers. Use it for the cumeeira with `focus="50% 12%"`.
4. `contain` sets `object-fit: contain` and the same `object-position` on all layers. Use it for the koi.
5. For the cumeeira, set `sizes="100vw"`.
6. Between 1000 px and 1700 px of width, move or narrow the hero sheet of the home. The face of the dragon must stay visible. One option is to put the sheet at the right.
7. Record the new weight of the first load at 1440 px in `docs/VALIDATION.md`.

**Acceptance.**

- In each stage, all layers have the same computed `object-fit` and `object-position`, except the first sakura layer.
- At 768×1024, 1440×900, 1920×1080 and 2560×1440, no straight edge of a layer is visible in the cumeeira or in the koi.
- The face of the dragon and the pagoda are visible in the first screen at the four sizes.
- At device pixel ratio 1 and widths up to 1920 px, the selected file is not narrower than the rendered layer.
- The sakura screenshots do not change.
- Save one screenshot for each size and theme in `.taste-skill/`. Look at each one before the commit.

**Do not.** Do not make new artwork. Do not add a library.

**Decision for the owner (O6).** The cumeeira is square. A full-width stage on a wide screen cuts the base of the mountain. New wide artwork (3:2 or 16:9) keeps the full motif. It is an art task, as O3. The recommendation is: do Q1 now, and order the wide cumeeira together with the five-fish koi.

## Q2 — Blog root background

**Result of the check in a real browser (2026-11-11).** The black band is not a defect of the site. In Comet (Chromium, Windows, GPU), at a window of 1936×1072, the paper goes to the bottom of the window in the two themes. The bottom rows have the paper colour and its texture: about `rgb(28,26,23)` in dark and `rgb(241,235,222)` in light.

**What the band is.** A capture defect of Chromium without a GPU. It shows in the Playwright headless shell and in headless Chromium on WSL, at 1440×900, 768×1024 and 390×844. The awwwards reviewer and the design-taste captures show it for the same reason. It goes away when `.header` is not `position: sticky`. The drawing buffer is correct in all cases.

**Defect that stays.** The root colour is wrong on the blog. `html:has(body[data-surface='blog'])` at `src/styles/global.css:52` reads `--bg` from `:root`, not the blog value. The root colour shows during overscroll and before the canvas paints.

**Steps.**

1. Make the root background of the blog equal to the blog `--bg` in the two themes.
2. Keep the one-shot loop, the reduced-motion path and the Save-Data path as they are.
3. Do not add a screenshot test for the band. The e2e browser has no GPU and shows the capture defect.

**Acceptance.**

- On `/blog/`, the computed background colour of `html` is `#f2ecdf` in light and `#1d1b18` in dark.
- `paper.spec.ts` continues to pass.

**Do not.** Do not change the sticky header. Do not change the canvas height. Do not import a library.

**Note for the next review.** Ignore a black band at the bottom of blog captures made without a GPU. Examine the bottom of the window in a real browser.

## Q3 — Narrow screens: order and first CTA

**Defects.**

- At 390×844, the caption «Cumeeira» / «Sakura» and its note are between the image and the `h1`. The design-taste inspector fails this as `eyebrow` on the blog and holds the score at 6.0.
- At 390×844 the button «Conheça meu trabalho» ends at y=877. The window ends at 844.
- At 768×1024 the same button ends at y=1113. The window ends at 1024. The `h1` starts at y=809.

**Cause.** `src/styles/global.css:647-650` puts the full `figure` (stage and caption) before the sheet. `src/styles/diorama.css:62-65` gives the stage `min(100vw, 62svh)`.

**Steps.**

1. On narrow screens, show the caption after the sheet, not between the image and the title.
2. Decrease the stage height on narrow screens until the first button is in the first screen. Start with `46svh`.
3. Do this after Q1. The cumeeira then uses `cover` and can lose height without side bands.
4. Keep the DOM order: sheet, stage, caption, pause button.

**Acceptance.**

- At 390×844 and 768×1024, the bottom of «Conheça meu trabalho» is above the bottom of the window.
- No text is between the image and the `h1` at 390×844 and 768×1024.
- `inspect.mjs` of design-taste shows no `eyebrow` FAIL on `/blog/` at 390 px.
- The test «o palco ocupa a largura da página em 390» continues to pass.

## Q4 — Small items

1. **Theme colour on the blog.** `src/layouts/BaseLayout.astro:69,74,111-112` uses the home colours `#f6f3ec` and `#171614`. On the blog use `#f2ecdf` and `#1d1b18`.
2. **Heading order.** `/projects/` goes from `h1` to `h3` (`src/components/projects/ProjectCard.astro:14`). Add a level 2 heading or let the card take the heading level as a prop. The home uses the same card below an `h2`.
3. **Line length on inner pages.** `.reading` has `max-width: 72ch`. The reviewer measured 77 to 84 characters for each line. Use the blog measure (`42rem` at the body size) or `65ch`.
4. **Pause button with reduced motion.** The awwwards reviewer reports that the button stays visible with reduced motion. `PlateStage.astro:73-74` hides it. Open the page with reduced motion and record which one is correct.
5. **Arrow glyph.** `→` (U+2192) is not in the Manrope subset. The site does not use it today. Record this in `README.md` near the font line.

## Atualização: hero da cumeeira refeito (2026-11-11)

O dono pediu o hero do dragão refeito, com quatro caixas de luz de papel recortado como referência. Foi feito nesta sessão, sem commit:

- A cumeeira é agora uma caixa de luz (`variant="lightbox"` em `PlateStage`). As seis folhas ficam num quadro só, sem ampliar. As folhas da frente escondem cerca do quarto de baixo da cena. Cinco folhas recortadas por máscara CSS ocupam a largura do palco.
- No tema escuro a luz vem de trás e o nome fica direto sobre a folha da frente. No claro é papel branco com sombra.
- Em tela estreita o palco tem 46svh, a legenda desceu para depois da folha e o primeiro botão está na primeira tela em 390 e 768.
- Em janela baixa (1366×650) a folha do nome cabe no palco. Antes ela entrava por baixo do cabeçalho.
- A partir de 1000 px de largura o nome fica ao lado do vão, em qualquer proporção de janela.

Efeito nos pacotes: do **Q1** sobra só a koi. Do **Q3** sobra só o blog (a sakura). A decisão **O6** fica menos urgente para a cumeeira: a arte quadrada já não aparece como quadrado solto. Ela continua sendo do dono.

## Atualização: dez anotações do dono sobre a home (2026-11-11)

O dono anotou dez pontos na home e todos foram aplicados nesta sessão, sem commit: relevo macio nos cartões, no caderno, na folha do método e nos botões; lâmpada no lugar do botão de tema; legendas das duas cenas da home removidas; emendas entre seções amaciadas; escala menor na barra, na tipografia e nos botões. A koi passou a usar o mesmo ajuste em todas as folhas.

Efeito nos pacotes: o **Q1** está feito (cumeeira e koi). Do **Q3** sobra a legenda da sakura no blog. O item 3 do **Q4** (largura de linha nas páginas internas) deve ser medido de novo, porque o corpo passou de 18 para 16 px.

## O que esta revisão não verificou

- Chrome, Firefox, Safari, leitor de tela e Lighthouse. O único navegador real aberto foi o Comet (Chromium) no Windows, em uma largura, na home e em `/blog/`.
- O estado vazio real de `/blog/` nas capturas: a cópia de medição tinha um artigo. Os testes e2e cobrem o estado vazio.
- As nove correções do P5, uma a uma, no olho. Só o resultado dos testes.
- A fluidez do papel em máquina real. No Chromium sem GPU a animação fez de 12 a 86 quadros em 1,4 s, conforme o tamanho da janela.
- A causa da faixa nas capturas sem GPU. No navegador real ela não aparece; em artigo e em tela estreita não foi conferida fora do headless.
- No Q1, a prévia com `cover` foi injetada no navegador para a cumeeira. A folha movida (passo 6) e a koi com `contain` em todas as folhas não foram vistas na tela.

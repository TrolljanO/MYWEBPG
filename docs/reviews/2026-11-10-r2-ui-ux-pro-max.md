# Reavaliação R2 com a skill ui-ux-pro-max

## 1. Cabeçalho

- Data: 2026-11-10
- Skill: ui-ux-pro-max (ordem de prioridade: acessibilidade, toque e interação, performance, estilo, layout e responsivo, tipografia e cor, animação). A skill não tem nota de 1 a 10. Cada achado leva severidade e id de regra.
- Git HEAD: b951c09 (branch feat/astro-content-boilerplate)
- Servidor: build de produção em http://127.0.0.1:4322/MYWEBPG/ (porta 4321 não foi aberta).
- Ferramenta: Playwright (Chromium 1254) com scripts em `.taste-skill/r2-uiux/` (`measure.mjs`, `scroll.mjs`, `m2.mjs`) e a busca da skill (`search.py`) sem `--persist`.
- Aberto e medido (DOM, rede, CLS, LCP, contraste, alvos de toque, estouro horizontal):
  - Home e blog: 2 temas x 3 viewports (1440x900, 768x1024, 390x844).
  - about, projects, projects/sdd-buddy, resume, privacy e nao-existe: 2 temas x 1440 e 390.
  - Movimento reduzido: home e blog, 1440.
  - Foco por teclado: home, 9 Tabs.
  - Menu móvel: projects, 390.
- Vistos como imagem por mim: home claro 1440 (tela inteira), home escuro 390 (tela inteira), home claro 390 (primeira tela), blog escuro 1440 e about escuro 390. As outras capturas foram só medidas por script, não olhadas.

## 2. O que a página é

Portfólio e blog de uma pessoa, em pt-BR, em papel quente creme com tipografia serifada grande (Cormorant) e interface em Manrope. A abertura é um diorama de papel recortado (pagode com dragão na home, cerejeira no blog, onda com koi no meio da home), com o nome numa folha de texto ao lado. O resto é calmo: dois projetos "em progresso", um caderno ainda sem textos e um rodapé claro. Passa a impressão de um site de autor com identidade visual própria, ainda esqueleto de conteúdo.

## 3. Achados, por severidade

### Alta

**A1. Home, 390x844 (claro e escuro): a ilustração de abertura encolhe para 168x168 px e o botão "Pausar movimento" a cobre.**

- Medido: palco em [111, 596, 168, 168]; botão em [111, 608, 156, 74], ou seja 93% da largura e 44% da altura do palco. O texto do botão quebra em duas linhas. A folha de texto ocupa a primeira tela inteira. Em 1440 o palco tem 728 px e em 768 tem 383 px.
- Regras: `content-priority`, `visual-hierarchy`, `compact-label-overflow` (layout e responsivo, prioridade 5).
- Evidência: `v-home-light-m.png`, `s-home-dark-m.png`.
- Causa: `src/styles/global.css:804-830`. `.scene-split` fixa `height: calc(100svh - 5.5rem)` e o palco usa `calc((100cqh - 4.75rem) * ratio)`. Sobra pouca altura depois da folha. `.motion-toggle` fica absoluto no canto (`src/styles/diorama.css`, bloco `.diorama-stage .motion-toggle`) sem `white-space: nowrap` nem tamanho mínimo do palco.
- A koi (390x260) em 390 fica bem; o problema é só o palco da abertura.

**A2. Blog, tema escuro, todos os viewports: a legenda da ilustração fica quase invisível.**

- Medido: "Sakura" cor `rgb(243,238,230)` sobre `#f3ecdf`, razão 1,02:1. "Oito folhas no mesmo quadro. Ilustração com IA." com `--muted` escuro-tema `rgb(193,182,168)` sobre o mesmo papel, razão 1,7:1. O mínimo é 4,5:1. A divulgação "Ilustração com IA" some.
- Regras: `color-contrast`, `contrast-readability`, `color-accessible-pairs` (acessibilidade, prioridade 1, crítica).
- Evidência: `s-blog-dark-d.png` (legenda embaixo à direita do palco), `measure.json` (entrada `blog_-dark-*`, campo `low`).
- Causa: `.plate-frame` (`src/styles/global.css:595-600`) pinta o fundo `#f3ecdf` mas não redefine `--text` e `--muted`. Na home o `.opening` (linhas 583-594) e o `.koi-chapter` redefinem esses tokens, por isso a home passa. O blog usa `.plate-frame` sem `.opening`. No tema claro o mesmo trecho passa (28,25,22 sobre papel).

### Média

**M1. Manrope em TTF de 164.700 bytes, sem preload, eixo variável completo (200 a 800).**

- Medido em todas as rotas: `manrope.DIRNzeTG.ttf` é a maior fonte, 8,6 vezes a Cormorant WOFF2 (19.512 bytes, essa sim com preload). O corpo e a interface usam Manrope, então há troca de fonte visível (FOUT com `font-display: swap`).
- Regras: `font-loading`, `font-preload` (performance, prioridade 3).
- Evidência: `measure.json` (`reqs`), `src/styles/global.css:8-13`, `src/layouts/BaseLayout.astro` (só a Cormorant tem `rel="preload"`).
- CLS medido ficou baixo (máx 0,024), então o custo é peso e flash, não salto de layout.

**M2. Imagens do palco pedem tamanho maior que o exibido e carregam todas como `eager` no blog.**

- Medido: o `sizes` das planes é `min(100vw, calc((100svh - 5.5rem) * 1.5))`. Em 1440x900 isso dá cerca de 1218 px e o navegador baixa a variante 1248w, mas o palco mede 728 px. Em 390 o palco mede 168 px e o navegador baixa a mesma variante de 1248w (home 390: 757.506 bytes de rede). A razão 1,5 só vale para a koi, não para os palcos quadrados (ar 1/1).
- Peso: blog 1,45 MB em 1440 (972 KB em 768 e 390), com oito planes `loading="eager"`; `07-flores` 333 KB e `08-petalas` 398 KB. As demais rotas pesam cerca de 220 KB. Home 1,08 MB em 1440.
- Regras: `image-optimization`, `lazy-loading`, `lazy-load-below-fold` (performance, prioridade 3), e a regra do stack Astro "Use picture for responsive images".
- Evidência: `measure.json`, `scroll.mjs` (totais iguais antes e depois do scroll: tudo já chega no carregamento), `dist/index.html` (atributos `sizes`, `srcset`).
- Parte do que foi pedido é bom: `width` e `height` presentes, `srcset` de 828/1248/2400, CLS de 0 a 0,024.

### Baixa

**B1. Alvos de toque de 34x44 px em links soltos.** "RSS" no blog e "Início" em projects/sdd-buddy medem 34 de largura. Passa o mínimo WCAG 2.2 de 24 px (`web-target-size`), falha por pouco o 44 da regra `touch-target-size` (prioridade 2). Não vi outros alvos abaixo de 44 em nenhuma rota. Evidência: `measure.json`, campo `tg`.

**B2. Movimento: 11 camadas animadas em loop na home, o botão pausa só uma cena.**

- Medido: 11 animações rodando na home. Depois de clicar "Pausar movimento" no palco da abertura, ficaram 5 rodando (as da koi). O estado não vai para `localStorage` (a chave `motion` voltou nula) e a pausa não persiste entre páginas.
- Regra: `excessive-motion`, `motion-consistency` (animação, prioridade 7). O deslocamento é curto (até 3 a 4 px por camada de profundidade, `diorama.css`), então o risco é pequeno.
- Positivo: `prefers-reduced-motion: reduce` zera as animações (0 rodando, home e blog) e o botão existe com `aria-pressed`.

**B3. Faixas claras no tema escuro.** Abertura, capítulo da koi e rodapé ficam no papel claro nos dois temas (a abertura e o rodapé são faixas de 800+ px). É decisão registrada em DESIGN.md, então não conto como falha, mas a regra `dark-mode-pairing` (estilo, prioridade 4) pede que o escuro seja um tema próprio. Registro como observação.

### Passou, medido

- Sem rolagem horizontal em nenhuma das 36 combinações (`scrollWidth` igual a `innerWidth`).
- CLS: máx 0,024 (blog, 768); a maioria abaixo de 0,01. LCP local de 40 a 132 ms (servidor local, sem rede real).
- Foco: contorno sólido de 3 px na cor de acento, nos 9 itens que percorri; link "Pular para o conteúdo" é o primeiro. O contorno vem de `:focus-visible` (`global.css:85-88`).
- Cada rota tem um h1, landmarks `header`, `nav` (duas, com `aria-label`), `main`, `footer`.
- Imagens do palco com `alt=""` mais parágrafo `sr-only` que descreve a cena (`alt-text` aplicado como decoração com descrição).
- Fonte mínima 14 px, corpo 18 px, `line-height` 1,65.
- Contraste: nenhuma outra linha de texto abaixo de 4,5:1 (ou 3:1 para texto grande) fora de A2, pelo cálculo no DOM (limite descrito em "Não verificado").
- A página 404 mostra `404` no console só porque o servidor devolve 404 de verdade.

## 4. Pontuação

A skill não define nota de 1 a 10, por isso não invento uma. O resultado segue a ordem de prioridade.

| Prioridade | Categoria                  | Resultado                                                                                                                                   | Segura o resultado |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1          | Acessibilidade (crítica)   | Falha só no blog escuro (A2). Claro e demais rotas passam.                                                                                  | A2 (alta)          |
| 2          | Toque e interação          | Passa, com B1 abaixo de 44 px em 2 links                                                                                                    | B1 (baixa)         |
| 3          | Performance                | Passa com ressalvas: fonte pesada e imagens sobredimensionadas                                                                              | M1, M2 (média)     |
| 4          | Estilo                     | Passa. Coerente com o brief do dono.                                                                                                        | B3 (observação)    |
| 5          | Layout e responsivo        | Falha em 390 na home (A1). Sem estouro horizontal.                                                                                          | A1 (alta)          |
| 6          | Tipografia e cor           | Passa, exceto A2                                                                                                                            | A2                 |
| 7          | Animação                   | Passa. Reduced-motion e pausa existem.                                                                                                      | B2 (baixa)         |
| 8 a 10     | Formulários, nav, gráficos | Sem formulário, sem gráfico. Navegação testada: menu móvel com alvos de 46 px; header fixo de 88 px (cobertura do foco por ele não testada) | não se aplica      |

Tema claro e escuro diferem num ponto: o escuro leva A2 e o claro não. A1 vale para os dois temas.

Contagem: 2 altas, 2 médias, 3 baixas. As duas altas caem nas categorias 1 e 5. Sem nota numérica.

Design system sugerido pela skill (`--design-system` para "portfolio blog personal designer developer editorial"): padrão "Scroll-Triggered Storytelling", estilo Brutalism, Archivo + Space Grotesk, acento #2563EB. Não serve a este produto: o dono escolheu papel recortado, Cormorant e Manrope, tinta e vinho sobre creme. Não apliquei. Do padrão, a parte "cada capítulo legível no estado final em movimento reduzido" o site já cumpre.

## 5. Conflitos entre a skill e as regras do dono

| Item da skill                                                   | Regra do dono (AGENTS.md, DESIGN.md)                                         | Quem vence                                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Domínio `gsap` e presets GSAP, `--motion` do design system      | GSAP fora do layout base e das páginas de leitura; GSAP é exceção registrada | Dono. Não recomendo GSAP.                                            |
| Pattern "Scroll-Triggered Storytelling" com parallax e progress | Sem smooth scroll; ver DESIGN.md                                             | Dono. Barra de progresso existe só nos artigos.                      |
| "SVG icons (Heroicons/Lucide)", "no emoji icons"                | Iconify é exceção registrada, sem biblioteca de ícones                       | Dono. O site usa um SVG próprio (`Arrow.astro`) e passa na intenção. |
| Estilo Brutalism, Archivo/Space Grotesk, #2563EB                | Paleta creme, Cormorant + Manrope, diorama                                   | Dono. Sugestão descartada.                                           |
| Prova social, clientes, métricas (landing patterns)             | Não inventar experiência, clientes, métricas nem depoimentos                 | Dono. Não recomendo nenhum.                                          |
| "Animar 1 a 2 elementos por vista" (`excessive-motion`)         | Diorama em seis a oito camadas com deriva                                    | Falha parcial, registrada em B2. Não peço remover o diorama.         |
| Dark mode como tema próprio (`dark-mode-pairing`)               | Faixas claras nos dois temas por decisão do dono                             | Dono (B3, só observação).                                            |

## 6. Recommendations

1. Make the home hero plate larger on narrow screens.
   - File: `src/styles/global.css` (blocks `.scene-split` and `.scene-split .diorama-stage`, lines 804-830).
   - Remove the fixed height `calc(100svh - 5.5rem)` or set a minimum stage width of `min(100%, 20rem)`.
   - Add `white-space: nowrap` to `.motion-toggle` in `src/styles/diorama.css`.
   - Test: open `/MYWEBPG/` at 390x844. The stage is at least 300 px wide. The "Pausar movimento" button covers less than 20% of the stage.

2. Fix the caption colour on the blog plate in dark theme.
   - File: `src/styles/global.css`, rule `.plate-frame` (line 595).
   - Set `color: #1c1916` and `--text`, `--muted` and `--bg` to the values used by `.opening`.
   - Test: set `localStorage.theme` to `dark`. Open `/MYWEBPG/blog/`. The caption "Oito folhas no mesmo quadro. Ilustração com IA." has a contrast ratio of at least 4.5:1.

3. Correct the `sizes` attribute of the plate images.
   - File: `src/components/motion/PlateStage.astro`.
   - Use the real aspect ratio of each plate in the `sizes` expression. Square plates use ratio 1, not 1.5.
   - Test: open `/MYWEBPG/` at 1440x900 in a production build. The hero images download the 828w file. The total image bytes fall below 500 KB.

4. Convert Manrope to WOFF2 and preload it.
   - Files: `src/assets/fonts/manrope.ttf`, `src/styles/global.css` (lines 8-13), `src/layouts/BaseLayout.astro`.
   - Create `manrope.woff2` limited to the Latin range and weights 400 to 700. Add a `rel="preload"` link.
   - Test: run `ls -l dist/_astro/*.woff2`. The Manrope file is below 50 KB. The network panel shows no TTF request.

5. Load the blog plate layers lazily.
   - File: `src/components/blog/Archive.astro` and `src/components/motion/PlateStage.astro`.
   - Keep `loading="eager"` for the sky layer. Use `loading="lazy"` and `fetchpriority="low"` for the other layers when the plate is not the first image.
   - Test: open `/MYWEBPG/blog/` at 390x844. The first load transfers less than 600 KB. The plate looks the same after the layers load.

## 7. O que não foi verificado

- Lighthouse e Web Vitals em rede real ou com limitação de banda: o LCP medido (40 a 132 ms) é de servidor local e não vale como dado de campo.
- Leitor de tela real, zoom 200% do navegador e teclado em todas as rotas: o foco foi percorrido só na home (9 Tabs), no desktop.
- O menu móvel foi aberto e fotografado (`mobilenav-projects.png`) e os alvos foram medidos (46 px de altura), mas não olhei a imagem.
- Estados de hover, estado de foco no tema escuro e a interação com o ponteiro que desloca as camadas (DESIGN.md: "o ponteiro só ajusta o deslocamento"): não exercitei.
- O contraste foi calculado percorrendo o DOM até o primeiro fundo opaco. Os cartões (`.project-card`, `.reading`, `.post-card` e similares) pintam o fundo em pseudo-elementos `::after`, que esse cálculo não vê; uso o fundo da página. Onde o texto fica sobre cartão, o resultado pode estar errado. O cartão claro escuro-tema (#3c3832) e o texto claro passam nas capturas que olhei, mas isso não substitui medida por pixel.
- As capturas de projects, resume, privacy e nao-existe foram só medidas (estouro, alvos, contraste, CLS), não vistas. 768 px só foi testado em home e blog.
- A primeira captura de tela inteira da home (`home-light-d.png`) mostrou o bloco da koi em branco; a segunda, `s-home-light-d.png`, mostra a koi. As requisições já tinham terminado nas duas. Não descobri a causa e não afirmo que o usuário veja a koi vazia. Não acompanhei se a koi aparece sem rolagem em dispositivo real.
- `DESIGN.md` e AGENTS.md foram lidos. Não abri docs/reviews, docs/superpowers, legacy nem git log.

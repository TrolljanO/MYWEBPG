# Relatório consolidado da revisão do site (2026-10-28)

Fontes: tabela de achados do plano (`docs/superpowers/plans/2026-10-28-revisao-site-completo.md`) e seis `achados-*.md` desta pasta. IDs originais mantidos. Severidade: P0 função quebrada/texto ilegível · P1 defeito visível · P2 performance/higiene · P3 polimento.

**Total: 37 achados — P0 7 · P1 12 · P2 11 · P3 7.** Contagem após deduplicar (overflow de 7 px = 1) e contando COMP-3 (resolvido por remoção) como P1.

## Regras de consolidação aplicadas

- **Overflow de 7 px em zoom 200%** (COMP-5 = MOT-2 = A11Y-N2 = BUILD-1): um achado, dono `.contact-copy`, onda composição.
- **Causa raiz `--paper: #fff`** (`index.css:14`): origem de COMP-1 e B8. No tema escuro, o PNG `beige-background` da gravura mostra os furos do ripple em preto (parte do B3). Tudo resolvido pela decisão 3 (papel liso da paleta, nunca `#FFFFFF`) e pela paleta das Global Constraints.
- **PERF-1 substitui a estimativa de bytes do C1**: 18 `<img>` = 2.845.172 B (2,71 MiB), carga fria da home 3.304.208 B (não ≈2,3 MB).
- **PERF-2 corrige o C2**: os dois beges não são duplicados (SHA-256 distintos), mas `koi/beige-background.png` continua sem uso.
- **COMP-3**: resolvido por remoção (decisão 1 remove o botão Desdobrar gravura).
- **CONT-5**: aguarda usuário.

## Achados

### P0

| ID | Achado | Evidência | Onda |
|---|---|---|---|
| A1 | Botão "Desdobrar gravura" morto: JS procura `.art-layer`, o template só tem `.cut`. | `index.js:32`, `templates/home.html:8` | Task 4 (remoção, decisão 1) |
| A2 | Links e frase do rodapé sobre raízes/musgo: contraste 1,9 a 3,2:1 no claro, 1,5 a 2,3:1 no escuro. | `footer-1440.png`, `footer-375.png`, `index.css:1388-1391` | Task 4 |
| A3 | Mobile: título/lede da gravura sobre a espiral (p05 2,1:1) e nuvem atrás do link "Currículo" (1,2:1 no escuro). | `gravura-375.png`, `hero-375.png`; `gravura-390-escuro.jpg` | Task 4 |
| A4 | `scroll-behavior:smooth` disputa âncoras com Lenis; falta o CSS `.lenis`. | `index.css:57`, `index.js:88-92` | Task 4 |
| A11Y-N1 | Sem JS, tema, filtros e movimento seguem como botões focáveis que não fazem nada. | `a11y-no-js.jpg`; `templates/header.html:4`, `templates/home.html:13`, `templates/footer.html:1`; listeners `index.js:13-25,79` | Task 4 |
| COMP-1 | Escuro: título e lede da gravura em tinta clara sobre PNG bege que não troca de tema (mediana 1,06:1; título coberto em 67 a 99% da caixa). Causa raiz `--paper:#fff`. | `gravura-1440-escuro.jpg`, `gravura-390-escuro.jpg`; `index.css:14`, `index.css:35-38`, `index.css:1372` | Task 5 (decisão 3; contraste ≥ 4,5:1 é gate) |
| COMP-2 | Nota do hero (14 px, `--muted`) sobre `.mtn-back`: 1,56:1 no escuro; no claro mediana 5,0:1 mas p05 1,4 a 1,9. | `hero-1440-claro.jpg`, `hero-1440-escuro.jpg`; `index.css:1310-1315`, `index.css:1365` | Task 5 |

### P1

| ID | Achado | Evidência | Onda |
|---|---|---|---|
| B1 | Hero desktop: `.cloud-hero` herda trilho `.92fr 1.08fr`; `place-items:center` centra a cópia na 1ª coluna e deixa 878 px (61%) vazios à direita em 1440. | `index.css:162`, `index.css:1238`, `index.css:1245`; `hero-1440-claro.jpg`; inspector hero-void 33% | Task 5 |
| B2 | Hero mobile: `min-height:850px`, arte nos cantos, ~100 px vazios entre nav e intro. | `hero-375.png`, `index.css:1329-1333` | Task 5 (decisão 2) |
| B3 | Koi: `beige-background.png` (1094 px) esticado a 1440 com `cover`; no escuro os furos do ripple aparecem pretos; título sem onda nem montanha. | `gravura-1440.png`; inspector empty-middle 803 px; `index.css:1372` | Task 5 (decisão 3) |
| B4 | Sakura clipada: 460×450 px, 58 px além da direita e 27 px da base numa seção de 431 px. | `arquivo-1440.png`, `index.css:1382` | Task 5 |
| B5 | Card "Este espaço, em camadas": koi 330 px natural a 767 px (2,3×); link auto-referente para `#hero`. | `full-1440.png`, `templates/home.html:17` | Task 5 |
| B6 | Sem `ScrollTrigger.refresh()` após load/fontes; `gt-motion=paused` restaurado não para Lenis nem scrub; subpáginas sem Lenis (focus-1, focus-2 vermelhos). | `index.js:28-31`, `index.js:85-103`; `tests/browser-check.mjs` | Task 6 (decisão 7) |
| B7 | Sem intro no hero nem entrada por seção; pointer-parallax disputaria `transform` com GSAP. | `index.js:63-70` | Task 6 (parallax removido pela decisão 1) |
| B8 | Escuro: sombra fixa `rgb(21 21 21/.16)` some; `--art-shadow` existe e não é usado. Causa raiz `--paper:#fff`; faixa bege de 640 px no escuro (amostra `#e7dac3`). | `hero-dark-1440.png`, `index.css:1364`, `index.css:14` | Task 5 |
| B9 | Inspector FAIL eyebrow: 4 kickers (`.project-kind` ×3, "GitHub" no rodapé). | `report.json` findings[0] | Task 5 |
| COMP-3 | "Desdobrar gravura" sobre a espiral no claro (2,8:1 em 1440/768). **Resolvido por remoção** (A1). | `gravura-1440-claro.jpg`, `index.css:1373` | Task 4 (some com A1) |
| COMP-4 | Escuro: fim do lede do arquivo cruza a sakura (1,47:1 em 32% da linha a 1440; 1,52:1 no 390). | `arquivo-1440-escuro.jpg`, `index.css:1381` | Task 5 |
| COMP-5 | Zoom 200% em 1440×1400: `scrollWidth` 1447 vs 1440 (7 px). Dono `.contact-copy` (`gap:8vw` fixo, botão quebra em 3 linhas, nome do rodapé cortado). Absorve MOT-2, A11Y-N2, BUILD-1. | `zoom-contato-1440.jpg`; `index.css:105-107`, `568-575`, `583-589`, `1387`; `tests/browser-check.mjs:141-146` | Task 5 |

### P2

| ID | Achado | Evidência | Onda |
|---|---|---|---|
| C1 (+PERF-1) | 18 `<img>` (2,71 MiB) sem `loading`, `width/height`, `decoding`, `srcset`; carga fria 3,30 MB; 17 `.cut` com `drop-shadow` em scrub. CLS medido 0. | `templates/home.html`; `performance.transferSize` 3304208 B | Task 7 |
| C2 (+PERF-2) | `dist` carrega 29 arquivos sem referência (2,86 MB): SVGs do motor (`hero-desktop` 508 K, `hero-mobile` 475 K, `engraving`), `koi/beige-background.png` (não duplicado, só sem uso), ripples e petals não usados. | `scripts/site_builder.py:449-463`; lista em `achados-performance.md` | Task 7 (decisão 5) |
| C3 | Montserrat (145 K) como terceira família; direção define só Cormorant + Manrope. | `index.css:1215,1221,1241,1320` | Task 5 (decisão 4) |
| C4 | Testes dependiam do motor antigo; `test_hero_nuvens.py` grava `assets/hero-desktop.svg`; `render-engraving.mjs:128` com caminho fixo. | `tests/`; browser-checks já alinhados em `7f9c9e4` | Task 7 (resíduo Python) |
| C5 | CSS morto do motor antigo (`.art-layer`, `.print-frame`, `.engraving`, `.hero-papercut-*`, `.sheet-*`). | `index.css:218-242, 932-938, 1018-1037, 1104, 1191-1192, 1245-1270` | Task 7 |
| C6 | Zips, PNGs na raiz, `error.log`, `pacote-codex*`, `Maquete *.dc.html` soltos no `git status`. | `git status` | Task 7 |
| C7 | Ilustrações em CSS/SVG (cards SDD/RAG, `about-symbol`, estado vazio) destoam dos recortes PNG. | `templates/home.html:15-16,20,22` | Fora de escopo (decisão 6) |
| MOT-1 | Lenis, listener e callback no ticker GSAP sem cleanup (`pagehide`, `lenis.destroy()`, `ScrollTrigger.kill()`). | `index.js:84-103` | Task 6 |
| BUILD-2 | Builder não falha com PNG referenciado ausente (62 arquivos "OK"); só o checker acusa. | `scripts/site_builder.py:367-368`, `459-467` | Task 7 |
| BUILD-3 | `README.md` e direção descrevem o motor SVG/Maquete e dizem que PNG não entra no pacote; a home usa recortes PNG. | `README.md:3,27,79-81`; `docs/design/direcao-e-fontes.md:35-43` | Task 7 (README na Task 8) |
| CONT-1 | Nenhum HTML credita os recortes (Grok Imagine); `.art-credit` existe no CSS e não está em template. | `templates/home.html:9`, `content/pages/privacidade.md:12`, `index.css:1111` | Task 5 (ver decisão nova) |

### P3

| ID | Achado | Evidência | Onda |
|---|---|---|---|
| D1 | 15 tamanhos de fonte (13 a 136,8 px); 7 caixas 1 px outline. | inspector/lint WARN | Task 5 |
| D2 | Faixa `hero-foot` órfã entre hero e koi. | `full-1440.png` | Task 5 |
| D3 | Copy "Cada parte se move por conta própria" promete o que A1 não entrega. | `templates/home.html:9` | Task 4 (com A1) |
| CONT-2 | Card "Este espaço, em camadas" lista stack "SVG", mas mostra PNG. | `templates/home.html:17` | Task 5 (com B5) |
| CONT-3 | Nota "ilustrações conceituais" não vale para o card 3 (PNG de produção, links para `#hero`, sem repositório). | `templates/home.html:17-18` | Task 5 (com B5) |
| CONT-4 | Mesmo URL como "Fonte" na meta e "Explorar o repositório" no fim do texto, nas duas páginas de projeto. | `scripts/site_builder.py:293`; `content/projects/*.md:36-38` | Task 5 |
| CONT-5 | Sobre/currículo citam seguros, serviços financeiros, gestão comercial, Laravel, arquitetura e construção sem empregador, período ou peça. | `content/pages/curriculo.md:15,19,25-33` | Aguarda usuário |

## Decisões pendentes

### Já tomadas (2026-10-28, não reabrir)

| # | Resolução |
|---|---|
| 1 | Remover botão "Desdobrar gravura" e pointer-parallax; só o scrub GSAP controla `transform`. |
| 2 | Hero mobile com composição própria em 375: montanha na base, pagode maior, nuvens acima da nav, `min-height` pelo conteúdo. |
| 3 | Trocar `beige-background.png` por papel liso da paleta (nunca `#FFFFFF`) + ripples e peixes maiores; renomear título ou trazer onda/montanha. |
| 4 | Retirar Montserrat; ficar com Cormorant + Manrope. |
| 5 | SVGs do motor fora do `dist` (allowlist); `test_hero_nuvens.py` gera em tmp; `assets/motor/` fica como referência. |
| 6 | Ilustrações CSS/SVG serão trocadas por recortes do Grok em onda posterior (fora de escopo). |
| 7 | Lenis em todas as páginas; esconder o toggle só onde não há `.cut`. |

### Novas, levantadas pela auditoria

| Decisão | Recomendação |
|---|---|
| Crédito dos recortes (CONT-1) | Linha visível no rodapé ("Ilustrações: recortes gerados com Grok Imagine, composição própria") usando a `.art-credit` já existente; ajustar também a privacidade. |
| Stack "SVG" no card CONT-2 | Trocar para "Direção de arte / PNG recortado / Movimento"; se o card 3 sair por B5, a questão some. |
| Currículo sem evidência (CONT-5) | Usuário informa empregador/período/peça de cada item ou aprova remover o que não puder ser comprovado; não alterar antes disso. |

## Fora de escopo desta revisão

- Novos recortes do Grok para substituir as ilustrações CSS/SVG (C7, decisão 6).
- Conteúdo do blog (seção Arquivo continua em estado vazio).
- Texto e dados do currículo (CONT-5 depende do usuário).

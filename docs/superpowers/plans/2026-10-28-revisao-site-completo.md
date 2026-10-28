# Revisão completa do site (frontend + motion) — Plano de ação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auditar o site inteiro (composição, motion, performance, acessibilidade, conteúdo, build) com evidência medida, consolidar um relatório por severidade e corrigir em ondas P0 → P2 sem perder a direção de arte aprovada (papercut multicamadas em PNG, sombras, movimento leve).

**Architecture:** Ondas de sub-agentes por dimensão (Agent Swarm Discipline), cada uma lendo o mesmo build servido localmente e escrevendo achados em tabela com evidência (`arquivo:linha` ou nome de captura). O orquestrador revisa cada onda, consolida um relatório único e só então abre as ondas de correção, cada uma fechada por commit + gate (build, checker, unittest, browser-check, inspector). Nada é "achado" sem evidência; nada é corrigido sem gate.

**Tech Stack:** builder Python (`scripts/site_builder.py`), GSAP 3.12.7 + ScrollTrigger + Lenis (motor único de smooth scroll), CSS/JS vanilla, Chromium headless do Playwright via `cdp.mjs` da skill design-taste-frontend.

**Spec:** `docs/design/direcao-e-fontes.md` (direção de arte e exceções justificadas) + skills `build-awwwards-quality-sites` (§3 hero, §4 motion, §6 qualidade, §7 validação), `design-taste-frontend` (§7 gate, §8 look/`references/critique.md`, §9 move, `references/motion.md`), `frontend-design` (tells de página gerada), `ui-ux-pro-max` (`scripts/search.py --domain ux`).

## Global Constraints

- Stack fixa: sem novas dependências, sem CDN em runtime, sem Three.js, um único motor de smooth scroll (Lenis). Vendor em `assets/vendor/`.
- Direção aprovada pelo usuário e **inegociável**: recortes PNG (Grok Imagine) em camadas, drop-shadow de papel, motion leve. Um FAIL do inspector que contradiga isso recebe `taste-skill-ignore`, não remoção.
- `prefers-reduced-motion: reduce`: sem Lenis, sem scrub; estado final renderizado (já é assim; manter).
- Testes e scripts não gravam na árvore do repo; saídas temporárias vão para `/tmp` ou scratchpad.
- Cada onda termina em commit próprio na branch `TrolljanO/kittiwake`; sem force push; sem publicar.
- Copy em pt-BR, sentence case. "Não inventar problema": só entra achado com evidência; só se corrige o que está no relatório.
- Não reaproveitar nem copiar identidade/código de referências externas (skill §1).
- Paleta fixada pelo usuário em 2026-10-28, **sem branco puro `#FFFFFF` nem preto puro**. Tokens `--paper/--ink/--muted/--line` nos dois temas:

  | Papel | Claro | Escuro |
  |---|---|---|
  | Fundo da folha (`--paper`, `--field` derivado) | `#FAF9F6` | `#1C1B19` |
  | Texto (`--ink`) | `#1F1F1F` | `#E8E6E3` |
  | Texto secundário (`--muted`) | `#5A5A5A` | `#A8A5A0` |
  | Bordas e tabelas (`--line`) | `#E7E4DD` | `#34322E` |

  Atualizar também `meta[name=theme-color]` em `index.js:9` (hoje `#111111`/`#ffffff`) e `--reverse`.

## Review Focus

1. `localStorage` com `gt-motion=paused` ao carregar: Lenis e o scrub continuam ativos (só o clique chama `lenis.stop`). Teste na Task 1 (browser-check: com `gt-motion=paused` no storage antes do load ⇒ `<html>` tem a classe `lenis-stopped` e nenhum `.cut` muda de `transform` após rolar; `lenis` não está em `window`, usar a classe).
2. `prefers-reduced-motion` mudando durante a sessão (`matchMedia.change`): o bloco GSAP já inicializado não é desfeito. Teste na Task 1 via `Emulation.setEmulatedMedia` depois do load.
3. Navegação por âncora vinda de subpágina (`/curriculo.html` → `/#projetos`) e âncoras internas com Lenis ativo: destino correto sem salto duplo. Teste na Task 1.
4. PNG decorativo falhando (404 ou lento): seções com `min-height` fixa ficam vazias ou com buracos; sem `width/height` há CLS. Teste na Task 7 (bloquear `assets/gravura/**` com `Network.setBlockedURLs` e medir layout).
5. Zoom 200% e viewport alto: `.cut` posicionados em `%` extrapolam a seção e cobrem texto. Teste na Task 1 (sem overflow horizontal; nenhum `.cut` sobre `.wrap` de texto).

---

## Baseline desta sessão (2026-10-28, build fresco em tmp)

| Check | Resultado |
|---|---|
| `scripts/build-site.py --output <tmp>` | 66 arquivos, OK |
| `scripts/check-site.py . <tmp>` | 201 referências, 0 erros |
| `python3 -m unittest discover -s tests` | 32 testes OK (um deles grava `assets/hero-desktop.svg` na árvore) |
| `lint.mjs` (index.css, index.js, templates) | 6 FAIL (4 hairline, 2 shadow) / 11 WARN |
| `inspect.mjs` 1440/768/390 | 2 FAIL (eyebrow ×4, empty-screens 2/7) / 5 WARN (3 fontes, 15 tamanhos, no-footage, empty-middle 803px em `#gravura`, hero-void 33%) |
| Console (home, 1440 e 375) | 0 erros; `html.lenis` presente; gsap/ScrollTrigger/Lenis carregados |
| `dist` | ≈6,0 MB; 37 PNG copiados, 18 usados na home |
| Clone limpo de `ac9d11b` (checkpoint) | build 63 arquivos OK (SVGs do motor fora); checker 0 erros; unittest **28 rodados, 5 pulados, 1 erro** (`test_hero_nuvens` depende de `docs/design/hero-preview/` e `assets/engraving.svg`, não rastreados) — corrigido na Task 1 |

## Ambiente e comandos de reprodução

```bash
# build + servidor (nunca servir a raiz do repo)
OUT=/tmp/kittiwake-review/dist && rm -rf "$OUT" && python3 scripts/build-site.py --output "$OUT"
python3 scripts/check-site.py . "$OUT"
python3 -m http.server 4174 --bind 127.0.0.1 --directory "$OUT"   # em background

# browser headless (Playwright cache já instalado; libnss3/libnspr4 presentes)
export CHROME_PATH=/home/tj/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
export CDP_HELPER=/home/tj/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs
export SITE_URL=http://127.0.0.1:4174

# gate da skill design-taste-frontend (rodar de um diretório temporário: grava .taste-skill/ no cwd)
S=/home/tj/.agents/skills/design-taste-frontend/scripts
node $S/lint.mjs index.css index.js templates
node $S/inspect.mjs $SITE_URL/        # relatório em .taste-skill/inspect/report.json + jpgs

# diretrizes UX pesquisáveis
python3 /home/tj/.agents/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --domain ux

# testes de browser do repo (após Task 1)
node tests/browser-check.mjs && node tests/hero-check.mjs
```

Artefatos da revisão: `docs/review/2026-10-28/` (relatório, achados por dimensão, capturas-chave em JPG ≤ 200 KB). Capturas brutas ficam fora do repo.

## Exceções justificadas (carregadas de `docs/design/direcao-e-fontes.md`)

Marcar com `/* taste-skill-ignore */` na linha, nunca remover:

- `drop-shadow` em `.cut` (index.css:1364 e 1393): sombra de papel recortado é a linguagem do site.
- Hairlines que representam folhas/bordas de recorte e `data-ui` nos cards (index.css:400, 470, 1172, 1194): verificar caso a caso; as que não forem folha viram espaço/tom.
- WARN `no-footage`: ausência de vídeo é decisão registrada.
- Motion concentrado nas folhas com botão de pausa, em vez de mínimo arbitrário de elementos em movimento.

## Achados confirmados nesta sessão

Severidade: P0 função quebrada ou texto ilegível · P1 defeito visível de composição ou de motor · P2 performance/higiene · P3 polimento.

| ID | Sev | Achado | Evidência | Regra | Onda |
|---|---|---|---|---|---|
| A1 | P0 | Botão "Desdobrar gravura" morto: JS procura `.art-layer`, template só tem `.cut`; clique só alterna `aria-pressed` | `index.js:32`, `templates/home.html:8` | awwwards §6 controles robustos | motion |
| A2 | P0 | Links do rodapé (Privacidade, Pausar movimento, Voltar ao início) e frase do rodapé renderizam sobre raízes/musgo: ilegíveis, alvo de toque comprometido | `footer-1440.png`, `footer-375.png`, `index.css:1388-1391` | WCAG contraste, uupm touch targets | composição |
| A3 | P0 | Mobile: título e texto da seção koi sobre a espiral verde; nuvem atrás do link "Currículo" na nav | `gravura-375.png`, `hero-375.png` | WCAG contraste | composição |
| A4 | P0 | `html{scroll-behavior:smooth}` + Lenis ativo sem o CSS `.lenis` recomendado: duas suavizações disputando âncoras | `index.css:57`, `index.js:88-92` | awwwards §4 um motor | motion |
| B1 | P1 | Hero desktop: cópia à esquerda, 60% da direita vazio apesar de `place-items:center` (causa a apurar) | `hero-1440.png`; inspector hero-void 33%, empty-screens | awwwards §3, taste §8 | composição |
| B2 | P1 | Hero mobile: `min-height:850px`, arte reduzida a cantos, ~100 px de vazio entre nav e intro; plano 2026-10-27 previa enquadramento 375 próprio | `hero-375.png`, `index.css:1329-1333` | awwwards §3 | composição |
| B3 | P1 | Seção koi: `beige-background.png` (1094 px) esticado a 1440 com `object-fit:cover`; recortes brancos leem como manchas; título "Entre ondas e montanhas" sem onda nem montanha | `gravura-1440.png`; inspector empty-middle 803 px | taste §8 critique | composição |
| B4 | P1 | Sakura clipada: árvore 460 px com `right:-4%;bottom:-8%` em seção baixa, só uma fatia aparece | `arquivo-1440.png`, `index.css:1382` | taste §8 | composição |
| B5 | P1 | Card "Este espaço, em camadas": koi de 330 px natural exibido a 767 px (upscale 2,3×); link auto-referente para `#hero` | `full-1440.png`, `templates/home.html:17` | awwwards §2 crops deliberados | conteúdo |
| B6 | P1 | Motor: sem `ScrollTrigger.refresh()` após load/fontes; toggle restaurado do storage não para Lenis nem scrub; subpáginas retornam antes do bloco GSAP (sem Lenis, rodapé estático) | `index.js:28-31`, `index.js:85-103` | awwwards §4 refresh/cleanup | motion |
| B7 | P1 | Sem intro composta no hero nem entrada por seção; único movimento é scrub ±70 px. Pointer-parallax (`index.js:63-70`) disputaria `transform` com o GSAP se religado | `index.js` | awwwards §3/§4, taste §9 | motion |
| B8 | P1 | Tema escuro: sombra fixa `rgb(21 21 21/.16)` some no fundo escuro; token `--art-shadow` existe e não é usado. Faixa bege de 640 px no dark ainda não medida | `hero-dark-1440.png`, `index.css:1364` | vault: contraluz nos dois temas | composição |
| B9 | P1 | Inspector FAIL eyebrow: 4 kickers acima de títulos (`.project-kind` ×3, "GitHub" acima do nome no rodapé) | report.json findings[0] | frontend-design tells | conteúdo |
| C1 | P2 | 17 `<img>` com `filter:drop-shadow` em scrub; sem `loading`, `width/height`, `decoding`; sem WebP/AVIF; ≈2,3 MB de PNG decorativo na home | `templates/home.html`, medição de imagens | awwwards §6 performance | performance |
| C2 | P2 | `dist` carrega mortos: `hero-desktop.svg` 508 K, `hero-mobile.svg` 475 K, `engraving.svg` (0 referências em HTML); `koi/beige-background.png` 794 K duplicado; glob copia os 37 PNG | `scripts/site_builder.py:449-463` | higiene | build |
| C3 | P2 | `montserrat.ttf` 145 K como terceira família (hero/rodapé); direção define só Cormorant + Manrope | `index.css:1215,1221,1241,1320` | taste type.md, direção | composição |
| C4 | P2 | `tests/browser-check.mjs` e `tests/hero-check.mjs` asseguram `.wave-cut`, `.engraving`, `.hero-papercut-*` (0 ocorrências nos templates); `test_hero_nuvens.py` grava `assets/hero-desktop.svg` a cada execução | `tests/` | verificação honesta | build |
| C5 | P2 | CSS morto do motor antigo: `.art-layer`, `.print-frame`, `.engraving`, `.hero-papercut-*`, `.sheet-*` | `index.css:218-242, 932-938, 1018-1037, 1104, 1191-1192, 1245-1270` | higiene | build |
| C6 | P2 | Repo: zips, PNGs na raiz, `error.log`, `pacote-codex.tar.gz`, `Maquete *.dc.html`, `Zone.Identifier` soltos no `git status` | `git status` | higiene | build |
| C7 | P2 | Ilustrações desenhadas em CSS/SVG (cards SDD/RAG, `about-symbol`, estado vazio do arquivo) destoam da linguagem de recortes PNG | `full-1440.png`, `templates/home.html:15-16,20,22` | awwwards §2 | conteúdo |
| D1 | P3 | 15 tamanhos de fonte; 7 caixas 1 px outline | inspector/lint WARN | taste type.md | composição |
| D2 | P3 | Faixa `hero-foot` órfã entre hero e koi | `full-1440.png` | taste layout.md | composição |
| D3 | P3 | Copy "Cada parte se move por conta própria" promete interação que A1 não entrega | `templates/home.html:9` | frontend-design copy | conteúdo |

## Decisões do usuário (com recomendação)

Todas decididas pelo usuário em 2026-10-28. Não reabrir.

| # | Decisão | Resolução |
|---|---|---|
| 1 | Botão "Desdobrar gravura" e pointer-parallax | **Remover** ambos (`index.js:27-82`, botão em `templates/home.html:9`, CSS `.art-layer/.print-frame/.is-open`); só o scrub GSAP controla `transform`. |
| 2 | Hero mobile | Composição própria em 375: montanha na base inteira, pagode maior, nuvens acima da nav (não atrás); `min-height` pelo conteúdo. |
| 3 | Fundo da seção koi | **Substituir** `beige-background.png` por papel liso com a paleta das Global Constraints (nunca `#FFFFFF`) + ripples e peixes maiores. Renomear título ou trazer onda/montanha. |
| 4 | Montserrat | **Retirar** (CSS, allowlist, `assets/fonts/montserrat*`); ficar com Cormorant + Manrope. |
| 5 | SVGs do motor + `test_hero_nuvens.py` | **Retirar do `dist`** (allowlist) e o teste gera em `tmp`. Código em `assets/motor/` fica como referência. Os SVGs não entram no checkpoint. |
| 6 | Ilustrações em CSS/SVG (cards, símbolo, estado vazio) | **Aprovado**: trocar por recortes PNG do Grok em onda posterior a esta revisão (fora de escopo aqui). |
| 7 | Lenis nas subpáginas | **Sim**, inicializar em todas as páginas; esconder o toggle só onde não há `.cut`. |

---

### Task 0: Ambiente e baseline reproduzível

**Files:**
- Create: `docs/review/2026-10-28/baseline.md`

- [x] **Step 0 (feito em `ac9d11b`, 2026-10-28):** A árvore carregava toda a implementação dos recortes **sem commit** (`index.css`, `index.js`, `templates/`, HTML antigo da raiz apagado). Fazer um checkpoint antes de qualquer onda, no padrão do repo: `rtk git add -A -- index.css index.js templates scripts tests content assets/gravura assets/vendor .gitignore README.md docs/design/direcao-e-fontes.md && rtk git commit -m "chore: checkpoint recortes PNG + GSAP/Lenis"`. Sem isso, o commit da Task 4 engole o trabalho da sessão anterior. Não incluir zips, PNGs soltos da raiz, `error.log` nem `pacote-codex*` (C6).
- [ ] **Step 1:** Rodar o bloco "Ambiente e comandos" acima; build e checker com 0 erros; servidor em 4174.
- [ ] **Step 2:** Rodar `lint.mjs` e `inspect.mjs` de um diretório temporário. Esperado: números iguais à tabela de baseline (6/11 e 2/5). Divergência = anotar, não corrigir.
- [ ] **Step 3:** Escrever `baseline.md` com a tabela acima preenchida pelos valores obtidos e os caminhos das capturas.
- [ ] **Step 4:** `rtk git add docs/review/2026-10-28/baseline.md && rtk git commit -m "docs: baseline da revisão do site"`

### Task 1 (pré-requisito dos gates): testes de browser no mundo `.cut`

**Files:**
- Modify: `tests/browser-check.mjs:62-71` (remover asserções `.wave-cut`/`.engraving`/`unfold`), `tests/hero-check.mjs:28-36`
- Modify: `tests/test_hero_nuvens.py` (saída em `tempfile`, não em `assets/`)

**Interfaces:**
- Produces: `node tests/browser-check.mjs` e `node tests/hero-check.mjs` saem 0 no site atual; são o gate de acessibilidade/robustez das Tasks 4–7.

- [ ] **Step 1:** Rodar os dois scripts contra o build. Esperado: FAIL nas asserções do motor antigo (prova de que estão obsoletos).
- [ ] **Step 2:** Substituir por asserções do estado atual: 17 `.cut` com `naturalWidth>0`; `html.lenis` presente com motion e ausente sob reduced-motion; toggle oculto em `/arquivo/index.html` até a decisão 7; sem erros de console; 200% zoom sem overflow e sem `.cut` sobre `.wrap`.
- [ ] **Step 3:** Acrescentar os testes do Review Focus 1, 2, 3 e 5 (um `assert` cada; os de 1 e 2 **devem falhar agora** e documentar B6).
- [ ] **Step 4:** `test_hero_nuvens.py`: gerar em `tempfile.TemporaryDirectory()`. Atenção: `scripts/render-engraving.mjs:128` grava `docs/design/hero-preview/nuvem-isolada.svg` com caminho fixo e falha se a pasta não existir (erro em clone limpo); o script precisa aceitar um diretório de saída (argumento ou `OUT_DIR`) que o teste aponta para o tmp. `test_engraving.py` pula 5 testes sem `assets/engraving.svg`: decidir com a decisão 5 se viram `skip` definitivo ou são removidos. Rodar `python3 -m unittest discover -s tests` **de um clone limpo** (`git archive HEAD | tar -x -C <tmp>`); esperado OK sem erro nem escrita fora do tmp, e `rtk git status` sem alteração em `assets/` nem `docs/`.
- [ ] **Step 5:** Commit `test: alinhar browser-checks ao site de recortes`.

### Task 2: Onda de auditoria (6 sub-agentes em paralelo, orquestrador revisa)

**Files:**
- Create: `docs/review/2026-10-28/achados-<dimensão>.md` (uma tabela no formato dos "Achados confirmados"; cada linha com evidência)

Briefing comum a todos: URL do build, caminhos de `CHROME_PATH`/`CDP_HELPER`, a tabela de achados já confirmados (para não redescobrir) e as exceções justificadas. Só entra linha com evidência.

- [ ] **Composição/direção de arte** (Sonnet): ler `references/critique.md` da taste skill; capturar 1440/768/390 em claro **e escuro**, fold e página inteira; as 14 passagens da crítica por seção; apurar a causa de B1 no CSS; medir contraste de todo texto sobre `.cut` (A2, A3). Saída: `achados-composicao.md` + capturas JPG das seções problemáticas.
- [ ] **Motor de motion** (Sonnet): checklist awwwards §4/§7 contra `index.js` e `index.css` (um motor, integração ScrollTrigger, refresh após mídia/fontes, reduced-motion, cleanup, sistemas disputando a mesma propriedade, estados ao perder foco/visibilidade). Evidência em movimento: script `tests/motion-capture.mjs` que captura `scrollY` em 0/900/1800/2700/3600/4500 a 1440 e 390 com motion ligado e amostra `requestAnimationFrame` deltas durante rolagem sintética (p95 em ms). Antes de confiar nas capturas, confirmar que `window.scrollTo` move a posição do Lenis (se não, rolar com `Input.dispatchMouseEvent mouseWheel`). Saída: `achados-motion.md`.
- [ ] **Performance/assets** (Haiku coleta, Sonnet julga): bytes e dimensões naturais × exibidas de cada `<img>` em 1440 e 390, atributos `loading/width/height/decoding`, total transferido da home, arquivos de `dist` sem referência em HTML/CSS, duplicados por hash. Saída: `achados-performance.md`.
- [ ] **Acessibilidade/robustez** (Sonnet): Task 1 verde + teclado ponta a ponta (ordem de foco, foco visível sobre imagens), sem JS, storage bloqueado, impressão, zoom 200%, leitor de tela (nomes acessíveis dos botões de filtro/tema/motion). Consultar `search.py "<tema>" --domain ux` para cada falha. Saída: `achados-a11y.md`.
- [ ] **Conteúdo/honestidade** (Sonnet): awwwards §2/§6 + tells de `frontend-design`: placeholders, afirmações não verificáveis, ilustração autoral em CSS/SVG (C7), eyebrows (B9), títulos vs. conteúdo (B3, D3), crédito de IA/proveniência dos recortes visível no site, texto alternativo. Saída: `achados-conteudo.md`.
- [ ] **Build/testes/higiene** (Sonnet): allowlist (`site_builder.py:448-463`), CSS morto (C5), arquivos soltos (C6), `README`/docs desatualizados em relação aos recortes, `.gitignore`. Saída: `achados-build.md`.
- [ ] **Revisão do orquestrador:** para cada arquivo, apagar linhas sem evidência e linhas que contradizem as exceções justificadas; devolver ao sub-agente só se faltar evidência de algo visível em captura.

### Task 3: Consolidação

**Files:**
- Create: `docs/review/2026-10-28/relatorio.md`

- [ ] **Step 1:** Unir os seis arquivos de achados com a tabela desta sessão; deduplicar; atribuir P0–P3 e onda.
- [ ] **Step 2:** Seção "Decisões pendentes" com as sete decisões acima e as novas que a auditoria levantar, cada uma com recomendação.
- [ ] **Step 3:** Seção "Fora de escopo desta revisão" (ex.: novos recortes do Grok para C7, conteúdo do blog).
- [ ] **Step 4:** Commit `docs: relatório consolidado da revisão do site`. As sete decisões já foram tomadas (tabela acima); só parar antes da Task 4 se a auditoria levantar decisão nova.

### Task 4: Onda de correção P0 (A1–A4)

**Files:**
- Modify: `index.js` (remover `unfold`/pointer-parallax ou religar conforme decisão 1), `templates/home.html:9`, `index.css:57` e `:1388-1391`, `templates/footer.html`

- [ ] **Step 1:** Rodar `tests/browser-check.mjs`; o assert de A1/Review Focus 1 falha (vermelho).
- [ ] **Step 2:** A1 + D3: aplicar decisão 1; ajustar a copy da seção. A4: trocar `scroll-behavior:smooth` pelo CSS oficial do Lenis (`html.lenis,html.lenis body{height:auto}`, `.lenis.lenis-smooth{scroll-behavior:auto!important}`, `.lenis.lenis-stopped{overflow:hidden}`) e tratar âncoras com `lenis.scrollTo` ou opção `anchors`.
- [ ] **Step 3:** A2: rodapé com faixa de texto fora da área das imagens (reservar altura; imagens abaixo ou atrás com `--field` sob o texto). A3: no 375, `.cut` do koi e da nav fora das áreas de texto (ajustar `top/left/width` por media query); medir contraste ≥ 4,5:1.
- [ ] **Step 4:** Gate: build, checker, unittest, browser-check, hero-check, `inspect.mjs` (sem novo FAIL), reler capturas 1440/390 claro/escuro das áreas alteradas.
- [ ] **Step 5:** Commit `fix: P0 da revisão — controles, âncoras com Lenis, legibilidade sobre recortes`.

### Task 5: Onda P1 composição (B1–B5, B8, B9, C3) — depende das decisões 2, 3, 4

**Files:**
- Modify: `index.css` (hero, koi, sakura, rodapé, tokens de sombra), `templates/home.html` (card 3, títulos), fontes no allowlist

- [ ] **Step 1:** B1: corrigir a causa apurada na Task 2; hero com cópia e arte equilibradas (inspector sem hero-void/empty-screens). B2: media query 375 própria.
- [ ] **Step 2:** Aplicar a paleta das Global Constraints nos tokens dos dois temas e no `theme-color`; `grep -n "#fff\b\|#ffffff\|#111\b\|#151515" index.css index.js` deve devolver só exceções comentadas. B3 conforme decisão 3; B4: árvore inteira visível ou recorte intencional (não acidental); B8: sombra via `var(--art-shadow)` nos dois temas; faixa do koi no dark decidida pela captura.
- [ ] **Step 3:** B5: miniatura em tamanho natural ou novo recorte; destino do card para a seção koi ou remover o card até existir caso real. B9: kickers viram parte do título ou saem. C3: Montserrat → Manrope; retirar `montserrat.ttf` do allowlist.
- [ ] **Step 4:** Gate da Task 4 + `inspect.mjs` com 0 FAIL em 1440/768/390 + crítica escrita (formato `critique.md` §4) com capturas antes/depois em `docs/review/2026-10-28/capturas/`. Máximo três rodadas olhar-corrigir.
- [ ] **Step 5:** Commit `feat: composição revisada — hero, koi, sakura, tema escuro`.

### Task 6: Onda P1 motion (B6, B7) — depende das decisões 1 e 7

**Files:**
- Modify: `index.js` (inicialização em todas as páginas, `ScrollTrigger.refresh()` em `load` e `document.fonts.ready`, toggle que para Lenis **e** desabilita os ScrollTriggers, cleanup em `pagehide`), `index.css` (estados finais sem JS)

- [ ] **Step 1:** Review Focus 1 e 2 em `browser-check.mjs` ficam verdes (eram vermelhos desde a Task 1).
- [ ] **Step 2:** B7: uma sequência de intro no hero (nav, título por palavra com stagger ≤ 90 ms, texto, CTA, recortes) legível antes de terminar; entrada por seção (título → texto → imagem, 16–32 px, uma vez); tudo transform/opacity; conteúdo visível sem JS; reduced-motion renderiza o estado final. Referência: `references/motion.md` da taste skill. Texto dividido mantém nome acessível (skill §4).
- [ ] **Step 3:** Rodar `tests/motion-capture.mjs` (Task 2): nenhuma seção com conteúdo oculto em nenhuma posição; p95 de frame ≤ 20 ms em 1440 no Chromium headless (registrar o valor, não prometer fps real de celular).
- [ ] **Step 4:** Gate completo + commit `feat: motion — intro do hero, entradas por seção, toggle e refresh corretos`.

### Task 7: Onda P2 (C1, C2, C4–C6) — depende da decisão 5

**Files:**
- Modify: `scripts/site_builder.py:448-463` (allowlist explícita por arquivo usado), `templates/*.html` (`loading="lazy"` abaixo da dobra, `width`/`height`, `decoding="async"`), `index.css` (remover blocos mortos), `.gitignore`

- [ ] **Step 1:** Teste em `tests/test_build_regressions.py`: `dist` não contém `hero-desktop.svg`, `hero-mobile.svg`, `engraving.svg`, `koi/beige-background.png`, PNG sem referência. Rodar: falha.
- [ ] **Step 2:** Implementar allowlist explícita; opcional: converter os PNG usados para WebP com fallback (só se `cwebp`/Pillow disponíveis; registrar se não).
- [ ] **Step 3:** Review Focus 4: bloquear `assets/gravura/**` via CDP e capturar; nenhum buraco de layout nem texto escondido. Medir CLS com `PerformanceObserver('layout-shift')` < 0,1 na home.
- [ ] **Step 4:** Remover CSS morto (C5) com `grep` provando 0 usos de cada seletor nos templates/`dist`; limpar C6 (`.gitignore` + mover referências para `docs/design/referencias/` ou apagar com confirmação do usuário).
- [ ] **Step 5:** Gate completo; `dist` ≤ 3 MB registrado; commit `chore: allowlist explícita, lazy loading, CSS morto e higiene do repo`.

### Task 8: Validação final e handoff

**Files:**
- Create: `docs/review/2026-10-28/handoff.md`
- Modify: `README.md` (comandos de verificação), vault `kittiwake (MOC).md`

- [ ] **Step 1:** Rodar tudo: build, checker, unittest, browser-check, hero-check, motion-capture, lint, inspect (0 FAIL em 1440/768/390). Colar as saídas no handoff.
- [ ] **Step 2:** Relatório no formato awwwards §7: skill de design escolhida, fontes dos assets (Grok Imagine, prompts resumidos, licença das fontes), stack de motion, decisão Three.js (nenhum), validações executadas, limitações restantes e itens fora de escopo.
- [ ] **Step 3:** Vault: nota `project/` com as decisões tomadas nesta revisão e linha no MOC; espelhar ponteiro na memória local.
- [ ] **Step 4:** Commit `docs: handoff da revisão do site`. Não publicar; não fazer merge sem o usuário.

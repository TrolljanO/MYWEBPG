# Revisão UI/UX Pro Max

Revisão de 10 de novembro de 2026. Nenhum arquivo de design system foi persistido. Nenhum arquivo em `src/` foi editado.

## Escopo e o que você abriu

Produto: portfólio e blog de Guilherme Trajano. Direção pedida pelo dono: diorama de papercut, texto numa folha estável, cenário sem carregar a informação. Três cenas: cumeeira (dragão e pagode), koi, sakura no blog. As regras do repositório vencem a skill: sem GSAP, Lenis ou Three.js no layout base e nas páginas de leitura; sem inventar métrica, cliente ou e-mail.

Stack conferida no HTML servido: Astro estático, uma folha Tailwind 4.3.5 (`BaseLayout.D7bpzVYN.css`, 23 869 bytes) mais CSS próprio no mesmo arquivo. Viewport `width=device-width, initial-scale=1`. Sem `src` de GSAP, Lenis ou Three.js nas duas páginas.

Abri de verdade, em Chromium via Playwright, viewport 1440×900:

- Home: `http://127.0.0.1:4321/MYWEBPG/` — HTTP 200, título “Portfólio | Guilherme Trajano”. Tela inicial, página inteira, primeiro Tab (skip link) e o atributo `data-theme=dark` só no hero.
- Blog: `http://127.0.0.1:4321/MYWEBPG/blog/` — HTTP 200, título “Blog · página 1 | Guilherme Trajano”. Tela inicial e página inteira.

Também li o HTML dessas duas URLs e a folha CSS que o documento pede. About e Projetos responderam 200 no cabeçalho e não foram abertos.

Referências do dono, JPEG quadrado, olhadas à parte do site: `/tmp/grok-imagine/e8097549-1e03-4a6e-8c4f-2a5b7528b973.png` (cumeeira em papel cinza, dragão e pagode numa maquete já montada) e `/tmp/grok-imagine/2287f9ed-6104-4f85-a5a3-976266ce1d4c.png` (sakura, árvore inteira sobre um monte).

Não há gráficos. A prioridade 10 da skill (charts) fica de fora. Não há formulário nestas duas páginas.

## Design system sugerido pela busca

Comando, sem `--persist` e sem escrever `design-system/` no repositório:

```bash
python3 /home/tj/.grok/skills/ui-ux-pro-max/scripts/search.py \
  "portfolio editorial papercut personal site" \
  --design-system -p "Guilherme Trajano" -f markdown
```

Saída integral:

### Pattern

- **Name:** Scroll-Triggered Storytelling
- **Conversion Focus:** Keep the narrative understandable without scroll-driven effects. Use progress indicator. Mobile: simplify animations. Keep DOM reading order complete; disable parallax and scroll-scrub under reduced motion. Pause scroll animation when offscreen or hidden and render each chapter in its final readable state under reduced motion.
- **CTA Placement:** End of each chapter (mini) + Final climax CTA
- **Color Strategy:** Progressive reveal. Each chapter has distinct color. Building intensity.
- **Sections:** Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3 (solution) > Climax CTA

### Style

- **Name:** Brutalism
- **Mode Support:** Light supported | Dark supported
- **Keywords:** Raw, unpolished, stark, high contrast, plain text, default fonts, visible borders, asymmetric, anti-design
- **Best For:** Design portfolios, artistic projects, counter-culture brands, editorial/media sites, tech blogs
- **Performance:** cost:low|drivers:none | **Accessibility:** risk:low|requires:contrast-text-4.5,keyboard,visible-focus,reduced-motion

### Colors

| Role             | Hex       | CSS Variable               |
| ---------------- | --------- | -------------------------- |
| Primary          | `#18181B` | `--color-primary`          |
| On Primary       | `#FFFFFF` | `--color-on-primary`       |
| Secondary        | `#3F3F46` | `--color-secondary`        |
| On Secondary     | `#FFFFFF` | `--color-on-secondary`     |
| Accent/CTA       | `#2563EB` | `--color-accent`           |
| On Accent/CTA    | `#FFFFFF` | `--color-on-accent`        |
| Background       | `#FAFAFA` | `--color-background`       |
| Foreground       | `#09090B` | `--color-foreground`       |
| Card             | `#FFFFFF` | `--color-card`             |
| Card Foreground  | `#09090B` | `--color-card-foreground`  |
| Muted            | `#E8ECF0` | `--color-muted`            |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border           | `#E4E4E7` | `--color-border`           |
| Destructive      | `#DC2626` | `--color-destructive`      |
| On Destructive   | `#FFFFFF` | `--color-on-destructive`   |
| Ring             | `#18181B` | `--color-ring`             |

Notas da busca: monochrome + blue accent.

### Typography

- **Heading:** Caveat
- **Body:** Quicksand
- **Mood:** handwritten, personal, friendly, casual, warm, charming
- **Best For:** Personal blogs, invitations, creative portfolios, lifestyle brands
- **Google Fonts:** `Caveat` 400–700 + `Quicksand` 300–700

### Key Effects

No smooth transitions (instant), sharp corners (0px), bold typography (700+), visible grid, large blocks.

### Avoid

Corporate templates. Generic layouts.

### Pre-Delivery Checklist (veio na mesma saída)

Sem emoji como ícone. `cursor-pointer` nos clicáveis. Hover de 150–300 ms. Contraste de texto 4,5:1 no modo claro. Foco visível. `prefers-reduced-motion`. Breakpoints 375, 768, 1024 e 1440.

### Encaixe

A skill manda conferir se o resultado serve ao produto e, se estiver fora, refazer uma vez. Brutalismo com Caveat e acento azul `#2563EB` não descreve papercut nem uma folha de leitura estável. A segunda busca, `"papercut diorama editorial portfolio" --design-system`, devolveu Minimalism & Swiss Style, Archivo + Space Grotesk, o mesmo cinza e o mesmo azul. Também não é papercut. Não há linha verificada no banco para diorama de papel. O que segue usa a saída pedida como registro e as buscas por domínio quando elas encaixam melhor. Nenhuma das duas saídas foi gravada no repositório.

Buscas suplementares, uma intenção cada:

| Intenção                        | Comando                                            | O que voltou e serve                                                                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pular navegação e ver o foco    | `"skip link keyboard focus" --domain ux`           | Skip link (média). Foco visível, foco não coberto e teclado completo (alta). Aparência do foco, 2 px e 3:1, é critério AAA, não AA.                                                                                            |
| Leitura editorial longa         | `"editorial longform reading" --domain typography` | O par que encontra o título já usado é Editorial Classic: Cormorant Garamond + Libre Baskerville. News Editorial (Newsreader + Roboto) e Magazine Style (Libre Bodoni + Public Sans) servem a texto longo. Caveat não aparece. |
| Cor de papel, quente, editorial | `"paper craft warm editorial" --domain color`      | Primeiro hit útil: Magazine/Blog, `#18181B` sobre `#FAFAFA`, acento `#EC4899`. Os hits seguintes caem em outros produtos (cervejaria, receita, leitura posterior). Não aplico o rosa.                                          |
| Herói de portfólio em narrativa | `"portfolio hero storytelling" --domain landing`   | 1) Portfolio Grid: fundo neutro, o trabalho na frente, filtro, carga rápida. 2) Scroll-Triggered Storytelling, o mesmo padrão do design system, com a ressalva de a narrativa funcionar sem efeito de scroll.                  |
| Imagem estática e transição     | `"static images view transitions" --stack astro`   | `astro:assets` / `<Image>` (alta), `<Picture>` para vários tamanhos (média), JS zero por padrão (alta), `<ClientRouter>` no lugar de `<ViewTransitions>` (média).                                                              |

O site no ar já tem a folha de papel: fundo `#f6f3ec`, texto `#1c1916`, acento `#7a2f2c`, Manrope no corpo, Cormorant Garamond no título. Isso está mais perto do pedido do dono do que o brutalismo da busca.

## Achados por prioridade

### 1. Acessibilidade

O que segura:

- Contraste medido na folha, tema claro: texto `#1c1916` sobre `#f6f3ec` = 15,79:1. Muted `#5e574e` sobre o mesmo fundo = 6,43:1 (legenda “Cinco folhas no mesmo quadro. Ilustração com IA.” e o rótulo “em progresso”). Acento `#7a2f2c` sobre o papel = 8,35:1. Botão primário em repouso, creme sobre `#1c1916` = 15,79:1. No hover o preenchimento foi para `rgb(122, 47, 44)` com texto creme = 8,35:1. Regra `color-contrast` / `color-accessible-pairs` (4,5:1). Gravidade do que passa: nenhuma.
- Com `data-theme=dark` no hero, o cabeçalho vai para `#f3eee6` sobre `#171614` (15,66:1) e a folha do nome continua clara, 15,79:1. O cenário não inverte.
- Skip link “Pular para o conteúdo” existe, aponta para `#main` com `tabindex="-1"`. No primeiro Tab ele aparece no canto, texto creme em bloco quase preto, anel `outline: 3px solid` na cor de acento, offset de 5 px no CSS. Regras `skip-links` e `focus-states`.
- Imagens do diorama com `alt=""`. A legenda visível nomeia a cena (“Cumeeira”, “Na onda”, “Sakura”) e diz “Ilustração com IA”. Um parágrafo só para leitor de tela descreve as folhas. Regra `alt-text`: decorativo vazio quando o texto ao lado explica a figura.
- Hierarquia da home: um `h1` (“Guilherme Trajano.”), `h2` “Trabalho em aberto.”, `h3` nos dois projetos, `h2` “A bagagem vira método.”. No blog, um `h1` “Notas & descobertas.”. Sem salto de nível. Regra `heading-hierarchy`.
- No blog, o link Blog tem `aria-current="page"` e sublinhado borgonha. Ícones de seta são SVG com `aria-hidden` ao lado de texto. Regra `icon-context`.
- `scroll-padding-top: 7rem` no `html`, cabeçalho sticky de 89 px. Regra `focus-not-obscured` preparada no CSS. Não percorri a página inteira com Tab para provar que nenhum foco fica atrás do cabeçalho.

Achados:

- **O controle de pausa nasce fora da primeira tela.** Em 1440×900 a placa mede 812 px e começa em y=89. A legenda, com o botão “Pausar movimento” (146×44), começa em y=913. As folhas já animam enquanto o botão está abaixo da dobra. O que se vê na home e no blog: o diorama mexe; o botão só aparece depois de um pouco de scroll. Regra `auto-rotation-controls` (conteúdo em movimento precisa de pausa) e `focus-states` não falha no botão em si, que tem nome visível. Gravidade: média.
- **Alvos de texto estreitos.** “SDD-Buddy” mede 145×36 px e “Micro-RAG” 137×36 px. “X” mede 26×44 e “RSS” 24×44. A regra da skill `touch-target-size` pede 44×44. A regra `web-target-size` (WCAG 2.2 AA) pede 24×24: a altura dos títulos passa; a largura de “RSS” fica no limite de 24. Gravidade: média.
- **O skip link, focado, cobre o nome no cabeçalho.** Na captura do primeiro Tab, o bloco “Pular para o conteúdo” fica por cima de “gt. Guilherme Trajano” e o que resta visível do nome é o final da palavra. O controle focado em si está inteiro. Regra `focus-not-obscured` (o foco não pode sumir; aqui quem some é o nome ao lado). Gravidade: baixa.

### 2. Toque e interação

- Botões e links medidos com `cursor: pointer`. Cabeçalho, “Conheça meu trabalho” (263×51), “Ler o blog” (163×51), “Tema escuro” (127×44) e “Pausar movimento” (146×44) passam de 44 px. Regra `cursor-pointer` e, nesses, `touch-target-size`.
- O hover do botão primário troca o fundo em 0,2 s para o borgonha. O CSS também declara `translate: 0 -3px` no hover e `translate: 0 1px` no active. Regra `press-feedback` e o item de hover de 150–300 ms da checklist. Gravidade do que falha nos títulos e no “X”/“RSS”: a mesma da seção 1, média.
- O parallax do ponteiro é só `pointermove` no palco. Movi o ponteiro e o primeiro plano deslocou cerca de 1 px. Quem usa toque não recebe esse deslocamento. O texto não depende dele. Regra `hover-vs-tap`. Gravidade: baixa.

### 3. Desempenho

O que segura: as imagens entregues são WebP, com `width="2496"` e `height="1664"`, e o palco tem `aspect-ratio: 3/2`. Isso reserva o espaço (regra `image-dimension`). `@font-face` usa `font-display: swap` em Manrope e Cormorant Garamond (regra `font-loading`). Não há script de terceiro no HTML.

Achados:

- **Uma face de título muito pesada.** `cormorant.CENw2G75.ttf` tem 1 195 560 bytes, peso 500 apenas. Manrope variável tem 164 700 bytes. Regra `font-preload`: pré-carregar só o crítico e não carregar família inteira à toa. Aqui nem é preload de várias faces; é um TTF único grande demais para um título. Gravidade: alta.
- **WebP de uma medida só, e a segunda cena entra inteira.** Na home, as cinco folhas da cumeeira somam cerca de 1,51 MB (a do monte, 630 196 bytes; a das serras, 486 746). Estão no primeiro ecrã, em 1218×810, pedidas a 2496×1664, `loading=auto`, sem `srcset` nem `sizes`. As cinco folhas do koi somam cerca de 1,08 MB e também vêm com `loading=auto`, embora o capítulo esteja abaixo da dobra (a espuma, 617 396 bytes). No blog, árvore 830 118 bytes e tapete 418 462 bytes, de novo sem `srcset`. Regras `image-optimization` e `lazy-load-below-fold`. A guia Astro pede `<Picture>` quando há vários tamanhos (média) e `<Image>` em vez de `<img>` cru (alta): o HTML final é `<img>` para um WebP já processado em `/_astro/`, sem fontes responsivas. Gravidade: alta.
- Não medi CLS com rastreio. O espaço do palco está declarado; não afirmo o valor de CLS.

### 4. Escolha de estilo

O que se vê na home, de cima para baixo: cabeçalho creme; placa 3:2 com dragão vermelho, pagode, serras ocres e pinheiros azuis; folha branca por cima da esquerda, com o nome e dois botões; lista de dois projetos com sombra deslocada; segunda placa, a onda com dois koi; outra folha, “A bagagem vira método.”; faixa “O caderno está abrindo. O arquivo espera o primeiro texto.” No blog: placa da sakura em ramo horizontal com tapete de pétalas; só depois o título e o cartão “Nenhum artigo publicado ainda.”

Isso é um sistema só: papel `#f6f3ec`, borgonha, serifa na folha, sombra dura de poucos pixels, três cenas. Regra `consistency`. Ícones são SVG de traço, sem emoji. Regra `no-emoji-icons`. Há um botão preenchido no hero (“Conheça meu trabalho”) e os outros são contorno. Regra `primary-action`.

Achados:

- **A busca pede outro estilo.** Brutalismo, cantos 0, transição instantânea, Caveat e azul `#2563EB` quebrariam a folha e as três cenas. Não aplicar. A regra `style-match` fica cumprida pelo pedido do dono, não por essa linha do banco. Gravidade da recomendação bruta, se alguém a aplicasse: alta. Gravidade no site atual: o site não seguiu essa linha, e isso está certo.
- **As maquetes novas são outro corte da mesma ideia.** A referência da cumeeira é papel cinza, quadrada, dragão e pagode numa peça só. No ar, a cumeeira é colorida, 3:2, e a folha cobre o corpo do dragão. A referência da sakura é a árvore inteira, centrada, num monte. No ar é um ramo deitado com um tapete de pétalas. O motivo está certo. O acabamento e o enquadramento, não. Regra `style-match` e `effects-match-style`. Gravidade: média.
- O padrão Portfolio Grid (trabalho em grade, filtro, visuais na frente) não é a página. A home é placa, folha e dois capítulos. O padrão de storytelling da busca cabe melhor, com a ressalva que ele mesmo traz: a narrativa tem de funcionar sem efeito de scroll. Não há indicador de progresso de capítulo. Gravidade: baixa.

### 5. Layout e responsivo

O que segura em 1440×900: `scrollWidth` igual a `clientWidth` (1440). Sem scroll horizontal nessa largura. Regra `horizontal-scroll`, só neste viewport. Meta de viewport sem desligar zoom. Regra `viewport-meta`. Corpo a 17 px e entrelinha 1,65. A frase “Experimentos que ganharam forma…” fica em torno de 73 caracteres numa linha de 1325 px, dentro de 60–75. Regras `readable-font-size` (no desktop) e `line-length`.

A home cumpre o pedido da folha estável. O nome, a frase e os botões estão num retângulo `#f6f3ec` de 544×605 px (x=143, y=280), por cima da placa, com sombra. O cenário não é o lugar da frase.

Achados:

- **No blog, a primeira tela não tem a folha.** O `h1` “Notas & descobertas.” começa em y=1165. Numa janela de 900 px de altura, a primeira vista é só o cabeçalho e a sakura. O estado vazio (“O arquivo está pronto…”, “Nenhum artigo publicado ainda.”) vem depois da placa de 812 px. Na home a folha já entra com a placa. Regra `content-priority` e `visual-hierarchy`: o conteúdo principal aparece primeiro. Também é o ponto em que a página se afasta de “texto numa folha estável” e “o cenário não carrega informação”. Gravidade: alta.
- **Abaixo de 800 px o CSS tira a folha de cima da placa** (`position: relative`, largura quase total). Não abri esse viewport. O comportamento em 375 / 768 fica por verificar. Regra `mobile-first` e `breakpoint-consistency`. Gravidade: não classificada, porque não vi a tela.

### 6. Tipografia e cor

O que se vê e o que foi medido:

- Título do hero: Cormorant Garamond, 99,2 px, peso 500, entrelinha 1,08, dentro da folha. Corpo da folha: Manrope 17 px, entrelinha 28,05 px (1,65). A frase do hero: 22,4 px, entrelinha 32,48 px (1,45), largura útil cerca de 33 caracteres (`max-width: 28ch` no CSS).
- “Trabalho em aberto.” é Manrope, 56 px. O `h2` da segunda folha, “A bagagem vira método.”, usa a serifa (regra no CSS de `.method-sheet h2`). O índice fica em sans; a folha, em serifa.
- Tokens no `:root`: `--bg #f6f3ec`, `--text #1c1916`, `--muted #5e574e`, `--accent #7a2f2c`, `--line #d5cdc0`. No escuro, `--bg #171614`, `--text #f3eee6`, `--muted #c1b6a8`, `--accent #e7b2a4`. A folha (`.paper-sheet`) fixa `#1c1916` sobre `#f6f3ec` nos dois temas. Regra `color-semantic`: há tokens. A folha repete o hex em vez de só apontar para o token. Isso mantém o papel claro no tema escuro.
- O par Editorial Classic da busca (Cormorant no título) coincide com o que já está na folha. Caveat + Quicksand, da saída `--design-system`, piora a leitura longa. Não trocar.

Achados:

- **A entrelinha da frase do hero fica em 1,45.** A regra `line-height` pede 1,5–1,75 no texto corrido. O corpo da página está em 1,65. A frase do hero é o trecho que fica curto. Gravidade: baixa.
- **Rótulos entre 12,5 px e 13,6 px.** “em progresso” e os links do rodapé (Currículo, RSS, Privacidade) a 12,8 px. A etiqueta “Todos” no blog a 12,48 px. A legenda da placa a 13,6 px. A linha “Desenvolvimento, dados e inteligência artificial.” no hero a 15,2 px. Nenhum ficou abaixo de 12 px, que é o anti-padrão da skill. O contraste do muted passa 4,5:1. A regra `readable-font-size` pede 16 px no corpo, sobretudo no celular; estes são rótulos, não o parágrafo. Gravidade: baixa.
- A descrição do Micro-RAG, na largura medida de 601 px, passa de cerca de 80 caracteres. A regra `line-length` pede 65–75 no desktop. Gravidade: baixa.
- O acento rosa `#EC4899` da paleta Magazine/Blog não entra. O borgonha do site já passa 4,5:1 sobre o papel e sobre o texto creme do botão.

### 7. Animação

O que está no CSS servido e o que a página fez:

- `@keyframes paper-drift` em cada `.diorama-plane`: `translate` de 0 até `calc(var(--depth) * -3px)` e `calc(var(--depth) * -4px)`, duração `6.4s + depth * 0.35s`, `ease-in-out`, infinita, alternada. São cinco planos na cumeeira e mais cinco na onda. O blog tem dois. Regra `transform-performance`: mexe em `translate`, não em largura nem em `top`.
- Hover e cor usam 0,2 s. O drift usa vários segundos e muda com a profundidade. Não é uma duração única. Regra `duration-timing`.
- `@media (prefers-reduced-motion: reduce)` zera a animação dos planos, a transição do shift, e ainda `animation` e `transition` globais. O script do diorama também marca `data-paused` se a mídia reduzida ou `saveData` estiver ativa, e nesse caso nem mostra o botão. Eu li isso no CSS e no script embutido. Não reabri a página com a mídia forçada, então não vi o estado reduzido acontecer.
- Com movimento ligado, “Pausar movimento” aparece, `aria-pressed="false"`, 44 px de altura.

Achados:

- **O drift é ambiente e está em todos os planos.** A regra `excessive-motion` pede 1–2 elementos animados por vista. A regra `motion-meaning` pede que o movimento explique causa e efeito. Aqui as folhas oscilam sozinhas, o tempo todo, sem relação com a leitura. A folha de texto não entra nessa animação, e isso protege a leitura. Gravidade: média.
- **A pausa fica sob a placa**, como na seção 1. Em 900 px de altura o movimento começa antes do controle. Gravidade: média.
- A guia Astro sugere `<ClientRouter>` e `transition:name` para continuidade entre páginas (regras `continuity` e `shared-element-transition`, severidade média/baixa na stack). O HTML não tem ClientRouter. A navegação é documento inteiro, com URL própria para home, blog, sobre e projetos. Não coloco troca de página animada entre as três mudanças: a regra do repositório já barra GSAP, Lenis e Three nestas páginas, e a própria busca de storytelling manda a leitura funcionar sem efeito de scroll.

## Três mudanças que mais moveriam a página

1. **Trazer a folha para a primeira tela do blog.** Hoje, em 1440×900, a sakura ocupa o palco e “Notas & descobertas.” só começa em y=1165. A home já faz o contrário: a folha com o nome entra junto da placa. O mesmo gesto no blog — título e a frase de arquivo vazio numa folha estável, cenário sem frase — é o que mais muda a leitura. Cabe em `content-priority`.

2. **Aproximar as placas das maquetes que o dono acabou de gerar, sem escrever em cima delas.** A cumeeira no ar é uma ilustração colorida 3:2; a referência é a maquete cinza, quadrada, já montada. A sakura no ar é um ramo deitado; a referência é a árvore inteira. A folha continua sendo o único lugar da frase. Isso muda a primeira impressão mais do que outro ajuste de tipo.

3. **Cortar o peso da primeira carga.** O Cormorant em TTF está em 1,2 MB para um peso. As folhas WebP saem sempre a 2496 px, sem `srcset`. A cena do koi (cerca de 1,08 MB, espuma sozinha em 617 KB) entra mesmo abaixo da dobra. Uma face subsetada e tamanhos reais de imagem, com lazy só no que não está na primeira tela, mudam a espera sem mudar o desenho da folha.

Não entra nesta lista: adotar Caveat, o azul `#2563EB`, o rosa `#EC4899`, depoimentos, logos de cliente ou um e-mail. A busca até sugere prova social num dos padrões de landing. O dono pediu para não inventar isso.

## O que não foi verificado

- About, Projetos, currículo, privacidade, artigo e RSS. Só confirmei HTTP 200 em `/about/` e `/projects/`.
- Larguras 375, 768 e 1024. O CSS tem um corte em 800 px para a folha e para a legenda. Não vi essa tela, nem paisagem, nem zoom de página.
- Tab além do skip link. Não testei a ordem até o rodapé, o foco no tema escuro, nem se o cabeçalho sticky cobre algum link no meio da página. Não cliquei no botão de tema; forcei `data-theme=dark` e olhei o hero.
- `prefers-reduced-motion` e `saveData` em runtime. A regra está no CSS e no script servidos; não forcei a mídia.
- CLS, Lighthouse e uma passagem com leitor de tela. O contraste foi calculado a partir das cores computadas e dos tokens, não com um auditor de página inteira no tema escuro abaixo do hero.
- Se o parallax e o drift cansam depois de vários segundos. Vi o deslocamento pequeno do ponteiro e li a keyframe; não comparei dois fotogramas do drift.
- Formulários, gráficos e o checklist nativo de `pro-rules.md` (iOS/Android). Não se aplicam a estas duas páginas.

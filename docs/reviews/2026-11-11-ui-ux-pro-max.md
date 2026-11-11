# Revisão UI/UX — 11 nov 2026

Revisão só de leitura do preview em `http://127.0.0.1:4401/MYWEBPG/`. Chromium, via Playwright do repositório. Nada no site foi editado. Não rodei Lighthouse.

Antes de cada navegação, `localStorage.theme` foi definido como `light` ou `dark`. Depois do `load`, `html[data-theme]` coincidiu com esse valor nos 48 estados. Todas as respostas foram HTTP 200. Não houve erro de consola. `documentElement.scrollWidth - clientWidth` foi 0 nos 48. O viewport meta é `width=device-width, initial-scale=1` (zoom não está desligado). `lang` é `pt-BR`.

As medidas de caixa, contraste e comprimento de linha foram tiradas no primeiro ecrã, antes de Tab. O contraste usa a cor computada do texto contra o fundo opaco acumulado dos ancestrais. Texto normal precisa de 4,5:1; texto grande (a partir de 24px, ou 18,66px com peso ≥ 700) de 3:1. O pior texto normal ficou em **6,43:1** (`rgb(94, 87, 78)` sobre `rgb(246, 243, 236)`, 14px). Nenhum nó de texto visível ficou abaixo do limiar.

## Buscas na skill

Script: `/home/tj/.grok/skills/ui-ux-pro-max/scripts/search.py`, sem `--persist`. O `No` abaixo é a coluna id do CSV da linha cujo `Issue` ou `Guideline` a busca devolveu.

| Consulta                                            | Resultado usado                                                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `text contrast 4.5` `--domain ux`                   | **36** Color Contrast (High); **76** Contrast Readability (High); **38** Alt Text (High)                                                  |
| `touch target size spacing` `--domain ux`           | **22** Touch Target Size (High); **23** Touch Spacing (Medium); **104** Target Size (Minimum) (High)                                      |
| `astro portfolio` `--stack astro`                   | **0 resultados.** Não há regra com esse texto.                                                                                            |
| Repetição `image islands` `--stack astro`           | **24** Optimize images with astro:assets (High); **25** Use picture for responsive images (Medium); **1** Use Islands Architecture (High) |
| Repetição `portfolio image` `--stack astro`         | **24** e **25** de novo                                                                                                                   |
| `line length characters` `--domain ux`              | **73** Line Length (Medium); **72** Line Height (Medium); **110** Heading Line Balance (Medium)                                           |
| `readable font size mobile` `--domain ux`           | **67** Readable Font Size (High); **74** Font Size Scale (Medium); **22** outra vez                                                       |
| `heading hierarchy skip` `--domain ux`              | **39** Heading Hierarchy (Medium); **45** Skip Links (Medium)                                                                             |
| `focus ring visible` `--domain ux`                  | **28** Focus States (High); **101** Focus Not Obscured (Enhanced) (Medium)                                                                |
| `breakpoint mobile navigation` `--domain ux`        | **65** Breakpoint Testing (Medium); **2** Sticky Navigation (Medium). O outro hit foi Back Button, fora do que se vê nestas páginas.      |
| `non-text contrast button border` `--domain ux`     | Não há regra de borda. Voltou **76**, **36** e Back Button.                                                                               |
| Repetição `ui component contrast 3:1` `--domain ux` | Outra vez **76** e **36**. O terceiro hit foi Depth Layering (VisionOS), fora de assunto.                                                 |
| `persistent navigation labels` `--domain ux`        | **40** ARIA Labels (High); **2** outra vez. O primeiro hit foi Form Labels, e não há campos nestas rotas.                                 |

## Matriz dos 48 estados

Cada linha é o que estava no ecrã inicial desse estado.

| Rota                   | Tema  | Viewport | Observação                                                                                                                             |
| ---------------------- | ----- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                    | light | 1440×900 | H1 «Guilherme Trajano.» a 99,2px, top 246. Cartão absoluto 544×607 sobre palco 1440×812. «Pausar movimento» 183×44 em x=1245.          |
| `/blog/`               | light | 1440×900 | H1 «Notas & descobertas.» a 99,2px, top 320, cartão 544×412. `aria-current` em Blog e em Todos. Arquivo vazio. Lead com 49 caracteres. |
| `/about/`              | light | 1440×900 | H1 «Sobre mim.» top 296. Parágrafo a 18px chega a 83 caracteres, line-height 1,75. Nav marca Sobre.                                    |
| `/projects/`           | light | 1440×900 | H1 «Do problema à prática.» top 296. A seguir só H3 (SDD-Buddy, Micro-RAG), sem H2. Resumo do cartão com 73 caracteres.                |
| `/resume/`             | light | 1440×900 | H1 «Currículo.» top 296. «Imprimir / salvar PDF» 203×52. Prosa a 83 caracteres. H2 Perfil e Experiência profissional no primeiro ecrã. |
| `/privacy/`            | light | 1440×900 | H1 «Privacidade.» a 99,2px, top 196. Parágrafo a 18px, 84 caracteres em 696px de largura, line-height 1,75.                            |
| `/projects/sdd-buddy/` | light | 1440×900 | H1 top 395. Breadcrumb a 14px. Prosa a 80 caracteres. Botões Repositório e «Próximo projeto: Micro-RAG». H2 Contexto depois do H1.     |
| `/projects/micro-rag/` | light | 1440×900 | H1 top 395. Prosa a 81 caracteres. Há Repositório e não há «próximo». H2 Contexto no primeiro ecrã.                                    |
| `/`                    | dark  | 1440×900 | Mesmo enquadramento do claro. Botão «Tema claro» 119×44. O cartão do herói continua creme; o pior texto nele mede 6,43:1.              |
| `/blog/`               | dark  | 1440×900 | `data-theme=dark`. H1 e palco do sakura iguais ao claro. Pausar movimento no canto do diorama. Estado vazio do arquivo.                |
| `/about/`              | dark  | 1440×900 | 83 caracteres no parágrafo longo. Nos 8 primeiros Tabs o outline é 3px `rgb(231, 178, 164)` e o ponto central acerta o controle.       |
| `/projects/`           | dark  | 1440×900 | Projetos sublinhado como página atual. Cartão SDD-Buddy permanece papel claro sobre o fundo escuro. Salto H1→H3.                       |
| `/resume/`             | dark  | 1440×900 | 83 caracteres, 18px, line-height 1,75. Currículo não está na nav principal; o link está no rodapé.                                     |
| `/privacy/`            | dark  | 1440×900 | Os mesmos 84 caracteres e 696px do tema claro. H1, «Métricas de acesso» e «Serviços externos» cabem no primeiro ecrã.                  |
| `/projects/sdd-buddy/` | dark  | 1440×900 | Nav marca Projetos. 80 caracteres na prosa. Hierarquia H1→H2, sem salto.                                                               |
| `/projects/micro-rag/` | dark  | 1440×900 | Meta «11 de nov. de 2025» a 14px. 81 caracteres. H1 depois H2 Contexto.                                                                |
| `/`                    | light | 768×1024 | Nav de secretária `display:none`; menu `display:block`. Palco 768×635. H1 a 53,76px, top 809, ainda dentro dos 1024.                   |
| `/blog/`               | light | 768×1024 | H1 top 786, debaixo de um palco de 635px. Lead medido a 70 caracteres. Menu no lugar dos três links.                                   |
| `/about/`              | light | 768×1024 | H1 top 205 a 53,76px. Linha mais longa: 77 caracteres.                                                                                 |
| `/projects/`           | light | 768×1024 | H1 top 222. H1, H3 e H3 entram no primeiro ecrã. Linha de resumo: 77 caracteres.                                                       |
| `/resume/`             | light | 768×1024 | H1 top 205. Prosa a 77 caracteres. Menu fecha com Escape.                                                                              |
| `/privacy/`            | light | 768×1024 | H1 top 151. Prosa a 78 caracteres. Altura de scroll 1083px.                                                                            |
| `/projects/sdd-buddy/` | light | 768×1024 | H1 top 304. Prosa a 75 caracteres, no limite da regra 73. Tags python, fastapi e react com altura 44.                                  |
| `/projects/micro-rag/` | light | 768×1024 | H1 top 304. Prosa a 75 caracteres. Mesmo padrão de tags ≥44px.                                                                         |
| `/`                    | dark  | 768×1024 | Layout igual ao claro. Menu aberto: Sobre 76×46, Projetos 97×46, Blog 63×46. Escape fecha.                                             |
| `/blog/`               | dark  | 768×1024 | H1 top 786 sobre o sakura. Arquivo vazio. Tema dark confirmado no `html`.                                                              |
| `/about/`              | dark  | 768×1024 | H1 no primeiro ecrã. Menu presente; Escape devolveu `open=false`.                                                                      |
| `/projects/`           | dark  | 768×1024 | H1 e os dois H3 visíveis sem scroll. Salto de heading igual ao claro.                                                                  |
| `/resume/`             | dark  | 768×1024 | H1 e H2 Perfil no primeiro ecrã. Sem overflow.                                                                                         |
| `/privacy/`            | dark  | 768×1024 | H1 top 151. Artigo quase cabe na altura (scroll 1083 contra 1024).                                                                     |
| `/projects/sdd-buddy/` | dark  | 768×1024 | H1 top 304, H2 Contexto visível. Menu com os três destinos ≥44px de altura.                                                            |
| `/projects/micro-rag/` | dark  | 768×1024 | H1 top 304. Prosa a 75 caracteres. Tema dark, overflow 0.                                                                              |
| `/`                    | light | 390×844  | Palco 390×390. H1 a 43,2px, top 602. «Pausar movimento» em x=195, largura 183 (cabe; borda direita ~378). Header 88px numa linha.      |
| `/blog/`               | light | 390×844  | H1 a 43,2px, top 579. Palco quadrado de 390. Pausar movimento no mesmo canto. Lead ~39–40 caracteres.                                  |
| `/about/`              | light | 390×844  | H1 top 184. Prosa ~37–40 caracteres. Ações Currículo, GitHub, LinkedIn e X.                                                            |
| `/projects/`           | light | 390×844  | H1 top 210. SDD-Buddy entra no primeiro ecrã; Micro-RAG não. Vão entre tags 7,6px.                                                     |
| `/resume/`             | light | 390×844  | H1 top 184. Linhas ~36–40 caracteres. Scroll da página 2620px.                                                                         |
| `/privacy/`            | light | 390×844  | H1 top 136. Linhas ~37–40 caracteres. Scroll 1320px.                                                                                   |
| `/projects/sdd-buddy/` | light | 390×844  | H1 top 283. Prosa ~35 caracteres. Tags python, fastapi e react na mesma faixa.                                                         |
| `/projects/micro-rag/` | light | 390×844  | H1 top 283. Prosa ~37 caracteres. Scroll 2803px.                                                                                       |
| `/`                    | dark  | 390×844  | Igual ao claro no lugar do H1 e do palco. «Tema claro» 98×44. Nota do diorama a 14px.                                                  |
| `/blog/`               | dark  | 390×844  | H1 abaixo do sakura. Tag Todos e cartão «Nenhum artigo publicado ainda». «Página 1 de 1».                                              |
| `/about/`              | dark  | 390×844  | Coluna ~40 caracteres. Header 88px. Overflow 0.                                                                                        |
| `/projects/`           | dark  | 390×844  | H1 visível. Tag «busca-em-documentos» 174×44 ao lado de fastapi, vão 7,6px.                                                            |
| `/resume/`             | dark  | 390×844  | H1 top 184. Sem overflow. Currículo continua fora da nav principal.                                                                    |
| `/privacy/`            | dark  | 390×844  | H1 no topo do miolo. Menu e tema na mesma barra de 88px.                                                                               |
| `/projects/sdd-buddy/` | dark  | 390×844  | Breadcrumb e «em progresso» a 14px. H1 depois H2. Overflow 0.                                                                          |
| `/projects/micro-rag/` | dark  | 390×844  | H1 top 283. Tags fastapi e busca-em-documentos. Scroll 2803px, overflow 0.                                                             |

Nos 24 estados com largura ≤800, o menu abriu e Escape fechou (`details.open` voltou a falso). Alvos interativos visíveis medidos no documento: nenhum abaixo de 44×44. A regra web **104** pede 24×24; a **22** pede 44pt / 48dp e manda usar a regra web à parte. Os dois limiares passam.

## Achados

### 1. Médio — linhas de prosa acima de 75 caracteres

- **Regra:** ux **73**, Line Length. Fazer: limitar a 65–75 caracteres por linha. Não fazer: texto na largura toda do ecrã. Severidade no CSV: Medium.
- **Onde:** about, resume e privacy, nos dois temas, a 1440×900. Também sdd-buddy e micro-rag, nos dois temas, a 1440×900. Em 768×1024, home, about, projects, resume e privacy, nos dois temas.
- **Medido:** o parágrafo mais largo de privacy, nos dois temas a 1440×900, tem **84 caracteres** em **696px**, fonte **18px**, line-height **1,75**. About e resume a 1440×900: **83**. sdd-buddy: **80**. micro-rag: **81**. A 768×1024: home, about, projects e resume **77**; privacy **78**. sdd-buddy e micro-rag a 768 ficam em **75**, no limite, e não entram neste achado. A 390×844 a prosa fica entre 34 e 40 caracteres.
- O corpo não está na largura da janela (há coluna), mas 72ch de «0» ainda rende mais letras do que o teto da regra.

### 2. Médio — a listagem de projetos salta de H1 para H3

- **Regra:** ux **39**, Heading Hierarchy. Fazer: níveis seguidos, h1–h6. Não fazer: saltar níveis. Severidade no CSV: Medium.
- **Onde:** `/projects/`, light e dark, 1440×900, 768×1024 e 390×844 (6 estados).
- **Medido:** a árvore de headings dessa rota é só `H1` «Do problema à prática.», `H3` «SDD-Buddy», `H3` «Micro-RAG». Não há `H2`. Nas fichas `/projects/sdd-buddy/` e `/projects/micro-rag/` o H2 «Contexto» segue o H1. Na home há H2 antes dos H3. No blog só existe o H1, porque não há artigos; isso não é salto.

### 3. Baixo — vão de 6,4px entre links da navegação

- **Regra:** ux **23**, Touch Spacing. Fazer: vão mínimo de 8px. Não fazer: alvos colados. Severidade no CSV: Medium. Baixei para baixo: o défice é 1,6px e cada alvo já tem altura ≥45,7px e largura ≥62,6px.
- **Onde:** as 8 rotas, light e dark, a 1440×900 (nav visível). Menu aberto medido à parte em `/projects/` dark, 768×1024 e 390×844.
- **Medido a 1440×900:** Sobre **75,6×45,7**, vão **6,4px**, Projetos **96,6×45,7**, vão **6,4px**, Blog **62,6×45,7**. Igual nas 16 combinações de rota e tema.
- **Medido no menu aberto** (projetos, dark): Sobre **76×46** em x=16, vão **6,4px**, Projetos **97×46**, vão **6,4px**, Blog **63×46**. O `gap` do componente é o mesmo nas outras rotas; o número com o menu aberto só foi medido nesse par.

O vão de **7,6px** entre tags (por exemplo busca-em-documentos 174,4×44 e fastapi 67,4×44) fica a 0,4px do mínimo e não entra como falha.

### 4. Baixo — frases de apoio da home a 14px

- **Regra:** ux **67**, Readable Font Size. Fazer: corpo com no mínimo 16px no telemóvel. Não fazer: texto minúsculo. Severidade no CSV: High. Baixei para baixo: não é o corpo (o corpo está a 18px), o contraste desse cinza é 6,43:1 e 14px não é o `text-xs` do exemplo negativo. A regra **74** (Font Size Scale) inclui 14 na escala, por isso meta, tags e rodapé a 14px não entram aqui.
- **Onde:** `/`, light e dark, nos três viewports.
- **Medido:** `p.intro-line`, `p.hero-note` e a nota `.muted` da legenda do diorama estão a **14px** nos seis estados. Exemplo no escuro a 390×844: «Curiosidade como ponto de partida…» e «Seis folhas no mesmo quadro…». Cor `rgb(94, 87, 78)` sobre `rgb(246, 243, 236)`, razão **6,43:1**.

### 5. Baixo — entrelinha do enunciado da home a 1,45

- **Regra:** ux **72**, Line Height. Fazer: 1,5–1,75 no texto de corpo. Severidade no CSV: Medium. Baixei para baixo: é um enunciado curto, não a prosa, e o corpo medido está a 1,65 e a prosa a 1,75.
- **Onde:** `/`, light, 768×1024. É o único estado em que calculei a razão computada. O mesmo parágrafo aparece nos outros cinco estados da home; não repeti a conta de pixels neles.
- **Medido:** `.hero-statement`, `font-size` **18,4px**, `line-height` **26,68px**, razão **1,45**.

## Contagem

- Altos: **0**
- Médios: **2**
- Baixos: **3**

## Medido e não classificado como achado

- Contraste de texto (regras **36** e **76**): nenhum texto visível abaixo de 4,5:1 (normal) ou 3:1 (grande). Pior caso 6,43:1.
- Alvos (regras **22** e **104**): nenhum controle visível abaixo de 44×44. O menu aberto também fica acima disso.
- Foco (regras **28** e **101**): nos primeiros 8 Tabs de cada estado o outline computado é `solid 3px` na cor de acento (claro `rgb(122, 47, 44)`, escuro `rgb(231, 178, 164)`), offset 5px. O controle estava no ecrã e `elementFromPoint` acertou nele. O skip link «Pular para o conteúdo» aparece ao foco (regra **45**).
- Cabeçalho sticky (regra **2**): altura 88px; o miolo começa em y=88, não por baixo da barra.
- Imagens (regra **38**, astro **24**): as folhas do diorama são WebP via `astro:assets`, com `width` e `height`, `alt=""`. A figura tem legenda visível e um texto só para leitor de ecrã. Não tratei `alt=""` como falha porque a imagem é camada decorativa com alternativa no `figure`. A regra **25** pede `<Picture>` para art direction e recusa `<Image>` de um só tamanho; aqui o `<Image>` traz várias larguras (480, 828, 1248, 2400), não um único tamanho. Não há violação dessa frase.
- Ilhas (astro **1**): o documento não hidrata a página inteira. Não vi um cliente global a transformar o site numa SPA.
- Borda dos botões secundários e do alternador de tema: preenchimento transparente ou igual ao header, borda de 1px. Razão borda/fundo do pai entre **1,25:1** (tema claro, header `rgb(235, 228, 216)` / borda `rgb(213, 205, 192)`) e **1,55:1** (tema escuro). As duas buscas de contraste de componente não devolveram regra de borda; o texto desses botões não falha 4,5:1. Fica de fora dos achados.
- «Pausar movimento» a 390×844 mede 183×44 e cobre o canto superior direito do palco de 390px. Não há regra, entre as buscas, que proíba esse overlay. Não corta a viewport.
- Links dentro do `<details>` fechado, a 768, ainda reportam caixa (~51×46) e `display:flex`, mas `innerText` vem vazio, Playwright `isVisible()` é falso, o hit-test acerta o diorama, e o snapshot ARIA do header fechado só expõe o grupo «Menu», não os três links. Não são alvo visível.

## O que não testei

- Lighthouse, zoom a 200% ou 400%, e retrato além de 768×1024 e 390×844.
- `prefers-reduced-motion`, `prefers-contrast` e impressão (o botão de imprimir existe no currículo; o diálogo não foi aberto).
- Leitor de ecrã real. O snapshot ARIA foi só do header, a 390, tema claro, menu fechado.
- Teclado além dos primeiros 8 Tabs, do skip link e do Escape no menu. Não percorri o fim da página até o rodapé em todos os estados.
- Firefox, WebKit, telemóvel físico, safe area e barra do browser.
- Rotas fora das oito: 404, tags, artigo (não há artigo publicado; o blog mostra o estado vazio).
- CLS, rede lenta e `font-display`. Manrope e Cormorant Garamond constavam como `loaded` depois de `document.fonts.ready`; não medi flash de texto invisível.
- Contraste de píxeis da ilustração por baixo do botão de pausar. O texto do herói está num cartão opaco, não sobre a imagem.
- Formulários, erros e autenticação: estas rotas não têm campos. Com as métricas desligadas, a privacidade não mostra os botões de consentimento.

# Revisão R2 — design-taste-frontend

## 1. Cabeçalho

- Data: 2026-11-10
- Skill: design-taste-frontend (modo REVIEW, "Redesign, restyle or review of an existing page")
- Git HEAD: b951c09 (branch feat/astro-content-boilerplate)
- Alvo: build de produção em http://127.0.0.1:4322/MYWEBPG/ (porta 4322 apenas)
- Ferramentas: `inspect.mjs` (tema claro, 1440/768/390, uma pasta por rota em `.taste-skill/r2-taste/<rota>/`), `lint.mjs` em `src/pages` e `src/styles` (`.taste-skill/r2-taste/lint.txt`), e Playwright próprio (`dark.mjs`, `dark2.mjs`, `font.mjs`) para tema escuro, reduced-motion, contraste e rolagem.
- Aberto e medido:
  - Home e blog: claro e escuro, 1440, 768 e 390. Reduced-motion em 1440.
  - about, projects, projects/sdd-buddy, resume, privacy e 404: claro (inspetor) e escuro (Playwright) em 1440 e 390.
  - Todas as capturas que o inspetor listou foram abertas.
- Regras do dono lidas antes: AGENTS.md e "Exceções ao inspetor (D4)" em DESIGN.md.

## 2. O que a página é

Portfólio e blog de uma pessoa (Guilherme Trajano, "Desenvolvimento, dados e inteligência artificial"). O visitante vê um cartão de papel com o nome em serifa grande ao lado de um diorama de papel em IA (dragão e pagode), depois uma faixa de projetos, uma onda com carpas e uma chamada final. O blog ainda não tem artigos e as páginas internas são folhas de texto em coluna única, sem imagem.

## 3. Achados, por severidade

1. **Alta. Home, tema escuro, todos os viewports.** O tema escuro só escurece o cabeçalho e o fundo do `body` (`rgb(23,22,20)`). Medido em 1440 e em 390: `.opening`, `.paper-band`, `.koi-chapter` e `footer` continuam em `#f3ecdf` / `#f6f3ec` com texto `#1c1916`. O botão "Tema claro" promete uma troca que a home não entrega. Evidência: `home-dark-desktop-full.png`, `home-dark-desktop-s1.png`, `home-dark-mobile-fold.png`. Causa: `.opening` e `.paper-band` fixam cores literais (`src/styles/global.css:~671-690`) e `--paper` é igual nos dois temas (`src/styles/tokens.css:28,45`).
2. **Alta. Blog, tema escuro, 1440/768/390.** A legenda do palco fica quase invisível. "Sakura" tem contraste 1,02:1 e "Oito folhas no mesmo quadro. Ilustração com IA." tem 1,70:1 (medidos). O palco continua creme e o texto usa `--text` claro do tema escuro. Evidência: `blog-dark-desktop-full.png`, `dark-results.json`. Mesma causa do item 1: o palco não redefine `--text`/`--muted` no escuro.
3. **Alta. Home, claro e escuro, 390.** O diorama do herói mede 168×168 px dentro de uma figura de 366 px; o botão "Pausar movimento" (156×74 px) cobre a maior parte dessa imagem. A primeira tela móvel mostra o cartão de texto inteiro e uma imagem pequena sob um botão. Evidência: `home/mobile-fold.jpg`, medida em `font.mjs` (img 111,596,168,168; botão 111,608,156,74). Em 1440 o herói tem 41% de mídia.
4. **Alta. Todas as rotas, claro.** Sombra de repouso: todo cartão ("folha") tem uma segunda camada deslocada de 6–8 px em tom `--sheet-under` (cartão do herói, "Trabalho em aberto", "O caderno está abrindo", folhas de about/resume/privacy/projeto, cartão vazio do blog). A skill proíbe sombra em objeto em repouso e limita a nota a 6,5. Evidência: `home/desktop-page-01.jpg`, `about/desktop-page-01.jpg`. Causa provável: `src/styles/global.css:458,758` e `src/styles/typography.css:68` (não confirmei a linha exata do deslocamento). Nenhum `box-shadow` no CSS (grep vazio); o efeito vem de camada deslocada.
5. **Alta. about, projects, sdd-buddy, resume, privacy, 404, 1440 e 390.** O inspetor reporta FAIL `few-pictures` (0 imagens) e `still-page` (0 elementos em movimento) nas seis rotas. Em projects, sdd-buddy e 404 há também FAIL `eyebrow` ("PORTFÓLIO / PROJETOS", "em progresso", "404 / FORA DO ARQUIVO"; em maiúsculas com tracking em projects e 404). Evidência: `<rota>.txt`. Código: `src/pages/404.astro:13`, `src/pages/projects/index.astro:15`, `src/styles/global.css:115`.
6. **Média. Blog, 1440/768/390.** A página é um estado vazio: "Nenhum artigo publicado ainda." dentro de um cartão, uma pílula "Todos" (filtro sem nada para filtrar, 1 de 1) e "Página 1 de 1". O herói diz "O arquivo está pronto" sem haver arquivo. Conteúdo vazio, não lorem. Evidência: `blog/desktop-page-01.jpg`.
7. **Média. Home, 1440.** Sobram duas seções fracas: "O caderno está abrindo." (um cartão à esquerda e metade da largura vazia; o inspetor marca `lopsided` em 768 com 436 px vazios) e "Trabalho em aberto" com dois cartões em escada (o segundo recuado 26 px). Margens desiguais medidas pelo inspetor: 48 px à esquerda e 26 px à direita em 1440 (home e blog); 20 px e 34 px em 390 (about, projects, sdd, resume). Evidência: `home/desktop-page-01.jpg`, `home/tablet-page-01.jpg`.
8. **Média. Projects e 404, 1440.** Herói com 46% (projects) e 43% (404) da primeira tela vazios (`hero-void`). Evidência: `projects/desktop-page-01.jpg`, `n404/desktop-page-01.jpg`.
9. **Média. Texto de corpo cinza.** `grey-body` em home, blog, projects (6,4:1; 5,6:1 em 768 no sdd). Abaixo dos 7:1 que a skill pede. Rótulos pequenos de 14 px ("em progresso", "python / fastapi / react", "Curiosidade como ponto de partida") sobre cartões. Tamanho mínimo medido: 14 px.
10. **Baixa. Tipografia.** O acento circunflexo do "ê" em "você" e em "Experiência" aparece alto e fino, quase destacado da letra, em Cormorant 500 com entrelinha 1,08. A fonte carregada é só a Cormorant (sem fallback no rodapé, conferido por CDP: 27 glifos Cormorant). Não achei a causa; pode ser o desenho do glifo no subset de 19 KB. Evidência: `home-light-desktop-s2.png`.
11. **Baixa. Menu móvel.** Em 390 e 768 o menu é um `<summary>` com o triângulo nativo ("▶ Menu"), fora do estilo do resto. Evidência: `home/mobile-fold.jpg`.
12. **Baixa. Linhas e rótulos.** Lint: 4 FAIL (`eyebrow` ×3; `mono` em `src/styles/tokens.css:13`, token `--font-mono` declarado; não verifiquei se é usado) e 5 WARN de caixa com borda de 1 px (`src/styles/diorama.css:57`, `src/styles/global.css:216,242`, `src/styles/typography.css:34,80`). Os botões secundários e as pílulas de tag usam esse contorno.
13. **Baixa. Sem vídeo e pouco movimento.** `no-footage` em todas as rotas (exceção registrada do dono). `still-page` na home (11 elementos) e no blog (8). Reduced-motion: o botão "Pausar movimento" some e o palco fica estático; o conteúdo aparece completo (`home-reduced-fold.png`, 0 animações CSS em execução).

O que funciona: título claro e `h1` em duas linhas em todas as rotas e viewports (99,2 px em 1440; 43,2 px em 390); um botão primário real na primeira tela; sem overflow horizontal em nenhuma combinação medida (`scrollWidth` = largura da janela); contraste de texto OK nas internas escuras; duas famílias (Manrope e Cormorant); dioramas autorais de alta qualidade com o mesmo tratamento; interno escuro funciona em about, projects, resume, privacy e 404.

Peso e fontes: Cormorant em WOFF2 de 19 KB; Manrope em TTF de 161 KB sem compressão de fonte (`src/assets/fonts/manrope.ttf`). Em `dist/_astro` há 8 MB de WebP somando todas as variantes responsivas; o maior arquivo isolado tem 677 KB (`03-espuma`). Não medi a transferência por página.

## 4. Notas

Escala da skill: design 40%, usabilidade 30%, criatividade 20%, conteúdo 10%. Fórmula: `0,4·D + 0,3·U + 0,2·C + 0,1·T`.

Tetos que valem aqui:

- Sombra em repouso visível (achado 4) e rótulos pequenos acima de títulos: nota geral máxima 6,5.
- Qualquer FAIL do inspetor: máximo 6,0 (about, projects, sdd, resume, privacy, 404).
- Pass 3 (cubra o logo) e pass 14 (concorrente): o diorama de papel é bonito mas poderia estar em qualquer portfólio de dev com arte de IA. Criatividade máxima 7; usei 6,5.
- Sem coisa viva (só o botão de pausa): criatividade máxima 7,5, não restringe.
- Menos de quatro imagens reais: design máximo 6,5 nas seis rotas internas. Home tem 11 imagens (camadas do diorama), blog 8.

Round 1, home e blog (leitura em 1440, 768 e 390):

```
ROUND 1 — home
Seen in one second: o diorama cinza do dragão e o nome em serifa grande.
Idea (one sentence): na página, o arquivo de papel (o diorama em folhas) vira o palco com camadas em paralaxe.
Live thing: nenhuma além do botão "Pausar movimento" e do tema; a paralaxe é decoração.
Layout words by section: hero=split / Trabalho em aberto=lista / koi=cartão sobre quadro cheio / caderno=cartão solto / rodapé=nome + links
Scores claro: design 6,5 · usabilidade 7 · criatividade 6,5 · conteúdo 6 → 0,4·6,5 + 0,3·7 + 0,2·6,5 + 0,1·6 = 6,60
Caps applied: sombra de repouso visível → 6,5. Nota final: 6,5.
Scores escuro: design 5,5 · usabilidade 6,5 · criatividade 6,5 · conteúdo 6 → 2,2 + 1,95 + 1,3 + 0,6 = 6,05. Nota final: 6,0 (sem arredondar para cima).
Top three problems:
1. O tema escuro da home só escurece o cabeçalho (home-dark-desktop-s1.png).
2. Em 390 o diorama do herói tem 168 px e o botão "Pausar movimento" o cobre (home/mobile-fold.jpg).
3. Cartões com camada deslocada em repouso e "O caderno está abrindo." com meia largura vazia (home/desktop-page-01.jpg).

ROUND 1 — blog
Seen in one second: a cerejeira rosa.
Idea (one sentence): na página, o arquivo de notas vira um diorama de papel por estação (sakura).
Live thing: nenhuma.
Layout words by section: hero=split / lista=estado vazio / rodapé=nome + links
Scores claro: design 6 · usabilidade 6,5 · criatividade 6,5 · conteúdo 5 → 2,4 + 1,95 + 1,3 + 0,5 = 6,15
Caps applied: sombra de repouso → 6,5 (não limita aqui). Nota final: 6,15.
Scores escuro: design 5,5 · usabilidade 6 · criatividade 6,5 · conteúdo 5 → 2,2 + 1,8 + 1,3 + 0,5 = 5,80
Caps applied: nenhum além da conta. Nota final: 5,8.
Top three problems:
1. Legendas ilegíveis no escuro: 1,02:1 e 1,70:1 (blog-dark-desktop-full.png).
2. A lista é um estado vazio com uma pílula "Todos" e "Página 1 de 1" (blog/desktop-page-01.jpg).
3. Cartão vazio com camada deslocada e herói que afirma "O arquivo está pronto" (blog/desktop-page-01.jpg).
```

Rotas internas (uma passada, 1440 e 390; as notas valem para claro e escuro, que não diferem em contraste medido):

| Rota               | D   | U   | C   | T   | Conta | Teto       | Nota |
| ------------------ | --- | --- | --- | --- | ----- | ---------- | ---- |
| about              | 6   | 7   | 5,5 | 5,5 | 6,15  | FAIL → 6,0 | 6,0  |
| projects           | 5,5 | 6,5 | 5,5 | 5   | 5,75  | 6,5        | 5,75 |
| projects/sdd-buddy | 5,5 | 7   | 5,5 | 6   | 6,00  | FAIL → 6,0 | 6,0  |
| resume             | 6   | 7   | 5,5 | 6   | 6,20  | FAIL → 6,0 | 6,0  |
| privacy            | 6   | 7,5 | 5   | 6,5 | 6,30  | FAIL → 6,0 | 6,0  |
| 404                | 5,5 | 6,5 | 5,5 | 6   | 5,85  | 6,5        | 5,85 |

Resumo: home 6,5 claro e 6,0 escuro; blog 6,15 claro e 5,8 escuro. O inspetor deu 0 FAIL em home e blog e 2 a 3 FAIL em cada rota interna, mas a leitura das capturas pesa mais que o medidor.

## 5. Conflitos entre a skill e as regras do dono

- GSAP, smooth scroll, Three.js e ícones por biblioteca (Iconify): o dono proíbe ou não adota. A skill pede uma camada de movimento rica; não recomendo nenhum deles. O item de movimento da skill (`still-page`) fica reprovado por essa razão e é registrado como exceção, mas o dono não proíbe movimento em CSS.
- `palette-cream` e `no-footage`: exceções registradas em DESIGN.md. A skill as marca como WARN; vale a regra do dono. Não recomendo vídeo.
- Conteúdo inventado: a skill aceita "sample details" e pede seções completas; AGENTS.md proíbe inventar experiência ou resultados e publicar rascunhos. Vale AGENTS.md. Por isso o blog vazio e o texto curto das páginas não são tratados como falha de invenção; contam como conteúdo curto, não como placeholder.
- Fotos de acervo aberto (assets.mjs): não recomendo trazer imagens de fora para preencher as páginas internas; o dono criou os dioramas. As recomendações reusam esses dioramas.
- `few-pictures` nas rotas internas: continua reprovado pela skill. Não é conflito, porque reusar um diorama existente não inventa conteúdo.

## 6. Recommendations

1. **Fix the dark theme on the home page.**
   - Change `src/styles/global.css` (`.opening`, `.paper-band`, `.koi-chapter`, `footer`) and `src/styles/tokens.css` (`--paper`).
   - Replace each literal colour with a token.
   - Define the token values for the dark theme.
   - Acceptance test: Set localStorage `theme` to `dark` and open `/MYWEBPG/`. Check that no section background is lighter than `#3c3832`. Check that body text has contrast of at least 7:1.
2. **Fix the stage captions in dark mode on the blog.**
   - Change `src/styles/diorama.css` or the `.opening` rule so the caption colour follows the stage background.
   - Acceptance test: Open `/MYWEBPG/blog/` in the dark theme. Measure "Sakura" and the caption below the picture. Confirm a contrast of at least 4.5:1.
3. **Enlarge the mobile hero picture and move the pause button.**
   - Change `src/components/motion/PlateStage.astro` and `src/styles/diorama.css`.
   - Make the picture fill the width of its figure at 390 px.
   - Place the "Pausar movimento" button below the picture or in a corner that covers less than 10% of it.
   - Acceptance test: Open `/MYWEBPG/` at 390×844. Check that the picture is at least 340 px wide. Check that the button covers less than 10% of the picture.
4. **Remove the offset layer under each sheet.**
   - Change `src/styles/global.css` (lines 458 and 758) and `src/styles/typography.css` (line 68).
   - Use one flat surface in a different tone.
   - Acceptance test: Open any route at 1440 px. Check that no card shows a second layer offset from its edge. Run `node scripts/inspect.mjs` from the skill and compare the screenshots.
5. **Clear the inspector failures on the six inner routes.**
   - Delete the labels in `src/pages/404.astro:13`, `src/pages/projects/index.astro:15` and `src/styles/global.css:115`.
   - Put one existing diorama in the header of each inner page.
   - Add an entrance animation with CSS only.
   - Reuse existing files in `src/assets/diorama/`.
   - Acceptance test: Run the skill `inspect.mjs` on each route. Check that the result shows 0 FAIL. Check that `prefers-reduced-motion` keeps all content visible.

## 7. O que não foi verificado

- Não abri o servidor de desenvolvimento (porta 4321) e não rodei build, validate ou testes.
- Não medi transferência real por página nem LCP; só o tamanho dos arquivos em `dist/`.
- Não confirmei a linha exata da camada deslocada (achado 4) nem a causa do acento circunflexo alto (achado 10).
- Não verifiquei se `--font-mono` (`src/styles/tokens.css:13`) é usado em algum seletor.
- O inspetor só carrega o tema claro. O escuro foi medido por Playwright (fundos, contraste de texto, overflow) e visto em capturas; não rodei as regras completas do inspetor no escuro.
- Reduced-motion foi checado em 1440 na home e no blog. Não filmei a rolagem, e o movimento real do palco (paralaxe) não foi medido.
- Tablet (768) só foi avaliado em home e blog; as outras rotas ficaram em 1440 e 390.
- Os cliques em menu, filtro e botão de pausa não foram exercitados além do que as capturas mostram.
- Contraste medido por script próprio sobre o fundo computado do elemento; texto sobre imagem pode distorcer esse número. A legenda do blog foi confirmada à vista.

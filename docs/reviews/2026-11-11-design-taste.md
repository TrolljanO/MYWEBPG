# Crítica de gosto — 2026-11-11

Revisão do site no ar, sem correção. Preview `http://127.0.0.1:4401/MYWEBPG/`. Chromium do Playwright (`chrome-linux64`, Chrome for Testing 158). Tema aplicado antes da navegação com `localStorage.theme`; nos 48 estados `html[data-theme]` coincidiu com o pedido.

`inspect.mjs` não tem bandeira de tema. Rodou no tema padrão do browser, que pintou claro (`#f6f3ec`, botão «Tema escuro»):

- Home: 0 FAIL, 5 WARN. Folhas em `.taste-skill/before/home/`.
- Blog: 1 FAIL (`eyebrow` a 390 px), 5 WARN. Folhas em `.taste-skill/before/blog/`.

O escuro não passou pelo inspector. As notas de escuro vêm das capturas em `.taste-skill/states/`. Não há `direction.json`; nada foi dispensado com `--allow`.

`lint.mjs src`: 1 FAIL `mono` em `src/styles/tokens.css` (variável `--font-mono`) e 5 WARN `outlined-box` (borda de 1 px). No render medido, `monoShare` foi 0. A borda de 1 px aparece nos botões.

## Matriz — 48 estados abertos

Todos devolveram HTTP 200. `data-theme` bateu com o tema pedido. `scrollWidth` não passou de `clientWidth` em nenhum. Nenhuma heading medida ficou com 3 linhas ou mais. «Telas» é o número de fatias de viewport gravadas (dobra mais scroll).

| Rota                   | Tema  | 1440×900                            | 768×1024               | 390×844                |
| ---------------------- | ----- | ----------------------------------- | ---------------------- | ---------------------- |
| `/`                    | light | 200 · light · 4 telas · h1 2 linhas | 200 · light · 4 · h1 2 | 200 · light · 5 · h1 2 |
| `/`                    | dark  | 200 · dark · 4 · h1 2               | 200 · dark · 4 · h1 2  | 200 · dark · 5 · h1 2  |
| `/blog/`               | light | 200 · light · 2 · h1 2              | 200 · light · 2 · h1 1 | 200 · light · 2 · h1 1 |
| `/blog/`               | dark  | 200 · dark · 2 · h1 2               | 200 · dark · 2 · h1 1  | 200 · dark · 2 · h1 1  |
| `/about/`              | light | 200 · light · 3 · h1 1              | 200 · light · 2 · h1 1 | 200 · light · 3 · h1 1 |
| `/about/`              | dark  | 200 · dark · 3 · h1 1               | 200 · dark · 2 · h1 1  | 200 · dark · 3 · h1 1  |
| `/projects/`           | light | 200 · light · 2 · h1 2              | 200 · light · 2 · h1 2 | 200 · light · 3 · h1 2 |
| `/projects/`           | dark  | 200 · dark · 2 · h1 2               | 200 · dark · 2 · h1 2  | 200 · dark · 3 · h1 2  |
| `/resume/`             | light | 200 · light · 3 · h1 1              | 200 · light · 2 · h1 1 | 200 · light · 4 · h1 1 |
| `/resume/`             | dark  | 200 · dark · 3 · h1 1               | 200 · dark · 2 · h1 1  | 200 · dark · 4 · h1 1  |
| `/privacy/`            | light | 200 · light · 2 · h1 1              | 200 · light · 2 · h1 1 | 200 · light · 2 · h1 1 |
| `/privacy/`            | dark  | 200 · dark · 2 · h1 1               | 200 · dark · 2 · h1 1  | 200 · dark · 2 · h1 1  |
| `/projects/sdd-buddy/` | light | 200 · light · 3 · h1 1              | 200 · light · 3 · h1 1 | 200 · light · 4 · h1 1 |
| `/projects/sdd-buddy/` | dark  | 200 · dark · 3 · h1 1               | 200 · dark · 3 · h1 1  | 200 · dark · 4 · h1 1  |
| `/projects/micro-rag/` | light | 200 · light · 3 · h1 1              | 200 · light · 3 · h1 1 | 200 · light · 4 · h1 1 |
| `/projects/micro-rag/` | dark  | 200 · dark · 3 · h1 1               | 200 · dark · 3 · h1 1  | 200 · dark · 4 · h1 1  |

H1 medido a 1440: home «Guilherme Trajano.» 99,2 px, 2 linhas; blog «Notas & descobertas.» 99,2 px, 2 linhas; projetos «Do problema à prática.» 99,2 px, 2 linhas; sobre, currículo, privacidade e os dois casos, 99,2 px, 1 linha. A 768 o h1 da home continua em 2 linhas (53,8 px no inspector). A 390, idem (43,2 px).

## O que o inspector mediu (tema claro)

Home, 1440×900. Título «Guilherme Trajano.» Cormorant Garamond 500, 99,2 px (6,9 vw), tracking −0,03 em, entrelinha 1,08, 2 linhas. A 768: 2 linhas, 53,8 px. A 390: 2 linhas, 43,2 px. Faces: Manrope 92%, Cormorant 8%. Tamanhos: 14 / 18 / 24 / 27 / 56 / 99 px. Corpo 18 px. Página 3,7 telas, 253 palavras, 11 imagens, 0 vídeo. Herói com mídia em cerca de 90% da dobra. Margens do quadro: 54 px à esquerda, 12 px à direita. Movimento: 11 elementos CSS, 0 transição, 0 script, 0 vídeo. Preenchimento das telas desktop: 0,86 · 0,28 · 0,77 · 0,31. Contraste do corpo amostrado: 6,4:1 a 1440 e 15,8:1 a 768. A caixa da seção «O caderno está abrindo.» foi medida com esquerda 82 px e direita 891 px. Sem overflow horizontal. Sem erro de consola.

Blog, 1440×900. Título «Notas & descobertas.» 99,2 px, 2 linhas; a 768 e a 390, 1 linha (53,8 px e 43,2 px). Manrope 82%, Cormorant 18%. Corpo amostrado 24 px, contraste 6,4:1 nos três largos. Página 2 telas, 92 palavras, 8 imagens, 1 canvas, 0 vídeo. Margens 56 px / 26 px. Movimento: 8 elementos. FAIL só a 390: o rótulo «Sakura» acima de «Notas & descobertas.»

WARN comuns: fundo creme `#f6f3ec` (`palette-cream`), texto corrido abaixo de 7:1 (`grey-body`), sem vídeo (`no-footage`), margens desiguais (`off-centre`), pouca movimento (`still-page`, aviso, não falha). O inspector não reportou sombra, gradiente, mono visível, numeração 01/02/03, nem headline de 3 linhas. Não há `box-shadow` nas folhas de `src/styles/`. O segundo fio por baixo dos cartões é um degrau de papel (`--sheet-under`), não uma sombra medida.

As 11 e 8 «imagens reais» do inspector são folhas de diorama (céu, nuvens, serra, monte, dragão, onda, koi, sakura). A legenda na página diz «Ilustração com IA». Para o teto de desenho, desenho não conta como fotografia.

## ROUND 1 — Home, claro

Seen in one second: um dragão de papel e o nome Guilherme Trajano num cartão à esquerda.

Idea (one sentence): o portfólio é uma pilha de pranchas de papel (cumeeira, onda, caderno) e o nome senta na primeira.

Live thing: a prancha mexe e há um botão «Pausar movimento» (44 px de altura). Não cliquei nele.

Layout words by section: hero=split / trabalho=list / koi=split / caderno=band / footer=split

Scores: design 6.5 · usability 8 · creativity 7 · content 7 → overall 6.5

A conta antes do teto de conjunto era 0,4·6,5 + 0,3·8 + 0,2·7 + 0,1·7 = 7,1.

Caps applied:

- Menos de quatro fotografias (as pranchas são ilustração): design não passa de 6,5. Fica 6,5.
- Margens desiguais, 54 px e 12 px a 1440: design não passa de 6,5.
- `still-page` (11 elementos): design não passaria de 7. O teto das fotos é mais baixo.
- A frase «Desenvolvimento, dados e inteligência artificial.» está acima do h1, mas é uma frase, não um rótulo curto; o inspector não a marcou como sobrancelha. O rótulo «em progresso» está visível acima de «SDD-Buddy» e de «Micro-RAG» (folha desktop, segunda tela, e o empilhado do telefone). Sobrancelha visível: o conjunto não passa de 6,5. Por isso 7,1 vira 6,5.
- Botões em repouso com fio de 1 px («Tema escuro», «Ler o blog», «Pausar movimento») caem no mesmo teto.
- Há botões de verdade na primeira tela desktop («Conheça meu trabalho» 277×52, «Ler o blog» 169×52). O teto de «sem botão» não se aplica.
- O h1 tem 2 linhas em todos os largos. O teto de três linhas não se aplica.
- A ideia serve a outro programador com as mesmas pranchas: criatividade não passa de 7. Fica 7. A frase por baixo do nome impede a leitura de «qualquer ramo»; não apliquei o teto 6 do passe 3.
- A prancha que se move conta como coisa viva. Não apliquei o teto 7,5.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. A primeira tela é um dragão e um pagode, não o trabalho. Trocar o nome deixava a imagem de pé. Em `.taste-skill/before/home/desktop-fold.jpg` o cartão diz quem é a pessoa e a prancha mostra um cenário. O mesmo em `.taste-skill/states/home-light-1440x900/fold.jpg`. Corrigir: a prancha grande tem de mostrar o que ele constrói (o ecrã do SDD-Buddy ou do Micro-RAG), e o cenário fica menor ou sai.
2. A segunda tela desktop está a 28% de preenchimento: dois cartões de texto num campo creme, com «em progresso» por cima de cada título. Em `.taste-skill/before/home/desktop-page-01.jpg`, quadrante superior direito. Corrigir: tirar o rótulo de estado; pôr cada projeto com a sua imagem, no tamanho do título, não numa faixa.
3. O quadro não fecha. O inspector mediu 54 px à esquerda e 12 px à direita a 1440, e a seção do caderno com a caixa a acabar 891 px antes da borda direita. Na folha, «O caderno está abrindo.» é uma frase e um botão, e o resto da tela é chão. Em `.taste-skill/before/home/desktop-page-01.jpg`, quadrante inferior direito. Corrigir: uma margem só, igual dos dois lados; o caderno ou ganha a outra metade ou deixa de ser seção.

No telefone (`.taste-skill/before/home/mobile-fold.jpg`) a prancha ocupa a dobra e o nome cabe por baixo, ainda na primeira tela, a 43,2 px em 2 linhas. «Pausar movimento» senta em cima do dragão, não em cima do título. O botão preto começa no corte inferior da dobra; a tela seguinte mostra o resto. A 768 a navegação vira «Menu». Não abri o menu.

## ROUND 2 — Home, escuro

Seen in one second: o mesmo dragão de papel, agora com uma barra preta em cima e o nome no cartão claro.

Idea (one sentence): a mesma pilha de pranchas; o escuro só troca o chão entre elas.

Live thing: o mesmo «Pausar movimento», agora preenchido de preto sobre a prancha clara.

Layout words by section: hero=split / trabalho=list / koi=split / caderno=band / footer=split

Scores: design 6.5 · usability 8 · creativity 7 · content 7 → overall 6.5

Caps applied: os mesmos da home clara. O inspector não mediu este tema. Vi as mesmas pranchas ilustradas, o mesmo «em progresso» sobre os títulos (`.taste-skill/states/home-dark-1440x900/s01.jpg`) e os mesmos fios de 1 px. Conjunto travado em 6,5. O contraste do corpo contra `#171614` que medi foi 15,66:1 (texto `rgb(243, 238, 230)`). O 1,03:1 do h1 contra o fundo da `body` é falso: o título está em tinta escura no cartão claro, legível na dobra. Não é falha de contraste.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. A prancha não escurece e não mostra o produto. Em `.taste-skill/states/home-dark-1440x900/fold.jpg` o dragão é o mesmo ficheiro claro da versão clara, com um header `#171614` por cima. Corrigir: ou a ilustração é tratada para o escuro, ou — melhor — a dobra mostra o trabalho, não o dragão.
2. Entre as pranchas o chão fica preto e os cartões continuam de papel claro, mas «em progresso» segue acima de «SDD-Buddy». Em `.taste-skill/states/home-dark-1440x900/s01.jpg`. Corrigir: o estado entra na frase do projeto; o cartão deixa de ser uma ficha com kicker.
3. «O caderno está abrindo.» continua uma faixa curta e, por baixo, um vão escuro até «O que você está construindo?». Em `.taste-skill/states/home-dark-1440x900/s03.jpg`. Corrigir: fechar esse vão; uma frase no rodapé chega.

No telefone escuro (`.taste-skill/states/home-dark-390x844/fold.jpg`) a ordem é a mesma do claro: prancha, legenda «Cumeeira» numa barra preta, nome, frase. A 768 (`.taste-skill/states/home-dark-768x1024/fold.jpg`) «Pausar movimento» corta a nuvem do canto superior direito. Não tapa o título, que está abaixo da imagem.

## ROUND 3 — Blog, claro

Seen in one second: uma cerejeira e o título «Notas & descobertas.» num cartão.

Idea (one sentence): o arquivo é a prancha da sakura, e o texto ainda não chegou.

Live thing: outra vez só pausar o movimento da prancha. O arquivo não muda com a visita.

Layout words by section: hero=split / arquivo=list / footer=split

Scores: design 6.5 · usability 7 · creativity 6 · content 6 → overall 6.0

A conta antes do teto era 0,4·6,5 + 0,3·7 + 0,2·6 + 0,1·6 = 6,5.

Caps applied:

- FAIL do inspector, `eyebrow` a 390: «Sakura» acima de «Notas & descobertas.». Qualquer FAIL segura o conjunto em 6,0.
- O mesmo rótulo está na dobra do telefone e na do tablet. Sobrancelha visível também seguraria o conjunto em 6,5; o FAIL é mais baixo.
- Ilustração, não fotografia: design em 6,5.
- Margens 56 / 26 a 1440: design em 6,5.
- `still-page` com 8 elementos: design não passaria de 7.
- Não há botão de ação na primeira tela, só nav, tema e pausa. Usabilidade não passa de 7. Fica 7.
- A cerejeira serviria a outra revista. Criatividade não passaria de 7 pelo passe do concorrente. A nota ficou em 6.
- O arquivo vazio não é lorem. Não apliquei o teto 5 de placeholder.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. No telefone, «Sakura» é um kicker em cima do h1. O inspector falhou isto a 390. Em `.taste-skill/before/blog/mobile-fold.jpg` a ordem é árvore, «Sakura», «Oito folhas no mesmo quadro. Ilustração com IA.», e só então «Notas & descobertas.». No desktop a legenda fica na prancha e o título no cartão, por isso o FAIL não disparou a 1440 (`.taste-skill/before/blog/desktop-fold.jpg`). Corrigir: a legenda da prancha fica na prancha também no telefone, nunca entre a imagem e o título.
2. A segunda tela é uma caixa vazia. «Nenhum artigo publicado ainda.», um link «RSS» e «Página 1 de 1». Em `.taste-skill/before/blog/desktop-page-01.jpg`, quadrante superior direito. Corrigir: uma frase, a que já está no cartão («Um texto entra aqui quando deixa de ser rascunho.»), e o RSS no rodapé. Sem paginação de zero itens. Sem caixa de 1 px à volta do vazio.
3. A primeira tela não tem ação. Quem chega para ler não tem para onde ir senão rolar até uma lista vazia. Corrigir: se não há texto, o botão da dobra deve dizer isso e apontar para os projetos, que existem.

Corpo amostrado pelo inspector a 24 px com 6,4:1 no claro. É legível (passa AA) e mesmo assim é o cinza que o medidor marca como fino.

## ROUND 4 — Blog, escuro

Seen in one second: a mesma cerejeira clara debaixo de um header preto.

Idea (one sentence): a mesma sakura; o escuro não chega à prancha e, por baixo, o chão vira uma malha.

Live thing: pausar o movimento. O arquivo continua vazio.

Layout words by section: hero=split / arquivo=list / footer=split

Scores: design 6 · usability 7 · creativity 6 · content 6 → overall 6.0

A conta era 0,4·6 + 0,3·7 + 0,2·6 + 0,1·6 = 6,3. O teto desce a 6,0.

Caps applied: o inspector deste URL falhou no claro. No escuro eu vi o mesmo «Sakura» acima do título, no telefone e no tablet (`.taste-skill/states/blog-dark-390x844/fold.jpg`, `.taste-skill/states/blog-dark-768x1024/fold.jpg`). O teto de sobrancelha é 6,5; apliquei o 6,0 do FAIL porque é a mesma página, com o mesmo rótulo, e não um tema à parte. Sem botão na dobra: usabilidade em 7. Ilustração em vez de fotografia: o design já está em 6, abaixo de 6,5.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. «Sakura» por cima de «Notas & descobertas.» no telefone escuro. Em `.taste-skill/states/blog-dark-390x844/fold.jpg`. A mesma correção do claro: a legenda não pode ser a linha de cima do título.
2. Debaixo da prancha o chão escuro mostra uma malha geométrica, e em cima dela a caixa clara «Nenhum artigo publicado ainda.» com «Página 1 de 1». Em `.taste-skill/states/blog-dark-1440x900/s01.jpg`. No claro essa textura quase não se via. Corrigir: chão liso; a frase de arquivo vazio sem caixa e sem paginação.
3. A dobra (`.taste-skill/states/blog-dark-1440x900/fold.jpg`) repete o cartão claro do tema claro, com a árvore a sangrar por baixo do header. Não há ação. Corrigir: um botão, e a prancha a começar abaixo da barra, não por baixo dela.

## ROUND 5 — Páginas internas, claro

Sobre, projetos, currículo, privacidade, SDD-Buddy e Micro-RAG. Uma nota para o grupo.

Seen in one second: um título grande numa folha de papel ao centro, e chão creme dos dois lados. Em projetos, o título está à esquerda e a direita da dobra está vazia.

Idea (one sentence): não há ideia nestas páginas; a folha de papel da home perdeu a prancha e ficou um documento.

Live thing: nenhuma. O currículo tem «Imprimir / salvar PDF». Os casos têm «Repositório», abaixo da dobra. Isso não muda de visita para visita.

Layout words by section: about=column / projects=statement / resume=column / privacy=column / sdd-buddy=column / micro-rag=column

A mesma palavra, column, quatro vezes. O template aparece.

Scores: design 6 · usability 7 · creativity 5 · content 8 → overall 6.3

Conta: 0,4·6 + 0,3·7 + 0,2·5 + 0,1·8 = 6,3.

Caps applied:

- Zero imagens nestas seis rotas (medi `imgCount` 0 a 1440). Design não pode passar de 6,5. A nota é 6, já por baixo.
- Projetos: o h1 «Do problema à prática.» ocupa a esquerda e a metade direita da primeira tela é chão. Teto de seção encostada a um lado: design ≤ 6,5. Já cumprido pela nota 6.
- Sobre, projetos, privacidade e os dois casos não têm botão de ação na primeira tela. O currículo tem. Para o grupo, usabilidade não passa de 7. Fica 7.
- Passe 3: «Sobre mim.» numa coluna podia ser de outro consultor. Criatividade não passa de 6. A nota é 5.
- «em progresso» está sozinho acima do h1 em SDD-Buddy e em Micro-RAG, e acima do título do cartão em projetos. Sobrancelha visível: conjunto ≤ 6,5. 6,3 está abaixo.
- Nenhuma heading com 3 linhas. O h1 de projetos tem 2 em todos os largos.
- Não apliquei teto de placeholder. O texto não é lorem. Não apliquei teto de seção em falta por brief: esta revisão não tinha brief de conteúdo; o que está curto está dito como curto de propósito («Nenhuma métrica do README foi reproduzida aqui.»).

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. A primeira tela de projetos é um título e um vazio. Em `.taste-skill/states/projects-light-1440x900/fold.jpg`, «Do problema à prática.» e «Uma coleção em construção.» ficam à esquerda; à direita não há nada até aos filtros, no fundo. Sobre, currículo e privacidade são o outro desenho do mesmo problema: uma coluna ao centro com margens mortas iguais (`.taste-skill/states/about-light-1440x900/fold.jpg`, `.taste-skill/states/resume-light-1440x900/fold.jpg`, `.taste-skill/states/privacy-light-1440x900/fold.jpg`). Corrigir: a lista de projetos começa no topo, com cada peça grande; a coluna estreita não pode ser a página inteira.
2. «em progresso» é um kicker. Em `.taste-skill/states/sdd-buddy-light-1440x900/fold.jpg` está acima de «SDD-Buddy», depois da migalha «Início / Projetos». O mesmo em Micro-RAG. No índice, repete-se no canto do cartão (`.taste-skill/states/projects-light-1440x900/s01.jpg`). Corrigir: apagar. Se o estado importa, entra na primeira frase.
3. Os dois casos são o mesmo molde, Contexto / Solução / Stack / Resultados / Aprendizados, sem uma imagem do produto. Resultados diz que a métrica não foi trazida. Em `.taste-skill/states/sdd-buddy-light-1440x900/s01.jpg` e `.taste-skill/states/micro-rag-light-1440x900/s01.jpg`. Corrigir: um recorte real da interface em cada caso, no lugar de «Resultados» vazio. O h2 interno está a 27,2 px, ao lado de um h1 a 99 px e de corpo a 18 px: o miolo não tem salto.

O texto, esse, é concreto. Sobre: vendas antes do código, construção, Laravel. Currículo: recusa publicar cargo e data incompletos e manda o detalhe ao LinkedIn (`.taste-skill/states/resume-light-1440x900/s01.jpg`). Micro-RAG: documentos de estoque, FAISS, citação que não garante a resposta. Datas visíveis: SDD-Buddy 20 de nov. de 2025, Micro-RAG 11 de nov. de 2025. Por isso conteúdo 8, não por falta de página.

No telefone de projetos (`.taste-skill/states/projects-light-390x844/fold.jpg`) os filtros quebram a linha (`react` sozinho) e o cartão fica dentro da tela: medi a `article` de SDD-Buddy de x=20 a x=370 numa viewport de 390. Não há corte horizontal. O aspecto de «cartão cortado» é o degrau do papel a chegar perto da borda, com 20 px ainda de margem.

Contraste que medi a 1440 no claro, texto `rgb(28, 25, 22)` sobre `rgb(246, 243, 236)`: 15,79:1 no h1 e no corpo. Não é o cinza de 6,4:1 da home.

## ROUND 6 — Páginas internas, escuro

Seen in one second: o mesmo título, agora em creme, numa folha castanha-escura sobre preto. Em projetos, o título flutua no preto e a direita continua vazia.

Idea (one sentence): a mesma coluna; o escuro só separa a folha do fundo, e isso é o ganho todo.

Live thing: nenhuma, como no claro.

Layout words by section: about=column / projects=statement / resume=column / privacy=column / sdd-buddy=column / micro-rag=column

Scores: design 6.5 · usability 7 · creativity 5 · content 8 → overall 6.5

Conta: 0,4·6,5 + 0,3·7 + 0,2·5 + 0,1·8 = 6,5.

Caps applied: os do grupo claro. Sem fotos, design não passa de 6,5, e é aí que ficou. Usabilidade em 7 por falta de botão na primeira tela (salvo o currículo). Criatividade em 5, abaixo do teto 6 do passe 3. Sobrancelha «em progresso» visível no escuro: conjunto não passaria de 6,5, e a conta já dá 6,5. Subi o desenho meio ponto em relação ao claro porque a folha escura sobre `#171614` é uma massa, e no claro a folha e o chão são o mesmo creme. Não sobe mais: a direita de projetos continua vazia (`.taste-skill/states/projects-dark-1440x900/fold.jpg`).

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. «Do problema à prática.» no escuro deixa metade da tela sem nada, e o vazio pesa mais porque o fundo é preto. Em `.taste-skill/states/projects-dark-1440x900/fold.jpg`. Corrigir: o primeiro projeto ocupa essa metade, com imagem.
2. «em progresso» acima de «Micro-RAG» e de «SDD-Buddy». Em `.taste-skill/states/micro-rag-dark-1440x900/fold.jpg` e `.taste-skill/states/sdd-buddy-dark-390x844/fold.jpg`. Corrigir: apagar o rótulo nos dois temas.
3. A coluna de sobre no escuro lê-se bem (contraste 15,66:1, corpo 18 px) e mesmo assim é uma folha estreita com h2 a 27,2 px. Em `.taste-skill/states/about-dark-1440x900/fold.jpg` e, no tablet, `.taste-skill/states/about-dark-768x1024/fold.jpg`, onde a folha quase enche a largura e o texto fica honesto. Corrigir: no desktop, ou a medida alarga até a margem da página, ou a outra metade leva uma prova (foto, interface, lista). Não deixar o miolo a 27 px quando o título está a 99.

Privacidade no telefone escuro (`.taste-skill/states/privacy-dark-390x844/fold.jpg`) cabe quase toda na dobra e diz o que o site faz: estático, tema só no browser, métricas desligadas, redes e vídeo só se a pessoa pedir. É a página interna mais completa para o tamanho que tem. Não vi banner de consentimento.

## Três mudanças que moveriam o sítio

Por ordem, o efeito maior primeiro. Não foram feitas.

1. A prancha tem de ser o trabalho. Dragão, koi e sakura são ilustração genérica com a legenda «Ilustração com IA». Enquanto a dobra for isso, desenho fica travado em 6,5 por falta de fotografia e a ideia serve a outro nome.
2. Tirar os kickers. «Sakura» no blog a 390 é um FAIL. «em progresso» e a linha de ofício por cima do nome são o mesmo gesto. Sem isso o teto de 6,5 do conjunto sai de cima da home, e o teto de 6,0 sai de cima do blog.
3. As páginas de dentro não podem ser a mesma coluna. Projetos abre com meia tela vazia. Os casos repetem cinco h2 e não mostram o programa. Uma interface recortada em cada caso, e a lista de projetos no tamanho da dobra, mudam desenho e conteúdo ao mesmo tempo.

## O que não testei

- O inspector não rodou no tema escuro, nem em sobre, projetos, currículo, privacidade, SDD-Buddy ou Micro-RAG. Essas notas são das capturas e das medidas do Playwright (linhas do h1, contraste, contagem de imagens, overflow).
- Não abri o «Menu» a 768 nem a 390. Não percorri foco por teclado, nem leitor de ecrã, nem hover.
- Não cliquei em «Pausar movimento», no tema, em «Imprimir / salvar PDF», nem nos links externos (LinkedIn, GitHub, X, repositórios, RSS, filtros de tag).
- Não fotografei `prefers-reduced-motion`. O inspector, no claro da home e do blog, não reportou `reduced-hidden`. Não confirmei isso à vista.
- Não há artigo publicado; não abri uma página de post. Não abri tags, 404, nem larguras fora de 1440, 768 e 390. Não testei paisagem, Firefox nem Safari.
- Não medi o tempo de carga nem Lighthouse. O passe de cinco segundos é a minha leitura das dobras, não a de outra pessoa.
- Não editei `src`, testes, README nem `DESIGN.md`. As capturas ficam em `.taste-skill/` e não entram em commit por esta revisão.

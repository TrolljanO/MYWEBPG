# Revisão — design-taste-frontend (modo REVIEW)

Arquivo pedido em 2026-11-09. Medições feitas em 2026-11-10, no tema claro que o servidor entregou.

Skill: `design-taste-frontend`, seção «Redesign, restyle or review of an existing page». Uma review para no passo «A review stops here». Nada em `src/` foi editado. Nenhum commit. Nenhuma das mudanças abaixo foi feita.

Site medido: `http://127.0.0.1:4321/MYWEBPG/` e `http://127.0.0.1:4321/MYWEBPG/blog/`. Node `v24.15.0`.

## O que rodou

Não havia Chrome, Edge nem Chromium em `/usr/bin`. O inspector rodou com o Chromium do Playwright:

`CHROME_PATH=/home/tj/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome`

| Passo                                                   | Saída                                 | Resultado        |
| ------------------------------------------------------- | ------------------------------------- | ---------------- |
| `inspect.mjs` na home, `--out .taste-skill/review-home` | `report.json` em 2026-11-10T14:10:31Z | 5 FAIL, 7 WARN   |
| `inspect.mjs` no blog, `--out .taste-skill/review-blog` | `report.json` em 2026-11-10T14:10:56Z | 8 FAIL, 7 WARN   |
| `lint.mjs src/pages src/styles`                         | 17 arquivos                           | 18 FAIL, 13 WARN |

Prints abertos, todos os que o inspector listou:

- Home: `desktop-fold.jpg`, `desktop-page-01.jpg`, `tablet-fold.jpg`, `tablet-page-01.jpg`, `mobile-fold.jpg`, `mobile-page-01.jpg`.
- Blog: os mesmos seis nomes em `.taste-skill/review-blog/`.

Referências do dono, fora do site, abertas: `/tmp/grok-imagine/2287f9ed-6104-4f85-a5a3-976266ce1d4c.png` (sakura) e `/tmp/grok-imagine/e8097549-1e03-4a6e-8c4f-2a5b7528b973.png` (cumeeira em cinza).

## Home — o que o inspector mediu

Página: 3259px, 3.6 telas, 250 palavras, 10 imagens raster, 11 SVG, 0 vídeo, 4 seções. Hero media 76% da primeira tela. Overflow horizontal 0. Margens do miolo: 58px à esquerda, 71px à direita (diferença abaixo do aviso). Movimento: 10 elementos via CSS, 0 transições, 0 script, 0 vídeo. Preenchimento das 4 telas de desktop: 0.67, 0.29, 0.61, 0.25.

Manchete «Guilherme Trajano.» Cormorant Garamond 500, tracking −0.03em, leading 1.08, sempre 2 linhas:

| Largura | Tamanho         | Topo do h1 | Posição                  |
| ------- | --------------- | ---------- | ------------------------ |
| 1440    | 99.2px (6.9vw)  | 338px      | esquerda, 34% da largura |
| 768     | 53.8px (7vw)    | 726px      | centro, 77% da largura   |
| 390     | 43.2px (11.1vw) | 572px      | centro, 82% da largura   |

Tipo em uso a 1440: Manrope 84%, ui-monospace 11%, Cormorant Garamond 5%. Doze tamanhos: 13, 14, 15, 17, 18, 22, 24, 25, 26, 56, 64, 99. Corpo Manrope 17px / 1.65, contraste 6.4:1 (`#5e574e` sobre o fundo). A 768 e a 390 o corpo continua 17px e os blocos abaixo de 13px sobem de 6 para 10.

Cor: fundo `#f6f3ec`, seção `#f3ecdf`, botão `#1c1916`. Da tinta na página, `#5e574e` ocupa 52%, `#1c1916` ocupa 45%, `#f6f3ec` ocupa 3%, o acento `#7a2f2c` aparece com parcela ~0. Botões: 9, dos quais 4 no primeiro viewport (incluindo «Pular para o conteúdo» e «Tema escuro»); raio 2px; altura 51px; sem sombra e sem gradiente no botão. Nav fixa, 89px, 4 links, sem pill e sem blur.

Quatro títulos medidos, nenhum com mais de 2 linhas: h1 «Guilherme Trajano.» 99px; h2 «Trabalho em aberto.» Manrope 56px; h2 «A bagagem vira método.» Cormorant 56px; a frase do rodapé «O que você está construindo?» é um `p` a 64px.

Geometria que o aviso de seção usa: o `section.section` do caderno (topo 2556px, altura 338px, 13 palavras, sem heading) tem o conteúdo a 83px da esquerda e 906px vazios à direita.

### FAIL (5)

- **mono** @1440, também 768 e 390. ui-monospace fora de código. Amostras: «em progresso», «python / fastapi / react», «python / fastapi / busca-em-documentos», e ainda «© 2026 Guilherme Trajano», «Currículo».
- **shadow** @1440, também 768 e 390. 5 `box-shadow` em coisa parada. As amostras nomeiam quatro: `div.paper-sheet.hero-sheet` → `rgba(70, 48, 32, 0.14) 0 18px 40px`; dois `article.project-card.paper-sheet` → `rgb(213, 205, 192) 7px 9px 0`; `div.paper-sheet.method-sheet` com a mesma sombra suave da folha do hero. A quinta entra na contagem e não vem nomeada na lista de amostras.
- **hairline** @1440, também 768 e 390. 4 fios: `header.header` 1440px, dois `div.diorama-stage` 1218px (cumeeira e onda), `footer.footer` 1440px.
- **outlined-box** @1440, também 768 e 390. 3 caixas com contorno de 1px.
- **small-text** @1440, também 768 e 390. 6 blocos abaixo de 13px a 1440; a métrica interna conta 10 a 768 e a 390.

### WARN (7)

- **palette-cream.** Fundo `#f6f3ec`, seção `#f3ecdf`, texto claro `#f6f3ec`.
- **font-count.** 3 famílias (Manrope, ui-monospace, Cormorant Garamond).
- **size-count.** 12 tamanhos a 1440 (10 a 768 e a 390).
- **grey-body.** Texto corrido 6.4:1. O corpo tem 17px, então o teto de «texto pequeno e cinza» não entra; o aviso de cinza entra.
- **no-footage.** Nenhum vídeo.
- **lopsided** @1440. Uma seção, `section.section`, deixa 906px da largura vazios. É o caderno, sem título.
- **still-page** @1440. 10 elementos se moveram. O aviso dispara abaixo de 16; o FAIL dispararia abaixo de 8. Aqui é WARN.

O inspector não emitiu `eyebrow`, `gradient`, `empty-screens`, `no-title`, `off-centre`, `blank-gap` nem `headline-lines` na home. Gradientes medidos: 0. O `<br>` do h1 segura o nome em 2 linhas nas três larguras.

## Blog — o que o inspector mediu

Página a 1440: 2176px, 2.4 telas, 87 palavras, 2 imagens, 4 SVG, 1 seção. Preenchimento: 0.80, 0.18, 0.15. Movimento: 2 elementos. O h1 «Notas & descobertas.» (Cormorant, 99.2px quando entra) começa a 1165px, fora da primeira tela de 900px. A 768 o mesmo h1 cabe em 1 linha a 53.8px com topo 791px, e a 390 em 1 linha a 43.2px com topo 622px: nos folds de tablet e de celular o título aparece no fim da primeira tela. Corpo medido a 1440: 24px / 1.65, ainda 6.4:1, porque quase não há texto corrido. Mono sobe para 18% (Manrope 65%, Cormorant 17%).

### FAIL (8)

- **mono** @1440, também 768 e 390. Amostras: «Todos», «Página 1 de 1», «© 2026 Guilherme Trajano», «Currículo», «RSS», «Privacidade».
- **shadow** @1440, também 768 e 390. 1 sombra em repouso: `p.notebook-empty` → `rgb(213, 205, 192) 8px 10px 0`.
- **hairline** @1440, também 768 e 390. 3 fios: header 1440px, `div.diorama-stage` 1218px, footer 1440px.
- **few-pictures** @1440. 2 imagens raster. O piso da skill é 4.
- **no-title** @1440. O h1 não está na primeira tela.
- **still-page** @1440. Só 2 elementos se moveram. Aqui é FAIL.
- **empty-screens** @1440. Telas 2 e 3 com menos de 20% ocupado (0.18 e 0.15).
- **small-text** @768 e 390. 5 blocos abaixo de 13px. A 1440 o mesmo id é só WARN, com 3 blocos.

### WARN (7)

- **outlined-box** @1440 e 390. 1 caixa de 1px.
- **palette-cream.** Os mesmos `#f6f3ec` / `#f3ecdf`.
- **font-count.** As mesmas 3 famílias.
- **grey-body.** 6.4:1.
- **no-footage.**
- **small-text** @1440. 3 blocos.
- **no-hero** @1440. Nenhuma manchete no primeiro viewport.

## Lint — `src/pages` e `src/styles`

17 arquivos. Exit code 1. Nada foi corrigido. O lint olha a fonte; vários achados não estão na home renderizada.

FAIL, 18:

- **eyebrow** (3). `src/pages/404.astro:13`, `src/pages/projects/index.astro:15`, `src/styles/global.css:103` (`.eyebrow`). A home usa `p.intro-line`, não essa classe.
- **hairline** (4). `global.css:96` (`.rule`), `:156` (header), `:417` (footer), `:546` (nav móvel).
- **mono** (4). `global.css:104`, `:307`, `:364` (`font-family: var(--font-mono)`), `tokens.css:13` (o token).
- **gradient** (2). `global.css:283` e `:284`, a grade de 1px em `.hero-art`. O inspector mediu 0 gradientes na home e no blog: essa classe não está no que foi fotografado.
- **shadow** (5). `global.css:341` (cartão de projeto), `:390` (cartão de post), `:464` (`.reading`), `:625` (folha do hero e do método), `:647` (caderno vazio).

WARN, 13, todos **outlined-box** (`border: 1px solid`): `global.css` linhas 199, 223, 286, 335, 366, 386, 462, 474, 487, 645; `typography.css` linhas 34, 68, 80 (pre, tabela e details). Parte disso é código e tabela, que a skill deixa em paz dentro de `pre` / tabela real. O metro estático não faz essa distinção.

## As catorze passadas, na home

1. **Um segundo.** O nome, grande, numa folha branca, com dragão vermelho e pagode atrás. Há um foco. **Cinco segundos.** Dá para dizer quem é, o que faz («Venho de vendas. Construo com código…») e o que fazer («Conheça meu trabalho», «Ler o blog»). O título não depende do scroll no desktop. No celular a estampa vem primeiro e o nome entra ainda na primeira tela.
2. **Apertar os olhos.** Duas massas: a folha e a estampa. Abaixo, «Trabalho em aberto» vira duas tiras parecidas, médias, e o caderno vira uma tira fina. A hierarquia do primeiro quadro não continua.
3. **Cobrir o logo.** A estampa poderia ser chá, viagem ou papelaria. Trocar o nome no h1 deixa a página de pé. A frase de vendas → código → obra é desta pessoa; o dragão não é. A ideia visual pertence ao gênero «portfólio com ilustração de papel».
4. **Bordas.** Quatro x de texto: ~58px (trabalho e rodapé), 83px (caderno), 165–167px (as duas pranchas). Uma página composta reusa duas ou três.
5. **Espaço e moldura.** As margens externas quase casam (58 e 71). O vão entre seções não gerou `blank-gap`. O buraco está dentro do caderno: meia largura ociosa, 906px. A prancha em si é uma caixa 3:2 de 1218px no meio de 1440, com creme dos dois lados.
6. **Tipo.** O salto do corpo 17px para o nome 99px é decisivo (~5,8×). Há doze tamanhos, não cinco. «Trabalho em aberto» é Manrope 56; «A bagagem vira método» é Cormorant 56. O rodapé, um `p`, está a 64px, maior que os h2. Nenhuma manchete passa de duas linhas. A medida do parágrafo mais largo ficou em 44 caracteres a 1440.
7. **Cor.** O creme segura a superfície. A tinta cheia `#1c1916` perde para o cinza `#5e574e` (52% contra 45%). O acento `#7a2f2c` quase não existe na interface; o vermelho que se vê é o dragão, dentro da estampa. O botão principal é preto. Superfícies vizinhas (`#f6f3ec` e `#f3ecdf`) são o mesmo osso, então a separação fica com fio, caixa e sombra.
8. **Imagens.** Dez rasters, zero vídeo, cantos retos, prancha 3:2. A legenda diz «Ilustração com IA». Elas armam o lugar. Não provam o trabalho, o que combina com a regra do dono de que o cenário não carrega informação. Não há foto da pessoa, do código nem da obra.
9. **Repetição.** hero = folha sobre prancha; trabalho = lista de cartões; bagagem = folha sobre prancha de novo; caderno = faixa; rodapé = pergunta à esquerda e links à direita. A palavra «folha sobre prancha» aparece duas vezes, com a lista no meio.
10. **Celular.** A 390 a prancha vai de borda a borda e a folha desce para baixo dela. É outra composição, e o nome continua em duas linhas a 43px. O wordmark quebra («Guilherme» / «Trajano») ao lado de Menu e de Tema escuro. O primeiro botão ocupa a largura.
11. **Cheio.** A tela 2 está a 0.29: dois cartões baixos e muito creme. A tela 4 está a 0.25: a faixa do caderno e o começo do rodapé. Não chegou no FAIL de tela vazia (piso 0.20). Lê-se como seção magra, não como descanso desenhado.
12. **Substância.** Os dois projetos existem (SDD-Buddy, Micro-RAG), com uma frase cada. O capítulo da bagagem tem a trajetória em uma frase. O caderno diz que o arquivo espera o primeiro texto. Não há depoimento, logo nem número inventado. O botão principal está na primeira tela.
13. **Colisões.** A folha do hero cobre o corpo do dragão. Não cobre o h1, que está dentro da folha. Nada sai da largura do celular (overflow 0).
14. **Concorrente e coisa viva.** Outro portfólio ilustrado aguenta o mesmo dragão e a mesma folha. A coisa viva é «Pausar movimento» e «Tema escuro». O drift é de poucos pixels por camada. O visitante não mexe no trabalho.

## ROUND 1

```
ROUND 1
Seen in one second: o nome numa folha branca, com dragão vermelho e pagode atrás.
Idea (one sentence): Uma folha com o nome senta sobre um diorama de papel oriental, e o cenário não explica a pessoa.
Live thing: Pausar movimento e Tema escuro; o drift das folhas é de poucos pixels, e não há um gesto feito do trabalho.
Layout words by section: hero=folha-sobre-prancha / trabalho=lista / bagagem=folha-sobre-prancha / caderno=faixa / footer=split
Scores: design 6 · usability 7 · creativity 6 · content 7 → overall 6.0
Caps applied: qualquer FAIL (mono, shadow, hairline, outlined-box, small-text) segura o overall em 6.0 (a conta sem teto dava 6.4). Fio, sombra em repouso e mono visíveis segurariam o overall em 6.5, teto mais folgado. still-page segura design em 7 (o 6 fica abaixo). A seção do caderno, com 906px vazios de um lado, segura design em 6.5. Caderno sem heading segura usability em 7, e o 7 está nesse teto. Passada 3 (a página aguenta outro nome) segura creativity em 6. Passada 14 (o concorrente ilustrado aguenta a ideia) seguraria creativity em 7. Sem coisa viva de verdade, creativity iria a no máximo 7.5. Não aplicados: manchete de 3 linhas (são 2 nas três larguras), poucos rasters (há 10), gradiente visível (o inspector mediu 0), five-second na home (o nome, a frase e os dois botões estão na primeira tela).
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-fold.jpg — a folha branca corta o corpo do dragão e lê-se como painel (linha “Desenvolvimento, dados e inteligência artificial.”, dois botões, sombra 0 18px 40px) sobre uma prancha 3:2 de 1218px com fio, no meio de 1440. A referência cinza é o dragão inteiro, de borda a borda, em camadas. Fix: uma só peça de papel até a moldura; a folha do texto cortada do mesmo papel, sem a linha acima do nome e sem a sombra que a faz flutuar; o nome continua a ser a única coisa grande.
2. desktop-page-01.jpg, quadrante superior direito — “Trabalho em aberto.” é outra página: dois cartões iguais, contorno de 1px, sombra dura 7px 9px 0, “em progresso” e “python / fastapi / react” em ui-monospace, h2 em Manrope 56 enquanto o resto do display é Cormorant. Fix: os dois projetos na mesma folha do hero, na mesma face, sem mono e sem caixa.
3. desktop-page-01.jpg, faixa inferior — o caderno (“O caderno está abrindo. O arquivo espera o primeiro texto.”) é um section.section sem heading, topo 2556px, conteúdo a 83px da esquerda e 906px vazios à direita. Fix: um heading que nomeie a seção e alguma coisa na metade vazia (a página do caderno), ou fechar a faixa e deixar o rodapé encerrar.
```

A conta: 0,4×6 + 0,3×7 + 0,2×6 + 0,1×7 = 6,4, cortada para 6,0 pelo FAIL.

Design 6: o primeiro quadro segura como pôster; da segunda tela em diante o sistema é um kit (caixa, mono, sombra dura, faixa oca). Usability 7: em cinco segundos dá para saber quem é e qual é o botão; o teto é 7 por causa do caderno sem título, e o texto pequeno mais o corpo a 6,4:1 impedem subir. Creativity 6: o dispositivo é reconhecível e, pela passada 3, ainda serve a outro nome. Content 7: a frase de origem e os dois projetos são concretos; «Experimentos que ganharam forma. Código, decisões e espaço para melhorar.» é genérica; as imagens não são o assunto.

## As três mudanças que mais moveriam a página

São as três do ROUND 1, nesta ordem. Não foram feitas.

1. **A primeira tela vira o objeto das referências.** Prancha até a moldura, dragão inteiro, folha estável do mesmo papel. É a ideia. Detalhe de botão não salva o quadro enquanto a folha for um cartão em cima da estampa (`desktop-fold.jpg`).
2. **«Trabalho em aberto» entra no mesmo papel.** Hoje é o ponto em que a página vira template (`desktop-page-01.jpg`).
3. **O caderno deixa de ser um buraco de 906px.** Sem heading e com a metade direita vazia, é a seção que o metro e o olho apontam juntos.

O tipo vem depois dessas três: duas famílias, cerca de cinco tamanhos, corpo na tinta `#1c1916`. Doze tamanhos e 11% de mono não salvam a página enquanto o hero e o caderno estiverem como estão.

## Blog — passada curta

```
ROUND 1 — blog
Seen in one second: um galho de cerejeira em papel, e nada escrito.
Idea (one sentence): O arquivo abre com a árvore de papel, e o título espera embaixo.
Live thing: Pausar movimento. Não há texto para ler nem filtro que mude a página (o chip “Todos” está sozinho).
Layout words by section: hero=estampa-cheia / arquivo=faixa / footer=split
Scores: design 5 · usability 5 · creativity 6 · content 6 → overall 5.3
Caps applied: FAILs seguram o overall em 6.0, e a nota 5.3 está abaixo, então o teto não a levanta. no-title e a falha dos cinco segundos no desktop seguram usability em 6 (a nota é 5). empty-screens e few-pictures (2 imagens) seguram design em 6.5. still-page segura design em 7. Fio, sombra e mono segurariam o overall em 6.5. Passada 3 segura creativity em 6: o galho poderia abrir o índice de outra pessoa.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-fold.jpg — a primeira tela de 1440×900 é só o galho e o tapete de pétalas. O h1 “Notas & descobertas.” começa a 1165px. Fix: o título e a frase “O arquivo está pronto…” na primeira tela, a estampa ao lado ou atrás, no mesmo papel.
2. desktop-page-01.jpg — as telas 2 e 3 estão a 0.18 e 0.15: um cartão “Nenhum artigo publicado ainda.” com sombra 8px 10px 0, e o resto é chão. Fix: o vazio honesto ocupa a tela como uma folha, com o título já visto, em vez de uma caixa pequena no meio do creme.
3. desktop-page-01.jpg e mobile-fold.jpg — o chrome do arquivo é mono (“Todos”, “Página 1 de 1”) sobre o mesmo fio de header e footer da home. Fix: essas palavras na face do texto, no tamanho do corpo.
```

A 768 e a 390 o título alcança o fim da primeira tela (`tablet-fold.jpg`, `mobile-fold.jpg`). O FAIL `no-title` é do desktop. O wordmark continua quebrando no celular. O estado vazio é verdadeiro: não há artigo. A frase do arquivo é específica. O que falta é composição, não um texto inventado.

Conta do blog: 0,4×5 + 0,3×5 + 0,2×6 + 0,1×6 = 5,3.

## Distância entre as duas referências e a home

As duas imagens são maquetes quadradas, de borda a borda, sem tipo e sem interface. A sakura é uma árvore inteira, rosa sobre rosa, com pétalas soltas e sombra de camada. A cumeeira é cinza só: o dragão inteiro nas nuvens, o pagode no pico, serras empilhadas em folhas de papel.

A home usa o vocabulário da cumeeira (dragão, pagode, serras, pinheiros) e deixa a sakura para o blog. A distância é de objeto:

- A referência é quadrada e sangra. A home é uma prancha 3:2 de 1218px, centrada, com cerca de 111px de creme de cada lado e um fio em cima e embaixo do palco.
- Na referência o dragão está inteiro, acima do pagode. Em `desktop-fold.jpg` a folha branca corta o corpo do dragão. No celular a estampa fica inteira e o nome desce, mais perto da maquete, ainda com header, legenda e botão «Pausar movimento» no meio.
- A referência cinza é um material só. A home mistura creme de interface, dragão vermelho, pinheiros azul-escuros, montanha ocre e botão preto. A sakura de referência é uma família de rosa; no blog o galho é parente dela, cortado (galho e tapete, sem a árvore inteira), e no desktop ocupa a tela no lugar do título.
- As referências não têm folha de texto. A regra do dono pede exatamente isso: cenário mudo, informação na folha estável. A home tenta o par. A folha que está no ar é um cartão de site (sombra suave, dois botões, uma linha de categoria), e os cartões de projeto usam outra sombra, dura, mais contorno e mono. O papel não atravessa a página.
- O cenário, nos dois lados, não informa. Nisso a home cumpre o pedido. A distância não é «falta uma explicação dentro do desenho». É que o desenho ainda é uma ilustração de papercut dentro de um template, e a referência já é o papel.

## O que não rodou

- O fallback de fotografar com Playwright à mão, nas larguras 1440, 768 e 390. Não fez falta: o inspector achou o Chromium e fotografou essas larguras.
- `scenes.mjs`. A home não usa as cenas de scroll da skill. O movimento medido é o drift CSS das folhas.
- Tema escuro. O botão «Tema escuro» está no primeiro viewport. O inspector carregou o tema claro servido. Esta revisão não clica nele.
- `npm run validate`, `npm run test:e2e`, `npm run format:check`. Não houve mudança de código.
- Draw de direção, `assets.mjs`, implementação, segundo round. A skill manda a review parar aqui.

Nada além deste arquivo e das pastas `.taste-skill/review-home` e `.taste-skill/review-blog` (saída pedida do inspector) foi escrito.

# Reavaliação W7 — 2026-11-10

Medição só desta onda. Nada em `src/` foi editado. Nada foi publicado. O sítio medido é o `HEAD` `d00c041` da branch `feat/astro-content-boilerplate`, build estático de 13 páginas, servido em `http://127.0.0.1:4321/MYWEBPG/` e `http://127.0.0.1:4321/MYWEBPG/blog/`. Node `v24.15.0`.

As notas de hoje saem do que foi visto e medido nesta sessão. Onde uma célula não foi medida, a tabela diz «não medido». Os números do baseline foram copiados dos quatro arquivos de 9 e 10 de novembro, não de memória.

## Como cada leitura mediu

**Inspector** (`inspect.mjs`, Chromium do Playwright em `CHROME_PATH`). O script não troca o tema. O que ele carregou foi o tema claro: fundo `#f6f3ec`, `dark: false`.

- Home, 2026-11-10T20:11:38Z, `.taste-skill/w7-home/`: **0 FAIL, 6 WARN**.
- Blog, 2026-11-10T20:11:55Z, `.taste-skill/w7-blog/`: **0 FAIL, 5 WARN**.

Larguras do inspector: 1440×900, 768×1024, 390×844. Abri os doze prints que ele listou.

**Playwright**, o mesmo Chromium, com `localStorage.theme` e `colorScheme` fixados antes do carregamento. Este caminho mediu os dois temas, nas três larguras, nas duas rotas. Prints em `/tmp/wave-w7-shots/`. Geometria, contraste computado e alvos saem daqui. A contagem FAIL/WARN do inspector no tema escuro: **não medido**.

A busca da skill UI/UX, sem `--persist` e sem gravar design system no repositório, devolveu de novo Brutalism, Caveat, Quicksand e azul `#2563EB`. Não foi adotada. A paleta no ar é a do papel.

## O que está no ar, em uma frase

A folha do nome fica ao lado da cumeeira em 1440 e não cobre o dragão (interseção horizontal 0). No blog, «Notas & descobertas.» está na primeira tela. Abaixo de 800 px a folha empilha sobre a prancha. O tema escuro escurece o cabeçalho (`#24211d`, texto 13,88:1) e deixa a folha clara (h1 15,79:1 nos dois temas).

Não há GSAP, Lenis, Locomotive nem Three no HTML das duas páginas. A regra do repositório vence a skill de Awwwards. A nota de movimento fica limitada por isso. Não proponho montar essas bibliotecas.

## Tabela

Awwwards e design taste usam as quatro notas do relatório de 2026-11-09 e de `critique.md`: design, usabilidade, criatividade, conteúdo. UI/UX não tem nota 1–10 no baseline nem na skill; a célula traz o que foi medido.

| Skill        | Rota | Tema   | Largura | Nota de hoje                                                                                                                         | Nota do baseline                                                                                                                               |
| ------------ | ---- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Awwwards     | home | claro  | 1440    | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 6 · criatividade 6 · conteúdo 7 — nota única do sítio; a usabilidade 6 é a do desktop, sem tema nem largura             |
| Awwwards     | home | claro  | 768     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 6 · criatividade 6 · conteúdo 7 — nota única; usabilidade do desktop, 768 não separado                                  |
| Awwwards     | home | claro  | 390     | design 5 · usabilidade 6 · criatividade 5 · conteúdo 7                                                                               | design 5 · usabilidade 6 · criatividade 6 · conteúdo 7 — nota única; usabilidade do desktop, 390 não separado                                  |
| Awwwards     | home | escuro | 1440    | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 6 · criatividade 6 · conteúdo 7 — nota única; o escuro foi fotografado em 2026-11-09 e não recebeu nota própria         |
| Awwwards     | home | escuro | 768     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 6 · criatividade 6 · conteúdo 7 — nota única; 768 escuro não separado                                                   |
| Awwwards     | home | escuro | 390     | design 5 · usabilidade 6 · criatividade 5 · conteúdo 7                                                                               | design 5 · usabilidade 6 · criatividade 6 · conteúdo 7 — nota única; 390 escuro foi visto em 2026-11-09 sem nota própria                       |
| Awwwards     | blog | claro  | 1440    | design 6 · usabilidade 6 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 5 · criatividade 6 · conteúdo 7 — design, criatividade e conteúdo são nota única; usabilidade 5 é a do blog desktop     |
| Awwwards     | blog | claro  | 768     | design 6 · usabilidade 6 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 5 · criatividade 6 · conteúdo 7 — usabilidade 5 é a do blog desktop; 768 não separado                                   |
| Awwwards     | blog | claro  | 390     | design 6 · usabilidade 6 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 5 · criatividade 6 · conteúdo 7 — usabilidade 5 é a do blog desktop; 390 não separado                                   |
| Awwwards     | blog | escuro | 1440    | design 6 · usabilidade 6 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 5 · criatividade 6 · conteúdo 7 — blog medido no escuro em 2026-11-09; a usabilidade 5 é a do desktop, sem nota de tema |
| Awwwards     | blog | escuro | 768     | design 6 · usabilidade 6 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 5 · criatividade 6 · conteúdo 7 — 768 escuro não separado                                                               |
| Awwwards     | blog | escuro | 390     | design 6 · usabilidade 6 · criatividade 6 · conteúdo 7                                                                               | design 5 · usabilidade 5 · criatividade 6 · conteúdo 7 — 390 escuro foi visto em 2026-11-09 sem nota própria                                   |
| UI/UX        | home | claro  | 1440    | sem nota 1–10. h1 15,79:1, y=229, na dobra. Pausa 181×44, y=108, na dobra. Alvos medidos ≥44. Overflow 0                             | sem nota numérica. Pausa y=913, fora da dobra de 900. Folha 15,79:1. Medido em 1440×900 claro                                                  |
| UI/UX        | home | claro  | 768     | sem nota 1–10. h1 y=147, na dobra. Pausa 181×44, y=573, na dobra, sobre o dragão. Overflow 0                                         | sem nota numérica. 768 não visto em 2026-11-09                                                                                                 |
| UI/UX        | home | claro  | 390     | sem nota 1–10. h1 y=146, na dobra. Pausa 156×74 sobre prancha de 168×168. Overflow 0                                                 | sem nota numérica. 390 não visto em 2026-11-09                                                                                                 |
| UI/UX        | home | escuro | 1440    | sem nota 1–10. h1 15,79:1 na folha clara. Cabeçalho 13,88:1. Pausa na dobra. Alvos ≥44. Overflow 0                                   | sem nota numérica. O escuro foi forçado só no herói; contraste do cabeçalho citado como 15,66:1, sem nota                                      |
| UI/UX        | home | escuro | 768     | sem nota 1–10. Mesma geometria do claro: h1 y=147, pausa sobre o dragão. Cabeçalho escuro. Overflow 0                                | sem nota numérica. 768 escuro não visto                                                                                                        |
| UI/UX        | home | escuro | 390     | sem nota 1–10. Pausa 156×74 sobre a prancha de 168px. h1 na dobra, 15,79:1. Overflow 0                                               | sem nota numérica. 390 escuro não visto                                                                                                        |
| UI/UX        | blog | claro  | 1440    | sem nota 1–10. h1 y=304, 15,79:1, na dobra. Pausa y=108. Cartão vazio y=1116, fora da dobra. RSS 34×44. Legenda 14,9:1 e nota 6,06:1 | sem nota numérica. h1 y=1165, fora da dobra de 900. RSS citado em 24×44                                                                        |
| UI/UX        | blog | claro  | 768     | sem nota 1–10. h1 y=124, 1 linha, na dobra. h2 do arquivo y=1154, abaixo da dobra de 1024. Pausa na dobra. Overflow 0                | sem nota numérica. 768 não visto                                                                                                               |
| UI/UX        | blog | claro  | 390     | sem nota 1–10. h1 y=123, na dobra. Pausa 181×44 sobre a árvore de 366px. h2 do arquivo y=968, abaixo da dobra de 844. Overflow 0     | sem nota numérica. 390 não visto                                                                                                               |
| UI/UX        | blog | escuro | 1440    | sem nota 1–10. h1 15,79:1 na dobra. «Sakura» 1,02:1. «Oito folhas…» 1,7:1. Cartão vazio y=1116. RSS 34×44                            | sem nota numérica. Blog escuro fotografado; contraste da legenda não medido                                                                    |
| UI/UX        | blog | escuro | 768     | sem nota 1–10. h1 na dobra. A legenda clara sobre o papel aparece no fim da dobra. Ratio 1,02:1 e 1,7:1 medido em 1440, mesmas cores | sem nota numérica. 768 escuro não visto                                                                                                        |
| UI/UX        | blog | escuro | 390     | sem nota 1–10. h1 na dobra. A linha «Oito folhas…» aparece no fim da dobra, nas cores medidas em 1440 (1,7:1). Overflow 0            | sem nota numérica. 390 escuro não visto                                                                                                        |
| Design taste | home | claro  | 1440    | design 6,5 · usabilidade 8 · criatividade 6 · conteúdo 7 → 6,9                                                                       | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,0 — página, tema claro, largura não separada                                        |
| Design taste | home | claro  | 768     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,0 — página, tema claro, largura não separada                                        |
| Design taste | home | claro  | 390     | design 5 · usabilidade 7 · criatividade 5 · conteúdo 7 → 5,8                                                                         | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,0 — página, tema claro, largura não separada                                        |
| Design taste | home | escuro | 1440    | design 6,5 · usabilidade 8 · criatividade 6 · conteúdo 7 → 6,9                                                                       | não medido                                                                                                                                     |
| Design taste | home | escuro | 768     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | não medido                                                                                                                                     |
| Design taste | home | escuro | 390     | design 5 · usabilidade 7 · criatividade 5 · conteúdo 7 → 5,8                                                                         | não medido                                                                                                                                     |
| Design taste | blog | claro  | 1440    | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | design 5 · usabilidade 5 · criatividade 6 · conteúdo 6 → 5,3 — página, tema claro, largura não separada                                        |
| Design taste | blog | claro  | 768     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | design 5 · usabilidade 5 · criatividade 6 · conteúdo 6 → 5,3 — página, tema claro, largura não separada                                        |
| Design taste | blog | claro  | 390     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | design 5 · usabilidade 5 · criatividade 6 · conteúdo 6 → 5,3 — página, tema claro, largura não separada                                        |
| Design taste | blog | escuro | 1440    | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | não medido                                                                                                                                     |
| Design taste | blog | escuro | 768     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | não medido                                                                                                                                     |
| Design taste | blog | escuro | 390     | design 6 · usabilidade 7 · criatividade 6 · conteúdo 7 → 6,4                                                                         | não medido                                                                                                                                     |

Contas do design taste, tema claro e escuro com a mesma composição: 0,4×6,5 + 0,3×8 + 0,2×6 + 0,1×7 = 6,9 na home a 1440. 0,4×6 + 0,3×7 + 0,2×6 + 0,1×7 = 6,4 na home a 768 e no blog nas três larguras. 0,4×5 + 0,3×7 + 0,2×5 + 0,1×7 = 5,8 na home a 390.

## Awwwards

Escala do relatório de 2026-11-09. Não há nota única na skill. O movimento não entra numa quinta nota: fica dito aqui.

Em 1440 a primeira tela da home é a prancha cinza (dragão inteiro, pagode, serras) ao lado da folha com o nome, a frase e os dois botões. Isso sobe o design de 5 para 6. Não chega a 7 porque a lista «Trabalho em aberto.» e o caderno, com a metade direita vazia, ainda são o miolo de um template. A 768 a pilha continua legível, design 6. A 390 a cumeeira vira um quadrado de 168 px e o botão de pausa senta em cima: design 5, criatividade 5. A ideia do diorama não sobrevive a esse recorte.

No blog, o título e a frase do arquivo estão na primeira tela nas três larguras, e a árvore inteira permanece grande até 390. Usabilidade sobe de 5 para 6. O cartão «Nenhum artigo publicado ainda.» continua na tela seguinte. No escuro, a legenda «Sakura» cai a 1,02:1; essa falha está na linha de UI/UX. O título na folha continua legível, então as quatro notas de Awwwards não descem por causa dela. Conteúdo permanece 7: os dois projetos e o arquivo vazio são verdadeiros. Não há biografia, métrica nem e-mail inventados.

Movimento, contra a skill: não há sequência GSAP, não há Lenis nem Locomotive, não há Three montado. Contra o repositório, essa ausência é a decisão certa. O que existe é o drift em CSS: 11 elementos na home (6 folhas da cumeeira e 5 da onda) e 8 no blog. «Pausar movimento» está na primeira tela nas doze células (`aria-pressed="false"`). Com `prefers-reduced-motion: reduce`, medido só em 1440 no tema claro, as animações caem a 0 e o botão de pausa fica sem caixa (0×0); a folha e a prancha continuam no lugar. Não cliquei o botão para alternar o estado.

## UI/UX

Prioridades pedidas: contraste, alvo, primeira dobra, blog vazio, pausa, dois temas, três larguras.

Contraste que passa 4,5:1, medido em 1440 nos dois temas: h1 da folha 15,79:1; botão primário 15,79:1; pausa 15,79:1; cabeçalho claro 13,85:1; cabeçalho escuro 13,88:1; nota do hero `#5e574e` sobre `#f6f3ec` 6,43:1; «em progresso» 6,43:1 a 14 px, Manrope, não mono. O corpo que o inspector chama de cinza é 6,4:1 a 18 px.

Contraste que não passa, só no blog escuro: a palavra «Sakura» sai `rgb(243, 238, 230)` sobre `rgb(243, 236, 223)`, 1,02:1. A nota «Oito folhas no mesmo quadro. Ilustração com IA.» sai `#c1b6a8` sobre o mesmo papel, 1,7:1. As duas estão em y=836, dentro da dobra de 900. Na home escura a mesma faixa fica na tinta do papel: «Cumeeira» 14,9:1 e a nota 6,06:1. Vi a linha clara no fim da dobra do blog escuro também em 768 e em 390. O ratio foi computado em 1440.

Alvos: na home, nenhum `a` ou `button` visível ficou abaixo de 44×44 nas três larguras. No blog, «RSS» do cartão vazio mede 34×44. Passa o mínimo web de 24×24 da própria busca. Fica abaixo dos 44×44 que a skill pede para toque. «Todos» mede 62×44.

Primeira dobra: o h1 está dentro da viewport nas doze células. No baseline do blog ele começava em y=1165.

Blog vazio: o texto é «Nenhum artigo publicado ainda.», contraste 13,85:1, 27,2 px, dentro de `.archive-empty`. Em 1440 o cartão começa em y=1116. O h2 «O arquivo está pronto.» está abaixo da dobra nas três larguras (y=1040, 1154 e 968). A frase já aparece na folha da primeira tela.

Pausa: na primeira tela nas doze células. Em 390 na home ela mede 156×74 e cobre a prancha de 168 px. Em 1440 ela fica no canto da prancha, 181×44, y=108.

Peso da primeira carga, medido nos resource timings: Cormorant é `cormorant-500.CI0lkEhY.woff2`, 19 512 bytes decodificados. Manrope continua um TTF de 164 700 bytes. As imagens têm `srcset`. Na home a 1440 a cumeeira chega com naturalWidth 1218 e desenha a 728. A onda, com `loading="lazy"`, desenha a 1440 a partir de um naturalWidth 1218. O peso em bytes de cada WebP não foi medido.

## Design taste

A review para no passo «A review stops here». Não houve draw, não houve correção de FAIL. O inspector não reportou FAIL.

WARN da home: `palette-cream`, `grey-body`, `no-footage`, `off-centre` (48 px à esquerda, 26 px à direita em 1440), `still-page` (11 elementos), `lopsided` em 768 («O caderno está abrindo.», 436 px vazios).

WARN do blog: `palette-cream`, `grey-body`, `no-footage`, `off-centre` (48/27 em 1440; também 390, margens 3 e 16), `still-page` (8 elementos).

`palette-cream` e `no-footage` estão em `DESIGN.md` como exceção. O registro não adota outra paleta nem pede filme. GSAP, smooth scroll e Iconify também estão nessa lista e não apareceram no metro. `few-pictures` não disparou: a home tem 11 rasters, o blog 8. `still-page` disparou e não é exceção. Os 8 elementos do blog são as oito folhas da sakura. O contador de camadas explica o número. Não é uma necessidade da referência, e não transforma o WARN em coreografia.

Tetos aplicados, home 1440: margens desiguais e o caderno com 891 px vazios à direita (vi em `desktop-page-01.jpg`; o metro só emitiu `lopsided` em 768) seguram o design em 6,5, e a nota senta nesse teto. `still-page` seguraria o design em 7, teto mais folgado. A passada 3 segura a criatividade em 6: outro nome na folha deixaria o dragão de pé. Sem FAIL, o teto de 6,0 do overall não entra. Fio, sombra em repouso e mono não foram reportados. O corpo a 18 px e 6,4:1 não aciona o teto de «texto pequeno e cinza».

Home 768: o `lopsided` segura o design em 6,5; a nota é 6 porque a pausa cobre o dorso do dragão e a prancha chega espremida no fim da dobra. Usabilidade 7: o nome e os dois botões estão na primeira tela, com esse problema real.

Home 390: a prancha de 168 px com o botão de 156×74 em cima é um recorte acidental. Design 5, criatividade 5. Usabilidade 7: o nome e «Conheça meu trabalho» ocupam a dobra e dá para agir. O metro não marcou `off-centre` nem `lopsided` nesta largura (margens 20 e 20).

Blog, nas três larguras: o título está na primeira tela (2 linhas em 1440 e em 390, 1 linha em 768). Não há botão de ação na primeira tela, então a usabilidade não passa de 7. A segunda tela em 1440 está a 0,29 de preenchimento: um cartão e «Página 1 de 1» num campo de creme. Design 6, abaixo do teto 6,5 do `off-centre`. Criatividade 6 pela passada 3. Conteúdo 7: o vazio é verdadeiro e a frase é específica. No escuro a usabilidade permanece 7 porque o contraste 1,02:1 da legenda é o exemplo de «um problema real» dessa faixa, e o h1 continua legível.

```
ROUND 1 — home, tema claro, 1440
Seen in one second: o nome numa folha, ao lado de um dragão de papel cinza inteiro.
Idea (one sentence): A folha estável carrega o nome e a prancha muda fica ao lado, sem frase.
Live thing: Pausar movimento e Tema escuro. O drift é o das folhas.
Layout words by section: hero=folha-ao-lado-da-prancha / trabalho=lista / koi=folha-sobre-a-onda / caderno=faixa / footer=split
Scores: design 6,5 · usability 8 · creativity 6 · content 7 → overall 6,9
Caps applied: off-centre e a faixa do caderno com a direita vazia seguram design em 6,5. still-page seguraria design em 7. Passada 3 segura criatividade em 6. Sem FAIL, o teto 6,0 do overall não se aplica.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-page-01.jpg, faixa inferior — o caderno ocupa a esquerda e deixa cerca de 891 px de creme à direita.
2. desktop-fold.jpg — as margens externas medem 48 px e 26 px.
3. mobile-fold.jpg — a cumeeira vira um selo de 168 px e «Pausar movimento» cobre o monte.
```

```
ROUND 1 — blog, tema claro, 1440
Seen in one second: «Notas & descobertas.» numa folha, ao lado da cerejeira inteira.
Idea (one sentence): O arquivo abre com a árvore de papel e o título na mesma tela.
Live thing: Pausar movimento. O filtro «Todos» está sozinho.
Layout words by section: hero=folha-ao-lado-da-prancha / arquivo=faixa / footer=split
Scores: design 6 · usability 7 · creativity 6 · content 7 → overall 6,4
Caps applied: off-centre segura design em 6,5 (a nota é 6). still-page, com 8 folhas, segura design em 7. Sem botão de ação na primeira tela, usabilidade não passa de 7. Passada 3 segura criatividade em 6. Sem FAIL, o teto 6,0 não se aplica. A nota 6,4 está acima do 5,3 do baseline e abaixo do teto.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-page-01.jpg — a segunda tela está a 0,29: um cartão «Nenhum artigo publicado ainda.» e o resto é chão.
2. desktop-fold.jpg — as margens medem 48 px e 27 px.
3. No tema escuro, blog-dark-1440-fold.jpg — «Sakura» mede 1,02:1 sobre o papel da prancha.
```

Um site do dia, na calibração da rubrica, fica em torno de 7,5 a 8,0. A home em 1440 ficou em 6,9. O blog ficou em 6,4.

## Três mudanças que mais moveriam a nota

Não foram feitas.

**Awwwards**

1. Em 390, devolver à cumeeira o tamanho de prancha. Hoje é um quadrado de 168 px com o botão de pausa por cima, e é aí que design e criatividade caem para 5.
2. Fazer a lista de projetos e o caderno continuarem a folha da primeira tela. O caderno deixa a direita vazia; a lista é o trecho genérico.
3. Sentar a folha de «A bagagem vira método.» ao lado da onda, como o nome já fica ao lado da cumeeira. Vi a folha cobrindo a onda em `desktop-page-01.jpg` e em `tablet-page-01.jpg`. Não medi esse cruzamento em pixels. GSAP, Lenis e Three continuam fora. A nota de movimento não sobe com essas bibliotecas.

**UI/UX**

1. No blog escuro, pintar «Sakura» e «Oito folhas…» com a tinta que a home escura já usa na legenda (14,9:1 e 6,06:1). Hoje estão em 1,02:1 e 1,7:1, dentro da primeira tela.
2. Tirar «Pausar movimento» de cima da prancha em 390. O botão mede 156×74 e a imagem mede 168×168.
3. Alargar o «RSS» do cartão vazio de 34×44 para pelo menos 44×44, e trazer o cartão «Nenhum artigo publicado ainda.» para a primeira tela. O título já está lá; o cartão começa em y=1116 em 1440.

**Design taste**

1. Fechar o vazio do caderno: 891 px à direita em 1440, 436 px em 768. É o teto de design da home.
2. Igualar as margens externas (48 e 26 na home em 1440; 48 e 27 no blog). É o `off-centre`.
3. Fazer a segunda tela do blog, hoje a 0,29, ser a folha do arquivo vazio em vez de um cartão no meio do creme. O `still-page` (11 na home, 8 no blog) permanece WARN: são as folhas do contador, não um sistema de entrada. Não proponho GSAP para apagá-lo.

## O que não foi medido

- Contagem FAIL/WARN do inspector no tema escuro. Os prints e a geometria do escuro são do Playwright.
- `lint.mjs`, `npm run validate`, `npm run test:e2e`, `npm run format:check` desta onda. Não houve mudança de código antes deste arquivo.
- Teclado além do que a geometria mostra. O skip link não foi percorrido com Tab. O botão de pausa não foi clicado.
- `prefers-reduced-motion` fora de 1440 no tema claro.
- Larguras 375 e 1024. Zoom. CLS. Lighthouse. Peso em bytes dos WebP.
- O deslocamento do parallax de ponteiro.
- About, projetos, currículo, privacidade, artigo e RSS como página.
- O retângulo de `.archive-empty` em 768 e em 390. Nessas larguras medi o h2 do arquivo, que fica abaixo da dobra.
- O cruzamento, em pixels, da folha «A bagagem vira método.» com a onda.

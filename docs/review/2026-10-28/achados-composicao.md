# Composição — 2026-10-28

Auditoria da home em `http://127.0.0.1:4174/` (dist em `/tmp/kittiwake-review/dist`, CSS idêntico ao `index.css` do repo). Viewports 1440×900, 768×1024 e 390×844, temas claro e escuro, primeiro écran e página. Contraste: par de PNG com o texto transparente e com os `.cut` ocultos; mediana dos pixels que mudam ≥ 16 níveis. Capturas brutas em `/tmp/kittiwake-comp/sheets/`. Esta página não propõe correção.

## Causa de B1

B1 fica de pé. Não é linha nova.

`.cloud-hero` (`index.css:1238`) define `place-items: center` e não mexe em `grid-template-columns`. Esse trilho continua o de `.hero` (`index.css:162`): `.92fr 1.08fr`. O céu é `position: absolute` (`index.css:1245`); o único item da grade é `.hero-copy`, com `grid-column: auto`, na primeira coluna. `place-items: center` centra a cópia dentro dessa coluna, não no hero.

Medido no claro, igual no escuro:

| Viewport | Colunas usadas | Cópia | Vão à direita | Papel nesse vão |
|---|---|---|---|---|
| 1440 | 627,1 px + 736,1 px, gap 28,8 px | 448 px, x=114, centro 382 px à esquerda do meio | 878 px (61%) | 91,9% (`#f6f6f6`) |
| 768 | 324,1 px + 380,5 px, gap 15,4 px | 260 px, centro 198 px à esquerda | 452 px (59%) | 89,9% |
| 390 | 358 px (`1fr`) | 340 px, centro no meio | 25 px (6%) | a cópia ocupa a largura |

O `1fr` só entra em `max-width: 700px` (`index.css:745`). De 701 px para cima o vão é o mesmo mecanismo. Evidência visual: `hero-1440-claro.jpg`, `hero-768-claro.jpg`.

## O que já estava aceito

Medido de novo, sem linha nova:

- **A2.** Frase e links do rodapé sobre raiz e musgo. Claro, 1440: frase mediana 1,9:1; Privacidade 3,2:1; Voltar ao início 2,3:1; Pausar movimento 2,0:1. O escuro repete a faixa 1,5–2,3:1. O nome grande encosta na raiz em cerca de 1% da caixa (mediana 4,2 no claro); isso não chega a outro achado.
- **A3.** No 390 claro o título e o lede da gravura têm mediana 15,8:1 e p05 2,1–2,3: a espiral cobre um trecho, o bege não. Currículo sobre `cloud-b`: 13,6:1 no claro e 1,2:1 no escuro. A colisão descrita em A3 permanece; o par que falha de fato no link é o tema escuro.
- **B4.** Sakura a 1440: 460×450 px, 58 px além da direita da seção e 27 px além da base. Seção com 431 px de altura.
- **B5.** O koi do card mede 330×513 px naturais e aparece a 767×392 px em 1440.
- **B8.** A faixa da gravura tem 640 px. No escuro a amostra do terço inferior é `#e7dac3` (6% de pixels de `--paper`). A sombra fixa some no `#111`. O texto claro em cima desse bege é o COMP-1, não uma repetição de B8.
- **D1.** 15 tamanhos de fonte no 1440, de 13 px a 136,8 px. Nenhum parágrafo passa de 75 caracteres na linha.

`#FAF9F6` não entra como defeito. `--paper` do arquivo servido é `#fff` (`index.css:14`); esta auditoria não pede outra folha. Sombra de `.cut`, recortes PNG e ilustração CSS/SVG (decisão 6) não são achado para remoção.

## Crítica

Leitura das 14 passagens nas seções pedidas. Notas de jurado, uma rodada: design 6, usabilidade 5, criatividade 7, conteúdo 7 → 6,0. O vão do hero segura o design em 6,5; o título da gravura ilegível no escuro segura a usabilidade em 6. A sombra de recorte e a falta de fotografia não abaixam a nota como pedido de troca: são a linguagem combinada.

**Hero.** Em um segundo, o nome. O botão está no primeiro écran. As massas são o título, o monte e o pagode; o lado direito é chão de papel (passagem 5), não descanso. A cópia não usa a borda do `.wrap` (x=48): o bloco começa em x=114. A nota de 14 px cai sobre o monte (passagem 13). No 390 a cópia centraliza e a arte continua nos cantos (B2). Há um botão real. O tema e, mais abaixo, o filtro e o scrub são a coisa viva.

**Gravura.** Full-bleed de recortes, título à esquerda e lede à direita. No claro o bege segura o título; a espiral come o botão (1440/768) e um pedaço do título no 390 (A3). No escuro a tinta clara fica no PNG, que não troca de tema: o título some. O botão “Desdobrar gravura” não entrega movimento (A1, fora desta dimensão).

**Projetos.** Três splits alternados (imagem à esquerda, à direita, à esquerda). É o mesmo tipo de layout três vezes, com o segundo invertido. Os kickers acima do título já são B9. Os dois primeiros cards são desenho CSS; a decisão 6 tira isso desta revisão. O terceiro card é o koi esticado (B5). A faixa entre os projetos e o “sobre” é um corte de tema, não um buraco.

**Arquivo.** Título à esquerda, lede à direita, cartão vazio no meio, sakura no canto (B4). No claro o lede sobre a flor mede 11,9:1. No escuro o fim da frase cai para 1,5:1. O estado vazio diz que o caderno está abrindo; o texto cabe e tem título.

**Rodapé.** O nome é o cartaz. A barra de baixo atravessa raiz e musgo (A2) nos dois temas. `hero-foot` entre o hero e a gravura continua o D2.

## Achados novos

| ID | Sev | Achado | Evidência | Regra | Onda |
|---|---|---|---|---|---|
| COMP-1 | P0 | No tema escuro, título, lede e (no 390) o botão da gravura usam tinta clara sobre o PNG bege, que não acompanha o tema. Título: mediana 1,06:1 em 1440 (67% da caixa), 1,06:1 em 768 (99%) e 1,07:1 em 390 (88%). Lede: 1,06:1 em 1440 (31% da linha) e 1,07:1 em 390 (92%). | `gravura-1440-escuro.jpg`, `gravura-390-escuro.jpg`; `index.css:35-38`, `index.css:1372` | WCAG 1.4.3 | composição |
| COMP-2 | P0 | A nota do hero (14 px, `--muted`) senta em `.mtn-back`. No escuro a mediana é 1,56:1 e 1,57:1 (73% e 89% da linha). No claro a mediana é 5,09:1 e 4,96:1; o p05 cai a 1,9 e 1,4 onde a hachura cruza o glifo. | `hero-1440-claro.jpg`, `hero-1440-escuro.jpg`; `index.css:1310-1315`, `index.css:1365` | WCAG 1.4.3; crítica, passagem 13 | composição |
| COMP-3 | P1 | “Desdobrar gravura”, no claro, fica inteiro sobre a espiral em 1440 (mediana 2,81:1) e em 768 (2,78:1). No 390 claro o botão está no bege e mede 15,9:1. No escuro, em 1440/768, a mediana do botão é 6,0:1 (o p05 da borda é 1,1). | `gravura-1440-claro.jpg`; `index.css:1373` | WCAG 1.4.3 | composição |
| COMP-4 | P1 | No escuro, o fim do lede do arquivo (“e perguntas que continuam abertas.”) cruza a sakura: mediana 1,47:1 em 32% da linha, a 1440. No 390 a primeira linha do lede mede 1,52:1 em 20% (pétalas). No claro a mesma frase mede 11,9:1. | `arquivo-1440-escuro.jpg`; `index.css:1381` | WCAG 1.4.3 | composição |
| COMP-5 | P1 | Zoom 200% em 1440×1400: `scrollWidth` 1447 e `innerWidth` 1440 (7 px). A lista de `.cut` sobre texto de `.wrap` veio vazia. Quem estoura é `.contact-copy` (direita em 1447). Com o zoom, o `.wrap` cai a 624 px e o `gap: 8vw` continua 115,2 px; as colunas usadas são 409,7 px + 150,6 px. Na mesma tela o botão do contato quebra em três linhas e o nome do rodapé (`nowrap`, `9.5vw`) é cortado em “Guilherme Tra” — o `overflow: hidden` do rodapé impede esse nome de aumentar o `scrollWidth`. Grades de sobre, projeto e princípios cabem (direita em 1344). Sem zoom, 1440/768/390 não têm overflow horizontal. | `zoom-contato-1440.jpg`; `index.css:105-107`, `index.css:568-575`, `index.css:583-589`, `index.css:1387` | WCAG 1.4.10; focus-5 | composição |

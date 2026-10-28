# Revisão de direção de arte: kittiwake (estado de 28/10)

Não editei nenhum arquivo. Minhas capturas estão em `/tmp/kittiwake-review/opus/`: `full-1440-light.jpg`, `full-1440-dark.jpg`, as de `projetos`, `sobre` e `contato` nos dois temas, e `accent-test.png`.

## A. Diagnóstico em 10 linhas

1. **A fonte de título está quebrada, e é a primeira coisa que um juror vê.** O `assets/fonts/cormorant.woff2` desenha os acentos soltos: o ^ de "você" flutua, o acento de "está" corta o t, e "método", "Além" e "é humana" também saem tortos. Confirmei num teste isolado (`accent-test.png`): com Georgia o mesmo texto sai certo, então o defeito é do arquivo da fonte. Num site em português isso aparece em todo título grande.
2. **A linguagem cobre só 39% da página.** As três cenas somam cerca de 2.500 px de 6.412. Os outros 61% são interface de template: cards cinza com desenhos de linha em CSS, um bloco preto chapado e um rodapé com sobras de recorte. As referências enchem a área toda, de ponta a ponta, em degraus de tom.
3. **"Sobre" é uma laje preta no tema claro e clara no escuro.** É a maior quebra de tom da página e não tem relação nenhuma com papel nem com gravura.
4. **Os desenhos dos projetos são traço fino de 1 px.** O método do próprio dono proíbe isso ("ilustração com contorno"). O card 3 mostra um koi de 330 px ampliado 2,3 vezes, que no tema escuro fica azul ciano por causa de um `filter:invert(1)` (`index.css:489`). O link desse card aponta para `#hero`.
5. **A física do papel está errada.** Todo `.cut` recebe `drop-shadow(6px 10px 0)` duro, por cima de PNGs que já trazem sombra. Resultado: cada peixe, pedra e pedaço de musgo ganha um gêmeo cinza deslocado, que parece impressão fora de registro e não papel. Os furos do musgo viram manchas cinza.
6. **As costuras entregam o recorte automático.** Aparecem cortes retos verticais nas bordas das peças: nuvem do dragão em x≈1385 e x≈610, espirais em x≈835 e x≈1195. Cada cena também termina numa linha horizontal reta, seguida de 150 px de papel vazio. Os fundos em PNG (`beige-background`, `soft-pink-background`) carregam "fantasmas" borrados da imagem original e estão ampliados de 2 a 4 vezes em telas retina.
7. **O koi não é a referência.** O poder da imagem do koi está na massa diagonal da onda, com espuma. O recorte automático só extraiu as espirais, então a cena virou bolinhas verdes espalhadas em volta de cinco peixes, sem a onda e sem os arcos de água em volta do cardume.
8. **O hero é a melhor cena, mas tem dois erros.** O pagode flutua no ar: na referência ele coroa o pico central. E a folha de texto faz a coisa certa ao ficar parada, em cota +1, com contraste correto. O erro é que ela é um retângulo de interface de 560 px com sombra dura, que cobre a metade esquerda da cena sem pertencer a ela: não tem a segunda folha de baixo, não tem sombra macia, não conversa com a grade.
9. **O tema escuro vira uma zebra.** A sequência é preto, creme, preto, claro, rosa, preto. No hero, o papel branco sobre o quase-preto parece adesivo em lousa. No arquivo, o card do estado vazio fica com fundo escuro e texto forçado escuro (`#1F1F1F`), ou seja, ilegível.
10. **O ritmo é de template.** O mesmo cabeçalho de seção se repete quatro vezes (título grande à esquerda, texto miúdo a 1.300 px de distância). Sobra a faixa `hero-foot` entre hero e koi. O contato tem 213 px de altura e o nome aparece duas vezes no fim. Filtros para três projetos são teatro de interface. O que o juror marca, em ordem: acento quebrado, sombra dupla e costuras, laje preta, desenho de linha nos projetos, zebra do tema escuro.

## B. As 5 mudanças de maior impacto, em ordem

### 1. Trocar a fonte Cormorant (custo mínimo, impacto máximo)
- **O que fazer:** substituir `assets/fonts/cormorant.woff2` pela Cormorant Garamond oficial do Google Fonts, com os subconjuntos latin e latin-ext, pesos 400 a 600. Pode ser variável ou dois estáticos. Manter o nome do arquivo, para que o `site_builder.py` (linhas 271, 378 e 454) continue funcionando sem mudança. Apagar o `cormorant.ttf` de 1,1 MB se ele não for o arquivo de fallback.
- **Por que:** hoje todo título com acento sai quebrado.
- **Como verificar:** renderizar "você está é ó ã ç Além" em 90 px (o mesmo teste de `accent-test.png`) e capturar o `#contact-title` e o `#archive-title` a 1440.

### 2. Cenas viram pranchas montadas, nos dois temas, com física de papel correta
- **Pranchas fixas.**
  - Hoje só o koi e o arquivo têm papel próprio e tinta fixa. Fazer o mesmo com o `.cloud-hero`: fundo fixo `#F3F1EC` (ou `#FAF9F6`) e tinta `#1F1F1F`, que não mudam com o tema.
  - As três cenas ficam recuadas da borda da tela, com `margin-inline: clamp(12px, 2vw, 32px)` e cantos de 2 px, como gravuras montadas sobre a mesa. No escuro, a página vira a moldura. Isso resolve a zebra e o efeito de adesivo sem precisar de arte escura.
- **Folha de texto do hero (`.hero-sheet`).** Aplicar a regra "pilha dura + sombra macia" do próprio método, com uma folha de baixo visível e uma sombra macia curta, por exemplo `box-shadow: 6px 6px 0 var(--line), 6px 6px 0 1px var(--muted-line), 0 18px 32px rgb(21 21 21/.10)`. A folha pode passar um pouco da borda inferior da prancha (`translateY(48px)`), o que cria profundidade em vez de tampar a cena.
- **Sombra dos recortes (`.cut` em `index.css:1362`).**
  - Trocar por `drop-shadow(1px 2px 0 rgb(21 21 21/.10)) drop-shadow(3px 6px 8px rgb(21 21 21/.12))`.
  - Nas peças que já têm sombra embutida (peixes, árvore, musgo), usar `filter:none`.
  - Remover o bloco `@media reduced-motion .cut` duplicado.
- **Fundos (`.koi-paper` e `.pink-sky`).**
  - Remover os dois PNGs de fundo e usar a cor do papel em CSS (`#F1E5CC` e `#F7EAE8` já estão no CSS), sem `.cut`, sem dobradura e sem scrub.
  - No `index.js`, o `gsap.from(layers…)` não pode incluir os planos de fundo.
- **Costuras.** Em cada peça cortada pelo recorte automático, ou empurrar a borda reta para fora da prancha (com `overflow:hidden`), ou aplicar `mask-image: linear-gradient(...)` de 24 px nessa borda.
- **Card do arquivo.** `.archive-section .archive-empty {background:#FAF9F6}`.
- **Card do koi.** Apagar `[data-theme=dark] .print-picture img {filter:invert(1)}`.
- **Por que:** isso resolve de uma vez o tema escuro, o gêmeo cinza, as costuras e o fundo sujo.
- **Como verificar:**
  - capturas de página inteira a 1440 nos dois temas, sem nenhuma faixa preta/clara alternando dentro das cenas;
  - recorte a 200% de um peixe, sem duplicata deslocada;
  - contraste do card do arquivo no escuro igual ou acima de 4,5:1.

### 3. Trazer as seções do meio para a linguagem
Depende dos PNGs da seção C. Dá para começar já com as peças grandes que existem e não estão em uso.
- **Projetos.**
  - Remover o card 3 ("Este espaço, em camadas") e os filtros (`.work-filters` e o bloco de filtros em `index.js:18-25`).
  - Trocar `.sheet-composition` e `.rag-composition` por uma "janela" rebaixada (cota −3 do método): moldura de papel recortada, com 3 a 4 camadas PNG dentro e scrub leve. Prompts C4 e C5.
  - Apagar todo o CSS de `.document`, `.doc-*` e `.rag-*`.
- **Sobre.**
  - `.about-section` sai de `background:var(--ink)` e volta para `var(--paper)`, perdendo a inversão.
  - O `.about-symbol` (SVG de linha) dá lugar a um recorte vertical do caminho de pedra subindo até um torii (C6), à esquerda, de 360 a 420 px de largura.
  - Os três princípios ficam sobre uma única folha de cota +1, com divisores verticais.
- **Contato e rodapé, unidos numa última cena baixa.**
  - Uma lanterna de pedra com luz quente à direita (C7; é o único uso de "luz sódio", como o método prevê).
  - Embaixo, uma faixa de chão contínua de borda a borda (C8, ou provisoriamente `segments (1)/mossy-ground.png` de 1363 px repetido ou espelhado). Ela substitui as raízes e o musgo soltos nos cantos.
  - Remover o segundo "Guilherme Trajano." gigante, ou reduzi-lo a assinatura.
- **Estado vazio do arquivo:** o ícone de documento em CSS vira o caderno aberto com uma pétala (C9), e o card perde a metade esquerda vazia.
- **Por que:** são os 61% da página que hoje parecem template.
- **Como verificar:** na página inteira a 1440, nenhuma faixa de mais de 900 px sem papel recortado, e zero `stroke` em SVG decorativo (`grep -c "stroke-width" templates/home.html` deve dar 0).

### 4. Recompor o koi e o hero conforme as referências
- **Koi, com a onda nova (C1):**
  - a massa da onda ocupa o terço direito em diagonal, de cima à direita até embaixo à esquerda, com 55 a 60% de largura e saindo da prancha;
  - o cardume fica fechado à esquerda: os cinco peixes dentro de um círculo de cerca de 520 px, todos com a mesma direção de nado;
  - os arcos de água (C2) ficam atrás deles;
  - no máximo duas espirais soltas, como respingo;
  - o título fica sobre o papel liso, no alto à esquerda, e o texto de apoio logo abaixo do título, não a 1.000 px de distância.
- **Koi, provisório sem PNG novo:** agrupar `ripple-a`, `ripple-b`, `ripple-c`, `ripple-d` e `ripple-f` sobrepostas em diagonal no lado direito, com 18 a 30% de largura cada, em vez de espalhadas, e fechar o cardume.
- **Hero:**
  - pôr o pagode sobre um pico: usar `segments (4)/mountain-peaks/mountain-peaks-1.png` (505 px) centralizado sob ele, com a base do pagode encostada no cume (`.pagoda {bottom:34%}`, `.peak {left:44%; bottom:8%; width:24%}`), ou usar o C3;
  - pôr `stylized-clouds-4.png` (1404×511, não usada) como banda de nuvem na frente, embaixo, cobrindo a base reta das montanhas;
  - remover a faixa `.hero-foot`.
- **Ritmo:** distância entre pranchas e seções de 96 a 120 px; hoje são 150 px, e `.section-space` está definido três vezes no CSS.
- **Por que:** a composição tem que ler como as referências, com uma peça principal no centro, silhuetas densas atrás e massa baixa na frente.
- **Como verificar:** colocar lado a lado a captura de 1440 do koi e a referência. Ao reduzir as duas para 300 px, a massa verde deve ocupar o mesmo lado e uma proporção parecida.

### 5. Tipografia, hierarquia e limpeza do CSS
- Reduzir a escala para 5 tamanhos:
  - nome: 96 a 108 px;
  - h2: 56 a 64 px;
  - h3: 32 a 40 px;
  - texto de abertura: 20 px;
  - corpo: 16 px.
  - Hoje são 15 tamanhos, de 13 a 136,8 px.
- Rótulos de 12 a 14 px nunca abaixo de `--muted`. Remover os 10 e 11 px que aparecem no mobile (`.work-footnote` e `.inline-links`).
- `.section-heading`: o texto de apoio fica embaixo do título, com no máximo 48ch, em vez de `justify-content:space-between`.
- `index.css` tem cerca de 1.460 linhas de sobrescritas umas sobre as outras (`.cloud-hero`, `.project-picture` e `.section-space` definidos 2 ou 3 vezes, regras mortas de `.art-layer`, `.hero-papercut-*` e `.print-frame`). Antes da próxima rodada, apagar o morto e juntar as regras das cenas num bloco só. Senão cada correção nova continua perdendo para uma regra antiga.
- **Como verificar:** o inspetor de tamanhos de fonte acusa no máximo 6 tamanhos; `grep -c "\.section-space" index.css` dá 1.

## C. Recortes PNG novos para gerar no Grok

Regras para todas as gerações:
- **Prefixo comum em cada prompt:** *"Layered paper-cut artwork in the style of a Japanese woodblock print, cut cardstock sheets with visible paper thickness, short soft shadows cast down-right (light from top-left), matte paper fibers, flat colors per sheet, no outlines, no gradients inside a sheet, no text, no border, no frame, subject fully isolated on a flat uniform #FAF9F6 off-white background, nothing touching the image edges, generous empty margin, high resolution."* Pedir "nothing touching the edges" evita as costuras retas.
- **Resolução:** gerar no maior tamanho possível e ampliar 2 vezes (Real-ESRGAN ou equivalente) antes de recortar. Peças que ocupam a tela toda precisam de pelo menos 2.400 px de largura para telas retina.

| # | Uso | Prompt (depois do prefixo) |
|---|---|---|
| C1 | Massa da onda do koi | "A single huge diagonal ocean wave mass sweeping from top-right to bottom-left, deep jade green (#1E6B52) paper filled with cream concentric seigaiha spirals cut into it, bold white foam crests with round cut-out droplets along its left leading edge, 3–4 stacked layers of green in slightly different values, wide 16:10 composition, the wave occupies the right 60% and the left 40% is empty background." |
| C2 | Arcos de água | "Loose set of thin curved jade-green paper strips forming broken concentric water ripple arcs around an empty center, like ripples around a school of fish, delicate but cut from paper, square composition, center empty." |
| C3 | Pagode no pico | "A five-tiered Japanese pagoda crowning the summit of a steep craggy rock peak, small pine trees and a stone staircase winding up the rock, monochrome grayscale paper in 6 value steps from light gray to charcoal, the peak base fading into a soft paper cloud band at the bottom, portrait 3:4." |
| C4 | Card SDD-Buddy (ideia → especificação) | "A loose crumpled sheet of paper on the left gradually unfolding, to the right, into a neat stack of three precisely cut rectangular sheets, with a single origami paper crane rising from the top sheet, monochrome warm grays with one vermilion (#E2552B) accent on the crane, low horizontal composition 16:10." |
| C5 | Card Micro-RAG (documento → contexto → resposta) | "A small Japanese tansu cabinet of wooden drawers with one drawer pulled open, a scroll unrolling out of it, and a small stone lantern beside it casting a warm amber glow on the scroll, monochrome warm grays with amber (#E8A33D) only in the lantern light, horizontal 16:10." |
| C6 | Sobre (trajetória) | "A winding stone path climbing a layered mountain slope toward a small red torii gate near the top, pine trees along the path, misty paper cloud bands crossing the slope, grayscale paper in stepped values with the torii as the only vermilion accent, tall portrait 2:3." |
| C7 | Contato | "A traditional Japanese stone lantern (tōrō) on mossy ground, its window glowing warm amber with layered paper light rays, a few sakura petals around its base, grayscale stone with moss green and amber light, portrait 3:4." |
| C8 | Chão do rodapé | "Very wide continuous ground strip of mossy earth with small gray rocks, exposed twisted roots and fallen sakura petals, irregular organic top edge, flat bottom edge that touches the bottom of the image, panoramic 5:1." |
| C9 | Estado vazio do arquivo | "An open blank paper notebook lying flat, pages slightly curled, a single pink sakura petal resting on the right page and a brush resting beside it, warm off-white and gray paper with the petal as the only color, square 1:1." |
| C10 | Nuvem de transição (se `stylized-clouds-4` não bastar) | "Long horizontal band of swirling Japanese auspicious clouds (xiangyun) in white and light gray paper layers, flat bottom, swirled top edge, panoramic 4:1." |

Não gerar fundos: as cores de fundo saem em CSS.

## D. O que não mexer

- A direção (papercut em camadas, gravura japonesa, as três cenas dragão/koi/sakura) e a paleta fixa. Nenhum branco puro e `--paper:#FAF9F6` já está correto.
- A ideia de folha de texto parada sobre a cena no hero: é o método certo. Só falta a folha de baixo e a sombra macia.
- O conjunto do dragão com a nuvem e a árvore sakura grande. São as peças com mais qualidade e escala certa.
- A mecânica do movimento em `index.js`: Lenis como única rolagem suave, scrub por `data-depth`, desligar tudo em `unmount()` quando o movimento é pausado ou reduzido, dobradura que roda uma vez só, e `pagehide` limpando. Só tirar os fundos da dobradura.
- A cópia do hero ("Venho de vendas. Construo com código.") e o botão primário escuro. São claros e têm contraste.
- O cabeçalho com os links em pílulas de papel sobre a cena.

---

Não verifiquei:
- o mobile das seções do meio, além das capturas de 390 que já existiam;
- a causa exata da fonte quebrada: o fontTools não está instalado, então não inspecionei os glifos;
- o teste com o `cormorant.ttf`, que não carregou no servidor e por isso não prova nada.

Risco: as mudanças 3 e 4 dependem dos PNGs novos. Se a geração não sair a pelo menos 2.400 px e sem nada encostando nas bordas, as costuras e o borrão em tela retina voltam.

### Arquivos críticos para a implementação
- /home/tj/orca/workspaces/MYWEBPG/kittiwake/index.css
- /home/tj/orca/workspaces/MYWEBPG/kittiwake/templates/home.html
- /home/tj/orca/workspaces/MYWEBPG/kittiwake/templates/footer.html
- /home/tj/orca/workspaces/MYWEBPG/kittiwake/assets/fonts/cormorant.woff2
- /home/tj/orca/workspaces/MYWEBPG/kittiwake/index.js

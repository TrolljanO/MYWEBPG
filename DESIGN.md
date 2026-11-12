# Sistema visual provisório

## Brief

O proprietário pediu apenas o esqueleto e vai refazer todo conteúdo e design. Aplicar a skill awwwards à fundação, sem inventar biografia, estudos de caso ou métricas. Exemplos editoriais ficam como rascunhos. Nenhum objetivo de obter nota de júri ou finalizar identidade nesta entrega.

## Conceitos considerados

| Ideia                | Âncora                               | Assinatura                                   | Emoção / frame                       | Originalidade / adequação / viabilidade / portabilidade |
| -------------------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| Estudo espacial      | Software e IA como experimentação    | Estrutura 3D mínima, rotacionável e pausável | Curiosidade; tipografia com diagrama | 3 / 4 / 5 / 4                                           |
| Caderno de hipóteses | Publicação técnica contínua          | Notas e índices editoriais                   | Clareza; índice tipográfico          | 3 / 4 / 5 / 4                                           |
| Trajetórias          | Nome Trajano e percurso profissional | Linhas que conectam projetos                 | Continuidade; mapa de caminhos       | 3 / 3 / 4 / 4                                           |

Escolha em 2026-11-09, a pedido do proprietário: diorama de papercut. Cada cena é uma pilha de pranchas com o mesmo tamanho. O alfa cobre o quadro inteiro e o motivo fica na coordenada em que foi desenhado. Não se recorta a folha para depois reposicionar no CSS.

Idea: a página segura um diorama de papel, e cada folha conta uma distância.
Metaphor: gravura japonesa cortada em planos, não um modelo 3D.
Signature: três cenas. Cumeeira na abertura, koi na onda no meio, sakura no arquivo.
Emotion: papel, tinta e um pouco de teatro de caixa.
Motion verb: assentar como folha; o deslocamento é curto e mais forte nas folhas da frente.
Screenshot: o nome na folha da frente de uma caixa de luz; o dragão no vão, atrás de cinco folhas recortadas.

## Sistema

Papel #f6f3ec, tinta #1c1916, superfície #ebe4d8, secundário #5e574e, linha #d5cdc0, acento #7a2f2c. O prato da koi e da sakura permanece #f3ecdf nos dois temas. A cumeeira é exceção: é uma caixa de luz (ver abaixo). Cormorant Garamond local no título, Manrope na interface. Display fluido, tracking negativo. Radius 0.9rem nos botões e controles. Ease expo-out. As pranchas são `PlateStage` em CSS. O ponteiro só ajusta o deslocamento. O blog tem tema e movimento de papel: um canvas WebGL amassa, assenta e para. Sem movimento, com Save-Data ou sem WebGL, o fundo fica na textura CSS.

Tema escuro, em `:root[data-theme='dark']` e quando o sistema pede escuro sem tema explícito. Os tokens saem de `src/styles/tokens.css`. Não há preto nem branco puro:

| Token           | Valor     |
| --------------- | --------- |
| `--bg`          | `#171614` |
| `--surface`     | `#24211d` |
| `--text`        | `#f3eee6` |
| `--muted`       | `#c1b6a8` |
| `--line`        | `#3c3832` |
| `--accent`      | `#e7b2a4` |
| `--on-accent`   | `#1c1916` |
| `--paper`       | `#f3ecdf` |
| `--sheet`       | `#171614` |
| `--sheet-under` | `#24211d` |

A seção de trabalho, o caderno e o rodapé seguem o tema: usam `--bg`. Só o prato da koi e o da sakura ficam em `#f3ecdf` nos dois temas.

O blog, em `[data-surface='blog']`, usa outra tinta. No claro, `--bg` é `#f2ecdf` e `--text` é `#211d19`. No escuro, `--bg` é `#1d1b18` e `--text` é `#e9e2d6`. A folha `.paper-sheet` segue o tema, na cor da página. Fica em `#f6f3ec` com tinta `#1c1916` nos dois temas só quando está sobre o prato claro da arte: a folha do método em janela larga e a folha das notas do blog em janela larga. O campo de papel existe só no blog. A home e os projetos não montam esse canvas.

Caixa de luz da cumeeira, escolha de 2026-11-11 a pedido do proprietário, com referência em caixas de luz de papel recortado. A cena de seis pranchas fica no fundo, num quadro só, sem ampliar. As folhas da frente escondem cerca do quarto de baixo da cena e quase toda a prancha das nuvens da frente. Cinco folhas com um vão liso e orgânico ocupam a largura do palco; o vão cresce do fundo para a frente. As folhas não são imagem: são máscaras CSS geradas em `PlateStage` (`variant="lightbox"`). O proprietário pediu, no mesmo dia, um desenho mais limpo, no estilo neumorphism, sem reta e sem quina afiada: as folhas quase não mudam de cor e o relevo vem de uma luz e uma sombra macias (`--soft-hi`, `--soft-lo`, `--box-edge`, `--box-shade`); o cartão do nome, os botões do hero e o botão de pausa são arredondados e sem linha dura. No tema claro é papel branco com sombra entre as folhas. No tema escuro a luz vem de trás: a cena fica âmbar, as folhas escurecem para a frente e a da frente tem a cor da página. Os tokens são `--box-*` em `src/styles/tokens.css`. No escuro o nome fica direto sobre a folha da frente, sem cartão. A partir de 1000 px de largura o nome fica ao lado do vão. Abaixo disso o palco tem 46svh, o nome vem depois dele e a legenda depois do nome.

Relevo macio e escala, pedido do proprietário em 2026-11-11 (dez anotações sobre a home):

- Toda folha (cartão de projeto, caderno, folha do método, leitura, arquivo) tem canto de `--radius-sheet` (1.5rem), a cor da página e uma luz e uma sombra macias (`--soft-hi`, `--soft-lo`). A segunda folha deslocada em bloco saiu.
- Todo `.button` tem o mesmo relevo, sem borda de 1px. Apertado, o relevo afunda. O primário continua preenchido.
- O botão de tema é uma lâmpada em SVG inline: acesa e preenchida no tema claro, só contorno no escuro. O nome acessível continua «Ativar tema claro/escuro».
- A barra do topo tem a cor da página e uma sombra macia embaixo. A borda de cima e de baixo dos palcos some na cor da página por máscara. Blur não foi usado: ele não amacia a linha entre duas cores chapadas.
- A home não mostra legenda nas duas cenas. O crédito das ilustrações fica em `src/assets/diorama/CREDITOS.md`.
- Escala menor. Barra de 88 para 60 px (`--header-h`). Corpo de 18 para 16 px. Título de abertura de até 99 para até 68 px. Título de seção de até 56 para até 42 px. Botões de 48 para 44 px de altura. O corpo do artigo do blog (`--step-read`) não mudou.
- Na koi as cinco folhas usam o mesmo `object-fit`, para a onda de trás não sair do registro.

Composição, como o código monta hoje:

```text
Home:       [nome na folha da frente | cumeeira no vão de uma caixa de luz, largura total]
            [trabalho no papel #f6f3ec]
            [koi | folha do método sobre o capítulo]
            [caderno no mesmo papel claro]
Blog:       [sakura em oito pranchas | folha das notas no papel claro]
            [fundo no tema do blog, com o campo de papel]
            [arquivo vazio até o primeiro texto publicado]
Sobre:      [coluna de leitura]
Rodapé:     [contato      | redes] no papel #f6f3ec, nos dois temas
```

Sem loader, cursor artificial, smooth scroll ou transições de rota: não ajudam a tarefa de entregar um esqueleto. A geometria é substituível; não há imagens fictícias de projetos. Ausência de casos e textos finais impede avaliar originalidade/conteúdo como site de portfólio concluído.

## Regras

- A folha de texto é estável. Na home o nome fica sobre a folha da frente da caixa de luz, fora do vão.
- O cenário não carrega informação. As pranchas são o diorama; a leitura está na folha.
- GSAP não entra no layout base nem nas páginas de leitura.

## Exceções ao inspetor (D4)

Estas marcas ficam registradas como exceção ao inspetor. O registro não adota nenhuma das cinco:

- `palette-cream`
- `no-footage`
- GSAP
- smooth scroll
- Iconify

Nas páginas de leitura, `few-pictures` e `still-page` também ficam como exceção. São sobre, currículo, privacidade, a lista de projetos, o estudo de caso e o artigo. A home e o blog mantêm o diorama.

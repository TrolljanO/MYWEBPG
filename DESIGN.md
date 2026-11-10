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
Screenshot: o nome numa folha estável, ao lado da cumeeira e fora do palco.

## Sistema

Papel #f6f3ec, tinta #1c1916, superfície #ebe4d8, secundário #5e574e, linha #d5cdc0, acento #7a2f2c. O prato do diorama permanece #f3ecdf nos dois temas. Cormorant Garamond local no título, Manrope na interface. Display fluido, tracking negativo. Radius 2px. Ease expo-out. A cena é `PlateStage`: CSS, sem canvas. O ponteiro só ajusta o deslocamento.

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
| `--sheet`       | `#3c3832` |
| `--sheet-under` | `#24211d` |

A seção de trabalho e o rodapé ficam no papel claro nos dois temas. O fundo deles é `#f6f3ec`. O prato, a abertura e o capítulo da koi ficam em `#f3ecdf`.

Composição, como o código monta hoje:

```text
Home:       [folha com o nome fora do palco | cumeeira em seis pranchas]
            [trabalho no papel #f6f3ec]
            [koi | folha do método sobre o capítulo]
            [caderno no mesmo papel claro]
Blog:       [folha das notas fora do palco | sakura em oito pranchas]
            [arquivo vazio até o primeiro texto publicado]
Sobre:      [coluna de leitura]
Rodapé:     [contato      | redes] no papel #f6f3ec, nos dois temas
```

Sem loader, cursor artificial, smooth scroll ou transições de rota: não ajudam a tarefa de entregar um esqueleto. A geometria é substituível; não há imagens fictícias de projetos. Ausência de casos e textos finais impede avaliar originalidade/conteúdo como site de portfólio concluído.

## Regras

- A folha de texto é estável. O nome fica nela, fora do palco da cumeeira.
- O cenário não carrega informação. As pranchas são o diorama; a leitura está na folha.
- GSAP não entra no layout base nem nas páginas de leitura.

## Exceções ao inspetor (D4)

Estas marcas ficam registradas como exceção ao inspetor. O registro não adota nenhuma das cinco:

- `palette-cream`
- `no-footage`
- GSAP
- smooth scroll
- Iconify

`few-pictures` e `still-page` não entram nesta lista.

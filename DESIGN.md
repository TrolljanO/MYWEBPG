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
Screenshot: o nome numa folha estável sobre a cumeeira.

## Sistema

Papel #f6f3ec, tinta #1c1916, superfície #ebe4d8, secundário #5e574e, linha #d5cdc0, acento #7a2f2c. O prato do diorama permanece #f3ecdf nos dois temas. Tema escuro usa carvão #171614 e texto #f3eee6, sem preto ou branco puro. Cormorant Garamond local no título, Manrope na interface. Display fluido, tracking negativo. Radius 2px. Ease expo-out. O diorama anima em CSS; o ponteiro só ajusta o deslocamento. GSAP e Three.js não entram na home nesta etapa.

Composição:

```text
Home:       [cumeeira em pranchas / folha com o nome / projetos em folhas / koi]
Blog:       [sakura / caderno vazio até o primeiro texto publicado]
Sobre:      [coluna de leitura]
Rodapé:     [contato      | redes]
```

Sem loader, cursor artificial, smooth scroll ou transições de rota: não ajudam a tarefa de entregar um esqueleto. A geometria é substituível; não há imagens fictícias de projetos. Ausência de casos e textos finais impede avaliar originalidade/conteúdo como site de portfólio concluído. Remover acessórios: a única cena fica na home; blog permanece estático.

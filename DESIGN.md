# Sistema visual provisório

## Brief

O proprietário pediu apenas o esqueleto e vai refazer todo conteúdo e design. Aplicar a skill awwwards à fundação, sem inventar biografia, estudos de caso ou métricas. Exemplos editoriais ficam como rascunhos. Nenhum objetivo de obter nota de júri ou finalizar identidade nesta entrega.

## Conceitos considerados

| Ideia                | Âncora                               | Assinatura                                   | Emoção / frame                       | Originalidade / adequação / viabilidade / portabilidade |
| -------------------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| Estudo espacial      | Software e IA como experimentação    | Estrutura 3D mínima, rotacionável e pausável | Curiosidade; tipografia com diagrama | 3 / 4 / 5 / 4                                           |
| Caderno de hipóteses | Publicação técnica contínua          | Notas e índices editoriais                   | Clareza; índice tipográfico          | 3 / 4 / 5 / 4                                           |
| Trajetórias          | Nome Trajano e percurso profissional | Linhas que conectam projetos                 | Continuidade; mapa de caminhos       | 3 / 3 / 4 / 4                                           |

Escolha provisória: estudo espacial, porque demonstra a integração 3D sem comprometer a futura direção artística. A portabilidade alta é intencional para um boilerplate.

Idea: um espaço de trabalho para ideias em construção.
Metaphor: desenho estrutural de um experimento.
Signature: wireframe leve que responde ao ponteiro e scroll.
Emotion: clareza e curiosidade.
Motion verb: orientar; rotações pequenas, links deslocam poucos pixels.
Screenshot: título à esquerda, estudo geométrico à direita.

## Sistema

Fundo #101719, superfície #182225, texto #e9eff0, secundário #a8b8bc, linha #46575c e acento #8cdae5. Tema claro usa o mesmo sistema com contraste recalibrado. Manrope variável local; mono de sistema para metadados. Display fluido 3–7rem, tracking negativo; leitura 18px/1.75 e 72ch (prioridade do PRD). Gutter fluido, largura máxima 1400px, radius 3px. Ease expo-out; CSS 200ms para feedback e GSAP apenas na cena.

Composição:

```text
Home:       [texto e CTAs  | estudo espacial]
Projetos:   [título       | resumo          | tags]
Blog:       [índice editorial em colunas, depois empilhado no mobile]
Sobre:      [coluna de leitura]
Rodapé:     [contato      | redes]
```

Sem loader, cursor artificial, smooth scroll ou transições de rota: não ajudam a tarefa de entregar um esqueleto. A geometria é substituível; não há imagens fictícias de projetos. Ausência de casos e textos finais impede avaliar originalidade/conteúdo como site de portfólio concluído. Remover acessórios: a única cena fica na home; blog permanece estático.

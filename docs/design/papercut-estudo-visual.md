# Estudo visual: gravura japonesa em camadas de papel recortado

## Objetivo e escopo

Encontrar uma direção visual aprovada para uma onda cujos contornos internos sejam recortes sobrepostos, revelando outros desenhos nas camadas inferiores.

Execução exclusiva de geração de imagens, comparação e validação artística. Não modificar o site, implementar animações, produzir componentes ou configurar publicação.

## Método

1. Gerar três estudos independentes, comparáveis: recorte fino, recorte profundo e contorno detalhado. Manter onda frontal, formato 6:5, papel branco, tinta preta, traços ukiyo-e e ausência de texto ou moldura. Variar a construção, não a direção artística.
2. Inspecionar composição e detalhes da crista, curva interna e sobreposições. Pontuar recorte, profundidade, revelação, gravura, continuidade e preparação visual para movimento de 0 a 2. Selecionar resultados com pelo menos 10/12, sem zero nos três primeiros critérios. A pontuação não substitui aprovação estética do usuário.
3. Refinar a referência recomendada, no máximo duas rodadas, com até dois problemas específicos por rodada. Preservar características aprovadas; registrar regressões.
4. Produzir estudos estáticos de camadas fechadas e abertas. Comparar continuidade e alterações involuntárias. Não apresentar essas imagens como frames interpoláveis ou prova de animação funcional.

## Critérios

| Critério | Evidência |
| --- | --- |
| Recorte | Bordas identificáveis como folhas cortadas |
| Profundidade | Sobreposição, oclusão e sombras coerentes |
| Revelação | Desenhos inferiores visíveis nas aberturas |
| Gravura | Traços e hachuras, sem água fotorrealista |
| Continuidade | Curvas coerentes, sem peças fundidas ou impossíveis |
| Preparação para movimento | Peças identificáveis que poderiam se deslocar separadamente |

Rejeitar gravura plana com sombra, túnel genérico e aparência de material espesso. O efeito procurado está dentro dos contornos da onda, não apenas entre objetos da paisagem.

## Entrega

Guardar imagens, prompts e avaliações em `assets/concepts/papercut/`. Usar nomes estáveis e relativos. Registrar cada rodada, decisão, pendência e próxima ação. Confirmar o push antes de fornecer links no GitHub.

Limite inicial: três estudos, duas rodadas de refinamento e dois estados de abertura. Se a direção não for alcançada, revisar o método antes de ampliar a geração.

## Limites da validação

Imagens geradas são referências achatadas, não arquivos em camadas. Sombras sugeridas não provam geometria física. Separabilidade, continuidade entre frames e fluidez exigirão posterior construção e animação. Aprovação final da direção depende do usuário.

## Execução

- Base: `a56aad11ecd62cb5466fa15c383bc5ad540cb8af` (`main`).
- Branch: `design/papercut-visual-study`.
- Status: ciclo inicial concluído — três estudos, duas rodadas de refinamento e dois estados estáticos gerados, inspecionados e documentados.
- Aprovação artística do usuário: pendente.
- Recomendação: estudo C refinado, `05-refinamento-recortes-planos.png`.
- Achado principal: a geração com referência mantém a direção geral, mas redesenha detalhes entre estados. Não usar imagens fechado/aberto como frames interpoláveis.
- Próxima ação: avaliação estética do usuário a partir da galeria no repositório. Não ampliar geração sem nova hipótese e retorno do usuário.
- Relatório completo: `assets/concepts/papercut/README.md`. Prompts e manifesto de integridade no mesmo diretório.

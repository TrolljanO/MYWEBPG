---
name: triagem-de-atendimento
description: Classifica mensagens de clientes de um pequeno negócio (dúvida, agendamento, reclamação, outro), sugere a resposta a partir da lista oficial de perguntas frequentes e marca o que precisa de uma pessoa. Use quando o usuário pedir pra triar, organizar ou responder mensagens de atendimento.
license: CC0-1.0
metadata:
  versao: "0.1"
  exemplo: "modelo do post glossario"
---

<!--
EXEMPLO DE SKILL.md (formato Agent Skills, padrão aberto adotado pelo Claude Code)

Regras do formato (agentskills.io/specification):
- O arquivo fica numa pasta com o MESMO nome do campo "name"
  (aqui: skills/triagem-de-atendimento/SKILL.md).
- "name": até 64 caracteres, só letras minúsculas, números e hífen.
- "description": até 1024 caracteres, diz o que faz E quando usar.
- O agente lê só name e description no início; o corpo abaixo entra
  quando a skill é ativada. Por isso mantenha o corpo enxuto.
- No Claude Code, a pasta pode ficar em .claude/skills/ (projeto) ou
  ~/.claude/skills/ (pessoal), e você chama com /triagem-de-atendimento.

Troque a licença, os caminhos e as categorias pelo que fizer sentido pra você.
Este comentário pode ser apagado.
-->

# Triagem de atendimento

## Entrada
Uma ou mais mensagens de clientes (texto colado ou arquivo indicado pelo usuário).

## Passos
1. Leia `references/faq.md` (a lista oficial de perguntas e respostas do negócio).
2. Pra cada mensagem, escolha uma categoria: `duvida`, `agendamento`, `reclamacao` ou `outro`.
3. Se for `duvida` e a resposta estiver na lista oficial, sugira a resposta e cite a pergunta da lista usada.
4. Se não estiver na lista, NÃO invente: marque `precisa_de_pessoa: sim` e diga o que falta.
5. Toda `reclamacao` vai pra pessoa, com um resumo de uma linha.

## Saída
Uma tabela com: mensagem (resumida), categoria, resposta sugerida, fonte na lista, precisa_de_pessoa.

## Cuidados
- Não envie nada pro cliente. Esta skill só sugere.
- Não repita dados pessoais na saída além do necessário pra identificar a conversa.

<!--
EXEMPLO DE SPEC PRA SDD (Spec-Driven Development, desenvolvimento guiado por especificação)

O que é SDD: um jeito de trabalhar em que você escreve primeiro a
especificação (o que construir e por quê) e só depois pede pro agente
planejar, quebrar em tarefas e implementar. A spec vira a fonte da verdade:
se algo muda, você muda a spec e refaz a partir dela.
O fluxo abaixo (spec, plano, tarefas, implementação) é a linha usada pelo
Spec Kit do GitHub. Este arquivo é um modelo próprio, simplificado.

Como usar:
1. Preencha a spec com o agente fazendo perguntas, até não sobrar ambiguidade.
2. Peça um plano técnico baseado NELA (sem inventar escopo).
3. Peça a lista de tarefas e revise antes de executar.

Negócio do exemplo: clínica fictícia que quer lembrete de consulta.
-->

# Spec: [Nome da funcionalidade, ex.: Lembrete de consulta com confirmação]

Status: [rascunho / revisada / aprovada] | Dona: [papel] | Data: [dd/mm/aaaa]

## Por que existe
[Problema em uma ou duas frases. Ex.: pacientes esquecem a consulta e a
recepção só descobre na hora.]

## O que deve acontecer (comportamento esperado)
1. [Ex.: um dia antes, o paciente recebe um lembrete com data, hora e endereço.]
2. [Ex.: o paciente responde "confirmo" ou "remarcar".]
3. [Ex.: "remarcar" vira tarefa pra recepção, com o histórico da conversa.]

## Cenários de aceite (dado, quando, então)
- Dado [consulta marcada pra amanhã], quando [chegar a hora do lembrete], então [o lembrete sai uma vez só].
- Dado [paciente respondeu "remarcar"], quando [a resposta chegar], então [a recepção recebe a tarefa com o resumo].
- Dado [paciente sem telefone cadastrado], quando [chegar a hora], então [nada é enviado e a recepção é avisada].

## Fora de escopo
- [ex.: remarcar sozinho, sem pessoa.]

## Restrições
- [ex.: só horário comercial; nenhuma informação clínica na mensagem.]

## Dúvidas em aberto (resolver antes do plano)
- [ ] [ex.: quantas horas antes enviar?]

---
## Plano (preencher DEPOIS da spec aprovada)
[Ferramentas, integrações, onde roda. Cada decisão aponta pra um item da spec.]

## Tarefas (preencher DEPOIS do plano)
- [ ] T1: [tarefa pequena e testável] (spec: item [n])
- [ ] T2: [tarefa] (spec: item [n])

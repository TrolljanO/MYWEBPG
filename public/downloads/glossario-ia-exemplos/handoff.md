<!--
EXEMPLO DE HANDOFF (passagem de bastão)

O que é: o momento em que um agente passa a tarefa pra outro agente, ou pra
uma pessoa, junto com o que o próximo precisa saber. Em ferramentas como o
Agents SDK da OpenAI, handoff é uma função própria (um agente delega pro
outro). Na prática do dia a dia, vale ter um bilhete padrão como este, pra
quem recebe não ter que perguntar tudo de novo.

Como usar: quem entrega preenche; quem recebe lê antes de começar.
Use as palavras de status com cuidado:
- rascunhado: escrito, ninguém conferiu.
- conferido: alguém checou contra a fonte ou o critério.
- bloqueado: parado esperando alguém ou alguma coisa.
- entregue: chegou em quem pediu.

Negócio do exemplo: escritório de contabilidade fictício.
-->

# Handoff: [tarefa, ex.: cobrança de documentos pendentes de novembro]

De: [quem entrega, ex.: agente de triagem]
Para: [quem recebe, ex.: atendente responsável]
Data e hora: [dd/mm/aaaa hh:mm]

## Em uma frase
[ex.: [N] clientes ainda devem documento; os rascunhos de cobrança estão prontos, falta aprovação.]

## Status
- [rascunhado / conferido / bloqueado / entregue]: [o quê]

## O que eu fiz
- [ex.: li os e-mails de 01/11 a 15/11 e montei a lista em saidas/pendencias.csv.]

## O que você precisa fazer
1. [ex.: revisar os rascunhos em saidas/cobrancas/.]
2. [ex.: aprovar ou ajustar antes de qualquer envio.]

## Onde está
- `[caminho do arquivo]`: [o que tem nele]

## O que eu não sei / riscos
- [ex.: 2 clientes trocaram de e-mail; não confirmei o novo endereço.]

## O que NÃO fazer
- [ex.: não enviar nada sem aprovação.]

## Critério de pronto
- [ex.: todos os clientes da lista com cobrança aprovada ou marcada como "não cobrar".]

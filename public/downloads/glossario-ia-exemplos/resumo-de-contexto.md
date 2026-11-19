<!--
EXEMPLO DE RESUMO DE CONTEXTO ANTES DE COMPACTAR

Pra que serve: quando a conversa com o agente fica longa, a ferramenta
"compacta" o histórico, ou seja, troca a conversa inteira por um resumo.
Nesse resumo automático, detalhe que você achava importante pode sumir.
Este modelo é pra você (ou o agente) escrever ANTES de compactar, salvar
num arquivo e, depois, pedir pro agente reler.

Como usar:
1. Preencha os campos entre [colchetes] em poucas linhas cada.
2. Salve na pasta do projeto (ex.: saidas/resumo-de-contexto.md).
3. Compacte (no Claude Code: /compact, com ou sem foco).
4. Na volta, peça: "leia saidas/resumo-de-contexto.md e continue".

Negócio do exemplo: escritório de contabilidade fictício.
-->

# Resumo de contexto: [tarefa, ex.: organizar pendências de documentos dos clientes de novembro]

Data e hora: [dd/mm/aaaa hh:mm]
Quem pediu: [papel, ex.: sócio responsável]

## Objetivo (uma frase)
[ex.: ter uma lista única de quais clientes ainda devem documentos e qual documento falta.]

## Decisões já tomadas (não rediscutir)
- [ex.: a lista sai em planilha, uma linha por cliente.]
- [ex.: cobrança por mensagem só depois de aprovação humana.]

## O que já foi feito
- [ex.: lidos os e-mails de 01/11 a 15/11; pendências em saidas/pendencias.csv.]

## O que falta
1. [próximo passo]
2. [passo seguinte]

## Arquivos que importam
- `[caminho]`: [pra que serve]

## Regras e restrições
- [ex.: não abrir a pasta privado/.]
- [ex.: não enviar nada pra cliente.]

## Dúvidas em aberto
- [pergunta que ainda precisa de resposta humana]

## O que pode ser esquecido
- [ex.: as tentativas de formato que foram descartadas.]

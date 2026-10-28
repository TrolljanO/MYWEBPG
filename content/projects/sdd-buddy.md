---
title: SDD-Buddy
slug: sdd-buddy
summary: Assistente que organiza ideias em especificações e planos revisáveis por etapas.
status: published
tags:
  - desenvolvimento
  - inteligência artificial
category: ai
stack:
  - Python
  - FastAPI
  - React
repository: https://github.com/TrolljanO/sdd_vibe_converter
source_url: https://github.com/TrolljanO/sdd_vibe_converter
---

## O problema

Uma ideia de software pode começar em uma conversa e terminar sem clareza sobre o que construir. Requisitos, decisões e critérios de aceitação correm o risco de ficar espalhados.

## A proposta

O SDD-Buddy organiza o trabalho em etapas guiadas que levam da ideia a princípios, especificação, planejamento, tarefas e revisão. Cada etapa produz um artefato em Markdown que pode ser lido, discutido e aprovado.

![Da conversa ao documento. Diagrama conceitual do fluxo documentado.](/assets/case-sdd.svg)

## Decisões documentadas

A documentação do projeto descreve uma máquina de estados para acompanhar as etapas, uma API em FastAPI e uma interface em React. O estado da conversa é persistido em SQLite, e os artefatos passam por aprovação antes de orientar a etapa seguinte.

Essa estrutura torna visível a passagem de uma resposta a um requisito e de um requisito a uma tarefa. Os documentos gerados podem ser inspecionados fora da conversa.

## Limites

O fluxo usa modelos de linguagem; por isso, uma especificação gerada ainda precisa de revisão humana. Esta página resume a documentação pública do repositório e não reproduz resultados de execução ou métricas.

[Explorar o repositório](https://github.com/TrolljanO/sdd_vibe_converter)

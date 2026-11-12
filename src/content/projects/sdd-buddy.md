---
title: SDD-Buddy
summary: Assistente que organiza ideias em especificações e planos revisáveis por etapas.
startDate: 2025-11-20
status: em progresso
tags: [python, fastapi, react]
featured: true
draft: false
repository: https://github.com/TrolljanO/sdd_vibe_converter
---

## Contexto

Uma ideia de software pode começar em uma conversa e terminar sem clareza sobre o que construir. Requisitos, decisões e critérios de aceitação correm o risco de ficar espalhados.

## Solução

O SDD-Buddy organiza o trabalho em etapas guiadas que levam da ideia a princípios, especificação, planejamento, tarefas e revisão. Cada etapa produz um artefato em Markdown que pode ser lido, discutido e aprovado.

A documentação do projeto descreve uma máquina de estados para acompanhar as etapas, uma API em FastAPI e uma interface em React. O estado da conversa é persistido em SQLite, e os artefatos passam por aprovação antes de orientar a etapa seguinte.

## Stack

Python, FastAPI e React, com persistência em SQLite. A escolha deixa os documentos gerados inspecionáveis fora da conversa.

## Resultados

Esta página resume a documentação pública do repositório. Nenhuma métrica do README foi reproduzida aqui.

## Aprendizados

O fluxo usa modelos de linguagem. Uma especificação gerada ainda precisa de revisão humana.

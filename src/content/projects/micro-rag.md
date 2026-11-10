---
title: Micro-RAG
summary: Busca em documentos técnicos de gestão de estoques para responder perguntas com trechos citáveis.
startDate: 2025-11-11
role: Autor
status: em progresso
tags: [python, fastapi, busca-em-documentos]
featured: true
draft: false
repository: https://github.com/TrolljanO/micro-rag-jump
---

## Contexto

Encontrar uma informação em documentos exige mais do que produzir uma resposta plausível. É preciso localizar material relacionado à pergunta e deixar a fonte disponível para conferência.

## Solução

O Micro-RAG responde perguntas sobre gestão de estoques a partir de documentos técnicos. Primeiro recupera trechos relacionados. Depois usa esse contexto para gerar uma resposta acompanhada de citações.

O fluxo documentado combina uma API em FastAPI, indexação vetorial com FAISS e um modelo de linguagem. O formato da resposta inclui o texto, as citações e métricas da execução.

## Stack

Python, FastAPI e FAISS. A recuperação de trechos mantém uma ligação entre a resposta e os documentos consultados.

## Resultados

As métricas descritas no repositório não foram reproduzidas nesta apresentação, e nenhuma chamada ao serviço foi feita para esta página.

## Aprendizados

O resultado depende da cobertura dos documentos indexados e da qualidade da recuperação. Uma citação, por si só, não garante que o trecho sustente a resposta.

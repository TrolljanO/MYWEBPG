---
title: Micro-RAG
slug: micro-rag
summary: Busca em documentos técnicos de gestão de estoques para responder perguntas com trechos citáveis.
status: published
tags:
  - busca em documentos
  - inteligência artificial
category: ai
stack:
  - Python
  - FastAPI
  - FAISS
repository: https://github.com/TrolljanO/micro-rag-jump
source_url: https://github.com/TrolljanO/micro-rag-jump
---

## O problema

Encontrar uma informação em documentos exige mais do que produzir uma resposta plausível. É preciso localizar material relacionado à pergunta e deixar a fonte disponível para conferência.

## A proposta

O Micro-RAG responde perguntas sobre gestão de estoques a partir de documentos técnicos. Primeiro recupera trechos relacionados; depois usa esse contexto para gerar uma resposta acompanhada de citações.

O fluxo documentado combina uma API em FastAPI, indexação vetorial com FAISS e um modelo de linguagem. O formato da resposta inclui o texto, as citações e métricas da execução.

![Uma resposta com caminho de volta. Diagrama conceitual do fluxo documentado.](/assets/case-rag.svg)

## Decisões e limites

A recuperação de trechos mantém uma ligação entre a resposta e os documentos consultados, permitindo que a pessoa confira o contexto. O resultado depende da cobertura dos documentos indexados e da qualidade da recuperação; uma citação, por si só, não garante que o trecho sustente a resposta.

As métricas descritas no repositório não foram reproduzidas nesta apresentação, e nenhuma chamada ao serviço foi feita para esta página.

[Explorar o repositório](https://github.com/TrolljanO/micro-rag-jump)

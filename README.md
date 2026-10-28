# Guilherme Trajano — portfólio pessoal

Site estático em português, com conteúdo em Markdown, gravura SVG em recortes independentes e JavaScript progressivo. Não há backend, CMS, analytics ou integração com redes sociais.

## Construir e visualizar

Python 3.10+ e as dependências de build em `requirements.txt`:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/build-site.py
.venv/bin/python scripts/check-site.py
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abra http://localhost:4173. Sirva **dist/**, não a raiz do repositório: referências, fontes editoriais e documentos de trabalho não fazem parte do site público. Builds locais usam `noindex`; não configuram hospedagem ou DNS.

Se um build encontrar arquivos antigos inesperados na saída, ele para. Inspecione esses arquivos; use `--output /tmp/portfolio-preview` para construir uma saída nova sem apagar trabalho anterior. O checker equivalente é `python3 scripts/check-site.py . /tmp/portfolio-preview`.

## Editar

- `templates/home.html`: composição da home. Cabeçalho, rodapé e páginas de leitura têm templates próprios.
- `content/projects/`: projetos; `content/pages/`: currículo e privacidade; `content/posts/`: publicações.
- `index.css`, `index.js`, `theme.js`: apresentação, interação e preferências locais.
- `site.config.json`: nome, idioma e URL pública. O domínio está intencionalmente vazio.
- `assets/engraving.svg`: composição vetorial; `scripts/compose-engraving.py` a recompõe a partir de `wave-lines.svg` e `mountain-lines.svg`.

### Publicações e futuro pipeline Second Brain

O pipeline poderá criar um arquivo UTF-8 em `content/posts/`, usando este contrato:

```yaml
---
title: "Título da publicação"
slug: titulo-da-publicacao
summary: "Resumo curto para o arquivo e o RSS."
status: draft
date: "2026-10-26"
tags:
  - desenvolvimento
source_url: https://example.org/publicacao-original
---

Texto em Markdown. A fonte original é opcional.
```

Altere `status` para `published` depois da revisão editorial. O build gera página individual, arquivo cronológico, os três posts mais recentes na home e RSS. Rascunhos não entram na saída. Identificadores precisam ser únicos; rotas reservadas são rejeitadas. Datas usam `YYYY-MM-DD`. HTML bruto não é executado. Links locais em Markdown são relativos à raiz pública, por exemplo `/assets/case-sdd.svg`.

Não há posts de exemplo publicados. O conteúdo do Second Brain não foi acessado ou importado. Uma automação futura pode preparar esses arquivos e rodar os mesmos checks; não deve transformar material privado em publicação sem seleção editorial.

## Verificar

```sh
python3 -m unittest discover -s tests -v
python3 scripts/build-site.py
python3 scripts/check-site.py
node --check index.js
node --check theme.js
```

Os testes do build usam diretórios temporários. O checker inspeciona todas as páginas emitidas, fragmentos, assets, RSS e a lista pública obrigatória em `manifest.json`. Os testes de navegador em `tests/browser-check.mjs` usam o helper CDP da skill design-taste-frontend, um Chromium local e a URL configurada por `SITE_URL`; veja o cabeçalho desse arquivo. Screenshots e relatórios ficam em `.taste-skill/`.

## Preparar uma publicação

Quando domínio e hospedagem estiverem definidos:

```sh
python3 scripts/build-site.py --production --site-url https://SEU-DOMINIO --output /tmp/portfolio-publico
python3 scripts/check-site.py . /tmp/portfolio-publico
```

`--site-url` também aceita subdiretório. O modo de produção exige HTTPS e gera URLs canônicas, metadados de compartilhamento, sitemap e RSS com a base definida. Esse comando apenas prepara arquivos; não publica nada. A hospedagem deve servir `404.html` como página de erro e aplicar compressão HTTP aos arquivos SVG/HTML/CSS.

## Conteúdo e arte

Identidade pessoal ampla: software, dados, IA e experiência comercial; AEC é uma área de aplicação. Os casos descrevem documentação pública de SDD-Buddy e Micro-RAG, sem alegar reprodução de métricas. O currículo é uma síntese factual, não uma transcrição completa do LinkedIn.

A gravura deriva de ilustrações criadas com IA neste projeto, convertidas em paths SVG. Oito máscaras curvas dividem o interior da onda em recortes com movimentos próprios; os traços de tinta dentro de cada recorte permanecem juntos. Fundo e pinheiro têm planos separados. Movimento reduzido e pausa mantêm a composição fechada.

Fontes locais Cormorant Garamond e Manrope, com licenças OFL preservadas. Os TTF e PNG originais são fontes de trabalho; o site usa WOFF2 e vetores.

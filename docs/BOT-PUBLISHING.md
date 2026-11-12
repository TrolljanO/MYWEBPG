# Publicação por bot, sem backend

O blog já funciona como um site estático: um arquivo em `src/content/blog/` vira uma página no build. Tags, listagens, RSS e sitemap são atualizados juntos. Não é necessário banco de dados nem servidor de aplicação. O bot precisa conseguir gravar arquivos no GitHub por Git ou pela API; essa capacidade depende da instalação do seu Grokbot e ainda não foi conectada ou testada aqui.

## Primeiro deploy

O GitHub Pages está configurado para GitHub Actions em `https://trolljano.github.io/MYWEBPG/`. Integre o branch `feat/astro-content-boilerplate` em `main` para publicar esta versão. Em **Actions → GitHub Pages**, acompanhe o build e o job `deploy`. Um push apenas no branch de trabalho executa Quality, mas não substitui o site público.

O workflow `.github/workflows/deploy.yml` instala as dependências pelo lockfile, verifica formatação, testa as regras editoriais, executa lint, tipos, testes unitários, build, links internos e testes de navegador. Só então envia `dist/` ao Pages. Uma falha impede a nova publicação.

## Contrato para o Grokbot

1. Atualize uma cópia do repositório a partir de `main` e crie um branch `feat/post-assunto`.
2. Crie `src/content/blog/assunto-do-artigo.md`, com nome kebab-case sem subpastas e sem sobrescrever artigos existentes.
3. Adicione imagens em `src/assets/images/`, com referências relativas e texto alternativo. Para vídeo, use um link Markdown para a hospedagem do vídeo. O Pages não processa vídeos.
4. Formate os arquivos e execute `npm run validate` com Node 24. Se alterar regras editoriais, rode também `npm run test:content`, sem outro build em paralelo.
5. Faça commit e push do branch, abra um pull request para `main` e revise fontes, direitos de uso, texto, imagens e os checks antes do merge.
6. Após o merge, GitHub Actions publica o site. O endereço do artigo será `https://trolljano.github.io/MYWEBPG/blog/assunto-do-artigo/`.

Para publicação totalmente automática, o bot pode enviar o commit diretamente para `main`, se as regras do repositório permitirem. Isso publica qualquer artigo elegível após os checks, sem revisão humana. Configure esse modo somente depois de validar a integração com um artigo aprovado.

Exemplo de formato (substitua o texto e a data por conteúdo revisado; não é um artigo para publicar):

```markdown
---
title: 'Título do artigo revisado'
description: 'Resumo claro do assunto, com no mínimo vinte caracteres.'
pubDate: '2026-11-12T09:00:00-03:00'
tags: [tecnologia, inteligencia-artificial]
draft: true
featured: false
toc: true
---

## Contexto

Texto revisado com fontes verificáveis.

## Referências

Links para as fontes consultadas.
```

Altere `draft` para `false` apenas quando aprovado. O artigo só aparece se `pubDate` já tiver chegado no momento do build. Há rebuild horário para agendados, sujeito aos atrasos do GitHub. Rascunhos ficam fora do site, mas seus arquivos continuam visíveis se o repositório for público. O schema estrito e as demais regras estão em `docs/CONTENT.md`.

## Credencial e disparo do workflow

Para um bot externo, use uma GitHub App instalada apenas neste repositório com permissão de escrita em Contents e, caso abra PRs, Pull requests. Alternativamente, use um fine-grained PAT restrito ao repositório com essas permissões e validade definida. Guarde a credencial na configuração secreta do bot, nunca no Markdown ou no Git. Não é preciso conceder permissão para editar workflows ao bot editorial.

Se o bot rodar dentro de GitHub Actions, commits feitos com o `GITHUB_TOKEN` normalmente não disparam outro workflow de push. Use um token de instalação de GitHub App ou PAT para esse fluxo, ou um disparo explícito por `workflow_dispatch` com as permissões correspondentes. Documentação: [disparo de workflows](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

Prefira `.md` para os textos gerados. MDX pode executar código durante o build e exige revisão dos imports e componentes. Não dê ao bot editorial a tarefa de alterar código, dependências ou workflows. Uma validação técnica não verifica a veracidade das pesquisas geradas.

## Recuperar uma publicação

Para retirar uma matéria, altere `draft: true` e envie um novo commit para `main`. Para desfazer uma edição, reverta o commit e envie a reversão. O próximo deploy bem-sucedido atualiza o site; o histórico Git permanece disponível.

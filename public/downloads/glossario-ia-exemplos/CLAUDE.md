<!--
EXEMPLO DE CLAUDE.md (modelo pra copiar e adaptar)

O que é: o arquivo de instruções persistentes que o Claude Code lê no início
de cada sessão. Se o projeto já tem um AGENTS.md, dá pra reaproveitar: a
linha "@AGENTS.md" abaixo importa o conteúdo dele (sintaxe @caminho da doc
oficial). Assim você mantém uma fonte só pra vários agentes.

Dica da doc oficial: mire em menos de 200 linhas por CLAUDE.md.
-->

@AGENTS.md

## Só pro Claude Code
- Use `/compact` com foco quando a conversa ficar longa, ex.: `/compact foco na agenda de retornos`.
- Antes de compactar, atualize `saidas/resumo-de-contexto.md` (modelo em `resumo-de-contexto.md`).

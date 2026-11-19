# Exemplo de configuração MCP (.mcp.json)

O que é MCP: Model Context Protocol, um padrão aberto pra ligar aplicativos de
IA a sistemas de fora (arquivos, planilhas, agenda, banco de dados). O app de
IA (o "host") abre uma conexão com cada "servidor MCP", e cada servidor
oferece ferramentas e dados pro agente usar. JSON não aceita comentário, então
a explicação fica aqui.

## Onde esse arquivo fica
No Claude Code, um `.mcp.json` na raiz do projeto vale pra todo mundo que usa
o projeto (escopo "project"). Na primeira vez, o Claude Code pede aprovação
pra cada servidor desse arquivo.

## Os dois tipos do exemplo
- `planilha-local` (stdio): roda no seu computador. O Claude Code inicia o
  programa a partir de `command` e `args`. `${CLAUDE_PROJECT_DIR:-.}` aponta
  pra pasta do projeto (com `.` de reserva, como pede a doc).
- `agenda-remota` (http): servidor na internet. Precisa de `"type": "http"`;
  sem `type`, o Claude Code trata a entrada como stdio e ela falha.

## Antes de usar
1. Troque `[PACOTE-DO-SERVIDOR-MCP-LOCAL]` e `[ENDERECO-DO-SERVIDOR-MCP]` por servidores que você conhece e confia.
2. Defina o token em variável de ambiente: `export AGENDA_API_TOKEN=SEU_TOKEN_AQUI`. O arquivo só referencia `${AGENDA_API_TOKEN}`; nunca cole o token nele.
3. Confira com `claude mcp list`.

## Cuidado
A doc oficial avisa: só conecte servidor em que você confia. Servidor que
busca conteúdo de fora pode expor o agente a prompt injection.

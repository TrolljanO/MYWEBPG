# Exemplo de plugin (Claude Code)

O que é um plugin: um pacote que junta, num lugar só, coisas que você já viu
separadas no post (skills, hooks, servidores MCP, subagentes) pra instalar e
compartilhar de uma vez. JSON não aceita comentário, então a explicação fica aqui.

## Estrutura (layout padrão da doc oficial)

```
plugin-atendimento/
├── .claude-plugin/
│   └── plugin.json          # manifesto: nome, versão, descrição, autor
├── .mcp.json                # servidores MCP que o plugin traz
├── skills/
│   └── confirmar-agendamento/
│       └── SKILL.md         # skill do plugin, vira /atendimento-pequeno-negocio:confirmar-agendamento
└── LEIA-ME.md               # este arquivo (não é lido pelo Claude Code)
```

## Campos do plugin.json usados aqui
- `name` (obrigatório): identificador em kebab-case. Tudo do plugin fica "dentro" desse nome.
- `displayName`, `version`, `description`, `author`, `license`, `keywords`: metadados. A validação avisa se faltar `version`, `description` ou `author`.
- Só o `plugin.json` vai dentro de `.claude-plugin/`. Skills, hooks e o resto ficam na raiz do plugin.

## Antes de usar
1. Troque `[SEU NOME]` e `[PACOTE-DO-SERVIDOR-MCP-DA-SUA-AGENDA]`.
2. Defina a variável de ambiente `AGENDA_API_TOKEN` com o seu token (ex.: `export AGENDA_API_TOKEN=SEU_TOKEN_AQUI`). Nunca escreva o token no arquivo.
3. Teste localmente com `claude --plugin-dir ./plugin-atendimento` e valide com `claude plugin validate`.

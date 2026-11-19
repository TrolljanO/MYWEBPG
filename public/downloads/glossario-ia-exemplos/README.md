# Arquivos-modelo do post "palavras pra quem está começando com IA e agentes"

Tudo aqui é modelo genérico pra copiar e adaptar. Os negócios dos exemplos
(clínica, loja, escritório de contabilidade) são fictícios. Nenhum arquivo tem
senha ou token real: onde precisa, aparece `SEU_TOKEN_AQUI` ou uma variável de
ambiente como `${AGENDA_API_TOKEN}`. Campos entre [colchetes] são pra você
preencher.

| Termo | Arquivo | O que é |
| --- | --- | --- |
| *.MD | `AGENTS.md` | Instruções do projeto pra agentes (formato aberto, agents.md). |
| *.MD | `CLAUDE.md` | Instruções do Claude Code que importam o AGENTS.md. |
| CONTEXTO / COMPACTAR | `resumo-de-contexto.md` | Resumo pra escrever antes de compactar a conversa. |
| PRD | `PRD.md` | O que fazer, pra quem, por quê e como medir. |
| SRS | `SRS.md` | Requisitos numerados e testáveis (linha da IEEE 830 / ISO/IEC/IEEE 29148). |
| SDD | `sdd/spec.md` | Spec que vem antes do plano e das tarefas. |
| SKILLS | `skills/triagem-de-atendimento/SKILL.md` (+ `references/faq.md`) | Skill no formato Agent Skills. |
| PLUGINS | `plugin-atendimento/` (`.claude-plugin/plugin.json`, `.mcp.json`, `skills/`, `LEIA-ME.md`) | Plugin do Claude Code que junta skill e MCP. |
| MCP | `mcp/.mcp.json` (+ `mcp/LEIA-ME.md`) | Configuração de servidores MCP (um local, um remoto). |
| HOOKS | `hooks/.claude/settings.json` + `hooks/.claude/hooks/proteger-pasta.sh` (+ `hooks/LEIA-ME.md`) | Hook que bloqueia edição numa pasta protegida. |
| HANDOFF | `handoff.md` | Bilhete de passagem de bastão. |
| ARTEFATO | `artefato-exemplo.md` | Modelo de entrega concreta (resumo semanal). |

Atenção: arquivos e pastas que começam com ponto (`.mcp.json`, `.claude/`,
`.claude-plugin/`) ficam ocultos em muitos sistemas. Se baixar em .zip,
confira se eles vieram.

Formatos conferidos na documentação oficial em 18/11/2026. Ferramentas mudam:
antes de usar, confira a doc da versão que você tem.

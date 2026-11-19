# Exemplo de hook (Claude Code)

Dois arquivos, que vão dentro da pasta `.claude/` do seu projeto:

- `.claude/settings.json`: diz QUANDO o hook roda. Aqui: no evento
  `PreToolUse` (antes de uma ferramenta rodar), só pras ferramentas `Edit` e
  `Write` (campo `matcher`).
- `.claude/hooks/proteger-pasta.sh`: diz O QUE acontece. Lê o caminho do
  arquivo e nega a edição se for dentro da pasta protegida.

JSON não aceita comentário, por isso a explicação fica aqui e dentro do `.sh`.

## Testar sem o Claude Code
```bash
echo '{"tool_input":{"file_path":"/projeto/privado/contrato.txt"}}' | ./.claude/hooks/proteger-pasta.sh
# deve imprimir um JSON com "permissionDecision": "deny"

echo '{"tool_input":{"file_path":"/projeto/saidas/relatorio.md"}}' | ./.claude/hooks/proteger-pasta.sh
# não imprime nada (segue normal)
```

## Outros eventos úteis (ver doc oficial de hooks)
- `SessionStart`: quando a sessão começa ou é retomada.
- `PreCompact` e `PostCompact`: antes e depois de compactar o contexto.
- `Stop`: quando o agente termina de responder.

#!/bin/bash
# EXEMPLO DE HOOK (Claude Code): proteger uma pasta contra edição.
#
# O que é um hook: um comando que roda SEMPRE num ponto fixo do trabalho do
# agente (aqui: antes de editar ou criar arquivo). Não depende do modelo
# "lembrar" da regra: o próprio Claude Code roda o script.
#
# Como funciona:
# - O Claude Code manda um JSON pela entrada padrão (stdin) com os dados da
#   ferramenta. O caminho do arquivo vem em .tool_input.file_path.
# - Se o caminho estiver dentro de PASTA_PROTEGIDA, o script responde com
#   permissionDecision "deny" e a edição não acontece.
# - Se não, sai com código 0 e o fluxo normal segue.
#
# Requisitos: jq instalado. Depois de copiar, rode:
#   chmod +x .claude/hooks/proteger-pasta.sh
#
# Troque "privado/" pela pasta que você quer proteger (ex.: contratos/).

PASTA_PROTEGIDA="privado/"

ARQUIVO=$(jq -r '.tool_input.file_path // empty')

if [[ "$ARQUIVO" == *"/$PASTA_PROTEGIDA"* || "$ARQUIVO" == "$PASTA_PROTEGIDA"* ]]; then
  jq -n --arg motivo "A pasta $PASTA_PROTEGIDA é protegida. Peça pra uma pessoa editar." '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $motivo
    }
  }'
  exit 0
fi

exit 0

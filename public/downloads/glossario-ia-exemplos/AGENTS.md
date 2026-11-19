<!--
EXEMPLO DE AGENTS.md (modelo pra copiar e adaptar)

O que é: um arquivo Markdown comum, na raiz da pasta do projeto, com as
instruções que você daria pra uma pessoa nova no time. Agentes compatíveis
(Codex, Cursor, Gemini CLI, entre outros listados em agents.md) leem esse
arquivo antes de trabalhar. Não tem campo obrigatório: é texto livre, com os
títulos que você quiser.

Como usar:
1. Copie pra raiz da pasta do projeto com o nome AGENTS.md.
2. Troque tudo que estiver entre [colchetes].
3. Mantenha curto. Instrução que só vale pra uma parte do projeto pode ir
   num AGENTS.md dentro da subpasta (o mais próximo do arquivo vale mais).

Negócio do exemplo: uma clínica fictícia que usa um agente pra organizar
a agenda e responder dúvidas frequentes. Nenhum dado real.
-->

# AGENTS.md: [Nome do projeto, ex.: Atendimento da Clínica Exemplo]

## Visão geral
- Este projeto organiza [o quê, ex.: a triagem de mensagens de pacientes e a agenda de retornos].
- Quem usa o resultado: [ex.: a recepção da clínica].
- O que NÃO é objetivo: [ex.: dar diagnóstico ou orientação médica].

## Onde estão as coisas
- `dados/modelos/`: modelos de mensagem aprovados pela recepção.
- `dados/faq.md`: perguntas frequentes e respostas oficiais.
- `saidas/`: onde o agente grava relatórios e rascunhos.
- `privado/`: NÃO ler nem editar. (Reforçado por um hook, ver `hooks/`.)

## Como trabalhar aqui
- Escreva em português, tom educado e direto.
- Responda dúvidas só com o que está em `dados/faq.md`. Se não estiver lá, marque como "precisa de humano".
- Nunca invente horário, preço ou nome de profissional.
- Antes de terminar, confira se cada resposta tem a fonte (arquivo e seção).

## Comandos úteis
- Gerar relatório do dia: `[comando, ex.: python scripts/relatorio.py --dia hoje]`
- Validar modelos de mensagem: `[comando]`

## Segurança
- Dados de pacientes ficam fora deste repositório.
- Tokens e senhas só em variável de ambiente (ex.: `AGENDA_API_TOKEN=SEU_TOKEN_AQUI`), nunca no texto.
- Qualquer envio pra paciente precisa de aprovação humana.

## Quando parar e perguntar
- Pedido fora do escopo acima.
- Conflito entre duas regras deste arquivo.

# Portfólio pessoal — plano de implementação

> Execução inline com executing-plans; revisão final independente.

**Objetivo:** primeira versão local, navegável e responsiva do site de Guilherme Trajano.
**Arquitetura:** HTML estático, CSS e JavaScript progressivo. Gravura SVG original em grupos separados para movimento. Sem dependências de execução externas.
**Brief:** conversa atual e materiais do pacote-codex.tar.gz; instruções do usuário prevalecem sobre propostas do pacote.

## Restrições
- Branco/preto, traços finos, estética de gravura japonesa, papercut multicamadas.
- Reutilizar o conceito de camadas dos exports AW, sem publicar seus arquivos, logotipo ou conteúdo no site.
- Não inventar posts, resultados, métricas, biografia ou contatos.
- Preservar arquivos fornecidos. Trabalhar no worktree existente TrolljanO/kittiwake.
- Preview local. Domínio e publicação dependem da escolha ainda ausente.

## Tarefas
- [x] Inventariar fontes; escrever direção e conteúdo.
- [x] Implementar home, gravura em camadas, projetos, arquivo vazio, currículo e privacidade.
- [x] Implementar tema persistente, controle de movimento e filtro de projetos.
- [x] Verificar navegação, teclado, temas, movimento reduzido, layouts 390/768/1440 e impressão.
- [x] Revisão final e entrega do preview.

## Foco da revisão
Sem JavaScript: conteúdo e links continuam disponíveis. localStorage bloqueado: botões funcionam. Movimento reduzido: sem paralaxe/entrada automática. Celular: sem overflow e alvos confortáveis. Conteúdo: nenhuma alegação de publicação ou integração social inexistente.

## Marco do protótipo — 2026-10-26

Primeira versão local implementada e verificada. Relatório do navegador registra 26 verificações aprovadas; empacotamento reproduzido antes do marco. Isto não é aprovação visual final.

Próxima execução: conteúdo e templates estáticos, arquivo Markdown/RSS, narrativa pessoal ampla, acabamento completo e recortes SVG internos independentes. Curadoria manual preparada para futuro pipeline Second Brain. Domínio e hospedagem permanecem pendentes.

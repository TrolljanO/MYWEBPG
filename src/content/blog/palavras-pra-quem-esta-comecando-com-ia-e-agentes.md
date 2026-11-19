---
title: 'Palavras pra você ir se acostumando: um glossário pra quem está começando com IA e agentes'
description: 'Handoff, SDD, PRD, SRS, skills, plugins, MCP, hooks e outros termos explicados sem jargão, com analogia e um arquivo-modelo pra baixar e adaptar no seu negócio.'
pubDate: 2026-11-19
tags: [ia, agentes-de-ia, glossario, automacao, processos, pequenos-negocios]
draft: false
featured: false
toc: true
social: []
---

Você que está começando a trabalhar com IA e Agentes agora, vou deixar algumas palavras pra você ir se acostumando a ouvi-las...

Essas palavras aparecem o tempo todo pra quem começa a usar agente, e quase ninguém para pra explicar o que elas querem dizer. Então juntei as que eu mais uso no dia a dia, cada uma do jeito que eu explicaria numa conversa: o que é, uma comparação com algo que você já conhece e um arquivo pra você baixar e mexer.

Este texto é pra quem tem um negócio, ou cuida de um, e começou a ouvir essas palavras em reunião, em vídeo ou na conversa com quem vende ferramenta de IA. A ideia não é transformar você em programador. É você entender o que cada termo quer dizer, pra conseguir perguntar melhor, decidir melhor e não ficar refém de quem fala difícil.

Cada termo vem com três coisas: o que é, uma comparação com algo do dia a dia e um arquivo-modelo que você pode baixar e adaptar. Os modelos usam negócios fictícios (clínica, loja, escritório de contabilidade) e não têm nenhuma senha ou dado real.

Uma observação antes de começar: vários exemplos usam o Claude Code como referência, porque a documentação dele é pública e detalhada. Os conceitos, porém, aparecem com nomes parecidos em outras ferramentas.

## *.MD: o formato onde quase tudo mora

**O que é.** `.md` é a extensão de arquivos Markdown: texto simples com alguns símbolos pra marcar título, lista e negrito (`#` pra título, `-` pra lista, `**` pra negrito). Como é texto puro, a IA lê os caracteres direto, sem precisar "enxergar" a página. Leitura de imagem (o tal OCR) só entra quando o arquivo é um PDF escaneado ou uma foto. Você vai ver muito `README.md`, `AGENTS.md`, `CLAUDE.md`, `SKILL.md`. Os agentes leem esses arquivos como instrução. O `AGENTS.md`, por exemplo, é um formato aberto, tipo um "leia-me pra agentes": fica na raiz do projeto e diz como trabalhar ali. Não tem campo obrigatório, é texto livre. O Claude Code tem o seu próprio, o `CLAUDE.md`, e consegue ler o `AGENTS.md` também.

**Analogia.** É o manual de boas-vindas que você entrega pra uma pessoa nova no time: onde ficam as coisas, o que pode, o que não pode e quando perguntar.

**Exemplo de arquivo.** `AGENTS.md` e `CLAUDE.md`, de uma clínica fictícia que usa um agente pra organizar a agenda. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`AGENTS.md`](/MYWEBPG/downloads/glossario-ia-exemplos/AGENTS.md) · [`CLAUDE.md`](/MYWEBPG/downloads/glossario-ia-exemplos/CLAUDE.md)

**Na minha visão.** A formatação e a estrutura do texto são feitas com símbolos. A IA lê os caracteres do texto, e não o visual, por isso, pra formatar, destacar e estruturar o texto, a gente usa o Markdown. A formatação em .docx sempre quebra a leitura, utf-8 etc. O .md é editável em qualquer notepad da vida. Mais simples.

## CONTEXTO e COMPACTAR: a memória de trabalho do agente

**O que é.** Contexto é tudo que o agente está "vendo" naquele momento: suas instruções, os arquivos que ele leu, as respostas que deu, os resultados das ferramentas. Esse espaço tem limite (é a tal janela de contexto). Quando a conversa fica longa e chega perto do limite, a ferramenta compacta: troca o histórico por um resumo pra poder continuar. No Claude Code isso acontece sozinho perto do limite, ou quando você pede com `/compact`, e dá pra dizer o foco do resumo.

O detalhe que importa pra você: no resumo, coisa que só foi dita na conversa pode se perder. O que está escrito em arquivo (como o `CLAUDE.md` da raiz do projeto) volta depois da compactação.

**Analogia.** O contexto é a janela de um teleprompter. Conforme o texto cresce, ele vai subindo e o começo some da janela. Compactar é resumir em tópicos o que já subiu. E o que não pode se perder fica num caderno fixo do projeto, fora da janela, que o agente consulta quando precisa.

**Exemplo de arquivo.** `resumo-de-contexto.md`: um modelo pra você escrever antes de compactar (objetivo, decisões, o que falta, regras), salvar e pedir pro agente reler depois. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`resumo-de-contexto.md`](/MYWEBPG/downloads/glossario-ia-exemplos/resumo-de-contexto.md)

**Na minha visão.** Eu sempre uso a explicação de viewport, ou desenho uma janela mesmo. Conforme o texto se alonga, ele não cabe mais na janela e vai "subindo", como um teleprompter, que vai subindo e desaparecendo. Compactar, pra mim, nada mais é que resumir e sumarizar em tópicos. E pra proteger o que não pode se perder no resumo, eu uso memória por projeto e ADRs no meu second brain, mais uma knowledge base por projeto.

ADR, se você ainda não ouviu, é Architecture Decision Record: um registro curto de uma decisão, com o porquê dela, pra ninguém precisar lembrar de cabeça depois.

## PRD: o que fazer, pra quem e por quê

**O que é.** PRD é a sigla de Product Requirements Document, o documento de requisitos do produto. Ele diz o que vai ser feito, pra quem, por quê e como você vai saber se deu certo. Costuma ter objetivo, contexto, premissas, histórias de usuário ("como cliente, eu quero..."), perguntas em aberto e uma parte muito útil: o que NÃO vamos fazer. Vem antes de construir.

**Analogia.** Pensa numa obra. O PRD é a conversa com o dono da casa: o que ele precisa, pra quem é, por que quer mudar. "Quero uma cozinha onde caibam quatro pessoas cozinhando, e a parede da sala não sai do lugar." Ainda não é a planta.

**Exemplo de arquivo.** `PRD.md`, de uma loja fictícia que quer responder mais rápido as dúvidas frequentes no WhatsApp. Os números são campos pra você preencher. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`PRD.md`](/MYWEBPG/downloads/glossario-ia-exemplos/PRD.md)

**Na minha visão.** Quando eu não domino o negócio, ou a área de atuação, geralmente me perco na lógica e na regra de negócio. Sem PRD, fico sem domínio do produto.

## SRS: como deve funcionar, com precisão

**O que é.** SRS é Software Requirements Specification, especificação de requisitos de software. Se o PRD diz o que e por quê, o SRS detalha como o sistema deve se comportar: requisitos numerados, cada um com uma frase clara ("o sistema deve...") e um jeito de testar se foi cumprido. Ele também vem antes de construir, logo depois do PRD. Durante muito tempo a referência pra esse documento foi a IEEE 830, de 1998. Ela foi substituída pela norma ISO/IEC/IEEE 29148, que trata de engenharia de requisitos de forma mais ampla.

**Analogia.** Voltando à obra: o SRS é o que o engenheiro escreve a partir da conversa com o dono. "A bancada tem 90 cm de altura", "a tomada fica a 1,10 m do chão". Dá pra conferir com a trena.

**Exemplo de arquivo.** `SRS.md`, um modelo simples inspirado nessa linha (introdução, descrição geral, requisitos funcionais e não funcionais com critério de aceite). Ele não substitui a norma. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`SRS.md`](/MYWEBPG/downloads/glossario-ia-exemplos/SRS.md)

**Na minha visão.** Do jeito mais curto: PRD é produto, SRS é sistema. Eu mesmo pulo direto pra spec, e não acho que sirva de exemplo. É má prática.

## SDD: a especificação manda, o resto segue

**O que é.** SDD é Spec-Driven Development, desenvolvimento guiado por especificação. Em vez de sair pedindo pro agente "faz aí", você escreve primeiro a especificação: o que construir, por quê, como saber que ficou certo e o que está fora. Depois pede um plano baseado nela, depois a lista de tarefas, e só então a execução. Se algo muda, você muda a spec e refaz a partir dela. O Spec Kit, do GitHub, é uma das ferramentas que organiza esse fluxo.

**Analogia.** É o trilho do projeto. A spec leva do escopo até as stories, as sprints, as tasks e os prazos de entrega, sem descarrilar no meio. E, quando o projeto prevê, o trilho já marca a estação de troca: o ponto em que um paliativo é desligado e o definitivo entra no lugar.

**Exemplo de arquivo.** `sdd/spec.md`, uma spec de lembrete de consulta pra uma clínica fictícia, com cenários de aceite e espaço pro plano e pras tarefas. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`sdd/spec.md`](/MYWEBPG/downloads/glossario-ia-exemplos/sdd/spec.md)

**Na minha visão.** A IA escreve o código que eu mando. Deixar a decisão deliberadamente aberta pra IA hoje ainda dá resultado assertivo se você tiver, no mínimo, um conjunto de skills e know-how técnico pra demandar a IA. Mas, como "nerdola" que sou, eu sou metódico e criterioso com documentação e controle do código. Eu deixo a IA escrever o código, mas um ponto de validação é que eu entenda e saiba "decifrar" cada função. Cada expressão eu preciso entender. E o argumento que eu sempre uso pra defender essa ideia: se nem quando eu escrevia código eu lembrava o que ele fazia, imagina agora que não escrevo nada na mão. Como vou dar sustentação e manutenção sem conhecer nada do código, da arquitetura e da engenharia adotada no desenvolvimento do software?

O SDD é o que me deixa seguir o escopo do início ao fim: criar stories, sprints, tasks, e depois disso os prazos de entrega e o "link" pra novos serviços. Eu uso a spec pra elaborar toda a arquitetura, o projeto e o escopo, e abstrair em tarefas e sprints.

Esse "link" é um momento de virada planejado na spec. Um exemplo: o cliente alimenta os leads numa planilha do Google Sheets. Quando entram o chatbot e o banco de dados integrado, ele não pode mais usar a planilha, tem que alimentar pelo sistema. A spec marca quando desligar o paliativo temporário e ligar o definitivo, que é gravar os dados no banco. Isso não é regra. Quando existe, foi mapeado durante o SDD e na montagem do board de tarefas.

## SKILLS: o procedimento que o agente puxa quando precisa

**O que é.** Uma skill é uma pasta com um arquivo `SKILL.md`: um cabeçalho com nome e descrição (o que faz e quando usar) e, embaixo, as instruções passo a passo. Pode ter arquivos de apoio junto, como uma lista de perguntas frequentes ou um script. O agente lê só o nome e a descrição no começo, e carrega o resto quando a tarefa pede. Isso economiza espaço no contexto. Existe um padrão aberto pra isso, o Agent Skills, e o Claude Code segue esse padrão.

**Analogia.** É o roteiro de uma ligação pro cliente: abrir a planilha, pegar o telefone, discar, esperar atender, falar o script, aguardar a resposta. Conforme a resposta, decisão A, B ou C, e assim vai.

**Exemplo de arquivo.** `skills/triagem-de-atendimento/SKILL.md`, uma skill que classifica mensagens de clientes, sugere resposta a partir da lista oficial e marca o que precisa de gente. Vem com um `references/faq.md` de exemplo. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`skills/triagem-de-atendimento/SKILL.md`](/MYWEBPG/downloads/glossario-ia-exemplos/skills/triagem-de-atendimento/SKILL.md) · [`skills/triagem-de-atendimento/references/faq.md`](/MYWEBPG/downloads/glossario-ia-exemplos/skills/triagem-de-atendimento/references/faq.md)

**Na minha visão.** Skill é todo o processo, o método já definido, abstraído e roteirizado. Não tem uma régua pra saber quando um processo está pronto pra virar skill. Eu crio skill pros processos que tenho bem definidos, sabendo o método completo do início ao fim. O processo precisa estar bem definido e detalhado pra conseguir abstrair e passar em forma de skill pra um agente.

## PLUGINS: o pacote que junta tudo

**O que é.** Um plugin é um pacote que junta, pra instalar de uma vez, peças que você viu separadas aqui: skills, hooks, conexões MCP, subagentes. No Claude Code, o plugin tem um manifesto (`.claude-plugin/plugin.json`) com nome, versão, descrição e autor, e as outras peças ficam em pastas padrão ao lado.

**Analogia.** É a caixa de ferramentas, a toolbox. Em vez de procurar cada ferramenta numa gaveta, você abre uma caixa só e está tudo ali, pronto pra usar.

**Exemplo de arquivo.** `plugin-atendimento/`, um plugin com uma skill de confirmação de agendamento e uma conexão MCP de agenda. Tem um `LEIA-ME.md` explicando cada campo. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`plugin-atendimento/LEIA-ME.md`](/MYWEBPG/downloads/glossario-ia-exemplos/plugin-atendimento/LEIA-ME.md)

**Na minha visão.** Plugin é um conjunto, um pacote, uma coleção de ferramentas. Uma caixa de ferramentas, uma toolbox. Um plugin de banco de dados, por exemplo, pode ter skills de modelagem e comandos, um MCP que conecta direto numa stack de banco e artefatos que interagem com o plugin pra renderizar os dados que ele pode gerar.

## MCP: o jeito padrão de ligar o agente nos seus sistemas

**O que é.** MCP é Model Context Protocol, um padrão aberto pra conectar aplicativos de IA a sistemas de fora: arquivos, planilhas, agenda, banco de dados. O aplicativo de IA abre uma conexão com cada "servidor MCP", e cada servidor oferece ferramentas e informações pro agente usar.

Um cuidado: conectar um servidor é dar acesso. Só conecte o que você conhece e confia.

**Analogia.** É o cabo USB-C universal. O agente é o aparelho, a base (um banco de dados, um Notion, uma agenda) é onde ele se conecta. Com um cabo padrão, não importa de qual aparelho ou de qual base você está falando, o encaixe é o mesmo. A própria documentação do MCP usa essa comparação com o USB-C.

**Exemplo de arquivo.** `mcp/.mcp.json`, com um servidor local (que roda no seu computador) e um remoto (pela internet), usando variável de ambiente no lugar do token. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`mcp/LEIA-ME.md`](/MYWEBPG/downloads/glossario-ia-exemplos/mcp/LEIA-ME.md)

**Na minha visão.** MCP é a porta de entrada, a conexão entre o agente e a base. Qualquer agente: o meu, o do serviço, o do colega. E funciona em qualquer cenário, no meu banco de dados ou no do usuário, reutilizável. É o cabo que conecta o dispositivo na base: o agente é o dispositivo móvel, a base é o objeto de interação, um banco de dados, um Notion da vida. Com Notion, o MCP pode vir com um pacote de skills, e não importa qual Notion você conecte, funciona do mesmo jeito.

## HOOKS: a regra que roda sempre, sem depender de lembrar

**O que é.** Hook é um comando que roda automaticamente num ponto fixo do trabalho do agente: quando a sessão começa, antes de uma ferramenta rodar, depois que ela roda, antes de compactar, quando o agente termina. A diferença pra uma instrução escrita é que o hook não depende de o modelo "lembrar" da regra. Quem roda é a ferramenta, sempre que aquele ponto acontece. Um hook pode bloquear uma ação antes dela acontecer, ou trocar um comando por outro.

Um exemplo real: o RTK (Rust Token Killer), um projeto aberto. Instalado com `rtk init -g`, ele registra um hook no Claude Code que roda antes de cada comando (`PreToolUse`). Quando o agente pede um `git status`, por exemplo, o hook troca por `rtk git status`, e o que volta pro agente é uma saída mais enxuta.

**Analogia.** É o porteiro na saída dos comandos. Tudo que passa por aquele ponto é conferido, sempre, sem ninguém precisar lembrar. Ele pode barrar o que não deve passar ou deixar sair só o que interessa.

**Exemplo de arquivo.** `hooks/`, com um `settings.json` que liga o hook e um script `proteger-pasta.sh` que impede o agente de editar arquivos numa pasta protegida. Tem também um jeito de testar sem o agente. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`hooks/LEIA-ME.md`](/MYWEBPG/downloads/glossario-ia-exemplos/hooks/LEIA-ME.md)

**Na minha visão.** Eu uso o RTK, que funciona com hooks: quando o agente chama comandos mapeados, como o git, ele trunca a resposta e lê só o conteúdo interessante, evitando gastar token à toa com poluição de texto. Na minha experiência, teve diferença sim: senti uma economia de algo entre sessenta e oitenta por cento dos tokens, uma economia bem forte.

Esse número é a minha percepção de uso, não uma medição. O resultado depende de como você usa e de quais comandos o agente roda.

## HANDOFF: a passagem de bastão

**O que é.** Handoff é quando um agente passa a tarefa pra outro (ou pra uma pessoa) junto com o que o próximo precisa saber. Em algumas ferramentas é uma função própria: no Agents SDK da OpenAI, um agente de triagem pode transferir a conversa pra um agente de reembolso, por exemplo. No dia a dia, o que mais importa é o conteúdo da passagem: o contexto, o que foi feito, o que falta, onde está, o que ainda não se sabe e o que não fazer.

**Analogia.** É a passagem de bastão numa corrida de revezamento. Quem entrega não solta o bastão no chão: entrega na mão, no ritmo certo, pra quem vai continuar.

**Exemplo de arquivo.** `handoff.md`, um bilhete padrão de passagem de bastão, com status (rascunhado, conferido, bloqueado, entregue) e critério de pronto. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`handoff.md`](/MYWEBPG/downloads/glossario-ia-exemplos/handoff.md)

**Na minha visão.** No OpenCode eu uso o comando `/handoff`, que vem por plugin: com ele o agente passa todo o contexto e o briefing da ideia. Por exemplo, quando eu delego uma apresentação pra um subagente: passo o contexto, os itens que eu quero, o briefing completo e detalhado, snippets se for o caso. Como se fosse uma passagem de bastão: você passa a tarefa pro colega com todos os detalhes e o contexto todo.

## ARTEFATO (ARTIFACT): o objeto que sai do trabalho

**O que é.** Artefato é a coisa concreta que o trabalho com o agente produz, e que você consegue abrir, olhar e mexer: um documento com imagens, uma planilha, um gráfico, uma página interativa. É o que dá pra revisar, guardar e repassar depois que a conversa termina. Em algumas ferramentas a palavra tem um sentido mais específico. No Claude Code, por exemplo, "artifact" é uma página web interativa publicada num link privado.

**Analogia.** É um objeto, não a conversa sobre ele. A conversa passa; o objeto fica na mesa, visual e interativo, pra você e pros outros usarem.

**Exemplo de arquivo.** `artefato-exemplo.md`, um modelo de resumo semanal de atendimento, com campos em branco e uma seção de limites do próprio resumo. [Baixar o pacote (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip) · [`artefato-exemplo.md`](/MYWEBPG/downloads/glossario-ia-exemplos/artefato-exemplo.md)

**Na minha visão.** Artefato é todo objeto que a gente constrói, visual: um documento de texto com imagens, um HTML interativo, algo do tipo. A melhor definição é um objeto interativo, seja uma planilha, um gráfico, alguma coisa assim.

## Pra fechar

Ninguém precisa dominar todas essas palavras de uma vez. Mas reparar que boa parte delas é, no fundo, sobre organização ajuda: escrever o que se quer antes de pedir (PRD, SRS, spec), deixar instrução num lugar fixo (*.MD, skills), passar o bastão direito (handoff), colocar um porteiro onde não pode passar coisa errada (hooks) e guardar o que foi entregue (artefato). Ferramenta muda rápido. Processo bem descrito costuma durar mais.

Os arquivos-modelo estão aí pra você baixar e adaptar. Eles são ponto de partida, não garantia de nada: confira sempre a documentação da versão da ferramenta que você usa.

No fim, quase tudo aqui volta pra mesma coisa: documentação e processo bem definido. A IA escreve muito, e rápido, mas quem precisa entender o que foi feito, e dar manutenção depois, é você. Então baixa os arquivos, mexe, quebra, adapta pro seu negócio. E se alguma palavra dessas ainda ficou nebulosa, me chama que a gente conversa.

Todos os arquivos de uma vez: [Baixar todos os arquivos (.zip)](/MYWEBPG/downloads/glossario-ia-exemplos.zip). A lista do que vai no pacote está no [`README.md`](/MYWEBPG/downloads/glossario-ia-exemplos/README.md).

## Fontes

Conferidas em 18/11/2026.

- AGENTS.md: https://agents.md/
- Claude Code, memória, CLAUDE.md e AGENTS.md: https://code.claude.com/docs/en/memory
- Claude Code, janela de contexto e compactação: https://code.claude.com/docs/en/context-window
- Claude Code, glossário: https://code.claude.com/docs/en/glossary
- Atlassian, o que é um PRD: https://www.atlassian.com/agile/product-management/requirements
- IEEE 830-1998 (substituída pela ISO/IEC/IEEE 29148): https://standards.ieee.org/ieee/830/1222/
- ISO/IEC/IEEE 29148:2018: https://www.iso.org/standard/72089.html
- GitHub Spec Kit (SDD): https://github.com/github/spec-kit
- Agent Skills, especificação: https://agentskills.io/specification
- Claude Code, skills: https://code.claude.com/docs/en/skills
- Claude Code, manifesto de plugin: https://code.claude.com/docs/en/plugins-reference
- Model Context Protocol, introdução: https://modelcontextprotocol.io/docs/getting-started/intro
- Claude Code, MCP: https://code.claude.com/docs/en/mcp
- Claude Code, hooks: https://code.claude.com/docs/en/hooks
- RTK (Rust Token Killer), repositório: https://github.com/rtk-ai/rtk
- RTK, instalação e hook do Claude Code: https://github.com/rtk-ai/rtk/blob/master/INSTALL.md
- OpenAI Agents SDK, handoffs: https://openai.github.io/openai-agents-python/handoffs/
- opencode-handoff, plugin da comunidade com o comando /handoff pro OpenCode: https://github.com/joshuadavidthomas/opencode-handoff
- Claude Code, artifacts: https://code.claude.com/docs/en/artifacts

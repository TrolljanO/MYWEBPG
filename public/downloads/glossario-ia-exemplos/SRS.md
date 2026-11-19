<!--
EXEMPLO DE SRS (Software Requirements Specification, especificação de requisitos de software)

O que é: o documento que detalha COMO o sistema deve se comportar, com
requisitos numerados, testáveis e sem ambiguidade. Historicamente o modelo de
referência era a IEEE 830 (1998); hoje ela foi substituída pela norma
ISO/IEC/IEEE 29148 (edição 2018 vigente). Este arquivo é um modelo simples
INSPIRADO nessa linha (introdução, descrição geral, requisitos específicos),
não é uma cópia nem substitui a norma.

Como usar: cada requisito tem um código (RF = funcional, RNF = não funcional),
uma frase com "deve" e um critério de aceite que dá pra testar.

Negócio do exemplo: a mesma loja fictícia do PRD.md.
-->

# SRS: [Nome do sistema, ex.: Assistente de dúvidas frequentes da loja]

Versão: [0.1] | Data: [dd/mm/aaaa] | Origem: PRD [link ou nome]

## 1. Introdução
### 1.1 Propósito
[Pra que serve este documento e quem vai ler.]
### 1.2 Escopo
[O que o sistema faz e o que fica de fora.]
### 1.3 Termos
- Dúvida frequente: pergunta que está na lista oficial `faq.md`.
- Transferência: passar a conversa pra uma pessoa (ver `handoff.md`).

## 2. Descrição geral
- Usuários: [cliente final, atendente, gestor].
- Ambiente: [ex.: canal de mensagens da loja + planilha de respostas].
- Restrições: [ex.: não guardar dado de cartão; horário de atendimento humano das 9h às 18h].
- Premissas e dependências: [ex.: a lista oficial é mantida pela equipe].

## 3. Requisitos funcionais
| Código | Requisito | Critério de aceite |
| --- | --- | --- |
| RF-01 | O sistema deve responder só com conteúdo da lista oficial. | Em [N] perguntas de teste fora da lista, nenhuma resposta inventada; todas viram transferência. |
| RF-02 | O sistema deve transferir pra pessoa quando o cliente pedir. | Mensagens com "falar com atendente" geram transferência com resumo. |
| RF-03 | O sistema deve registrar cada transferência com motivo. | Toda transferência aparece no registro com data, motivo e resumo. |

## 4. Requisitos não funcionais
| Código | Requisito | Critério de aceite |
| --- | --- | --- |
| RNF-01 | Tempo de resposta automática de até [N] segundos. | Medido em [N] conversas de teste. |
| RNF-02 | Nenhuma credencial em texto no projeto. | Busca por senha/token no repositório não encontra nada; só variável de ambiente (ex.: SEU_TOKEN_AQUI). |
| RNF-03 | Linguagem educada, em português, sem gíria. | Revisão humana de [N] respostas por semana. |

## 5. Rastreabilidade
| Requisito | História do PRD |
| --- | --- |
| RF-01 | [história 1] |
| RF-02 | [história 2] |

## 6. Pendências
- [ex.: confirmar texto padrão de transferência fora do horário.]

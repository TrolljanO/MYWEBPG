# Handoff — definição de estilo da gravura / papercut (para Claude)

**Destinatário:** Claude (sessão de direção de arte e especificação).  
**Implementador depois:** agente no Cursor (mesmo repositório), que aplica o que você definir aqui.  
**Dono do produto:** Guilherme Trajano — site pessoal / portfólio (identidade ampla: dev, dados, IA; AEC é uma aplicação entre outras).

---

## 1. O que pedimos a você (Claude)

Não implementar código nesta etapa. Produzir um **brief de estilo executável** para outro agente, com:

1. **Posicionamento visual** em 1 parágrafo (tom, o que evitar, o que é assinatura).
2. **Decisões fechadas** (escolha A ou B quando houver fork), não lista infinita de opções.
3. **Paleta** — papéis nomeados (fundo hero, tinta, acento opcional, sombra entre folhas); valores hex ou referência à rampa Maquete; comportamento em tema claro **e** escuro do site.
4. **Composição da hero** — enquadramento (cena cheia vs moldura com centro livre para texto), hierarquia (o que é fundo / meio / frente), quantas camadas (faixa 5–12).
5. **Vocabulário de motivos** — quais entram (nuvem ruyi, seigaiha, onda, monte, meandro, etc.) e quais **não** entram (dragão narrativo, canteiro de obra AW, isométrico laranja do pacote Grok).
6. **Linguagem de linha vs papercut** — o motor Maquete hoje só faz silhuetas chapadas com vazados. O usuário quer **também** linha de gravura/porcelana e folhas com contorno. Especifique: o que é SVG stroke, o que é camada sólida, o que fica para fase 2 (animação por contorno).
7. **Movimento** — gestos permitidos na hero (paralaxe, desdobrar recortes, respiro); o que desliga com `prefers-reduced-motion`.
8. **Critérios de aceite** — checklist de 8–12 itens verificáveis (“não parece baleia geométrica”, “há espiral em nuvens”, etc.).
9. **Plano de implementação em fases** — Fase 1 (estático SVG na home), Fase 2 (opcional: Maquete.animar ou equivalente).

Formato de saída desejado: markdown com seções `## Decisões`, `## Paleta`, `## Composição`, `## Motivos`, `## Motor Maquete`, `## Critérios de aceite`, `## Instruções para o implementador Cursor` (passos concretos em arquivos do repo).

---

## 2. Visão do usuário (não negociável sem ele)

- Site com **motion design** e estética **ukiyo-e / woodblock**, mas o papercut é **recorte sobre recorte com profundidade** — inclusive **contornos internos** da onda como bordas móveis que revelam desenho em linha atrás (referência mental: Remotion / After Effects; não é só parallax FG/BG).
- Inspiração de **cerâmica / porcelana** (linha, padrão, seigaiha) **sem** obrigar azul-e-branco; paleta pode ser sumi, cobalto, ou P&B do site.
- **Execução profissional original**; materiais antigos (AW Maquete corporativo, pacote Codex laranja) são referência de **método** ou conteúdo, não para copiar logo ou UI de obra.
- Conteúdo do site: não inventar posts/biografia; arte é exceção criativa explícita.

Trecho histórico: `docs/session-recovery/RETOMADA.md` e `docs/session-recovery/2026-10-26-conversa-compartilhada.txt`.

---

## 3. Referências visuais (anexar ou abrir no repo)

Copiar para o Claude as imagens em:

`assets/concepts/referencias/`

| Arquivo | Leitura |
| --- | --- |
| `01-porcelana-dragoes-paisagem.png` | Qinghua: densidade de linha, cena, meandro |
| `02-seigaiha-moldura-ruyi.png` | Fundo seigaiha, cantos, nuvem ruyi, centro vazio |
| `03-nuvens-auspiciosas-textil.png` | Padrão xiangyun, contorno, paleta limitada |
| `04-nuvens-papercut-camadas.png` | **Alvo de materialidade**: folhas, sombra, contorno claro |

**Smoke test que falhou (estética):** o usuário viu a hero com formas cinzas abstratas (montanhas zigue-zague, “baleia”, hexágonos, losangos na base) — preset `ukiyo` atual. Isso **não** é o objetivo; é wireframe procedural.

---

## 4. Estado técnico do repositório (para suas instruções ao Cursor)

**Repo:** `kittiwake` (worktree MYWEBPG). Site estático: Python build → `dist/`, conteúdo Markdown, sem CMS.

**Hero hoje:**

- Template: `templates/home.html` — `{{ engraving }}` dentro de `#print-frame`.
- Arte: `assets/engraving.svg` gerado por `node scripts/render-engraving.mjs [preset] [semente]`.
- Interação: `index.js` — `.art-layer` com `data-depth`, `data-open-x/y`, `data-open-rotate`; botão “Desdobrar gravura”.
- CSS: `index.css` — `.print-frame` aspect-ratio 900/760, tema via `--paper` / `--ink`.

**Motor papercut (usar, não reescrever do zero):**

- Cópia: `assets/motor/maquete-motor.js` (API: `Maquete.cena`, `Maquete.cenaSVG`, `Maquete.rampa`, `Maquete.vetores`, `PRESETS`).
- Extensão site: `assets/motor/maquete-kittiwake.js` — geradores `monteFuji`, `ondaGarra`, `nuvens`, `arabesco`; presets `ukiyo`, `porcelana`.
- Documentação: `docs/design/Design System com Papercut Layers/` (motor completo, `guia/vetores.md`, Gerador `.dc.html`).
- Doc interna: `docs/design/maquete-kittiwake.md`.

**Regras Maquete relevantes:** silhueta por camada, `nonzero` cheio/vazado, cor da rampa por profundidade, sem degradê interno na silhueta; luz de cima-esquerda; até ~9 passos de rampa.

**O que abandonar para a hero:** pipeline antigo imagegen → `wave-lines.svg` / `compose-engraving.py` (pode permanecer no repo como legado, não como fonte da home).

**Build / QA:** `python3 scripts/build-site.py --output <dir>`; `python3 -m unittest discover -s tests`; `scripts/check-site.py`. Gravura deve continuar autocontida em `assets/engraving.svg` (teste de inline + `#wave-print` para miniatura do projeto visual).

**Direção editorial site (não confundir com arte):** `docs/design/direcao-e-fontes.md` — P&B, Cormorant + Manrope, sem acento colorido obrigatório na UI; arte pode ter cor contida se o brief permitir.

**Fora de escopo:** publicação DNS, import Second Brain, copiar DS laranja de `pacote-codex/` para a home.

---

## 5. Perguntas que você (Claude) deve resolver explicitamente

1. Hero: **cena narrativa** (monte + onda) ou **moldura ornamental** com área central calma (ref. 02)?
2. Cor na arte: **só sumi/P&B** alinhado à UI, **cobalto** como acento, ou **paleta ref. 03** (teal/creme/vinho) em quantas camadas?
3. Linha interna (hachura/contorno): **obrigatória na Fase 1** ou aceita silhueta Maquete + contorno SVG overlay na Fase 1?
4. Onda: remeter a **Hokusai** sem copiar a Grande Onda literal — quais 3 traços distintivos obrigatórios?
5. Fundo da hero: `var(--paper)` sempre, ou céu escuro no tema dark (risco: abstração)?
6. Miniatura do card “Este espaço, em camadas”: manter `#wave-print` ou outro ícone?
7. Crédito na legenda: “Motor Maquete”, “gravura original”, menção IA ou não?

---

## 6. Anti-padrões (rejeitar no brief)

- Silhuetas que leem “baleia”, “PowerPoint”, ou terreno de obra.
- PNG gerado por IA vetorizado como hero final.
- Logo / Tiffany / canteiro Athié Wohnrath na arte pública.
- Animação em loop que atrapalha leitura (site prioriza conteúdo).
- Dez categorias de conteúdo ou métricas inventadas.

---

## 7. Como o usuário vai usar este handoff

1. Enviar este arquivo + as 4 PNGs de `assets/concepts/referencias/` ao Claude.
2. Pedir a saída no formato da seção 1.
3. Colar a resposta do Claude de volta no Cursor com: “Aplica o brief do Claude em `docs/design/handoff-estilo-gravura-para-claude.md` + anexo abaixo.”
4. O agente Cursor implementa em `maquete-kittiwake.js`, `render-engraving.mjs`, `engraving.svg`, ajustes mínimos em CSS/legenda se o brief pedir.

---

## 8. Preview local (para o implementador)

```bash
node scripts/render-engraving.mjs ukiyo 2718
python3 scripts/build-site.py --output /tmp/kittiwake-preview
python3 -m http.server 4173 --directory /tmp/kittiwake-preview --bind 0.0.0.0
```

Abrir `http://localhost:4173/` — testar tema claro/escuro, desdobrar gravura, movimento reduzido.

---

*Gerado em 2026-10-26 para handoff Claude → Cursor. Atualizar este arquivo se o usuário fechar novas decisões após o retorno do Claude.*

**Decisões fechadas em `docs/design/brief-estilo-gravura.md` (2026-10-26).** Implementação Cursor na mesma data.

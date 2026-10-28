# Brief de estilo — gravura / papercut da hero

**De:** Claude (direção de arte) · **Para:** implementador Cursor · **Data:** 2026-10-26
**Responde a:** `docs/design/handoff-estilo-gravura-para-claude.md` (seção 1 e perguntas da seção 5).
> **Superado em parte (2026-10-26, noite):** cor livre, medalhão/greca/cantos voltaram, dragão previsto. Ver `maquete-kittiwake.md` § Revisão.

**Referências:** `assets/concepts/referencias/01..04`. A **04** é o alvo de materialidade, a **02** dá o fundo, a **03** dá só o vocabulário da nuvem (a paleta dela não entra) e a **01** dá a densidade de linha (dragões e cena não entram).

---

## Posicionamento visual

Uma gravura em papel recortado, monocromática em sumi, que lê primeiro como **matéria** (folhas empilhadas, sombra curta, contorno claro rente à borda) e depois como **desenho** (espirais nas nuvens, estrias no rolo da onda, seigaiha fina ao fundo). A assinatura é **a linha dentro do recorte**: toda folha sólida carrega um contorno claro e um desenho em linha. A combinação de ukiyo-e (a onda) com porcelana (seigaiha e nuvem ruyi) aparece no desenho, sem azul-e-branco e sem citação literal. O que evitar: as formas abstratas geométricas do preset `ukiyo` atual (zigue-zague, losango, polígono de 8 pontos), qualquer leitura de "baleia", gradiente dentro da silhueta, cor de marca, imagem raster e movimento que chama atenção sozinho. A hero fica ao lado do texto e não compete com ele: é uma cena calma, densa nas bordas e respirando no meio.

---

## Decisões

Respostas fechadas às 7 perguntas do handoff (§5):

| # | Pergunta | Decisão |
|---|---|---|
| 1 | Cena narrativa ou moldura ornamental? | **Cena narrativa mínima: onda + nuvens + monte pequeno.** O texto já está em coluna própria (`.hero-copy`), então a arte não precisa de centro vazio. O que vem da ref. 02 é o **fundo seigaiha**; os cantos ornamentais dela não entram. |
| 2 | Cor na arte | **Só sumi (P&B quente), uma rampa de 7 passos.** Sem cobalto na Fase 1 e sem a paleta da ref. 03. Na tela, a profundidade vem do valor tonal e da sombra, não do matiz. |
| 3 | Linha interna na Fase 1? | **Obrigatória na Fase 1**, como overlay SVG `stroke` recortado pela própria silhueta (clip). Isso não inclui hachura densa estilo ref. 01, que não entra em nenhuma fase. |
| 4 | 3 traços Hokusai obrigatórios | (a) **Crista que se parte em 5–9 garras curvas** com a ponta virada para dentro; (b) **escala invertida**: o monte é pequeno (≤ 20% da largura) e fica dentro da concavidade da onda; (c) **estrias paralelas** (3–5 linhas) acompanhando o dorso e o rolo, mais espuma em gotas vazadas. Para não copiar: a onda é **espelhada** (sobe da direita e quebra para a esquerda, em direção ao texto), não tem barcos e não segue a proporção da Grande Onda. |
| 5 | Fundo da hero | **`var(--paper)` sempre**, nos dois temas. Céu escuro no dark não entra. |
| 6 | Miniatura do card | **Manter `#wave-print`.** O conteúdo passa a ser a silhueta de `ondaRolo` + `cristaGarras` em `currentColor`. |
| 7 | Crédito na legenda | Título **"Entre ondas e montanhas"** (mantém). Crédito: **"Gravura procedural original · motor Maquete"**. Sem menção a IA, porque a arte não usa imagem gerada: é código determinístico. |

Outras decisões:

- **7 camadas `.art-layer`** (dentro da faixa 5–12). Mais que isso polui; menos perde a profundidade.
- **Meandro e arabesco não entram na hero.** A faixa de base foi justamente o que leu como "losangos" no smoke test.
- **Sem gradiente interno.** O `linearGradient` por camada do `render-engraving.mjs` atual sai, porque viola a regra Maquete.
- **Cores via CSS custom properties com classes**, não hex no SVG. É isso que faz o tema escuro funcionar sem `filter: invert`.
- **Preset novo `gravura`** substitui `ukiyo` e `porcelana`. Os geradores antigos `nuvens`, `ondaGarra` e `arabesco` são **removidos**; `monteFuji` fica, parametrizado.

---

## Paleta

Uma rampa sumi de passos 2–8, mais 3 papéis auxiliares. A cor de cada folha vem do **passo** que o motor já calcula (`k.passo`, `de: 2`, `ate: 8`), e o render emite `class="sheet s{passo}"`.

| Papel | Token | Claro (`--paper #fff`) | Escuro (`--paper #111`) |
|---|---|---|---|
| Fundo hero | `var(--paper)` | `#ffffff` | `#111111` |
| Folha passo 2 (mais distante) | `--art-2` | `#f2f2ef` | `#1b1c1b` |
| Folha passo 3 | `--art-3` | `#e2e2de` | `#262826` |
| Folha passo 4 | `--art-4` | `#cbcbc6` | `#343734` |
| Folha passo 5 | `--art-5` | `#a9a9a3` | `#474b48` |
| Folha passo 6 | `--art-6` | `#7c7c77` | `#5e6360` |
| Folha passo 7 | `--art-7` | `#4d4d4a` | `#7a7f7b` |
| Folha passo 8 (frente) | `--art-8` | `#262624` | `#a3a7a2` |
| Tinta da linha (contorno e desenho interno) | `--art-line` | `#faf8f2` | `#e8e4d6` |
| Linha seigaiha do fundo | `--art-seigaiha` | `#dcdcd6` | `#2c2e2c` |
| Sombra entre folhas | `--art-shadow` | `rgb(21 21 21 / .28)` | `rgb(0 0 0 / .55)` |

- Os valores claros são a rampa `sumi` do motor (`M.rampa('#1a1a1a')`) aquecida para casar com `--field #f2f2ef` e `--ink #151515`. Os escuros seguem a ref. 04 (folha ardósia com linha creme).
- **Contraluz nos dois temas**: no claro, a frente é a mais escura; no escuro, a frente é a mais clara (folha iluminada sobre fundo de tinta). Nos dois, a distância se aproxima de `--paper`.
- Nas folhas distantes (passos 2–4) a linha clara fica quase invisível no tema claro. É **intencional**: perspectiva atmosférica, e a sombra é que desenha a borda.
- Impressão (`@media print`): repetir os tokens claros dentro do bloco print existente.

---

## Composição

ViewBox fixo **900 × 760** (o `aspect-ratio` do `.print-frame` não muda). Luz de **cima-esquerda**, então a sombra cai para **baixo-direita**. Ordem do fundo para a frente:

| # | Camada (tipo) | Passo | Plano | Posição / forma | Linha interna |
|---|---|---|---|---|---|
| L1 | `campo` + textura seigaiha | 2 | fundo | Quadro inteiro, com fill do pattern `#gv-seigaiha` (módulo 56px, 3 anéis) | É o próprio padrão (`--art-seigaiha`, 0.8px) |
| L2 | `monteFuji` | 3 | fundo | `x: 0.30`, base em y≈0.80h, cume em y≈0.60h, largura ≤ 0.20w; neve vazada no topo | Nenhuma (só contorno) |
| L3 | `nuvemRuyi` (traseira) | 4 | meio | 2 nuvens no quadrante superior esquerdo/centro, y 0.06–0.30h, largura 0.18–0.26w, cauda para a esquerda | Espiral de 1.4 volta em cada lóbulo |
| L4 | `marSeigaiha` | 5 | meio | Faixa de mar de y≈0.70h até a base, borda superior em escamas (arcos) | Pattern `#gv-seigaiha-mar` (fill `--art-5`, linha `--art-line`) |
| L5 | `ondaRolo` | 6 | frente | Massa que nasce no canto inferior direito, sobe até a crista em (0.42w, 0.20h) e enrola para a esquerda até x≈0.20w; 2–3 **fendas vazadas** longas seguindo as estrias | 3–5 estrias paralelas no dorso e uma espiral que fecha o rolo |
| L6 | `cristaGarras` | 7 | frente | Ao longo do lábio da onda, de (0.62w, 0.20h) a (0.20w, 0.34h): 7 garras curvas com a ponta para dentro; 6–10 gotas de espuma vazadas | 1 linha central em cada garra |
| L7 | `nuvemRuyi` (frontal) | 8 | frente extrema | 1 nuvem no canto superior direito, **cortada pela borda do quadro** (sangra para fora) | Espirais |

- **Hierarquia:** a onda (L5+L6) ocupa cerca de 55% da área e é a figura. As nuvens enquadram por cima e o monte é o ponto de fuga. O centro esquerdo-baixo (sob o rolo) fica mais calmo: só seigaiha e o monte.
- **Revelar o que está atrás (a visão "recorte sobre recorte"):** as fendas vazadas de L5 deixam ver a seigaiha de L1. Como L1 e L5 têm `data-depth` diferentes, a paralaxe desloca o desenho visto pela fenda, e isso já é a "borda móvel que revela linha atrás" na Fase 1, sem animação nova.

---

## Motivos

**Entram:**
- **Nuvem ruyi / xiangyun.** Lóbulos feitos de **círculos sobrepostos** (união por `nonzero`, todos no sentido horário), cauda afilada em curva e espiral em linha no centro de cada lóbulo (refs. 02, 03, 04).
- **Seigaiha:** fundo (L1) e mar (L4), sempre em linha fina (ref. 02).
- **Onda com garras**, conforme os 3 traços da tabela de Decisões.
- **Monte** pequeno, distante, com neve vazada.
- **Gotas de espuma** (círculos vazados).

**Não entram:**
- Dragão ou qualquer figura narrativa da ref. 01.
- Pagode, ponte, barco, flor de ameixeira.
- Meandro / greca, arabesco e faixa ornamental de base.
- Medalhões e cantos ornamentais (ref. 02).
- Paleta teal/vinho/ouro (ref. 03).
- Qualquer coisa do Maquete corporativo: skyline, torre, guindaste, andaime, canteiro de obra, Tiffany, logo AW.
- O isométrico laranja do `pacote-codex/` / Grok.
- Polígonos de 8 pontos como "nuvem" e zigue-zague como "montanha".

---

## Motor Maquete

O que é **camada sólida** (path Maquete, fill pela classe `s{passo}`, cheio = horário e vazado = anti-horário):
- L2–L7. Cada uma é **uma** silhueta com seus vazados (neve, fendas, gotas).

O que é **SVG stroke** (`fill: none`), Fase 1:
1. **Contorno inset**: o mesmo `d` da folha com `stroke: var(--art-line)` e `stroke-width: 2.4`, **recortado pela própria silhueta** (`clip-path`), de modo que só a metade interna (≈1.2px) aparece. É o contorno claro da ref. 04.
2. **Desenho interno** (`linhas`): espirais das nuvens, estrias da onda e linha central das garras, `stroke-width: 1`, `stroke-linecap: round`, com o mesmo clip da folha.
3. **Seigaiha**: `<pattern>` em `defs` (os dois patterns: fundo e mar).

**Contrato novo de gerador** (em `maquete-kittiwake.js`): retornar `{ d, linhas, largura, altura }`, onde `linhas` é uma string de path. O motor passa a repassar `linhas` com uma linha de mudança (ver Instruções, passo 1).

O que fica para a **Fase 2**:
- Desenho por contorno (`stroke-dashoffset`), uma única vez na chegada.
- Fendas que abrem (morph da largura de 0 até o valor final).
- Folha da crista que "descola" (rotação em torno da base).
- Sombra que cresce ao desdobrar.

---

## Movimento

| Gesto | Fase | Regra |
|---|---|---|
| Chegada das folhas (`paper-arrive`) | 1 | Já existe. Uma vez só, escalonada por `--i` (80ms por camada), 1.3s. |
| Paralaxe por ponteiro | 1 | Já existe em `index.js`. Deslocamento máximo de ~6px na frente; L1 quase parado. Sem giroscópio. |
| Desdobrar | 1 | Já existe (`data-open-*`). Novos valores: `ox = (i - mid) * 8`, `oy = -(i - mid) * 10`, `rot ≤ 0.4°`. Em `.is-open`, o contorno inset vai de 2.4 para 4 (`transition: stroke-width .8s`). |
| Respiro em loop | **nunca** | Anti-padrão do handoff: nada em loop. |
| Traço desenhando / fendas abrindo | 2 | Uma vez, disparado por `IntersectionObserver` ou pelo botão. |

**`prefers-reduced-motion: reduce`** (e `html[data-motion=paused]`) desliga chegada, paralaxe, desdobrar e transição de stroke. A composição estática tem que ficar completa e legível. As regras atuais de `index.css` e `index.js` já fazem isso; manter.

---

## Critérios de aceite

1. [ ] Nenhuma forma lê como baleia, losango, hexágono ou zigue-zague. A base do quadro **não** tem faixa ornamental (`arabesco` ausente do preset).
2. [ ] Toda nuvem tem lóbulos arredondados (círculos) e **≥ 2 espirais** em linha.
3. [ ] A crista tem **5–9 garras** curvas com a ponta para dentro, e a onda quebra **para a esquerda**.
4. [ ] O monte ocupa **≤ 20%** da largura e fica sob o rolo da onda.
5. [ ] A seigaiha aparece no fundo como linha fina, e pelas fendas da onda, deslocando com a paralaxe.
6. [ ] Toda folha sólida tem contorno inset claro e sombra para baixo-direita.
7. [ ] `grep -c linearGradient assets/engraving.svg` = 0, `grep -c '<image' assets/engraving.svg` = 0, nenhum `fill="#` nas folhas.
8. [ ] O tema escuro troca **só por tokens** (`--art-*`), sem `filter: invert` na gravura. A folha da frente tem contraste ≥ 3:1 contra `--paper` nos dois temas.
9. [ ] Exatamente **7** `.art-layer`; `engraving.svg` < 100 KB; `node scripts/render-engraving.mjs gravura 2718` roda duas vezes e o `git diff` da segunda é vazio (determinismo).
10. [ ] `#wave-print` existe e a miniatura do card "Este espaço, em camadas" mostra a onda reconhecível.
11. [ ] Com reduced motion: zero transform e zero animação, e a composição continua completa.
12. [ ] `python3 -m unittest discover -s tests` passa (incluindo o teste novo), e `scripts/check-site.py` sobre o build passa.

---

## Plano em fases

**Fase 1: estático SVG na home** (este brief, passos 1–10 abaixo). Entrega: as 7 folhas com linha, tokens de tema, a paralaxe e o desdobrar existentes recalibrados.

**Fase 2: opcional, só depois do aceite visual da Fase 1 pelo usuário:**
- traço desenhando uma vez (`stroke-dasharray`/`dashoffset` nas `.sheet-lines`);
- fendas de L5 que abrem;
- crista que descola com `rotate` em torno da base (`transform-origin` no lábio).

Implementar estendendo `index.js`. Usar `Maquete.animar` **só** se ele operar sobre o SVG inline sem reconstruir o DOM; caso contrário, fica fora.

---

## Instruções para o implementador Cursor

Executar na ordem. Não tocar em `pacote-codex/`, DNS, Second Brain ou no pipeline legado (`compose-engraving.py`, `wave-lines.svg`).

1. **`assets/motor/maquete-motor.js`, linha ~397** (`const camadas = lista.map(...)`). Adicionar `linhas: v.linhas || '',` ao objeto da camada, ao lado de `extra: v.eixos || null`. É a única mudança no motor copiado; registrar a divergência em `docs/design/maquete-kittiwake.md`.

2. **`assets/motor/maquete-kittiwake.js`**
   - **Remover** `nuvens`, `ondaGarra`, `arabesco`, `M.RAMPAS.cobalto`, `M.PRESETS.ukiyo`, `M.PRESETS.porcelana`.
   - **Manter** `monteFuji`, aceitando `o.larguraRel` (default `0.20`) e `o.base` (default `0.80`).
   - **Adicionar** um helper `espiral(cx, cy, r, voltas = 1.4, horario = true)`: polilinha arquimediana amostrada a cada 12°, retornando `M…L…`.
   - **Adicionar** os geradores (todos retornam `{ d, linhas, largura, altura }`; use `M.acaso(o.semente)` para jitter de ±6% em raios e posições):
     - `campo`: `d = ret(0, 0, w, h)`, `linhas = ''`.
     - `nuvemRuyi({ nuvens: [{ x, y, escala, cauda: 'esq' | 'dir' }] })`: cada nuvem tem 4–6 `circulo(..., true)` sobrepostos e uma cauda `cheio` afilada. `linhas` = uma `espiral` por lóbulo com `r = 0.55 × raio`.
     - `marSeigaiha({ nivel: 0.70, modulo: 56 })`: retângulo até a base, com a borda superior feita de arcos (`A`) de raio `modulo / 2`. `linhas = ''`, porque o desenho vem do pattern.
     - `ondaRolo()`: massa do canto inferior direito até a crista em (0.42w, 0.20h), enrolando até x≈0.20w (curvas `Q`/`C`, nada de polígono reto). Mais 2–3 fendas `vazado` finas (8–14px) seguindo o dorso. `linhas` = 3–5 curvas paralelas ao dorso + uma `espiral` fechando o rolo.
     - `cristaGarras({ garras: 7 })`: 7 garras `cheio` em forma de gancho ao longo do lábio, mais 6–10 gotas `circulo(..., false)`. `linhas` = a curva central de cada garra.
   - **Adicionar** `M.PRESETS.gravura`:
     ```js
     { nome: 'Gravura: onda, nuvem e monte', modo: 'contraluz', rampa: 'papel', de: 2, ate: 8, camadas: [
       { tipo: 'campo', textura: 'seigaiha' },
       { tipo: 'monteFuji', x: 0.30, larguraRel: 0.20, base: 0.80, alturaRel: 0.60 },
       { tipo: 'nuvemRuyi', nuvens: [{ x: 0.14, y: 0.12, escala: 1, cauda: 'esq' }, { x: 0.42, y: 0.24, escala: 0.8, cauda: 'esq' }] },
       { tipo: 'marSeigaiha', nivel: 0.70, modulo: 56, textura: 'seigaiha-mar' },
       { tipo: 'ondaRolo' },
       { tipo: 'cristaGarras', garras: 7 },
       { tipo: 'nuvemRuyi', nuvens: [{ x: 0.86, y: 0.06, escala: 1.3, cauda: 'esq' }] },
     ] }
     ```
     A `rampa` serve só para o Gerador `.dc.html`; no site a cor vem dos tokens.

3. **`scripts/render-engraving.mjs`**
   - Default `preset = 'gravura'`. Remover o ramo `porcelana`/`cobalto` e o `linearGradient`.
   - Prefixar todos os ids com `gv-`. Manter o `#wave-print` sem prefixo, porque o teste e o template dependem dele.
   - Em `defs`:
     - `<path id="gv-f{i}" d="…"/>` e `<clipPath id="gv-c{i}"><use href="#gv-f{i}"/></clipPath>` por folha;
     - 3 filtros de sombra (`gv-s0` longe, `gv-s1` meio, `gv-s2` perto) com `feDropShadow` de `dx`/`dy`/`stdDeviation` = `2/3/1.5`, `3/5/2`, `5/8/3`, escolhidos por `k.fator` (< .4, < .75, resto);
     - os patterns `gv-seigaiha` (fill `--paper`, stroke `--art-seigaiha`) e `gv-seigaiha-mar` (fill `--art-5`, stroke `--art-line`). Cada um é um `<pattern width="56" height="28" patternUnits="userSpaceOnUse">` com escamas centradas em (0,0), (56,0), (28,14), (0,28), (56,28), **desenhadas nessa ordem** para a sobreposição funcionar. Cada escama tem um círculo cheio de r=28 e anéis de r=28/19/10. Usar `class`, não atributo de cor.
   - Para cada camada `k` (índice `i`, config `cfgCamada = M.PRESETS[preset].camadas[i]`):
     ```html
     <g class="art-layer" style="--i:{i}" data-depth data-open-x data-open-y data-open-rotate>
       <use href="#gv-f{i}" class="sheet s{k.passo}" filter="url(#gv-s{n})"/>   <!-- se textura: fill="url(#gv-{textura})" em vez de classe s -->
       <use href="#gv-f{i}" class="sheet-edge" clip-path="url(#gv-c{i})"/>
       <path class="sheet-lines" d="{k.linhas}" clip-path="url(#gv-c{i})"/>   <!-- omitir se vazio -->
     </g>
     ```
     L1 (`campo`) não leva `sheet-edge` nem sombra.
   - `data-open-*` com os valores da seção Movimento. `data-depth` segue `1.5 + i * 0.45`, como hoje.
   - `#wave-print`: `<g id="wave-print"><path d="{ondaRolo.d}{cristaGarras.d}" fill="currentColor"/></g>`.
   - Atualizar `<title>`/`<desc>`: "Entre ondas e montanhas" / "Gravura em papel recortado: onda quebrando sob nuvens ruyi, monte distante e mar em seigaiha. Sete folhas em tons de sumi."
   - O `<rect>` de fundo leva `class="art-paper"` em vez de `fill="var(--paper)"`.

4. **`index.css`**
   - Tokens `--art-2…--art-8`, `--art-line`, `--art-seigaiha`, `--art-shadow` em `:root` e em `:root[data-theme=dark]` (valores da tabela de Paleta). Repetir os claros no bloco `@media print`.
   - Regras:
     ```css
     .engraving .art-paper { fill: var(--paper) }
     .engraving .s2 { fill: var(--art-2) } /* … até .s8 */
     .engraving .sheet-edge { fill: none; stroke: var(--art-line); stroke-width: 2.4; transition: stroke-width .8s var(--ease) }
     .print-frame.is-open .sheet-edge { stroke-width: 4 }
     .engraving .sheet-lines { fill: none; stroke: var(--art-line); stroke-width: 1; stroke-linecap: round; stroke-linejoin: round }
     .engraving feDropShadow { flood-color: var(--art-shadow); flood-opacity: 1 }
     .engraving .seigaiha-escama { fill: var(--paper); stroke: var(--art-seigaiha); stroke-width: .8 }
     .engraving .seigaiha-mar-escama { fill: var(--art-5); stroke: var(--art-line); stroke-width: .8 }
     ```
   - Trocar os `.engraving .art-layer:nth-child(2..6)` (hoje contam `title`/`desc`/`defs`, então o escalonamento está errado) por `.engraving .art-layer { animation-delay: calc(var(--i) * 80ms) }`.
   - Remover as regras legadas `.wave-cut`, `.cut-edge`, `.underprint`.
   - Garantir que reduced motion e `data-motion=paused` também zerem a `transition` de `.sheet-edge`.

5. **`index.js`**: sem mudança. Ele já lê `data-depth`/`data-open-*` e alterna `.is-open`.

6. **`templates/home.html`**: em `.art-credit`, trocar "Motor Maquete · papercut procedural" por "Gravura procedural original · motor Maquete".

7. **Gerar:** `node scripts/render-engraving.mjs gravura 2718`. Rodar de novo e confirmar `git diff --stat assets/engraving.svg` vazio na segunda vez. Testar 3–4 sementes e escolher a melhor, registrando-a no doc.

8. **`tests/test_engraving.py`** (novo, `unittest`, lendo `assets/engraving.svg`): conferir que existe `id="wave-print"`, que há exatamente 7 `class="art-layer"`, zero `linearGradient`, zero `<image`, zero `fill="#`, e tamanho < 100 KB.

9. **Docs:**
   - em `docs/design/maquete-kittiwake.md`: preset `gravura`, contrato `linhas`, divergência do motor, geradores removidos;
   - no fim de `docs/design/handoff-estilo-gravura-para-claude.md`: a linha "Decisões fechadas em `brief-estilo-gravura.md` (2026-10-26)".

10. **QA** (handoff §8):
    ```bash
    node scripts/render-engraving.mjs gravura 2718
    python3 -m unittest discover -s tests
    python3 scripts/build-site.py --output /tmp/kittiwake-preview && python3 scripts/check-site.py /tmp/kittiwake-preview
    python3 -m http.server 4173 --directory /tmp/kittiwake-preview --bind 0.0.0.0
    ```
    Tirar 4 capturas (claro, escuro, desdobrado, reduced motion) e conferir os 12 critérios de aceite um a um antes de entregar. Os critérios 1–5 são visuais e o usuário dá a palavra final.

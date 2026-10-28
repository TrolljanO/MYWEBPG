# Maquete no portfólio Kittiwake

Fonte do motor e metodologia: `Design System com Papercut Layers/` (Athié Wohnrath). Uso no site: geradores e presets próprios, sem logo nem tokens a|w na interface pública.

**Brief:** `docs/design/brief-estilo-gravura.md` (2026-10-26), **parcialmente superado** pela revisão abaixo.

## Revisão 2026-10-26 (noite): curvas no lugar de polígonos

O smoke test do brief sumi falhou ("horrível"). Causa raiz: os geradores usavam `cheio`/`vazado` do motor, que só emitem **segmentos retos**; onda, garras e monte viravam papelão. O usuário mandou 4 refs novas (seigaiha com cantos azuis, qinghua com dragões e faixas, medalhão de dragão com greca, dragão em traço com nuvens) e definiu: **as refs valem por forma e estilo, a cor é livre**.

- Geradores reescritos em `maquete-kittiwake.js` com Catmull-Rom → Bézier, arcos e offsets. Cada motivo é desenhado uma vez e o gerador só posiciona/escala/espelha.
- Nuvem xiangyun = anel de círculos; o contorno é a união (arcos externos entre interseções), com arcos concêntricos em cada lóbulo e espirais nas pontas.
- Garras da onda entram no **próprio contorno** (uma silhueta, sem costura); estrias = offsets do dorso.
- Voltaram ao escopo (contra o brief): medalhão com greca e lótus, faixa de meandro de base, quartos de rosácea nos cantos. **Dragão: etapa 2**, ainda não feito.
- Cor: tokens `--art-*` (agora com `--art-ink` para linha escura sobre papel); trocar a paleta não exige mexer no motor.
- Por camada, o preset define `tom` (2–8 ou `'papel'`) e `tinta` (linha escura).

## Divergência no motor copiado

`assets/motor/maquete-motor.js` repassa `linhas` do gerador para cada camada (`linhas: v.linhas || ''` em `cena()`). Necessário para contorno e desenho interno no SVG da hero.

## Pipeline

1. `assets/motor/maquete-motor.js` — motor procedural (cópia versionada; ver divergência acima).
2. `assets/motor/maquete-kittiwake.js` — preset **`gravura`** (8 camadas) e geradores `campo`, `medalhao`, `nuvens`, `monte`, `mar`, `onda`, `moldura`.
3. `node scripts/render-engraving.mjs gravura [semente]` → `assets/engraving.svg` (classes `sheet`, `sheet-edge`, `sheet-lines`, tokens `--art-*`).

Semente de produção atual: **2718** (revisar após smoke visual).

Explorar sementes no Gerador: copiar `styles.css`, `support.js` e `motor/` da pasta do design system para a raiz temporária e abrir `Maquete Gerador.dc.html`, ou variar a semente no script de render.

## Referências de gosto (2026-10-26)

Arquivos em `assets/concepts/referencias/` (não vão para o build público).

| Arquivo | O que captura | Uso no site |
| --- | --- | --- |
| `01-porcelana-dragoes-paisagem` | Qinghua: linha azul cobalto, hachura, cena narrativa (dragão, pagode, água), bordas meandro | Vocabulário de **tinta** e densidade — não copiar cena literal; inspirar arabescos e “faixas” decorativas |
| `02-seigaiha-moldura-ruyi` | Seigaiha de fundo, cantos ornamentais, nuvem ruyi, espaço central vazio | **Moldura da hero** e padrão de fundo discreto; UI respira no centro |
| `03-nuvens-auspiciosas-textil` | Nuvens xiangyun repetidas, contorno dourado, paleta limitada (teal, creme, vinho) | Paleta **opcional** para variantes (não obrigar dourado); motivo de nuvem com espiral interna |
| `04-nuvens-papercut-camadas` | Mesmo vocabulário de nuvem, mas **folhas empilhadas** com sombra e contorno claro | **Mais próximo do alvo**: Maquete + contorno + profundidade física; é o que a hero deve evoluir |

Síntese: você quer **gravura/porcelana na linguagem do traço** (nuvens, ondas, meandros) com **papercut real** (recorte, sombra, camadas que abrem) — não silhuetas lisas sem linha interna nem PNG vetorizado genérico. O preset `ukiyo` atual é só o primeiro degrau (silhuetas Maquete); o passo seguinte é `nuvensRuyi` com espirais vazadas + borda seigaiha/moldura + onda com “garras” mais trabalhadas, mantendo `render-engraving.mjs`.

## Pacote Codex (Grok)

`pacote-codex/` guarda o design system técnico laranja/grafite (etapa 3). **Não** é a direção visual atual do site (gravura/papercut em preto e branco). Serve como referência de conteúdo, tokens e ilustrações isométricas AEC — não copiar paleta laranja para a home.

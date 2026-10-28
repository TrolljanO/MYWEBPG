# Achados de motion — 2026-10-28

Auditoria feita sobre o build servido em `http://127.0.0.1:4174/`, idêntico a `index.js` e `index.css` no momento da medição. O capturador reproduzível está em `tests/motion-capture.mjs`; as 12 capturas e o resultado bruto estão em `/tmp/kittiwake-motion-capture/`.

O stack usa GSAP como sistema de animação e somente Lenis como motor de smooth scroll. A ligação `lenis.on('scroll', ScrollTrigger.update)` e o avanço por `gsap.ticker` estão presentes; não há Locomotive nem um segundo motor inicializado. A suavização CSS já registrada em A4, a ausência de `ScrollTrigger.refresh()` e o estado restaurado de pausa já registrados em B6, e a ausência de intro já registrada em B7 não foram reabertos.

Antes das capturas, `window.scrollTo(0, 900)` manteve `scrollY=0` no instante da chamada e chegou a `scrollY=900` após 500 ms nas duas larguras: o Lenis aceitou o comando, portanto não foi necessário o fallback por `Input.dispatchMouseEvent`. Com motion ativo, os pontos 0, 900, 1800, 2700, 3600 e 4500 foram atingidos exatamente em 1440×900 e 390×844. Nenhum `h1`, `h2`, `h3`, `p`, `a` ou `button` de seção intersectante estava oculto por `display`, `visibility`, `opacity` ou caixa nula nesses pontos; a inspeção visual das 12 capturas também não revelou conteúdo ausente.

Durante rolagem sintética por wheel, 132 deltas de `requestAnimationFrame` foram amostrados em cada largura. O p95 foi **16,8 ms em 1440 px** e **16,7 ms em 390 px** (máximo de 16,8 ms nos dois casos), abaixo do gate de 20 ms do plano; é uma medição de Chromium headless, não uma promessa de FPS em dispositivo real. A emulação CDP disponível não expôs `Emulation.setPageVisibilityOverride`, e a tentativa de blur não produziu perda real de foco; por isso não se atribui comportamento medido a uma aba oculta. A ausência de cleanup, porém, é verificável diretamente no código e aparece abaixo.

A contraprova de zoom confirmou o resultado novo da Task 1: em viewport 1440×1400 com zoom de 200%, `scrollWidth=1447` para `innerWidth=1440`, isto é, **7 px de overflow horizontal**. A mesma amostra encontrou zero textos de `.wrap` cobertos por `.cut`.

| ID | Sev | Achado | Evidência | Regra | Onda |
|---|---|---|---|---|---|
| MOT-1 | P2 | Lenis, seu listener de scroll e o callback adicionado ao ticker global do GSAP são criados sem caminho explícito de cleanup: não há `pagehide`, remoção do ticker, `ScrollTrigger.kill()` nem `lenis.destroy()`. | `index.js:84-103` | awwwards §4/§7 — cleanup de recursos de animação | motion |
| MOT-2 | P1 | A 200% de zoom, a página tem 7 px de overflow horizontal (`1447 − 1440`); os recortes amostrados não cobrem texto de `.wrap`. | `motion-zoom-200.jpg`; `tests/motion-capture.mjs:149-169` | WCAG 1.4.10; awwwards §7 | composição |

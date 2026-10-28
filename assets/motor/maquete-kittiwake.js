/* Preset gravura — Kittiwake. Carregar após maquete-motor.js
   Diferente dos vetores arquitetônicos do motor (polígonos retos), aqui tudo é curva:
   Catmull-Rom → Bézier cúbica, arcos de círculo e offsets. Cada motivo é desenhado uma vez
   (nuvem xiangyun, onda com garras, greca, seigaiha) e o gerador só posiciona, escala e espelha. */
(function (M) {
  if (!M) return;
  const r1 = n => Math.round(n * 10) / 10;
  const caixa = o => [o.largura || 900, o.altura || 760];
  const TAU = Math.PI * 2;
  const pt = p => `${r1(p[0])} ${r1(p[1])}`;

  /* ---------- geometria de curva ---------- */
  // Catmull-Rom (tensão .5) → segmentos cúbicos [p0, c1, c2, p3]
  function suave(pts, fechado = false) {
    const n = pts.length, segs = [];
    const at = i => fechado ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    for (let i = 0; i < (fechado ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      segs.push([p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2]);
    }
    return segs;
  }
  const caminho = (segs, fechar) => 'M' + pt(segs[0][0]) + segs.map(s => 'C' + pt(s[1]) + ' ' + pt(s[2]) + ' ' + pt(s[3])).join('') + (fechar ? 'z' : '');
  function bez(s, t) {
    const u = 1 - t;
    return [0, 1].map(k => u * u * u * s[0][k] + 3 * u * u * t * s[1][k] + 3 * u * t * t * s[2][k] + t * t * t * s[3][k]);
  }
  function amostra(segs, n = 12) {
    const out = [];
    segs.forEach((s, i) => { for (let k = i ? 1 : 0; k <= n; k++) out.push(bez(s, k / n)); });
    return out;
  }
  const area = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };
  const inverter = segs => segs.slice().reverse().map(([a, b, c, d]) => [d, c, b, a]);
  // mesma regra do motor (nonzero): cheio = área ≥ 0, vazado = área < 0
  const forma = (segs, cheio = true) => caminho((area(amostra(segs, 4)) >= 0) === cheio ? segs : inverter(segs), true);
  const linha = pts => pts.length > 1 ? caminho(suave(pts), false) : '';
  // arco de círculo em cúbicas (≤ 90° por pedaço); a0 → a1, ângulo crescente = horário na tela
  function arco(cx, cy, r, a0, a1) {
    const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 2))), da = (a1 - a0) / n, k = 4 / 3 * Math.tan(da / 4), segs = [];
    for (let i = 0; i < n; i++) {
      const a = a0 + i * da, b = a + da;
      const p0 = [cx + r * Math.cos(a), cy + r * Math.sin(a)], p3 = [cx + r * Math.cos(b), cy + r * Math.sin(b)];
      segs.push([p0, [p0[0] - k * r * Math.sin(a), p0[1] + k * r * Math.cos(a)], [p3[0] + k * r * Math.sin(b), p3[1] - k * r * Math.cos(b)], p3]);
    }
    return segs;
  }
  const circ = (cx, cy, r, cheio = true) => forma(arco(cx, cy, r, 0, TAU), cheio);
  // desloca uma polilinha pela normal (lado esquerdo do sentido de percurso quando dist > 0)
  function deslocar(pts, dist) {
    return pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      return [p[0] + dy / L * dist, p[1] - dx / L * dist];
    });
  }
  function espiral(cx, cy, r, voltas = 1.6, a0 = 0, horario = true) {
    const pts = [], n = Math.ceil(voltas * 24);
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = a0 + (horario ? 1 : -1) * t * voltas * TAU, rr = r * (1 - t * .82);
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
    return linha(pts);
  }
  // interseção de dois círculos: o ponto mais longe de (ox, oy)
  function cruza(a, b, ox, oy) {
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    const l = (a.r * a.r - b.r * b.r + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, a.r * a.r - l * l));
    const mx = a.x + dx * l / d, my = a.y + dy * l / d;
    const p = [mx + dy * hh / d, my - dx * hh / d], q = [mx - dy * hh / d, my + dx * hh / d];
    return Math.hypot(p[0] - ox, p[1] - oy) > Math.hypot(q[0] - ox, q[1] - oy) ? p : q;
  }

  /* ---------- motivos ---------- */
  // Nuvem xiangyun: anel de círculos em sentido horário (topo E→D, base D→E). O contorno é a
  // união (arcos externos entre interseções); dentro de cada lóbulo, arcos concêntricos.
  const NUVEM = [[-1.08, .14, .38], [-.66, -.26, .45], [-.1, -.46, .56], [.48, -.32, .5], [.98, .04, .42], [1.02, .44, .26], [.52, .44, .34], [-.04, .5, .36], [-.6, .46, .32], [-1.04, .52, .24]];
  function nuvemSegs(cx, cy, s, rnd, espelho = false) {
    let cs = NUVEM.map(([x, y, r]) => ({ x: cx + (espelho ? -x : x) * s, y: cy + y * s, r: r * s * rnd.entre(.94, 1.06) }));
    if (espelho) cs = cs.reverse();
    const ox = cs.reduce((a, c) => a + c.x, 0) / cs.length, oy = cs.reduce((a, c) => a + c.y, 0) / cs.length;
    const n = cs.length, ang = (c, p) => Math.atan2(p[1] - c.y, p[0] - c.x);
    let segs = [], linhas = '';
    cs.forEach((c, i) => {
      const pin = cruza(cs[(i - 1 + n) % n], c, ox, oy), pout = cruza(c, cs[(i + 1) % n], ox, oy);
      let a0 = ang(c, pin), a1 = ang(c, pout);
      while (a1 <= a0) a1 += TAU;
      segs = segs.concat(arco(c.x, c.y, c.r, a0, a1));
      const span = a1 - a0;
      if (span > 1.1) {
        linhas += caminho(arco(c.x, c.y, c.r * .7, a0 + .32, a1 - .32), false);
        if (c.r > s * .4) linhas += caminho(arco(c.x, c.y, c.r * .42, a0 + .6, a1 - .6), false);
      }
    });
    const [e, d] = espelho ? [cs[n - 1 - 0], cs[n - 1 - 4]] : [cs[0], cs[4]];
    linhas += espiral(e.x, e.y, e.r * .62, 1.5, Math.PI, false) + espiral(d.x, d.y, d.r * .62, 1.5, 0, true);
    return { segs, linhas, cs, s };
  }
  function nuvem(cx, cy, s, rnd, espelho = false) {
    const { segs, linhas } = nuvemSegs(cx, cy, s, rnd, espelho);
    return { d: forma(segs), linhas };
  }
  function amostraContorno(segs, passo = 12) {
    const pts = [];
    segs.forEach((s, i) => { for (let k = i ? 1 : 0; k <= passo; k++) pts.push(bez(s, k / passo)); });
    return pts;
  }
  function anelOffset(externo, interno) {
    const o = suave(externo, true), i = suave(interno, true);
    const oSegs = area(amostra(o, 4)) >= 0 ? o : inverter(o);
    const iSegs = area(amostra(i, 4)) < 0 ? i : inverter(i);
    return caminho(oSegs, true) + caminho(iSegs, true);
  }
  function folhasNuvem(segs, linhas, cs, s, folhas = 5) {
    const base = amostraContorno(segs, 14);
    const passo = Math.max(1.5, s * .012);
    const out = [];
    for (let f = 0; f < folhas; f++) {
      const shrink = f * passo;
      const outer = deslocar(base, -shrink);
      const inner = f < folhas - 1 ? deslocar(base, -(shrink + passo)) : null;
      let d = inner ? anelOffset(outer, inner) : forma(suave(outer, true), true);
      if (f < folhas - 1) {
        cs.forEach((c, i) => {
          if (i % 2 === f % 2) {
            const r = c.r * (.2 - f * .028);
            if (r > s * .05) d += circ(c.x, c.y, r, false);
          }
        });
      }
      out.push({ d, linhas: f === folhas - 1 ? linhas : '' });
    }
    return out;
  }
  const nuvemFolhaCache = new Map();
  function nuvemFolha(o = {}) {
    const [w, h] = caixa(o);
    const semente = o.semente || 2718;
    const rnd = M.acaso(semente);
    const cx = w * (o.x ?? .5), cy = h * (o.y ?? .5), s = w * (o.escala ?? 1) * .1;
    const espelho = !!o.espelho;
    const nuvem = o.nuvem ?? 0;
    const folha = o.folha ?? 0;
    const key = `${semente}|${nuvem}|${o.x}|${o.y}|${o.escala}|${espelho}`;
    if (!nuvemFolhaCache.has(key)) {
      const { segs, linhas, cs, s: ss } = nuvemSegs(cx, cy, s, rnd, espelho);
      nuvemFolhaCache.set(key, folhasNuvem(segs, linhas, cs, ss));
    }
    const pack = nuvemFolhaCache.get(key)[folha] || { d: '', linhas: '' };
    return { d: pack.d, linhas: pack.linhas, largura: w, altura: h };
  }
  function heroFundo(o = {}) {
    const [w, h] = caixa(o);
    return { d: M.tracos.ret(0, 0, w, h), linhas: '', largura: w, altura: h };
  }
  function heroCamadas(nuvens) {
    const camadas = [{ tipo: 'heroFundo', tom: 2 }];
    nuvens.forEach((n, nuvem) => {
      for (let folha = 0; folha < 5; folha++) {
        camadas.push({ tipo: 'nuvemFolha', nuvem, folha, tom: Math.min(8, folha + 3), ...n });
      }
    });
    return camadas;
  }
  const HERO_NUVENS_DESKTOP = [
    { x: -.1, y: .28, escala: 1.05, espelho: false },
    { x: 1.02, y: .36, escala: 1.35, espelho: true },
    { x: 1.0, y: .84, escala: 1.3, espelho: true },
    { x: -.08, y: .9, escala: 1.05, espelho: false },
    { x: 1.04, y: .6, escala: .72, espelho: true },
  ];
  const HERO_NUVENS_MOBILE = [
    { x: -.06, y: .2, escala: .95, espelho: false },
    { x: 1.06, y: .2, escala: .9, espelho: true },
    { x: .5, y: 1.04, escala: .85, espelho: false },
    { x: -.1, y: .62, escala: .55, espelho: true },
    { x: 1.1, y: .62, escala: .52, espelho: true },
  ];

  // Greca (meandro) numa faixa: map(u, v) → [x, y], u em módulos, v ∈ [0, 1]
  function greca(mods, map, passo = 6) {
    const chave = [[.12, 1], [.12, .16], [.86, .16], [.86, .74], [.38, .74], [.38, .44], [.62, .44]];
    let d = '';
    for (let m = 0; m < mods; m++) {
      const pts = [];
      for (let i = 0; i < chave.length - 1; i++) {
        const [u0, v0] = chave[i], [u1, v1] = chave[i + 1];
        for (let k = 0; k < passo; k++) { const t = k / passo; pts.push(map(m + u0 + (u1 - u0) * t, v0 + (v1 - v0) * t)); }
      }
      pts.push(map(m + chave[chave.length - 1][0], chave[chave.length - 1][1]));
      d += 'M' + pts.map(pt).join('L');
    }
    return d;
  }
  // anel com greca em coordenadas polares
  function anelGreca(cx, cy, rFora, rDentro, a0 = 0, a1 = TAU) {
    const larg = rFora - rDentro, mods = Math.max(4, Math.round((a1 - a0) * (rFora + rDentro) / 2 / larg));
    const map = (u, v) => { const a = a0 + (a1 - a0) * u / mods, r = rFora - v * larg; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    return greca(mods, map) + caminho(arco(cx, cy, rFora, a0, a1), false) + caminho(arco(cx, cy, rDentro, a0, a1), false);
  }

  /* ---------- geradores (contrato: { d, linhas, largura, altura }) ---------- */
  function campo(o = {}) {
    const [w, h] = caixa(o);
    return { d: M.tracos.ret(0, 0, w, h), linhas: '', largura: w, altura: h };
  }

  function medalhao(o = {}) {
    const [w, h] = caixa(o), cx = w * (o.x ?? .76), cy = h * (o.y ?? .28), r = w * (o.raio ?? .17);
    let linhas = anelGreca(cx, cy, r * .93, r * .78);
    linhas += caminho(arco(cx, cy, r * .72, 0, TAU), false);
    // lótus: pétalas em arco ao redor do centro
    // lótus: 8 pétalas em gota, com nervura
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8 + TAU / 16, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]];
      const P = (rr, s) => [cx + u[0] * r * rr + v[0] * r * s, cy + u[1] * r * rr + v[1] * r * s];
      linhas += caminho(suave([P(.16, 0), P(.34, -.13), P(.6, -.06), P(.66, 0), P(.6, .06), P(.34, .13), P(.16, 0)]), false);
      linhas += linha([P(.22, 0), P(.52, 0)]);
    }
    linhas += caminho(arco(cx, cy, r * .12, 0, TAU), false);
    return { d: circ(cx, cy, r), linhas, largura: w, altura: h };
  }

  function monte(o = {}) {
    const [w, h] = caixa(o), rnd = M.acaso(o.semente || 1), cx = w * (o.x ?? .4), base = h * (o.base ?? .9), alt = h * (o.alturaRel ?? .2), L = w * (o.larguraRel ?? .2);
    const j = v => v * rnd.entre(.96, 1.04);
    const topo = [[cx - L * .62, base], [cx - L * .42, base - alt * .42], [cx - L * .2, base - alt * .72], [cx - L * .06, base - j(alt)], [cx + L * .06, base - alt * .97], [cx + L * .24, base - alt * .64], [cx + L * .44, base - alt * .34], [cx + L * .62, base]];
    const segs = suave(topo.concat([[cx + L * .62, base + 40], [cx - L * .62, base + 40]]), true);
    // estratos: o perfil repetido para baixo, e a neve como linhas curtas no cume
    let linhas = '';
    for (let k = 1; k <= 4; k++) linhas += linha(topo.slice(1, -1).map(([x, y]) => [x, y + k * alt * .17]));
    for (let k = 0; k < 5; k++) {
      const x = cx - L * .14 + k * L * .07;
      linhas += linha([[x, base - alt * .9], [x + L * .02, base - alt * (.72 - (k % 2) * .08)]]);
    }
    return { d: forma(segs), linhas, largura: w, altura: h };
  }

  function nuvens(o = {}) {
    const [w, h] = caixa(o), rnd = M.acaso(o.semente || 1);
    let d = '', linhas = '';
    for (const n of o.nuvens || []) {
      const v = nuvem(w * n.x, h * n.y, w * n.escala * .1, rnd, n.espelho);
      d += v.d; linhas += v.linhas;
    }
    return { d, linhas, largura: w, altura: h };
  }

  function mar(o = {}) {
    const [w, h] = caixa(o), nivel = h * (o.nivel ?? .84), m = o.modulo || 64, r = m / 2;
    // borda superior em escamas (meia seigaiha), da direita para a esquerda
    let segs = suave([[w + m, h + 20], [w + m, nivel]]), linhas = '';
    for (let x = w + m; x > -m; x -= m) {
      segs = segs.concat(arco(x - r, nivel, r, 0, -Math.PI));
      for (const k of [.72, .44, .16]) linhas += caminho(arco(x - r, nivel, r * k, -.15, -Math.PI + .15), false);
    }
    segs = segs.concat(suave([segs[segs.length - 1][3], [-m - 1, h + 20], [w + m, h + 20]]));
    for (let k = 1; k <= 3; k++) {
      for (let x = w + m - r; x > -m; x -= m) linhas += caminho(arco(x - r, nivel + k * r * .9, r, -.2, -Math.PI + .2), false);
    }
    return { d: forma(segs), linhas, largura: w, altura: h };
  }

  // Onda: dorso sobe da direita, crista em ~(0.53w, 0.22h), lábio enrola para a esquerda e a
  // ponta volta para dentro. Garras ao longo do lábio, espuma vazada, estrias paralelas ao dorso.
  function onda(o = {}) {
    const [w, h] = caixa(o), rnd = M.acaso(o.semente || 1), sx = w / 900, sy = h / 760;
    const S = pts => pts.map(([x, y]) => [x * sx, y * sy]);
    const dorso = S([[930, 560], [880, 450], [800, 350], [700, 262], [600, 204], [510, 178], [430, 182], [362, 208], [312, 252], [290, 304], [300, 350], [328, 374], [362, 368]]);
    const face = S([[350, 340], [348, 300], [372, 272], [412, 262], [452, 278], [484, 318], [500, 378], [498, 452], [478, 528], [440, 590], [388, 632], [300, 662], [160, 680], [-30, 690]]);
    // garras entram no próprio contorno (uma silhueta só, sem costura): cada uma sai pela normal,
    // avança no sentido do lábio e a ponta volta para dentro
    const labio = amostra(suave(dorso.slice(4)), 20), ng = o.garras ?? 9, cx0 = 400 * sx, cy0 = 300 * sy;
    const franja = [];
    let linhas = '';
    const i0 = Math.floor(labio.length * .06), i1 = Math.floor(labio.length * .9);
    for (let i = 0; i < ng; i++) {
      const idx = Math.floor(i0 + (i1 - i0) * i / (ng - 1));
      const B = labio[idx], Nx = labio[Math.min(labio.length - 1, idx + 1)];
      const tl = Math.hypot(Nx[0] - B[0], Nx[1] - B[1]) || 1, T = [(Nx[0] - B[0]) / tl, (Nx[1] - B[1]) / tl];
      let N = [T[1], -T[0]];
      if ((B[0] - cx0) * N[0] + (B[1] - cy0) * N[1] < 0) N = [-N[0], -N[1]];
      const L = (58 - i * 3.2) * sx * rnd.entre(.9, 1.1), bw = (i1 - i0) / (ng - 1) * tl * .5;
      const at = (a, b) => [B[0] + N[0] * a * L + T[0] * b, B[1] + N[1] * a * L + T[1] * b];
      const atL = (a, b) => at(a, b * L);
      franja.push(at(0, -bw), atL(.5, -.06), atL(.92, .3), atL(.98, .62), atL(.8, .9), atL(.58, .82), atL(.66, .6), atL(.5, .4), at(.18, bw * .7));
      linhas += linha([at(.08, -bw * .2), atL(.55, .12), atL(.86, .55)]);
    }
    const contorno = dorso.slice(0, 4).concat(franja, dorso.slice(-2), face, S([[-30, 800], [930, 800]]));
    let d = forma(suave(contorno, true));
    // estrias: offsets do dorso para dentro, cobrindo o corpo como traço de porcelana
    const dorsoD = amostra(suave(dorso), 10);
    for (let k = 1; k <= 18; k++) {
      const off = deslocar(dorsoD, k * 15 * sx), corte = Math.min(off.length - 2, Math.floor(off.length * (.1 + k * .028)));
      linhas += 'M' + off.slice(0, off.length - corte).map(pt).join('L');
    }
    const faceD = amostra(suave(face.slice(0, 11)), 10);
    for (let k = 1; k <= 2; k++) linhas += 'M' + deslocar(faceD, k * 11 * sx).slice(12, -6).map(pt).join('L');
    // espuma vazada logo abaixo das garras
    for (let i = 0; i < 4; i++) {
      const p = labio[Math.floor((.2 + i * .16) * (labio.length - 1))];
      d += circ(p[0] + rnd.entre(-4, 4) * sx, p[1] + rnd.entre(18, 28) * sy, rnd.entre(3, 5.5) * sx, false);
    }
    return { d, linhas, largura: w, altura: h };
  }

  // Moldura de base: faixa com greca + dois quartos de rosácea nos cantos (ref. seigaiha/ruyi)
  function moldura(o = {}) {
    const [w, h] = caixa(o), fh = h * (o.faixa ?? .06), y0 = h - fh, R = w * (o.canto ?? .11);
    const mods = Math.round(w / fh);
    let d = M.tracos.ret(-2, y0, w + 4, fh + 2);
    let linhas = greca(mods, (u, v) => [u * w / mods, y0 + fh * .18 + v * fh * .64]);
    linhas += linha([[0, y0 + fh * .1], [w, y0 + fh * .1]]) + linha([[0, h - fh * .1], [w, h - fh * .1]]);
    for (const [cx, a0, a1] of [[0, -Math.PI / 2, 0], [w, Math.PI, Math.PI * 1.5]]) {
      d += forma(arco(cx, y0, R, a0, a1).concat([[[cx + R * Math.cos(a1), y0 + R * Math.sin(a1)], [cx, y0], [cx, y0], [cx, y0]]]));
      linhas += anelGreca(cx, y0, R * .92, R * .74, a0, a1);
      for (let i = 1; i < 9; i++) {
        const a = a0 + (a1 - a0) * i / 9;
        linhas += linha([[cx + Math.cos(a) * R * .2, y0 + Math.sin(a) * R * .2], [cx + Math.cos(a) * R * .66, y0 + Math.sin(a) * R * .66]]);
      }
      linhas += caminho(arco(cx, y0, R * .68, a0, a1), false) + caminho(arco(cx, y0, R * .18, a0, a1), false);
    }
    return { d, linhas, largura: w, altura: h };
  }

  function add(name, fn) {
    M.vetores[name] = fn;
    M[name] = fn;
  }

  M.RAMPAS.sumi = M.rampa('#1a1a1a');
  add('campo', campo);
  add('medalhao', medalhao);
  add('monte', monte);
  add('nuvens', nuvens);
  add('mar', mar);
  add('onda', onda);
  add('moldura', moldura);
  add('nuvemFolha', nuvemFolha);
  add('heroFundo', heroFundo);

  // tom: passo da rampa (2–8) ou 'papel'; tinta: linhas escuras (sobre papel) em vez de claras
  M.PRESETS.gravura = {
    nome: 'Gravura: onda, nuvem e monte',
    modo: 'contraluz',
    rampa: 'papel',
    de: 2,
    ate: 8,
    camadas: [
      { tipo: 'campo', textura: 'seigaiha' },
      { tipo: 'medalhao', x: .74, y: .27, raio: .17, tom: 3, tinta: true },
      { tipo: 'nuvens', tom: 'papel', tinta: true, nuvens: [{ x: .2, y: .16, escala: 1.15 }, { x: .5, y: .07, escala: .6, espelho: true }] },
      { tipo: 'monte', x: .44, base: .86, alturaRel: .2, larguraRel: .24, tom: 4, tinta: true },
      { tipo: 'mar', nivel: .84, tom: 6 },
      { tipo: 'onda', garras: 9, tom: 6 },
      { tipo: 'nuvens', tom: 'papel', tinta: true, nuvens: [{ x: .84, y: .66, escala: .7, espelho: true }] },
      { tipo: 'moldura', tom: 8 },
    ],
  };

  M.PRESETS['hero-nuvens-desktop'] = {
    nome: 'Hero nuvens — desktop',
    modo: 'contraluz',
    rampa: 'papel',
    de: 2,
    ate: 8,
    largura: 1440,
    altura: 900,
    camadas: heroCamadas(HERO_NUVENS_DESKTOP),
  };
  M.PRESETS['hero-nuvens-mobile'] = {
    nome: 'Hero nuvens — celular',
    modo: 'contraluz',
    rampa: 'papel',
    de: 2,
    ate: 8,
    largura: 375,
    altura: 850,
    camadas: heroCamadas(HERO_NUVENS_MOBILE),
  };
  M.PRESETS['hero-nuvens-isolada'] = {
    nome: 'Nuvem isolada',
    modo: 'contraluz',
    rampa: 'papel',
    de: 2,
    ate: 8,
    largura: 720,
    altura: 720,
    camadas: heroCamadas([{ x: .5, y: .5, escala: 1.8, espelho: false }]),
  };
})(typeof window !== 'undefined' ? window.Maquete : globalThis.Maquete);

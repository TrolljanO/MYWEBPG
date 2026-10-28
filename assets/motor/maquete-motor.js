/* maquete · motor v1.0
   Gera vetores arquitetônicos recortáveis (silhuetas com vazados), rampas de cor OKLCH, pilhas e
   recortes (box-shadow) e cenas em camadas com paralaxe, respiro e dobradura.
   Sem dependências. Navegador: window.Maquete · Node: require('./maquete-motor.js').
   Regra de traçado (fill-rule nonzero): cheio = sentido horário, vazado = anti-horário. */
(function (raiz) {
  'use strict';

  /* ---------- acaso com semente (mulberry32): mesma semente, mesmo desenho ---------- */
  function acaso(semente) {
    let a = (semente >>> 0) || 1;
    const f = function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.entre = (min, max) => min + f() * (max - min);
    f.inteiro = (min, max) => Math.floor(f.entre(min, max + 1));
    f.chance = p => f() < p;
    f.um = lista => lista[Math.floor(f() * lista.length)];
    return f;
  }

  /* ---------- primitivas de traçado ---------- */
  const r1 = n => Math.round(n * 10) / 10;
  const ret = (x, y, w, h) => (w <= 0 || h <= 0) ? '' : `M${r1(x)} ${r1(y)}h${r1(w)}v${r1(h)}h${r1(-w)}z`;
  const furo = (x, y, w, h) => (w <= 0 || h <= 0) ? '' : `M${r1(x)} ${r1(y)}v${r1(h)}h${r1(w)}v${r1(-h)}z`;
  const poli = pts => 'M' + pts.map(p => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'z';
  const area = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };
  const cheio = pts => poli(area(pts) >= 0 ? pts : pts.slice().reverse());
  const vazado = pts => poli(area(pts) < 0 ? pts : pts.slice().reverse());
  const circulo = (cx, cy, r, horario) => `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 ${horario ? 1 : 0} ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 ${horario ? 1 : 0} ${r1(-2 * r)} 0z`;
  function barra(x1, y1, x2, y2, e) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * e / 2, ny = dx / L * e / 2;
    return cheio([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]);
  }
  // encolhe um triângulo pelo incentro: cada aresta recua exatamente d (vira a espessura da barra)
  function encolher(t, d) {
    const [A, B, C] = t;
    const a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1]);
    const p = a + b + c, s = p / 2;
    const I = [(a * A[0] + b * B[0] + c * C[0]) / p, (a * A[1] + b * B[1] + c * C[1]) / p];
    const r = Math.sqrt(Math.max(0, (s - a) * (s - b) * (s - c) / s));
    if (r <= d * 1.15) return null;
    const k = (r - d) / r;
    return t.map(V => [I[0] + (V[0] - I[0]) * k, I[1] + (V[1] - I[1]) * k]);
  }
  // arcada vazada: sobe da base até a linha de nascença e fecha em arco (ry = flecha do arco)
  function arcada(x, base, larg, nasc, ry) {
    const rx = larg / 2; ry = ry == null ? rx : ry;
    if (larg <= 0 || base <= nasc) return '';
    return `M${r1(x + larg)} ${r1(base)}V${r1(nasc)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(x)} ${r1(nasc)}V${r1(base)}z`;
  }
  // banda treliçada em coordenadas locais (u ao longo, v através); map leva para x,y
  function banda(u0, v0, comp, esp, paineis, tipo, e, c, map) {
    map = map || (p => p);
    let d = cheio([[u0, v0], [u0 + comp, v0], [u0 + comp, v0 + esp], [u0, v0 + esp]].map(map));
    const pw = comp / paineis, vt = v0 + c, vb = v0 + esp - c, tris = [];
    if (tipo === 'pratt') {
      for (let i = 0; i < paineis; i++) {
        const a = u0 + i * pw, b = a + pw, T0 = [a, vt], T1 = [b, vt], B0 = [a, vb], B1 = [b, vb];
        if (i < paineis / 2) tris.push([T0, T1, B1], [T0, B1, B0]); else tris.push([T0, T1, B0], [T1, B1, B0]);
      }
    } else {
      for (let i = 0; i < paineis; i++) {
        const a = u0 + i * pw, b = a + pw, m = a + pw / 2;
        tris.push([[a, vb], [m, vt], [b, vb]]);
        if (i < paineis - 1) tris.push([[m, vt], [b, vb], [m + pw, vt]]);
      }
      tris.push([[u0, vt], [u0 + pw / 2, vt], [u0, vb]]);
      tris.push([[u0 + comp - pw / 2, vt], [u0 + comp, vt], [u0 + comp, vb]]);
    }
    for (const t of tris) { const k = encolher(t, e); if (k) d += vazado(k.map(map)); }
    return d;
  }
  function janelas(rnd, x, y, w, h, estilo, k) {
    k = k || 1; let d = '';
    const m = Math.max(3 * k, w * .14), topo = y + m, base = y + h - Math.max(8 * k, h * .06);
    if (base - topo < 10 * k) return '';
    if (estilo === 'faixas') {
      const fh = rnd.entre(2.5, 4) * k, g = rnd.entre(5, 8) * k;
      for (let yy = topo; yy + fh <= base; yy += fh + g) d += furo(x + m, yy, w - 2 * m, fh);
    } else if (estilo === 'frestas') {
      const fw = rnd.entre(1.8, 3) * k, g = rnd.entre(4, 7) * k, cols = Math.floor((w - 2 * m + g) / (fw + g));
      const ox = x + (w - (cols * (fw + g) - g)) / 2;
      for (let j = 0; j < cols; j++) d += furo(ox + j * (fw + g), topo, fw, base - topo);
    } else {
      const jw = rnd.entre(3, 5) * k, jh = rnd.entre(5, 8) * k, gx = rnd.entre(3, 5) * k, gy = rnd.entre(4, 6) * k;
      const cols = Math.floor((w - 2 * m + gx) / (jw + gx)), linhas = Math.floor((base - topo + gy) / (jh + gy));
      const ox = x + (w - (cols * (jw + gx) - gx)) / 2;
      for (let i = 0; i < linhas; i++) for (let j = 0; j < cols; j++) if (!rnd.chance(.14)) d += furo(ox + j * (jw + gx), topo + i * (jh + gy), jw, jh);
    }
    return d;
  }
  const caixa = (o, w, h) => [o.largura || w, o.altura || h];

  /* ---------- vetores ---------- */
  function skyline(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 1), k = o.escala || 1;
    const min = (o.alturaMin ?? .25) * h, max = (o.alturaMax ?? .8) * h, comJanelas = o.janelas !== false;
    const estilos = o.estilos || ['grade', 'grade', 'faixas', 'frestas'];
    let d = '', x = -rnd.entre(0, 20);
    while (x < w) {
      const bw = rnd.entre(28, 84) * k, marco = rnd.chance(o.chanceMarco ?? .08);
      let bh = rnd.entre(min, max); if (marco) bh = Math.min(h * .96, bh * 1.25);
      const topo = h - bh, tipo = rnd();
      d += ret(x, topo, bw, bh + 1);
      if (marco) {
        let cw = bw, cy = topo, cx = x;
        for (let i = 0, n = rnd.inteiro(2, 3); i < n; i++) { const nw = cw * rnd.entre(.62, .78), nh = rnd.entre(8, 18) * k; cx += (cw - nw) / 2; cy -= nh; d += ret(cx, cy, nw, nh + 1); cw = nw; }
        const ag = Math.max(2, cw * .12), ah = Math.min(cy - 2, rnd.entre(16, 36) * k); d += ret(cx + cw / 2 - ag / 2, cy - ah, ag, ah + 1);
      } else if (tipo < .18) {
        const rh = Math.min(topo - 2, bw * rnd.entre(.25, .45)); d += cheio([[x, topo + .5], [x + bw / 2, topo - rh], [x + bw, topo + .5]]);
      } else if (tipo < .32) {
        const nw = bw * rnd.entre(.45, .75), nh = Math.min(topo - 2, rnd.entre(8, 24) * k); d += ret(x + rnd.entre(0, bw - nw), topo - nh, nw, nh + 1);
      } else if (tipo < .42) {
        const ah = Math.min(topo - 2, rnd.entre(12, 30) * k); d += ret(x + bw * rnd.entre(.3, .7) - 1, topo - ah, 2, ah + 1);
      } else if (tipo < .5) {
        const n = Math.max(2, Math.round(bw / (16 * k))), sw = bw / n, sh = rnd.entre(6, 12) * k;
        for (let i = 0; i < n; i++) d += cheio([[x + i * sw, topo + .5], [x + i * sw, topo - sh], [x + (i + 1) * sw, topo + .5]]);
      }
      if (comJanelas && bw > 18 && bh > 30) d += janelas(rnd, x, topo, bw, bh, rnd.um(estilos), k);
      x += bw + rnd.entre(-6, 3) * k;
    }
    return { d, largura: w, altura: h };
  }

  function torre(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 7), cx = w * (o.x ?? .5);
    let bw = h * (o.larguraTorre ?? rnd.entre(.12, .17)), y = h, d = '';
    const bh = h * rnd.entre(.1, .14); d += ret(cx - bw * .62, y - bh, bw * 1.24, bh + 1);
    d += arcada(cx - bw * .12, y + 1, bw * .24, y - bh * .5, bw * .12); y -= bh;
    const ch = h * rnd.entre(.3, .38); d += ret(cx - bw / 2, y - ch, bw, ch + 1); d += janelas(rnd, cx - bw / 2, y - ch, bw, ch, 'frestas', 1); y -= ch;
    for (let i = 0, n = rnd.inteiro(2, 4); i < n; i++) {
      bw *= rnd.entre(.7, .8); const sh = h * rnd.entre(.04, .065);
      d += ret(cx - bw / 2, y - sh, bw, sh + 1); if (sh > 22) d += janelas(rnd, cx - bw / 2, y - sh, bw, sh, 'frestas', .8); y -= sh;
    }
    const ah = Math.max(4, Math.min(y - 4, h * rnd.entre(.08, .14))), ag = Math.max(2, bw * .1);
    d += cheio([[cx - bw * .32, y + .5], [cx, y - ah * .35], [cx + bw * .32, y + .5]]);
    d += ret(cx - ag / 2, y - ah, ag, ah + 1);
    return { d, largura: w, altura: h };
  }

  function ponte(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 3), modelo = o.modelo || rnd.um(['trelica', 'arco', 'pensil']);
    const yd = h * (1 - (o.nivel ?? .4)); let d = '';
    if (modelo === 'trelica') {
      const esp = h * rnd.entre(.13, .18), vaos = o.vaos || rnd.inteiro(3, 4), vw = w / vaos;
      const e = Math.max(1.6, esp * .045), c = Math.max(3, esp * .09);
      for (let i = 0; i < vaos; i++) d += banda(i * vw - 1, yd - esp, vw + 2, esp, Math.max(4, Math.round(vw / (esp * .9))), rnd.chance(.5) ? 'warren' : 'pratt', e, c);
      const pw = Math.max(10, esp * .45); for (let i = 0; i <= vaos; i++) d += ret(i * vw - pw / 2, yd, pw, h - yd + 1);
      d += ret(-2, yd, w + 4, Math.max(4, esp * .12));
    } else if (modelo === 'arco') {
      const vaos = o.vaos || rnd.inteiro(4, 7), vw = w / vaos, pil = vw * rnd.entre(.14, .2), s = h * .05;
      const topo = yd - h * .05; d += ret(-2, topo, w + 4, h - topo + 1);
      for (let i = 0; i < vaos; i++) { const larg = vw - pil, ry = Math.min(larg / 2, (h - topo - s) * .7); d += arcada(i * vw + pil / 2, h + 1, larg, topo + s + ry, ry); }
      if (o.aqueduto ?? rnd.chance(.5)) {
        const t2 = topo - h * .11; d += ret(-2, t2, w + 4, topo - t2 + 1);
        for (let i = 0, n2 = vaos * 2, w2 = w / n2; i < n2; i++) d += arcada(i * w2 + w2 * .16, topo - h * .015, w2 * .68, t2 + h * .035 + w2 * .2, w2 * .2);
      }
    } else {
      const t1 = w * rnd.entre(.2, .27), t2 = w - t1, tw = Math.max(12, h * .045), th = h * rnd.entre(.12, .22), esp = Math.max(6, h * .025);
      d += ret(-2, yd, w + 4, esp);
      for (const tx of [t1, t2]) {
        d += ret(tx - tw / 2, th, tw, h - th + 1);
        const pv = (yd - th) * .22; d += furo(tx - tw * .28, th + pv * .6, tw * .56, pv); d += furo(tx - tw * .28, th + pv * 2.1, tw * .56, pv);
      }
      const curva = (xa, ya, xb, yb, ym, n) => { const pts = [], cy = 2 * ym - (ya + yb) / 2; for (let i = 0; i <= n; i++) { const t = i / n; pts.push([xa + (xb - xa) * t, (1 - t) * (1 - t) * ya + 2 * (1 - t) * t * cy + t * t * yb]); } return pts; };
      const ec = Math.max(2.4, h * .008), meio = (yd + th) / 2 + (yd - th) * .18;
      const cabos = [curva(t1, th + 2, t2, th + 2, yd - esp - 4, 40), curva(-4, yd - 2, t1, th + 2, meio, 16), curva(t2, th + 2, w + 4, yd - 2, meio, 16)];
      for (const pts of cabos) {
        for (let i = 0; i < pts.length - 1; i++) d += barra(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], ec);
        for (let i = 2; i < pts.length - 2; i += 2) { const [x, y] = pts[i]; if (yd - y > 4) d += ret(x - .8, y, 1.6, yd - y + 1); }
      }
    }
    return { d, largura: w, altura: h };
  }

  function guindaste(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 5);
    const mx = w * (o.x ?? .5), mw = Math.max(10, h * .032), topo = h * rnd.entre(.1, .18);
    const e = Math.max(1.1, mw * .07), c = Math.max(1.5, mw * .1); let d = '';
    d += banda(0, 0, h - topo, mw, Math.max(6, Math.round((h - topo) / (mw * 1.1))), 'warren', e, c, p => [mx - mw / 2 + p[1], h - p[0]]);
    const jt = mw * .8, jy = topo, L = Math.min(w - mx - 8, h * rnd.entre(.75, 1)), CL = Math.min(mx - 8, L * rnd.entre(.3, .38));
    d += banda(mx + mw / 2 - 1, jy, L, jt, Math.max(6, Math.round(L / (jt * 1.2))), 'warren', e, c);
    d += banda(mx - mw / 2 - CL + 1, jy, CL, jt, Math.max(3, Math.round(CL / (jt * 1.2))), 'pratt', e, c);
    d += ret(mx - mw / 2 - 2, jy + jt - 1, mw * 1.2, mw * .9);
    d += ret(mx - mw / 2 - CL + 4, jy + jt - 1, CL * .3, mw * 1.4);
    const ah = jt * rnd.entre(2.2, 3);
    d += barra(mx - mw / 2, jy, mx, jy - ah, e * 2.4); d += barra(mx + mw / 2, jy, mx, jy - ah, e * 2.4);
    d += barra(mx, jy - ah, mx + mw / 2 + L * .72, jy + 1, e * 1.4); d += barra(mx, jy - ah, mx - mw / 2 - CL + 6, jy + 1, e * 1.4);
    const cx = mx + mw / 2 + L * rnd.entre(.45, .85), cy = jy + jt, gy = cy + (h - cy) * rnd.entre(.3, .6);
    d += ret(cx - mw * .35, cy - 1, mw * .7, mw * .35); d += ret(cx - .9, cy, 1.8, gy - cy);
    d += ret(cx - mw * .3, gy, mw * .6, mw * .45); d += cheio([[cx - mw * .12, gy + mw * .45], [cx + mw * .12, gy + mw * .45], [cx, gy + mw * .8]]);
    if (o.carga ?? rnd.chance(.6)) { d += ret(cx - .8, gy + mw * .8, 1.6, mw * .6); d += ret(cx - mw * 1.8, gy + mw * 1.4, mw * 3.6, mw * .4); }
    d += ret(mx - mw * 1.1, h - mw * .6, mw * 2.2, mw * .6 + 1);
    return { d, largura: w, altura: h };
  }

  function andaime(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 11);
    const W = h * (o.larguraRel ?? .9), H = h * (o.alturaRel ?? .45), x0 = w * (o.x ?? .5) - W / 2, yt = h - H;
    const n = o.colunas || rnd.inteiro(3, 5), m = o.niveis || rnd.inteiro(3, 5), t = Math.max(1.6, h * .005), bw = W / n, bh = H / m;
    let d = ret(x0, yt, W, H + 1);
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      d += furo(x0 + j * bw + t, yt + i * bh + t * 2, bw - 2 * t, bh - t * 3);
      if ((i + j) % 2 === 0 && rnd.chance(.75)) d += barra(x0 + j * bw + t, yt + (i + 1) * bh - t, x0 + (j + 1) * bw - t, yt + i * bh + t * 2, t * 1.1);
    }
    for (let i = 0; i <= m; i++) d += ret(x0 - t * 2, yt + i * bh - t, W + t * 4, t * 2.2);
    for (let j = 0; j <= n; j++) d += ret(x0 + j * bw - t * .8, yt - bh * .45, t * 1.6, bh * .45 + 1);
    d += ret(x0 - t, yt - bh * .45, W + t * 2, t * 1.4);
    return { d, largura: w, altura: h };
  }

  function estrutura(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 29);
    const andares = o.andares || rnd.inteiro(4, 7), vaos = o.vaos || rnd.inteiro(3, 5), ph = h * (o.alturaPavimento ?? .085);
    const W = ph * 1.5 * vaos, x0 = w * (o.x ?? .5) - W / 2, yt = h - ph * andares, lj = Math.max(3, ph * .14), pl = Math.max(3, ph * .12), bw = W / vaos;
    let d = ret(x0, yt, W, h - yt + 1);
    for (let i = 0; i < andares; i++) for (let j = 0; j < vaos; j++) {
      const xa = x0 + j * bw + (j === 0 ? pl : pl / 2), xb = x0 + (j + 1) * bw - (j === vaos - 1 ? pl : pl / 2), ya = yt + i * ph + lj, yb = yt + (i + 1) * ph + (i === andares - 1 ? 1 : 0);
      d += furo(xa, ya, xb - xa, yb - ya);
      if (i >= andares - 2 && rnd.chance(.45)) { const pa = (yb - ya) * .55; d += ret(xa, yb - pa, xb - xa, pa); d += furo(xa + (xb - xa) * .3, yb - pa * .8, (xb - xa) * .4, pa * .45); }
    }
    for (let j = 0; j <= vaos; j++) { const cx = x0 + j * bw; for (let q = -1; q <= 1; q += 2) { const eh = rnd.entre(6, 12) * (h / 400); d += ret(cx + q * pl * .25 - .6, yt - eh, 1.2, eh + 1); } }
    return { d, largura: w, altura: h };
  }

  function cupula(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 13), cx = w * (o.x ?? .5); let d = '';
    const bw = h * rnd.entre(.75, .95), bh = h * rnd.entre(.2, .25), by = h - bh;
    d += ret(cx - bw / 2, by, bw, bh + 1);
    for (let i = 0, na = rnd.inteiro(5, 9), aw = bw / na; i < na; i++) d += arcada(cx - bw / 2 + i * aw + aw * .22, h - bh * .12, aw * .56, by + bh * .3 + aw * .28, aw * .28);
    const tw = bw * rnd.entre(.5, .6), th = h * rnd.entre(.08, .11), ty = by - th;
    d += ret(cx - tw / 2, ty, tw, th + 1);
    for (let i = 0, nj = rnd.inteiro(4, 7), jw = tw / nj; i < nj; i++) d += arcada(cx - tw / 2 + i * jw + jw * .3, ty + th * .85, jw * .4, ty + th * .42, jw * .2);
    const rx = tw / 2 * 1.02, ry = Math.min(ty - h * .1, rx * rnd.entre(.85, 1.1)), pts = [];
    for (let i = 0; i <= 32; i++) { const a = Math.PI * i / 32; pts.push([cx - Math.cos(a) * rx, ty + .5 - Math.sin(a) * ry]); }
    d += cheio(pts);
    const lw = rx * .24, lh = ry * .22, ly = ty - ry - lh * .75; d += ret(cx - lw / 2, ly, lw, lh + 2);
    const p2 = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; p2.push([cx - Math.cos(a) * lw * .55, ly + .5 - Math.sin(a) * lw * .5]); } d += cheio(p2);
    d += ret(cx - 1, ly - lw * .5 - h * .03, 2, h * .03 + 1);
    for (const s of [-1, 1]) {
      if (o.minaretes ?? true) { const mx = cx + s * (bw / 2 + h * rnd.entre(.08, .16)), mw = Math.max(6, h * .03), mt = h * rnd.entre(.08, .2); d += ret(mx - mw / 2, mt, mw, h - mt + 1); d += ret(mx - mw * .85, mt + (h - mt) * .28, mw * 1.7, Math.max(3, h * .008)); d += cheio([[mx - mw * .6, mt + .5], [mx, mt - mw * 2.6], [mx + mw * .6, mt + .5]]); }
      if (rnd.chance(.75)) { const sx = cx + s * bw * .36, sr = bw * .09, sh = bh * .25; d += ret(sx - sr, by - sh, sr * 2, sh + 1); const p3 = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; p3.push([sx - Math.cos(a) * sr, by - sh + .5 - Math.sin(a) * sr * .95]); } d += cheio(p3); }
    }
    return { d, largura: w, altura: h };
  }

  function curvas(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 17);
    const nivel = h * (1 - (o.nivel ?? .5)), amp = h * (o.amplitude ?? .1), ondas = o.ondas ?? 2.5;
    const comps = [1, 2.1, 3.7].map((f, k) => ({ f: f * ondas, a: amp / (k + 1) * rnd.entre(.6, 1.1), p: rnd.entre(0, Math.PI * 2) }));
    const passo = 12, pts = [];
    for (let x = -passo; x <= w + passo; x += passo) { let y = nivel; for (const c of comps) y += c.a * Math.sin(c.f * Math.PI * 2 * x / w + c.p); pts.push([x, Math.max(2, Math.min(h - 2, y))]); }
    let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) d += `Q${r1(pts[i][0])} ${r1(pts[i][1])} ${r1((pts[i][0] + pts[i + 1][0]) / 2)} ${r1((pts[i][1] + pts[i + 1][1]) / 2)}`;
    d += `L${r1(w + passo)} ${h + 1}L${-passo} ${h + 1}z`;
    return { d, largura: w, altura: h };
  }

  function fachada(o = {}) {
    const [w, h] = caixa(o, 1200, 400), rnd = acaso(o.semente || 19), m = o.modulo || 36;
    let d = ret(0, 0, w, h); const cols = Math.floor(w / m), rows = Math.floor(h / m), usado = new Set();
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      if (usado.has(i + ',' + j) || rnd.chance(o.cheios ?? .45)) continue;
      let cw = 1, ch = 1; const t = rnd();
      if (t < .2 && j + 1 < cols && !usado.has(i + ',' + (j + 1))) cw = 2; else if (t < .35 && i + 1 < rows) ch = 2;
      for (let a = 0; a < ch; a++) for (let b = 0; b < cw; b++) usado.add((i + a) + ',' + (j + b));
      const pad = m * rnd.entre(.18, .3); d += furo(j * m + pad, i * m + pad, cw * m - 2 * pad, ch * m - 2 * pad);
    }
    return { d, largura: w, altura: h };
  }

  function moldura(o = {}) {
    const [w, h] = caixa(o, 1200, 400), mg = Math.min(w, h) * (o.margem ?? .07);
    let d = ret(0, 0, w, h);
    d += o.arco ? arcada(mg, h - mg, w - 2 * mg, mg + Math.min((w - 2 * mg) / 2, h * .3), Math.min((w - 2 * mg) / 2, h * .3)) : furo(mg, mg, w - 2 * mg, h - 2 * mg);
    return { d, largura: w, altura: h };
  }

  function planta(o = {}) {
    const [w, h] = caixa(o, 1200, 400), m = o.modulo || 24, rnd = acaso(o.semente || 23); let d = '';
    for (let x = 0; x <= w; x += m) d += ret(x, 0, 1, h);
    for (let y = 0; y <= h; y += m) d += ret(0, y, w, 1);
    const eixos = [];
    for (let i = 0, n = Math.min(3, o.eixos ?? 3); i < n; i++) {
      const x = Math.round((w * (i + 1) / (n + 1)) / m) * m; d += ret(x - .5, 30, 2, h - 30);
      d += circulo(x + .5, 16, 12, true) + circulo(x + .5, 16, 10.5, false); eixos.push({ x: x + .5, y: 16, rotulo: String.fromCharCode(65 + i) });
    }
    return { d, largura: w, altura: h, eixos };
  }

  const VETORES = { skyline, torre, ponte, guindaste, andaime, estrutura, cupula, curvas, fachada, moldura, planta };

  /* ---------- cor (OKLCH) ---------- */
  const lin = c => c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
  const gam = c => c <= .0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - .055;
  function hexParaOklch(hex) {
    const n = parseInt(hex.replace('#', ''), 16), r = lin((n >> 16 & 255) / 255), g = lin((n >> 8 & 255) / 255), b = lin((n & 255) / 255);
    const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    const L = .2104542553 * l + .793617785 * m - .0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, B = .0259040371 * l + .7827717662 * m - .808675766 * s;
    return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
  }
  function rgbDe(L, C, h) {
    const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
    const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s];
  }
  const noGamut = v => v.every(x => x >= -.0005 && x <= 1.0005);
  function oklchParaHex(L, C, h) {
    let c = C; if (!noGamut(rgbDe(L, c, h))) { let lo = 0, hi = C; for (let i = 0; i < 30; i++) { const md = (lo + hi) / 2; noGamut(rgbDe(L, md, h)) ? lo = md : hi = md; } c = lo; }
    return '#' + rgbDe(L, c, h).map(v => Math.round(Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0')).join('');
  }
  function luminancia(hex) { const n = parseInt(hex.replace('#', ''), 16); const [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => lin(v / 255)); return .2126 * r + .7152 * g + .0722 * b; }
  const contraste = (a, b) => { const x = luminancia(a), y = luminancia(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const tinta = hex => contraste(hex, '#000000') >= contraste(hex, '#ffffff') ? '#000000' : '#ffffff';
  const LUZ = [.984, .962, .905, .864, .814, .70, .575, .419, .30];
  const PERFIL = [.15, .33, .62, .85, 1, .95, .82, .62, .42];
  // nova marca? rampa('#cor') devolve 9 passos com a mesma luminosidade das rampas a|w
  function rampa(base, o = {}) {
    const [Lb, Cb, hb] = hexParaOklch(base), desvio = o.desvioMatiz || 0;
    let ancora = 0; LUZ.forEach((l, i) => { if (Math.abs(l - Lb) < Math.abs(LUZ[ancora] - Lb)) ancora = i; });
    return LUZ.map((l, i) => i === ancora ? base.toLowerCase() : oklchParaHex(l, Cb * PERFIL[i] / PERFIL[ancora], hb + desvio * (i / 8 - .5)));
  }
  function analogas(base) {
    const [L, C, h] = hexParaOklch(base);
    return { mae: rampa(base), vizinhaA: rampa(oklchParaHex(L, C * .9, h - 26)), vizinhaB: rampa(oklchParaHex(L, C, h + 46), { desvioMatiz: 30 }) };
  }
  const RAMPAS = {
    tiffany: ['#edfefd', '#d9fafa', '#99f2f1', '#4eede8', '#00dedb', '#0bb5b6', '#008a8e', '#00585c', '#00353a'],
    patina: ['#edfef8', '#d6fded', '#a7f2d5', '#81ebc2', '#61ddaf', '#46b68c', '#2b8c69', '#115a43', '#083628'],
    ciano: ['#f1fcff', '#dff8ff', '#b3eaff', '#98ddff', '#7dccff', '#49a5f0', '#357ac9', '#1d4992', '#102864'],
    papel: ['#ffffff', '#f5f6f6', '#e2e6e6', '#cbd3d3', '#abb3b3', '#8a9496', '#596264', '#303737', '#0a0b0b'],
    sodio: ['#fffae9', '#fbf0dc', '#ffda9c', '#ffc775', '#f2b53a', '#dc8818', '#9a5b00', '#7a3701', '#4e1c0a']
  };

  /* ---------- profundidade (box-shadow) ---------- */
  function pilha(cores, o = {}) {
    const p = o.passo ?? 4, t = o.traco ?? 1.5, ct = o.corTraco || '#000000', n = cores.length;
    const partes = cores.map((c, i) => { const k = (i + 1) * p; return `${k}px ${k}px 0 -${t}px ${c}, ${k}px ${k}px 0 0 ${ct}`; });
    if (o.macia !== false && n) partes.push(`${6 + n * 4}px ${8 + n * 6}px ${16 + n * 8}px -${8 + n * 2}px rgb(0 53 58 / .3)`);
    return partes.join(', ') || 'none';
  }
  const recorte = (cores, o = {}) => cores.map((c, i) => { const k = (i + 1) * (o.passo ?? 4); return `inset ${k}px ${k}px 0 0 ${c}`; }).join(', ') || 'none';

  /* ---------- cena ---------- */
  const PRESETS = {
    cidade: { nome: 'Cidade em contraluz', modo: 'contraluz', rampa: 'tiffany', camadas: [
      { tipo: 'skyline', escala: .55, alturaMin: .34, alturaMax: .6, chanceMarco: .1 },
      { tipo: 'skyline', escala: .75, alturaMin: .24, alturaMax: .5, chanceMarco: .14 },
      { tipo: 'torre', x: .7 },
      { tipo: 'skyline', escala: 1, alturaMin: .15, alturaMax: .36 },
      { tipo: 'skyline', escala: 1.35, alturaMin: .07, alturaMax: .2 },
      { tipo: 'curvas', nivel: .05, amplitude: .02, ondas: 1.2 }] },
    ponte: { nome: 'Ponte sobre o rio', modo: 'contraluz', rampa: 'ciano', camadas: [
      { tipo: 'skyline', escala: .6, alturaMin: .3, alturaMax: .56 },
      { tipo: 'ponte', modelo: 'pensil', nivel: .38 },
      { tipo: 'curvas', nivel: .28, amplitude: .025, ondas: 3 },
      { tipo: 'curvas', nivel: .17, amplitude: .03, ondas: 2.2 },
      { tipo: 'skyline', escala: 1.3, alturaMin: .05, alturaMax: .14 }] },
    canteiro: { nome: 'Canteiro de obra', modo: 'contraluz', rampa: 'tiffany', camadas: [
      { tipo: 'skyline', escala: .55, alturaMin: .2, alturaMax: .42 },
      { tipo: 'guindaste', x: .6 },
      { tipo: 'estrutura', x: .4, andares: 6, vaos: 4 },
      { tipo: 'andaime', x: .4, larguraRel: .6, alturaRel: .34, colunas: 4, niveis: 3 },
      { tipo: 'curvas', nivel: .06, amplitude: .02, ondas: 1.4 }] },
    cupulas: { nome: 'Cidade das cúpulas', modo: 'contraluz', rampa: 'papel', de: 2, ate: 7, camadas: [
      { tipo: 'skyline', escala: .5, alturaMin: .3, alturaMax: .5, janelas: false },
      { tipo: 'cupula', x: .5 },
      { tipo: 'skyline', escala: .8, alturaMin: .12, alturaMax: .3 },
      { tipo: 'ponte', modelo: 'arco', nivel: .2, aqueduto: false, vaos: 9 },
      { tipo: 'curvas', nivel: .04, amplitude: .015, ondas: 1 }] },
    terreno: { nome: 'Curvas de nível', modo: 'poco', rampa: 'tiffany', camadas: [.86, .74, .62, .5, .38, .26, .14].map((n, i) => ({ tipo: 'curvas', nivel: n, amplitude: .07 + i * .006, ondas: 1.6 + i * .25 })) },
    prancha: { nome: 'Prancha em cianotipia', modo: 'contraluz', rampa: 'ciano', camadas: [
      { tipo: 'planta' },
      { tipo: 'estrutura', x: .3, andares: 5, vaos: 3 },
      { tipo: 'guindaste', x: .55 },
      { tipo: 'skyline', escala: 1.2, alturaMin: .06, alturaMax: .18 },
      { tipo: 'moldura', margem: .05 }] }
  };
  const hexRgb = hex => { const n = parseInt(hex.replace('#', ''), 16); return `${n >> 16 & 255} ${n >> 8 & 255} ${n & 255}`; };
  // cfg: { largura, altura, semente, modo: 'contraluz'|'poco', rampa: nome|[9 hex], de, ate, camadas: [{tipo, ...}] } (fundo → frente)
  function cena(cfg = {}) {
    const base = typeof cfg.preset === 'string' ? PRESETS[cfg.preset] : null;
    cfg = Object.assign({}, base || {}, cfg);
    const w = cfg.largura || 1200, h = cfg.altura || 600, sem = cfg.semente || 1, modo = cfg.modo || 'contraluz';
    const r = Array.isArray(cfg.rampa) ? cfg.rampa : RAMPAS[cfg.rampa || 'tiffany'];
    let lista = (cfg.camadas || []).filter(c => VETORES[c.tipo]);
    if (cfg.moldura && !lista.some(c => c.tipo === 'moldura')) lista = lista.concat([{ tipo: 'moldura', margem: typeof cfg.moldura === 'number' ? cfg.moldura : .08 }]);
    const n = lista.length;
    const de = cfg.de ?? (modo === 'poco' ? 9 : 2), ate = cfg.ate ?? (modo === 'poco' ? 2 : 9);
    const camadas = lista.map((c, i) => {
      const passo = Math.round(de + (ate - de) * (n > 1 ? i / (n - 1) : 1)), fator = (i + 1) / n;
      const v = VETORES[c.tipo](Object.assign({ largura: w, altura: h, semente: sem * 31 + i * 7 + 1 }, c));
      return { indice: i, tipo: c.tipo, d: v.d, linhas: v.linhas || '', extra: v.eixos || null, passo, cor: r[passo - 1], corLuz: r[Math.max(0, passo - 2)], fator,
        sombra: `drop-shadow(${r1(2 + 3 * fator)}px ${r1(3 + 4 * fator)}px ${r1(4 + 5 * fator)}px rgb(${hexRgb(r[8])} / ${modo === 'poco' ? .5 : .32}))` };
    });
    const ceu = cfg.ceu || (modo === 'poco'
      ? `linear-gradient(180deg, ${r[8]} 0%, #000000 100%)`
      : `radial-gradient(130% 100% at 50% 100%, ${cfg.luzQuente === false ? r[0] : RAMPAS.sodio[0]} 0%, ${r[0]} 45%, ${r[Math.max(0, de - 2)]} 100%)`);
    return { largura: w, altura: h, modo, rampa: r, ceu, camadas };
  }
  function cenaSVG(cfg) {
    const c = cena(cfg), w = c.largura, h = c.altura, r = c.rampa, poco = c.modo === 'poco';
    const ceuA = poco ? r[8] : RAMPAS.sodio[0], ceuB = poco ? '#000000' : r[0];
    let defs = `<radialGradient id="mq-ceu" cx="50%" cy="100%" r="100%"><stop offset="0" stop-color="${ceuA}"/><stop offset="1" stop-color="${ceuB}"/></radialGradient>`;
    let corpo = `<rect width="${w}" height="${h}" fill="url(#mq-ceu)"/>`;
    c.camadas.forEach((k, i) => {
      defs += `<linearGradient id="mq-l${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.corLuz}"/><stop offset=".7" stop-color="${k.cor}"/></linearGradient>`;
      defs += `<filter id="mq-s${i}" x="-5%" y="-5%" width="115%" height="120%"><feDropShadow dx="${r1(2 + 3 * k.fator)}" dy="${r1(3 + 4 * k.fator)}" stdDeviation="${r1(2 + 2.5 * k.fator)}" flood-color="${r[8]}" flood-opacity="${poco ? .5 : .32}"/></filter>`;
      corpo += `<path data-camada="${i}" fill="url(#mq-l${i})" filter="url(#mq-s${i})" d="${k.d}"/>`;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}</defs>${corpo}</svg>`;
  }

  /* ---------- movimento: paralaxe + respiro + dobradura ----------
     el contém filhos [data-mq-camada="i"] (0 = fundo). Respeita prefers-reduced-motion e pausa fora da tela. */
  function animar(el, o = {}) {
    const reduzido = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const passo = o.passo ?? 3, max = o.max ?? 24, amp = o.amplitude ?? 2, escal = o.escalonamento ?? 70, dur = o.duracao ?? 640;
    const camadas = () => Array.from(el.querySelectorAll('[data-mq-camada]'));
    let ax = 0, ay = 0, x = 0, y = 0, raf = 0, visivel = true, reserva = 0; const t0 = performance.now(), entrada = new Map();
    const mover = e => { const b = el.getBoundingClientRect(); ax = ((e.clientX - b.left) / b.width - .5) * 2; ay = ((e.clientY - b.top) / b.height - .5) * 2; };
    const sair = () => { ax = 0; ay = 0; };
    const usarParalaxe = !reduzido && o.paralaxe !== false, usarRespiro = !reduzido && o.respiro !== false;
    if (usarParalaxe) { el.addEventListener('pointermove', mover); el.addEventListener('pointerleave', sair); }
    const limpar = () => { entrada.clear(); camadas().forEach(c => { c.style.opacity = ''; c.style.transform = ''; }); };
    // dobradura só quando há quadros de verdade; se nenhum quadro rodar (aba oculta, captura, impressão), a cena estática aparece
    const montar = () => {
      if (reduzido || o.dobradura === false || (typeof document !== 'undefined' && document.hidden)) return;
      const t = performance.now(), lista = camadas();
      lista.forEach((c, i) => { entrada.set(c, t + i * escal); c.style.opacity = '0'; });
      clearTimeout(reserva);
      reserva = setTimeout(() => { if (entrada.size) limpar(); }, lista.length * escal + dur + 400);
    };
    const voltaB = p => { const c1 = 1.3, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
    function quadro(agora) {
      raf = 0; if (!visivel) return;
      x += (ax - x) * .07; y += (ay - y) * .07;
      const lista = camadas(), n = lista.length || 1;
      lista.forEach((c, i) => {
        const k = parseFloat(c.getAttribute('data-mq-camada')) || i, f = (k + 1) / n;
        const dx = usarParalaxe ? Math.max(-max, Math.min(max, -x * passo * (k + 1))) : 0, dy = usarParalaxe ? Math.max(-max, Math.min(max, -y * passo * (k + 1) * .45)) : 0;
        const rs = usarRespiro ? Math.sin((agora - t0) / ((9 + k * 1.3) * 1000) * Math.PI * 2 + k * .7) * amp * (.35 + .65 * f) : 0;
        let rot = 0;
        if (entrada.has(c)) { const p = Math.min(1, Math.max(0, (agora - entrada.get(c)) / dur)); rot = (1 - voltaB(p)) * -86; c.style.opacity = String(Math.min(1, p * 1.8)); if (p >= 1) { entrada.delete(c); rot = 0; c.style.opacity = ''; } }
        c.style.transformOrigin = '50% 100%';
        c.style.transform = `perspective(900px) translate3d(${r1(dx)}px, ${r1(dy + rs)}px, 0)${rot ? ` rotateX(${r1(rot)}deg)` : ''}`;
      });
      raf = requestAnimationFrame(quadro);
    }
    const io = typeof IntersectionObserver === 'function' ? new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel && !raf) raf = requestAnimationFrame(quadro); }) : null;
    if (io) io.observe(el);
    montar(); raf = requestAnimationFrame(quadro);
    return {
      remontar: montar,
      parar() { cancelAnimationFrame(raf); raf = 0; visivel = false; clearTimeout(reserva); if (io) io.disconnect(); el.removeEventListener('pointermove', mover); el.removeEventListener('pointerleave', sair); limpar(); }
    };
  }

  const Maquete = { versao: '1.0.0', acaso, tracos: { ret, furo, cheio, vazado, barra, arcada, circulo, banda, janelas, encolher }, vetores: VETORES, rampa, analogas, hexParaOklch, oklchParaHex, contraste, tinta, RAMPAS, LUZ, pilha, recorte, PRESETS, cena, cenaSVG, animar };
  Object.assign(Maquete, VETORES);
  raiz.Maquete = Maquete;
  if (typeof module === 'object' && module.exports) module.exports = Maquete;
})(typeof window !== 'undefined' ? window : globalThis);

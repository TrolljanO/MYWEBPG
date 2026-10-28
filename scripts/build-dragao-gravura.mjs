#!/usr/bin/env node
/** Folhas do dragão azul para a gravura. Saída: assets/engraving.svg */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const r1 = n => Math.round(n * 10) / 10;
const TAU = Math.PI * 2;
const pt = p => `${r1(p[0])} ${r1(p[1])}`;

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
function amostra(segs, n = 10) {
  const out = [];
  segs.forEach((s, i) => { for (let k = i ? 1 : 0; k <= n; k++) out.push(bez(s, k / n)); });
  return out;
}
const area = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };
const inverter = segs => segs.slice().reverse().map(([a, b, c, d]) => [d, c, b, a]);
const forma = (segs, cheio = true) => caminho((area(amostra(segs, 4)) >= 0) === cheio ? segs : inverter(segs), true);
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
function deslocar(pts, dist) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return [p[0] + dy / L * dist, p[1] - dx / L * dist];
  });
}
function fita(pts, meia) {
  const suavePts = amostra(suave(pts), 3);
  const a = deslocar(suavePts, meia);
  const b = deslocar(suavePts, -meia).reverse();
  return forma(suave(a.concat(b), true), true);
}
function furo(pts, meia) {
  const suavePts = amostra(suave(pts), 3);
  const a = deslocar(suavePts, meia);
  const b = deslocar(suavePts, -meia).reverse();
  return forma(suave(a.concat(b), true), false);
}
function fitaVar(pts, larguras) {
  const s = amostra(suave(pts), 4);
  const left = [], right = [];
  for (let i = 0; i < s.length; i++) {
    const w = larguras[Math.min(larguras.length - 1, Math.floor(i / (s.length - 1) * (larguras.length - 1)))];
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const nx = dy / L, ny = -dx / L;
    left.push([s[i][0] + nx * w, s[i][1] + ny * w]);
    right.push([s[i][0] - nx * w, s[i][1] - ny * w]);
  }
  return forma(suave(left.concat(right.reverse()), true), true);
}
function espiralPts(cx, cy, r, voltas, a0, horario) {
  const pts = [], n = Math.ceil(voltas * 28);
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + (horario ? 1 : -1) * t * voltas * TAU, rr = r * (1 - t * .78);
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return pts;
}

const CX = 450, CY = 392;

function nuvem(cx, cy, s, espelho = false) {
  const lobes = [[-1.05, .12, .36], [-.62, -.28, .42], [-.05, -.42, .5], [.5, -.22, .44], [.95, .08, .34], [.7, .38, .28], [.1, .42, .32], [-.55, .36, .3]];
  let cs = lobes.map(([x, y, r]) => ({ x: cx + (espelho ? -x : x) * s, y: cy + y * s, r: r * s }));
  if (espelho) cs = cs.reverse();
  const ox = cs.reduce((a, c) => a + c.x, 0) / cs.length;
  const oy = cs.reduce((a, c) => a + c.y, 0) / cs.length;
  const ang = (c, p) => Math.atan2(p[1] - c.y, p[0] - c.x);
  const cruza = (a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const l = (a.r * a.r - b.r * b.r + d * d) / (2 * d);
    const hh = Math.sqrt(Math.max(0, a.r * a.r - l * l));
    const mx = a.x + dx * l / d, my = a.y + dy * l / d;
    const p = [mx + dy * hh / d, my - dx * hh / d], q = [mx - dy * hh / d, my + dx * hh / d];
    return Math.hypot(p[0] - ox, p[1] - oy) > Math.hypot(q[0] - ox, q[1] - oy) ? p : q;
  };
  let segs = [];
  cs.forEach((c, i) => {
    const pin = cruza(cs[(i - 1 + cs.length) % cs.length], c);
    const pout = cruza(c, cs[(i + 1) % cs.length]);
    let a0 = ang(c, pin), a1 = ang(c, pout);
    while (a1 <= a0) a1 += TAU;
    segs = segs.concat(arco(c.x, c.y, c.r, a0, a1));
  });
  let d = forma(segs, true);
  const [e, dir] = [cs[0], cs[3]];
  d += furo(espiralPts(e.x, e.y, e.r * .55, 1.35, Math.PI, false), e.r * .07);
  d += furo(espiralPts(dir.x, dir.y, dir.r * .5, 1.2, 0, true), dir.r * .06);
  return d;
}

function anel() {
  const fora = 268, dentro = 228;
  return forma(arco(CX, CY, fora, 0, TAU), true) + forma(arco(CX, CY, dentro, 0, TAU), false);
}

function grega() {
  let d = forma(arco(CX, CY, 286, 0, TAU), true) + forma(arco(CX, CY, 274, 0, TAU), false);
  for (const [sx, sy, esp] of [[78, 78, false], [822, 78, true], [78, 682, true], [822, 682, false]]) {
    d += nuvem(sx, sy, 62, esp);
  }
  return d;
}

function chamas() {
  let d = '';
  const spots = [[300, 250], [600, 250], [280, 520], [620, 510]];
  spots.forEach(([x, y], i) => {
    const s = 22 + (i % 2) * 6;
    const pts = [[x, y - s], [x + s * .35, y - s * .2], [x + s * .15, y + s * .15], [x + s * .55, y + s * .05], [x, y + s * .7], [x - s * .55, y + s * .05], [x - s * .15, y + s * .15], [x - s * .35, y - s * .2]];
    d += forma(suave(pts, true), true);
  });
  return d;
}

function dragao() {
  const spine = [[250, 560], [300, 500], [370, 470], [450, 430], [500, 360], [450, 300], [510, 250], [580, 230]];
  let d = fitaVar(spine, [10, 16, 22, 26, 24, 20, 16, 12]);
  const head = spine[spine.length - 1];
  d += circ(head[0] + 28, head[1] + 6, 34, true);
  d += fita([[head[0] + 48, head[1] + 10], [head[0] + 92, head[1] + 28], [head[0] + 118, head[1] + 48]], 7);
  d += fita([[head[0] + 10, head[1] - 20], [head[0] - 8, head[1] - 62], [head[0] + 14, head[1] - 92]], 5);
  d += fita([[head[0] + 28, head[1] - 16], [head[0] + 24, head[1] - 58], [head[0] + 48, head[1] - 84]], 4);
  d += fita([[head[0] + 20, head[1] + 18], [head[0] + 70, head[1] + 46], [head[0] + 40, head[1] + 70]], 2.2);
  d += fita([[head[0] + 36, head[1] + 8], [head[0] + 88, head[1] + 4], [head[0] + 110, head[1] - 16]], 1.8);
  d += circ(head[0] + 18, head[1] - 2, 6, false);
  const amostras = amostra(suave(spine), 5);
  for (let i = 3; i < amostras.length - 4; i += 4) d += circ(amostras[i][0], amostras[i][1], 5.5, false);
  [amostras[6], amostras[12], amostras[18], amostras[24]].filter(Boolean).forEach((p, i) => {
    const dir = i % 2 ? 1 : -1;
    d += fita([[p[0], p[1]], [p[0] + dir * 18, p[1] + 26], [p[0] + dir * 8, p[1] + 48]], 3.4);
    d += fita([[p[0], p[1]], [p[0] + dir * 28, p[1] + 18], [p[0] + dir * 36, p[1] + 40]], 2.4);
  });
  return d;
}

const sheets = [
  { id: 'folha-campo', cls: 's8', d: `M0 0h900v760H0z` },
  { id: 'folha-grega', cls: 's6', d: grega() },
  { id: 'folha-nuvens', cls: 'sp', d: [nuvem(300, 200, 58, false), nuvem(610, 210, 64, true), nuvem(270, 560, 52, true), nuvem(640, 540, 56, false)].join('') },
  { id: 'folha-chamas', cls: 's5', d: chamas() },
  { id: 'folha-anel', cls: 's7', d: anel() },
  { id: 'folha-dragao', cls: 'sp', d: dragao() },
];

let defs = `
<filter id="gv-s0" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="2" dy="3" stdDeviation="1.2"/></filter>
<filter id="gv-s1" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="3" dy="5" stdDeviation="1.6"/></filter>
<filter id="gv-s2" x="-22%" y="-22%" width="144%" height="154%"><feDropShadow dx="4" dy="6" stdDeviation="2"/></filter>
`;
let layers = '';
sheets.forEach((sheet, i) => {
  const shadow = i < 2 ? 'gv-s0' : i < 4 ? 'gv-s1' : 'gv-s2';
  defs += `<path id="gv-f${i}" d="${sheet.d}"/><clipPath id="gv-c${i}"><use href="#gv-f${i}"/></clipPath>`;
  const mid = (sheets.length - 1) / 2;
  const depth = (1.4 + i * 0.42).toFixed(2);
  const ox = ((i - mid) * 10).toFixed(1);
  const oy = ((mid - i) * 12).toFixed(1);
  const rot = ((i - mid) * 0.35).toFixed(2);
  const fill = sheet.id === 'folha-campo'
    ? `<use href="#gv-f${i}" class="sheet ${sheet.cls}"/>`
    : `<use href="#gv-f${i}" class="sheet ${sheet.cls}" filter="url(#${shadow})"/><use href="#gv-f${i}" class="sheet-edge" clip-path="url(#gv-c${i})"/>`;
  layers += `<g class="art-layer" style="--i:${i}" data-depth="${depth}" data-open-x="${ox}" data-open-y="${oy}" data-open-rotate="${rot}" data-tipo="${sheet.id}" id="${sheet.id}">${fill}</g>\n`;
});

const svg = `<svg class="engraving" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 760" role="img" aria-labelledby="gv-title gv-desc">
<title id="gv-title">Dragão azul</title>
<desc id="gv-desc">Medalhão de dragão em papel recortado: campo, grega, nuvens, chamas, anel e dragão, cada um numa folha.</desc>
<defs>${defs}<g id="wave-print"><path d="${sheets[5].d}" fill="currentColor"/></g></defs>
<rect class="art-paper" width="100%" height="100%"/>
${layers}</svg>
`;

const out = join(root, 'assets/engraving.svg');
writeFileSync(out, svg);
console.log(`Wrote ${out} · ${sheets.length} folhas · ${svg.length} bytes`);

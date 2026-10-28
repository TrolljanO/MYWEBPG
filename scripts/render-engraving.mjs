#!/usr/bin/env node
/** Build SVG art from the Maquete motor (gravura, hero nuvens, etc.). */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

require(join(root, 'assets/motor/maquete-motor.js'));
const ext = readFileSync(join(root, 'assets/motor/maquete-kittiwake.js'), 'utf8');
// eslint-disable-next-line no-eval
eval(ext);

const preset = process.argv[2] || 'gravura';
const semente = Number(process.argv[3]) || 2718;
const M = globalThis.Maquete;
const presetCfg = M.PRESETS[preset];
if (!presetCfg) {
  console.error(`Preset desconhecido: ${preset}`);
  process.exit(1);
}

function defaultOut(name) {
  if (name === 'hero-nuvens-desktop') return 'assets/hero-desktop.svg';
  if (name === 'hero-nuvens-mobile') return 'assets/hero-mobile.svg';
  if (name === 'hero-nuvens-isolada') return 'docs/design/hero-preview/nuvem-isolada.svg';
  return 'assets/engraving.svg';
}

const relOut = process.argv[4] || defaultOut(preset);
const w = Number(process.argv[5]) || presetCfg.largura || 900;
const h = Number(process.argv[6]) || presetCfg.altura || 760;
const hero = preset.startsWith('hero-nuvens');
const idPrefix = hero ? 'hn' : 'gv';
const svgClass = hero ? 'hero-papercut' : 'engraving';

const cfg = { preset, semente, largura: w, altura: h, modo: presetCfg.modo || 'contraluz', rampa: presetCfg.rampa || 'papel' };
const c = M.cena(cfg);
const n = c.camadas.length;
const mid = (n - 1) / 2;

function shadowId(fator) {
  if (fator < 0.4) return `${idPrefix}-s0`;
  if (fator < 0.75) return `${idPrefix}-s1`;
  return `${idPrefix}-s2`;
}

function seigaihaCircles(className) {
  const centers = [[0, 0], [64, 0], [32, 16], [0, 32], [64, 32]];
  const radii = [32, 26, 20, 14, 8, 3];
  let out = '';
  for (const [cx, cy] of centers) {
    for (const r of radii) {
      out += `<circle cx="${cx}" cy="${cy}" r="${r}" class="${className}"/>`;
    }
  }
  return out;
}

let defs = `
<filter id="${idPrefix}-s0" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="2" dy="3" stdDeviation="1.5"/></filter>
<filter id="${idPrefix}-s1" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="3" dy="5" stdDeviation="2"/></filter>
<filter id="${idPrefix}-s2" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="5" dy="8" stdDeviation="3"/></filter>
<pattern id="${idPrefix}-seigaiha" width="64" height="32" patternUnits="userSpaceOnUse">${seigaihaCircles('seigaiha-escama')}</pattern>
<pattern id="${idPrefix}-seigaiha-mar" width="64" height="32" patternUnits="userSpaceOnUse">${seigaihaCircles('seigaiha-mar-escama')}</pattern>
`;

let layers = '';
let thumbD = '';

c.camadas.forEach((k, i) => {
  const layerCfg = presetCfg.camadas[i] || {};
  defs += `<path id="${idPrefix}-f${i}" d="${k.d}"/>`;
  defs += `<clipPath id="${idPrefix}-c${i}"><use href="#${idPrefix}-f${i}"/></clipPath>`;

  const depth = (1.5 + i * 0.45).toFixed(2);
  const ox = ((i - mid) * 8).toFixed(1);
  const oy = (-(i - mid) * 10).toFixed(1);
  const rot = ((i - mid) * 0.08).toFixed(2);
  const isFundo = k.tipo === 'campo' || k.tipo === 'heroFundo';
  const textura = layerCfg.textura;
  let fillAttr;
  if (textura === 'seigaiha') fillAttr = `fill="url(#${idPrefix}-seigaiha)"`;
  else if (textura === 'seigaiha-mar') fillAttr = `fill="url(#${idPrefix}-seigaiha-mar)"`;
  else fillAttr = `class="sheet ${layerCfg.tom === 'papel' ? 'sp' : 's' + (layerCfg.tom ?? k.passo)}"`;
  const tinta = layerCfg.tinta ? ' ink' : '';

  let inner = '';
  if (!isFundo) {
    inner += `<use href="#${idPrefix}-f${i}" ${fillAttr} filter="url(#${shadowId(k.fator)})"/>`;
    inner += `<use href="#${idPrefix}-f${i}" class="sheet-edge${tinta}" clip-path="url(#${idPrefix}-c${i})"/>`;
    if (k.linhas) {
      inner += `<path class="sheet-lines${tinta}" d="${k.linhas}" clip-path="url(#${idPrefix}-c${i})"/>`;
    }
  } else {
    inner += `<use href="#${idPrefix}-f${i}" ${fillAttr}/>`;
  }

  const layerId = hero && k.tipo === 'nuvemFolha'
    ? ` id="hero-nuvem-${layerCfg.nuvem}-folha-${layerCfg.folha}"`
    : '';
  layers += `<g class="art-layer" style="--i:${i}" data-depth="${depth}" data-open-x="${ox}" data-open-y="${oy}" data-open-rotate="${rot}" data-tipo="${k.tipo}"${layerId}>${inner}</g>\n`;

  if (k.tipo === 'onda') thumbD += k.d;
  if (hero && !thumbD && k.tipo === 'nuvemFolha' && layerCfg.folha === 4) thumbD += k.d;
});

const title = hero ? 'Nuvens ornamentais em papercut' : 'Entre ondas e montanhas';
const desc = hero
  ? 'Composição hero com nuvens xiangyun recortadas em folhas de papel, em preto, branco e cinza.'
  : 'Gravura em papel recortado: onda com garras quebrando sob nuvens xiangyun, medalhão com greca, monte distante e mar; fundo em seigaiha. Folhas sobrepostas com traço de porcelana.';
const thumbId = hero ? 'hero-thumb' : 'wave-print';
const thumbBlock = thumbD ? `<g id="${thumbId}"><path d="${thumbD}" fill="currentColor"/></g>` : '';
const paperRect = hero ? '' : '<rect class="art-paper" width="100%" height="100%"/>';

const frame = hero ? ' preserveAspectRatio="xMidYMid slice"' : '';
const svg = `<svg class="${svgClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.largura} ${c.altura}"${frame} role="img" aria-labelledby="${idPrefix}-title ${idPrefix}-desc">
<title id="${idPrefix}-title">${title}</title>
<desc id="${idPrefix}-desc">${desc}</desc>
<defs>${defs}${thumbBlock}</defs>
${paperRect}
${layers}</svg>
`;

const out = join(root, relOut);
writeFileSync(out, svg);
console.log(`Wrote ${out} · preset=${preset} · semente=${semente} · ${n} camadas`);

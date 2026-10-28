"""Compose independently movable paper cuts from the preserved vector engravings.

Source linework was vectorized from the project's AI-generated illustrations.
This composer has no raster or third-party dependency. Run after editing cut curves.
"""
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent

def inner_svg(name):
    text = (ROOT / 'assets' / name).read_text()
    return text[text.index('>') + 1:text.rindex('</svg>')]

def curve(points):
    result = f'M{points[0][0]} {points[0][1]}'
    for i in range(1, len(points), 3):
        result += 'C' + ' '.join(f'{x} {y}' for x, y in points[i:i+3])
    return result

def reversed_curve(points):
    return curve(list(reversed(points)))

# Each boundary follows the inner sweep of the wave, rather than a rectangular crop.
boundaries = []
for n in range(7):
    points = [(-20, 595+n*24), (120, 520+n*21), (270, 480+n*26), (350+n*10, 365+n*23),
              (430+n*9, 260+n*16), (570+n*3, 185+n*14), (680-n*5, 230+n*17),
              (735-n*12, 282+n*9), (620-n*8, 305+n*18), (635-n*3, 458+n*16),
              (655+n*5, 625+n*15), (795+n*8, 720+n*10), (965+n*9, 776+n*13),
              (1170, 825+n*12), (1350, 780+n*17), (1560, 800+n*22)]
    boundaries.append(points)

clips=[]; cuts=[]
for i in range(8):
    if i==0:
        d=curve(boundaries[0])+'L1560 -20L-20 -20Z'
    elif i==7:
        d=curve(boundaries[-1])+'L1560 1050L-20 1050Z'
    else:
        low=boundaries[i]; high=boundaries[i-1]
        rev=reversed_curve(high)
        d=curve(low)+f'L{high[-1][0]} {high[-1][1]}'+rev[rev.index('C'):]+'Z'
    clips.append(f'<clipPath id="wave-cut-{i}"><path d="{d}"/></clipPath>')
    # Independent SVG groups retain all fine linework, with curve-shaped cut boundaries.
    edge='' if i==0 else f'<path d="{curve(boundaries[i-1])}" class="cut-edge" fill="none" stroke="var(--ink,black)" stroke-width=".7" opacity=".6"/>'
    cuts.append(f'<g class="art-layer wave-cut" data-cut="{i}" data-depth="{3+i*.45:.2f}" data-open-x="{(i-3.5)*5:.1f}" data-open-y="{(i-3.5)*8:.1f}" data-open-rotate="{(i-3.5)*.22:.2f}"><g clip-path="url(#wave-cut-{i})"><use href="#wave-print"/>{edge}</g></g>')

svg=f'''<svg class="engraving" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 760" role="img" aria-labelledby="engraving-title engraving-description">
<title id="engraving-title">Entre ondas e montanhas</title>
<desc id="engraving-description">Gravura japonesa em preto e branco. Oito recortes curvos independentes atravessam o interior da onda; abrir as folhas revela a impressão que fica atrás. Ilustrações com IA, vetorização e composição para este site.</desc>
<defs>
{inner_svg('wave-lines.svg')}
{inner_svg('mountain-lines.svg')}
{''.join(clips)}
<clipPath id="art-boundary"><rect x="12" y="12" width="876" height="736"/></clipPath>
<clipPath id="mountain-cut"><rect x="0" y="630" width="1536" height="394"/></clipPath>
<clipPath id="pine-cut"><rect x="0" y="0" width="1536" height="630"/></clipPath>
</defs>
<g clip-path="url(#art-boundary)">
<g class="art-layer" data-depth="1" data-open-x="-4" data-open-y="-4"><circle cx="290" cy="209" r="105" fill="var(--paper,white)" stroke="var(--ink,black)" stroke-width=".7"/><path d="M90 336Q160 314 233 327T397 320" fill="none" stroke="var(--ink,black)" stroke-width=".7"/></g>
<g transform="translate(120 15) scale(.508)"><g class="art-layer" data-depth="2" data-open-y="-12"><g clip-path="url(#mountain-cut)"><use href="#mountain-print"/></g></g><g class="art-layer" data-depth="3" data-open-x="9" data-open-y="-18"><g clip-path="url(#pine-cut)"><use href="#mountain-print"/></g></g></g>
<g transform="translate(-135 260) scale(.71)">
<g class="underprint" transform="translate(3 9)"><use href="#wave-print"/></g>
{''.join(cuts)}
</g>
</g></svg>'''
ET.fromstring(svg)
(ROOT/'assets/engraving.svg').write_text(svg)
print(f'Composed 8 internal cuts + 3 background planes; {len(svg):,} SVG bytes.')

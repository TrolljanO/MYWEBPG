"""Generate the portfolio's original, theme-aware SVG line engraving."""
from pathlib import Path
import math
parts=['''<svg class="engraving" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 760" role="img" aria-labelledby="engraving-title engraving-description">
<title id="engraving-title">Entre ondas e montanhas</title><desc id="engraving-description">Gravura original em preto e branco: linhas finas desenham ondas, uma montanha e um pinheiro em folhas sobrepostas.</desc>
<defs><clipPath id="art-boundary"><rect x="12" y="12" width="876" height="736" rx="1"/></clipPath>
<pattern id="fine-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(23)"><path d="M0 0V6" fill="none" stroke="var(--ink)" stroke-width=".55" opacity=".5"/></pattern>
<filter id="paper-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.1" flood-opacity=".13"/></filter></defs>
<g clip-path="url(#art-boundary)" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">''']
def add(s):parts.append(s)
def group(n):add(f'<g class="art-layer" data-depth="{n}">')
def end():add('</g>')
group(1)
add('<circle cx="603" cy="180" r="116" fill="var(--paper)" stroke-width=".9"/>')
for i in range(17):
 y=95+i*11
 dx=math.sqrt(max(0,116**2-(y-180)**2))
 add(f'<path d="M{603-dx:.1f} {y}H{603+dx:.1f}" opacity=".19" stroke-width=".65"/>')
add('<path d="M85 274C168 260 186 280 232 262S305 250 350 257M118 284C189 274 200 290 249 276M643 307C692 289 751 309 828 288"/>')
end()
group(2)
add('<path d="M208 467L465 209L507 246L527 239L730 471Z" fill="var(--paper)" stroke-width="1.5"/>')
add('<path d="M385 289L465 209L507 246L527 239L579 294L540 283L520 301L494 270L474 287L448 252L418 295L403 279Z" fill="var(--paper)"/>')
for i in range(28):
 x=237+i*16
 peak=465+(i-14)*2.5
 add(f'<path d="M{x} 461Q{(x+peak)/2:.1f} 365 {peak:.1f} {292+abs(i-14)*2}" stroke-width="{.55 if i%3 else 1.1}"/>')
add('<path d="M72 440Q180 395 284 430T478 419T730 438T880 418L900 760H0Z" fill="var(--paper)"/>')
for i in range(10):add(f'<path d="M20 {447+i*9}Q160 {417+i*9} 300 {448+i*8}T580 {444+i*8}T910 {440+i*9}" stroke-width=".6"/>')
end()
# Back curling wave: nested ink contours, thin cuts rather than thick sculptural slabs.
group(3)
add('<path d="M-50 652C70 610 131 583 183 475C212 415 247 349 308 342C371 335 405 370 387 407C376 428 353 429 338 414C368 419 373 391 354 382C319 363 288 420 283 475C280 544 342 573 429 586C560 604 694 507 940 520L940 800H-50Z" fill="var(--paper)" filter="url(#paper-shadow)" stroke-width="1.5"/>')
for i in range(17):
 d=i*5.2
 add(f'<path d="M{-25+d*.4:.1f} {666+d:.1f}C{95+d*.5:.1f} {621+d*.6:.1f} {158+d*.5:.1f} {573+d*.5:.1f} {203+d*.5:.1f} {477+d*.4:.1f}C{231+d*.4:.1f} {405+d*.4:.1f} {276+d*.4:.1f} {362+d*.4:.1f} {329+d*.2:.1f} {369+d*.22:.1f}" stroke-width="{.65 if i%4 else 1.3}"/>')
for i in range(13):add(f'<path d="M{300+i*4} {461+i*4}C{278+i*5} {556+i*5} 440 {631+i*3} 614 {568+i*6}S809 {533+i*8} 923 {551+i*9}" stroke-width=".7"/>')
end()
group(4)
add('<path d="M290 803C353 689 426 677 487 557C526 481 552 431 610 424C654 418 685 452 673 482C666 499 646 511 631 491C648 498 661 474 645 466C620 450 591 486 587 529C581 590 628 625 714 622C783 617 838 588 928 592L931 802Z" fill="var(--paper)" filter="url(#paper-shadow)" stroke-width="1.5"/>')
for i in range(21):
 d=i*4
 add(f'<path d="M{315+d} 798C{373+d*.6} {704+d*.5} {457+d*.4} {646+d*.1} {507+d*.4} {548+d*.2}S{573+d*.32} {442+d*.3} {620+d*.3} {450+d*.3}" stroke-width="{.65 if i%4 else 1.2}"/>')
for i in range(12):add(f'<path d="M{603+i*3} {510+i*7}C{572+i*3} {608+i*6} {696+i*2} {677+i*8} 921 {623+i*10}" stroke-width=".7"/>')
end()
# Foam crests as cut silhouettes with fine interior veins.
group(5)
for x,y,s in [(195,477,1),(225,414,.85),(267,366,.7),(314,348,.65),(492,566,1),(522,500,.9),(562,449,.72),(610,429,.6)]:
 add(f'<g transform="translate({x} {y}) scale({s})"><path d="M-15 24Q-25 7 -12 -6Q-7 -18 0 -10Q-6 -24 7 -28Q20 -30 16 -17Q29 -28 36 -16Q41 -5 26 -4Q44 0 34 12Q25 18 17 12Q27 28 13 31Q2 33 0 20Q-3 37 -15 24Z" fill="var(--paper)"/><path d="M-13 22Q-2 1 14 -15M2 11L-10 -5M9 3L29 -10M3 19L25 10" stroke-width=".65"/></g>')
for i in range(27):
 a=i*2.399;x=340+math.cos(a)*(70+i*2);y=315+math.sin(a)*(30+i*2)
 add(f'<path d="M{x:.1f} {y:.1f}q-4 -9 0 -13q5 4 0 13Z" fill="var(--paper)" stroke-width=".75"/>')
end()
# Pine on the right: angular trunk with individually engraved needles.
group(6)
add('<path d="M927 413Q820 331 798 262Q783 219 756 210Q733 193 711 164L704 166Q713 195 738 216Q774 244 779 282Q791 338 874 416Z" fill="var(--paper)" stroke-width="1.6"/>')
add('<path d="M900 400Q814 331 789 274Q781 241 745 217M815 320L854 220L863 200L856 199L838 225L801 283M778 258Q729 251 692 231L690 238Q721 268 786 279"/>')
for cx,cy,w in [(710,167,65),(754,207,73),(694,232,62),(855,200,59),(820,247,65)]:
 for j in range(39):
  a=math.pi+(j/38)*math.pi
  r=w*(.65+.35*math.sin(j*2.7)**2)
  ex=cx+math.cos(a)*r;ey=cy+math.sin(a)*r*.47
  add(f'<path d="M{cx+(j%5-2)*3} {cy+7}L{ex:.1f} {ey:.1f}" stroke-width=".75"/>')
 add(f'<path d="M{cx-w*.9} {cy+1}Q{cx} {cy+10} {cx+w*.9} {cy}"/>')
end()
add('</g></svg>')
Path('assets/gravura.svg').write_text('\n'.join(parts))

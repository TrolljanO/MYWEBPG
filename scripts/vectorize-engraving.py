"""Optional authoring helper; production builds use committed SVG assets."""
from PIL import Image
from pathlib import Path
from collections import defaultdict
from math import hypot
import argparse
parser=argparse.ArgumentParser(description='Vectorize the ink and paper contours of a project illustration. Requires Pillow, only for art authoring.')
parser.add_argument('source', type=Path)
parser.add_argument('destination', type=Path)
parser.add_argument('--id', default='wave-print')
args=parser.parse_args()
im=Image.open(args.source).convert('RGBA')
w,h=im.size
pixels=list(im.get_flattened_data())
def trace(test):
 mask=bytearray(test(*p) for p in pixels)
 edges=defaultdict(list)
 for y in range(h):
  for x in range(w):
   if not mask[y*w+x]:continue
   if y==0 or not mask[(y-1)*w+x]:edges[(x,y)].append((x+1,y))
   if x==w-1 or not mask[y*w+x+1]:edges[(x+1,y)].append((x+1,y+1))
   if y==h-1 or not mask[(y+1)*w+x]:edges[(x+1,y+1)].append((x,y+1))
   if x==0 or not mask[y*w+x-1]:edges[(x,y+1)].append((x,y))
 loops=[]
 while edges:
  start=next(iter(edges));p=start;points=[p]
  while p in edges:
   q=edges[p].pop()
   if not edges[p]:del edges[p]
   points.append(q);p=q
   if p==start:break
  if len(points)<12:continue
  area=sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(points,points[1:]))/2
  if abs(area)<6:continue
  # First collapse grid-collinear vertices, then simplify to subpixel precision.
  simple=[points[0]]
  for i in range(1,len(points)-1):
   a,b,c=points[i-1:i+2]
   if (b[0]-a[0])*(c[1]-b[1]) != (b[1]-a[1])*(c[0]-b[0]):simple.append(b)
  simple.append(points[-1])
  def rdp(seq,eps=1.1):
   if len(seq)<3:return seq
   ax,ay=seq[0];bx,by=seq[-1];dx=bx-ax;dy=by-ay;den=hypot(dx,dy)
   vals=[abs(dy*(x-ax)-dx*(y-ay))/den if den else hypot(x-ax,y-ay) for x,y in seq[1:-1]]
   m=max(vals,default=0)
   if m<=eps:return [seq[0],seq[-1]]
   i=vals.index(m)+1
   return rdp(seq[:i+1])+rdp(seq[i:])[1:]
  simple=rdp(simple)
  loops.append('M'+' '.join(f'{x},{y}' for x,y in simple[:-1])+'Z')
 return ''.join(loops)
paper=trace(lambda r,g,b,a:a>220)
ink=trace(lambda r,g,b,a:a>120 and (r+g+b)<380)
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><g id="{args.id}"><path fill="var(--paper,white)" fill-rule="evenodd" d="{paper}"/><path fill="var(--ink,black)" fill-rule="evenodd" d="{ink}"/></g></svg>'
args.destination.write_text(svg)
print('vector bytes',len(svg),'paper',len(paper),'ink',len(ink))

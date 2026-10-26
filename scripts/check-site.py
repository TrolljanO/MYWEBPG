"""Check local HTML asset and fragment links without dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
root=Path(__file__).resolve().parent.parent
pages=[root/x for x in ['index.html','curriculo.html','privacidade.html','404.html','projetos/sdd-buddy.html','projetos/micro-rag.html']]
class Parser(HTMLParser):
 def __init__(self,text):
  super().__init__();self.refs=[];self.ids=set();self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  for key in ('href','src'):
   if key in a:self.refs.append(a[key])
parsed={p:Parser(p.read_text()) for p in pages};errors=[];count=0
for source,doc in parsed.items():
 for ref in doc.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  target=(root/u.path.lstrip('/') if u.path.startswith('/') else source.parent/unquote(u.path)) if u.path else source
  target=target.resolve()
  if target.is_dir():target/= 'index.html'
  count+=1
  if not target.is_file():errors.append(f'{source.name}: missing {ref}')
  elif u.fragment and target in parsed and u.fragment not in parsed[target].ids:errors.append(f'{source.name}: missing fragment {ref}')
print(f'{count} local links/assets checked; {len(errors)} errors.')
for e in errors:print(e)
raise SystemExit(bool(errors))

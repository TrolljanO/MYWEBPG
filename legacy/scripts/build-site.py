"""Package only public website files. Supplied references are never copied."""
from pathlib import Path
import shutil,subprocess,sys
root=Path(__file__).resolve().parent.parent
subprocess.run([sys.executable,str(root/'scripts/build-pages.py')],cwd=root,check=True)
subprocess.run([sys.executable,str(root/'scripts/check-site.py')],cwd=root,check=True)
dest=root/'dist';dest.mkdir(exist_ok=True)
files=['index.html','index.css','index.js','theme.js','curriculo.html','privacidade.html','404.html','projetos/sdd-buddy.html','projetos/micro-rag.html','assets/favicon.svg','assets/onda-gravura.png','assets/montanha-gravura.png','assets/fonts/cormorant.ttf','assets/fonts/manrope.ttf','assets/fonts/cormorantgaramond-OFL.txt','assets/fonts/manrope-OFL.txt']
# Fail if a stale file would be silently published; a clean directory is expected.
expected=set(files)
extra=[str(p.relative_to(dest)) for p in dest.rglob('*') if p.is_file() and str(p.relative_to(dest)) not in expected]
if extra:raise SystemExit('Unexpected files in dist; inspect before packaging: '+', '.join(extra))
for name in files:
 (dest/name).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,dest/name)
print(f'Packaged {len(files)} public files in dist/. No deployment performed.')

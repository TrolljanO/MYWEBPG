# Guilherme Trajano — portfólio pessoal

Primeira versão local do site. HTML/CSS/JavaScript, sem dependências de runtime ou requisições a fontes externas.

## Prévia

```sh
python3 scripts/build-site.py
python3 -m http.server 4173 --directory dist
```

Abra http://localhost:4173. `dist/` contém somente os arquivos públicos; referências fornecidas, documentos, maquetes AW e logs ficam fora do pacote.

## Edição

- `index.html`: home, conteúdo e composição SVG da gravura.
- `index.css`: tokens, layout responsivo, temas, estados e impressão.
- `index.js` / `theme.js`: tema persistente, filtros e movimento das camadas.
- `scripts/build-pages.py`: conteúdo e geração de currículo, projetos, privacidade e 404.
- `scripts/check-site.py`: integridade dos links e assets locais.
- `assets/onda-gravura.png`, `assets/montanha-gravura.png`: camadas de arte geradas por IA; crédito na página. As imagens têm alpha real.
- `assets/fonts/`: Cormorant Garamond e Manrope, com licenças OFL.

```sh
python3 scripts/check-site.py
node --check index.js
node --check theme.js
```

## Estado editorial

Descrição e apresentação novas, baseadas na bio fornecida e nos READMEs públicos de SDD-Buddy e Micro-RAG. Currículo é um resumo a revisar, não uma transcrição integral de export do LinkedIn. Arquivo de posts ainda vazio, sem integração social automática. Wiseforge foi confirmado como domínio comprado, mas seu uso ainda está em decisão. Nenhum DNS ou serviço de hospedagem foi alterado.

A composição tem cinco planos de profundidade. Os desenhos de cada PNG não são subdivididos em vetores por linha de contorno; a próxima exploração artística pode detalhar esses recortes. Não confundir paralaxe de planos com animação individual de todos os traços.

`404.html` usa base `/`, pronta para domínio dedicado. Para hospedar em subdiretório (por exemplo GitHub Pages de projeto), adaptar a base no gerador antes de publicar.

Direção, fontes e decisões: `docs/design/direcao-e-fontes.md`.

# Validação do boilerplate

## Preparação para Pages em 12 de novembro de 2026

Validação local com Node 24.15.0, incluindo as alterações da caixa de luz e do relevo que estavam sem commit:

- `npm run validate`: ESLint passou; Astro Check verificou 54 arquivos com zero erros, warnings ou hints; 6 testes unitários passaram; build de 13 páginas e verificação de links/assets passaram.
- `npm run format:check`: passou.
- `npm run test:content`: passou com 35 páginas de fixtures, paginação, tags, Markdown/MDX, SEO, RSS, rascunhos e datas; imagem sem alt e frontmatter inválido impediram o build como esperado. O script removeu as fixtures e restaurou o build de produção.
- `CI=true npm run test:e2e`: 23 testes Chromium passaram em 35,3 s, sobre o preview de produção.
- `npm audit --omit=dev`: zero vulnerabilidades conhecidas.
- GitHub API: Actions habilitado; Pages com `build_type: workflow`, HTTPS obrigatório e URL `https://trolljano.github.io/MYWEBPG/`. Sem variáveis de domínio próprio: valem os defaults do workflow.
- O deploy continua condicionado a `main`. Esta verificação local não comprova um deploy desta versão. A integração do Grokbot não foi executada; o contrato está em `docs/BOT-PUBLISHING.md`.

Os registros abaixo são históricos. As limitações de navegador, leitor de tela e Lighthouse continuam aplicáveis.

Verificado em 10 de novembro de 2026, no build de produção local, Node 24.15.0. O CI e o deploy usam Node 24. `engines.node` é `>=22.23.4`.

- ESLint: passou.
- Astro Check: zero erros, warnings ou hints.
- Vitest: 5 testes passaram (4 de regras editoriais e 1 de paginação com base path).
- Build estático: 13 páginas HTML, RSS, robots e sitemap. O Astro registrou 5,90 s na execução do gate, com cache de imagem.
- Integridade: todos os links/assets locais gerados passaram, incluindo o prefixo `/MYWEBPG`. `scripts/check-build.mjs` contou 13 páginas.
- Teste editorial com fixtures: 35 páginas, Markdown e MDX, paginação do blog e tags, projetos e filtros, dados estruturados, rascunhos e posts futuros fora de RSS/sitemap/rotas. Builds com imagem sem alt e frontmatter inválido falharam como esperado. Fixtures removidas depois do teste.
- Playwright: 7 testes passaram, cobrindo tema persistente, skip link e teclado, menu mobile sem JavaScript, estado vazio do blog, `prefers-reduced-motion` com `data-paused` e botão de pausa oculto, o botão "Pausar movimento", RSS, robots e ausência de overflow em 320/390/768/1440/2560px.
- axe: nenhuma violação nas tags `wcag2a`, `wcag2aa`, `wcag21aa` e `wcag22aa` da home nos dois temas. A mesma checagem, numa passagem, em home, blog, sobre, projetos, currículo, privacidade, 404, SDD-Buddy e Micro-RAG.
- Chromium: a home não tem canvas. Com movimento reduzido os dois dioramas recebem `data-paused` e o botão de pausa não aparece. Com movimento permitido, o clique em "Pausar movimento" troca o rótulo para "Retomar movimento" e marca `data-paused`.
- `npm audit --omit=dev`: zero vulnerabilidades conhecidas na execução local.
- Lighthouse não foi medido de novo.

## Limites conhecidos

- Three.js e GSAP saíram do código e das dependências. Nenhuma página os importava. O chunk lazy e o aviso de tamanho do Vite deixam de existir.
- INP e FPS em dispositivo móvel real não foram medidos. Lighthouse não foi executado de novo.
- Safari, Firefox e Edge não foram executados; teste esses navegadores antes do lançamento do design final.
- Auditoria automática não substitui revisão manual com leitor de tela e conteúdo final.
- Nenhum deploy foi realizado. O workflow Pages será ativado pelo proprietário ao configurar Pages com GitHub Actions e integrar em main. Builds por PR geram artefato, não uma URL pública dedicada.
- Open Graph usa imagem provisória compartilhada por padrão; uma capa pode personalizar o preview do artigo. Geração automática de OG por título é evolução opcional.
- Não foi atribuída nota de design Awwwards: conteúdo e identidade finais estão explicitamente fora do escopo solicitado.

O rastreador lê `robots.txt` só na raiz do host. Este arquivo sai em `/MYWEBPG/robots.txt`. Não há domínio próprio. O Search Console não foi alterado.

## Primeiro carregamento da home

Medido de novo em 10 de novembro de 2026, nos arquivos de `dist/` deste build, e conferido no Chromium. O `sizes` gravado é `min(100vw, calc((100svh - 5.5rem) * 1.5))`. Em 1280×720 com densidade 1 o palco da cumeeira mede 548 CSS px. Com a raiz em 16px, a conta desse `sizes` dá 948 CSS px, e o Chromium pediu o candidato de 1248. Em 390×844 com densidade 2 o palco mede 168 CSS px, a conta do `sizes` dá 390 CSS px, e o Chromium pediu o candidato de 828. Os números abaixo são o corpo de cada arquivo, sem gzip. O preview chega a comprimir o CSS na rede; a conta não usa esse desconto.

| Peça                   | Arquivo                                        |  Bytes |
| ---------------------- | ---------------------------------------------- | -----: |
| HTML                   | `dist/index.html`                              |  17943 |
| CSS                    | `_astro/BaseLayout.MhjHDVQF.css`               |  26629 |
| Cormorant 500          | `_astro/cormorant-500.CI0lkEhY.woff2`          |  19512 |
| Céu, 1248              | `_astro/01-ceu.psL5_GLO_TzBdN.webp`            |  75588 |
| Nuvens de trás, 1248   | `_astro/02-nuvens-atras.CO22lcre_2usVf9.webp`  | 111504 |
| Serras, 1248           | `_astro/03-serras.CPiNzVpU_2uJqVy.webp`        |  55648 |
| Monte, 1248            | `_astro/04-monte.4lrZHPmZ_Z1Rstfc.webp`        |  80742 |
| Dragão, 1248           | `_astro/05-dragao.DcL_YH1A_1OyV0i.webp`        |  87862 |
| Nuvens da frente, 1248 | `_astro/06-nuvens-frente.BqEtqN0W_1DUHRK.webp` |  83294 |
| Soma                   | HTML + CSS + WOFF2 + seis folhas eager em 1248 | 558722 |

Ficou de fora:

- Manrope, `_astro/manrope.DIRNzeTG.ttf`, 164700 bytes. O navegador baixa. Esta medição não fez subset.
- A koi. As cinco folhas estão com `loading="lazy"`. No mesmo Chromium 1280×720 o limiar de lazy ainda pediu o candidato de 1248, 359122 bytes. Esses bytes não entram na soma.
- JavaScript externo. Não há chunk. Os scripts inline já estão dentro dos 17943 bytes do HTML.
- O candidato de 2400 da cumeeira, nestes dois viewports. O `srcset` gerado traz 828, 1248 e 2400. No móvel 390×844 com densidade 2, o mesmo conjunto (HTML, CSS, WOFF2 e as seis folhas eager no candidato de 828) soma 367898 bytes.

A Cormorant de display continua o WOFF2 estático, peso 500, subset Latin, de 19512 bytes.

Medido de novo em 11 de novembro de 2026, depois que a cumeeira virou caixa de luz. A conta agora é outra: soma o corpo de tudo o que o Chromium recebeu no primeiro carregamento da home, menos as folhas da koi. Entram HTML, CSS, as duas fontes e as seis folhas eager. O `sizes` da cumeeira é `(min-width: 1000px) calc(120svh - 6.6rem), 100vw`.

| Viewport     | Quadro da cena | Candidato | Bytes recebidos |
| ------------ | -------------: | --------: | --------------: |
| 1280×720, 1x |     758 CSS px |       828 |          412520 |
| 1440×900, 1x |     974 CSS px |      1248 |          603344 |
| 390×844, 2x  |     446 CSS px |       828 |          412520 |

O HTML da home foi de 17943 para 25548 bytes sem gzip. A diferença são as cinco máscaras das folhas recortadas, cada uma uma curva de 48 pontos no atributo `style`. Os bytes da tabela foram medidos com a máscara anterior, de 300 pontos, quando o HTML tinha 34683 bytes; as imagens não mudaram.

## Primeiro carregamento em 11 de novembro de 2026

Medido no Chromium, cache desligado, sobre o preview de produção deste build. O número é a soma de `transferSize` do documento e dos recursos. A home em 1440×900 usa densidade 1. A home em 390×844 usa densidade 2. O blog pediu os mesmos candidatos de imagem nos dois viewports.

| Página   | Viewport |   Bytes |
| -------- | -------- | ------: |
| `/`      | 1440×900 | 1591495 |
| `/blog/` | 1440×900 |  806827 |
| `/`      | 390×844  |  586043 |
| `/blog/` | 390×844  |  806827 |

A Manrope do corpo é `manrope.woff2`, subset Latin, eixo `wght` de 400 a 700, 21492 bytes no disco e 21792 bytes na transferência. `dist/_astro` não tem `.ttf`. O preload da Manrope está no `head`. Em 1440×900 a largura de uma amostra em Manrope não mudou entre o DOM pronto e `document.fonts.ready`.

## Checagens em 11 de novembro de 2026

- Vitest: 6 testes. São 4 de regras editoriais, 1 de paginação e 1 da versão do Node no `.nvmrc`.
- Playwright: 22 testes. O axe percorre as nove rotas abertas no tema claro e no tema escuro, nas tags `wcag2a`, `wcag2aa`, `wcag21aa` e `wcag22aa`. O blog com movimento reduzido fica em `data-paper="css"`, sem canvas e sem animação em execução. Em 390×844 o palco da home e o do blog medem a largura da página.
- A suíte não abre artigo publicado. Save-Data e a falha de compilação do shader não foram exercitados. Lighthouse, outro navegador e leitor de tela não rodaram.

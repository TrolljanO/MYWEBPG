# Validação do boilerplate

Verificado em 9 de novembro de 2026, no build de produção local, Node 24 (CI configurada com Node 22 LTS).

- ESLint: passou.
- Astro Check: zero erros, warnings ou hints.
- Vitest: 4 testes de regras editoriais e URLs passaram.
- Build estático: 7 páginas, RSS, robots e sitemap; aproximadamente 1 segundo neste ambiente.
- Integridade: todos os links/assets locais gerados passaram, incluindo o prefixo `/MYWEBPG`.
- Teste editorial com fixtures: 29 páginas, Markdown e MDX, paginação do blog e tags, projetos e filtros, dados estruturados, rascunhos e posts futuros fora de RSS/sitemap/rotas. Builds com imagem sem alt e frontmatter inválido falharam como esperado. Fixtures removidas depois do teste.
- Playwright: 5 testes passaram, cobrindo tema persistente, skip link e teclado, menu mobile sem JavaScript, estados vazios, reduced motion sem canvas, RSS, robots e ausência de overflow em 320/390/768/1440/2560px.
- axe: nenhuma violação nas regras WCAG A/AA automatizadas da home em ambos os temas; verificação adicional sem violações nas sete páginas/tipos, incluindo 404.
- Chromium: nenhum erro de página observado; WebGL inicializou e o botão de pausa funcionou. SVG é o fallback sem movimento/WebGL. Duas passagens visuais detectaram e corrigiram setas ausentes na fonte, substituídas por SVG.
- `npm audit --omit=dev`: zero vulnerabilidades conhecidas na execução local.
- Lighthouse mobile, home, uma execução local: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**. LCP **0,8 s**, CLS **0**, TBT **100 ms**. Estes são resultados de laboratório do esqueleto, não medição de usuários reais ou garantia do site final.

## Limites conhecidos

- Three.js e GSAP saíram do código e das dependências. Nenhuma página os importava. O chunk lazy e o aviso de tamanho do Vite deixam de existir.
- INP e FPS em dispositivo móvel real não foram medidos. Lighthouse usa TBT como sinal de laboratório, não substituto de INP.
- Safari, Firefox e Edge não foram executados; teste esses navegadores antes do lançamento do design final.
- Auditoria automática não substitui revisão manual com leitor de tela e conteúdo final.
- Nenhum deploy foi realizado. O workflow Pages será ativado pelo proprietário ao configurar Pages com GitHub Actions e integrar em main. Builds por PR geram artefato, não uma URL pública dedicada.
- Open Graph usa imagem provisória compartilhada por padrão; uma capa pode personalizar o preview do artigo. Geração automática de OG por título é evolução opcional.
- Não foi atribuída nota de design Awwwards: conteúdo e identidade finais estão explicitamente fora do escopo solicitado.

## Primeiro carregamento da home

Medido em 10 de novembro de 2026, nos arquivos de `dist/` deste build, e conferido no Chromium em 1280×720 com densidade 1. O palco mede 948 CSS px. O `sizes` gravado é `min(100vw, calc((100svh - 5.5rem) * 1.5))`. Com `100%` no lugar de `100vw`, o Chromium descarta o atributo e pede o candidato de 2496. Com `100vw`, o slot de 948 px escolhe o candidato de 1248, o 1x de 2496. Os números abaixo são o corpo de cada arquivo, sem gzip. O preview chega a comprimir o CSS na rede; a conta não usa esse desconto.

| Peça            | Arquivo                                    |  Bytes |
| --------------- | ------------------------------------------ | -----: |
| HTML            | `dist/index.html`                          |  16373 |
| CSS             | `_astro/BaseLayout.WK4lX_Gr.css`           |  24842 |
| Cormorant 500   | `_astro/cormorant-500.CI0lkEhY.woff2`      |  19512 |
| Nuvens, 1248    | `_astro/01-nuvens.zZvwnEgA_x0XYS.webp`     |  28502 |
| Serras, 1248    | `_astro/02-serras.DiLGZSFS_1EYzCE.webp`    | 141822 |
| Monte, 1248     | `_astro/03-monte.fsCrBaac_ZQakoD.webp`     | 192198 |
| Dragão, 1248    | `_astro/04-dragao.TuHG50Iy_Z7Mid3.webp`    |  50238 |
| Pinheiros, 1248 | `_astro/05-pinheiros.Cmm91tA__ZAKtEc.webp` |  60904 |
| Soma            | HTML + CSS + WOFF2 + cinco folhas eager    | 534391 |

Teto deste mesmo conjunto: 560000 bytes. A folga cobre cabeçalho HTTP e um pouco de variação de build. Não cobre o que ficou de fora.

Ficou de fora:

- Manrope, `_astro/manrope.DIRNzeTG.ttf`, 164700 bytes. O navegador baixa. Esta onda não fez subset.
- A koi. As cinco folhas estão com `loading="lazy"`. No mesmo Chromium o limiar de lazy ainda pediu o candidato de 1248, 359122 bytes, porque o capítulo começa perto de 1498 px. Esses bytes não entram na soma.
- JavaScript externo. Não há chunk. Os scripts inline já estão dentro dos 16373 bytes do HTML.
- O candidato de 2496 da cumeeira, neste viewport. No móvel 390×844 com densidade 2, o mesmo conjunto (HTML, CSS, WOFF2 e as cinco folhas eager no candidato de 828) soma 336641 bytes.

A Cormorant de display saiu de um TTF variável de 1195560 bytes para um WOFF2 estático, peso 500, subset Latin, de 19512 bytes.

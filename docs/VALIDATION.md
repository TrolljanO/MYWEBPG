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

- Three.js/GSAP ficam em chunk lazy maior que 500 kB minificado; Vite emite aviso de tamanho. Esse módulo não está no JavaScript inicial nem nas páginas de leitura. Não silenciamos o aviso: reavalie ao substituir a cena.
- INP e FPS em dispositivo móvel real não foram medidos. Lighthouse usa TBT como sinal de laboratório, não substituto de INP.
- Safari, Firefox e Edge não foram executados; teste esses navegadores antes do lançamento do design final.
- Auditoria automática não substitui revisão manual com leitor de tela e conteúdo final.
- Nenhum deploy foi realizado. O workflow Pages será ativado pelo proprietário ao configurar Pages com GitHub Actions e integrar em main. Builds por PR geram artefato, não uma URL pública dedicada.
- Open Graph usa imagem provisória compartilhada por padrão; uma capa pode personalizar o preview do artigo. Geração automática de OG por título é evolução opcional.
- Não foi atribuída nota de design Awwwards: conteúdo e identidade finais estão explicitamente fora do escopo solicitado.

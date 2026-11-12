# PRD — Portfólio + Blog para Devs

**Produto:** Portfólio pessoal e blog técnico de Guilherme Trajano  
**Versão:** 1.0  
**Data:** 2026-11-09  
**Autor:** Guilherme Trajano  
**Status:** Pronto para desenvolvimento  

---

## 1. Visão do produto

Criar um site estático, leve, rápido e visualmente memorável que funcione como:

1. **Portfólio profissional** de Guilherme Trajano, cientista e engenheiro de software com foco em dados e IA.
2. **Blog técnico**, com experiência de leitura inspirada em plataformas como Medium, porém com identidade visual própria.
3. **Laboratório criativo**, usando Three.js, WebGL, motion graphics e interações controladas por scroll.
4. **Base escalável**, com conteúdo gerenciado por arquivos Markdown/MDX no repositório, sem CMS externo na versão inicial.

O produto deve transmitir senioridade técnica, curiosidade intelectual e sensibilidade estética, sem comprometer performance, acessibilidade ou manutenibilidade.

---

## 2. Problema

Portfólios convencionais tendem a cair em dois extremos:

- Sites excessivamente simples, que parecem currículos estáticos e não comunicam personalidade.
- Sites excessivamente animados, com WebGL pesado, JavaScript excessivo e experiência ruim em mobile ou conexões lentas.

Guilherme precisa de um meio-termo: um site rápido e indexável, mas com uma identidade visual forte, animações intencionais e uma experiência de leitura excelente.

---

## 3. Objetivos

### Objetivos de negócio / carreira

- Criar uma presença profissional pública e memorável.
- Facilitar que recrutadores, parceiros e colegas encontrem projetos, artigos e formas de contato.
- Publicar conteúdo técnico com baixo atrito.
- Construir uma base reutilizável para futuras evoluções do site.

### Objetivos de produto

- Permitir publicar um post apenas criando um arquivo Markdown ou MDX.
- Permitir publicar projetos a partir de arquivos estruturados.
- Garantir pontuação Lighthouse alta em Performance, Accessibility, Best Practices e SEO.
- Suportar animações e cenas 3D sem degradar a experiência em dispositivos modestos.
- Permitir deploy automático no GitHub Pages.
- Manter o código organizado, tipado e fácil de evoluir.

### Métricas de sucesso

| Métrica | Meta inicial |
|---|---:|
| Lighthouse Performance em desktop | >= 90 |
| Lighthouse Accessibility | >= 95 |
| Lighthouse Best Practices | >= 95 |
| Lighthouse SEO | >= 95 |
| LCP | <= 2.5s em conexão 4G simulada |
| CLS | <= 0.1 |
| INP | <= 200ms |
| Tamanho de JavaScript inicial na home | <= 120 KB gzipado, excluindo Three.js lazy-loaded |
| Tempo para publicar um post | <= 5 minutos |
| Build de produção | <= 60 segundos em máquina local comum |

---

## 4. Público-alvo

### Persona 1 — Recrutador / Tech Lead

**Objetivo:** avaliar rapidamente competências, experiência, projetos e contato.

**Necessidades:**

- Entender em menos de 10 segundos quem é Guilherme e sua área.
- Ver projetos relevantes, stack, resultados e links.
- Encontrar GitHub, LinkedIn, e-mail e CV facilmente.
- Ler em desktop ou mobile sem fricção.

### Persona 2 — Desenvolvedor / Comunidade técnica

**Objetivo:** consumir artigos técnicos, exemplos de código e aprendizados.

**Necessidades:**

- Ler artigos com tipografia confortável.
- Copiar blocos de código facilmente.
- Navegar por tags, posts relacionados e índice de conteúdo.
- Compartilhar links limpos e legíveis.

### Persona 3 — Guilherme, autor e mantenedor

**Objetivo:** publicar e evoluir o site com pouco atrito.

**Necessidades:**

- Escrever em Markdown/MDX.
- Ter frontmatter validado por schema.
- Adicionar imagens, código, tabelas, links e componentes interativos.
- Publicar via Git push.
- Evitar dependências desnecessárias e dívida técnica.

---

## 5. Escopo

### 5.1 Incluído no MVP

- Home com hero artístico e introdução profissional.
- Página “Sobre” com trajetória, competências, stack e contato.
- Página de projetos com listagem e páginas individuais.
- Blog com listagem, tags, página de post e navegação entre artigos.
- Conteúdo em Markdown e MDX.
- Content Collections tipadas para `blog` e `projects`.
- Layout responsivo mobile-first.
- Tema claro e escuro, com preferência do sistema e toggle manual.
- SEO técnico: metatags, Open Graph, Twitter Cards, sitemap, robots.txt e canonical URLs.
- RSS feed.
- Acessibilidade: navegação por teclado, contraste, foco visível, landmarks e textos alternativos.
- Analytics leve, opt-in ou respeitando preferências de privacidade.
- Deploy automatizado para GitHub Pages via GitHub Actions.
- Integração com Three.js para um hero interativo.
- Integração com GSAP para animações de entrada, scroll e microinterações.
- Tailwind CSS para design system utilitário.
- TypeScript para tipagem de dados, componentes e configurações.

### 5.2 Fora do escopo do MVP

- CMS headless externo, como Sanity, Contentful, Strapi ou Decap CMS.
- Comentários com login social.
- Newsletter com automações complexas.
- Busca full-text com índice client-side.
- Internacionalização multilíngue completa.
- Área administrativa.
- E-commerce.
- Autenticação de usuários.
- Renderização server-side contínua.
- Banco de dados.

Esses itens podem entrar em versões futuras, mas não devem bloquear o MVP.

---

## 6. Stack técnica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Astro | Geração estática, rotas baseadas em arquivos, Content Collections e baixo JavaScript por padrão |
| UI | Astro Components | Componentes leves, zero-runtime por padrão |
| Estilo | Tailwind CSS v4 | Produtividade, consistência e design system utilitário |
| Conteúdo | Markdown + MDX | Escrita simples; MDX permite componentes interativos quando necessário |
| Validação de conteúdo | Zod + Astro Content Collections | Frontmatter tipado e validado em build |
| 3D | Three.js | Cenas WebGL, shaders, partículas e elementos artísticos |
| Animação | GSAP + ScrollTrigger | Timelines, scroll animations e microinterações |
| Linguagem | TypeScript | Segurança de tipos e melhor manutenibilidade |
| Ícones | Lucide ou Astro Icon | Ícones leves e consistentes |
| Fontes | Variáveis locais ou Google Fonts com `font-display: swap` | Controle de performance e identidade visual |
| Deploy | GitHub Pages + GitHub Actions | Hospedagem gratuita e pipeline automatizado |
| Qualidade | ESLint, Prettier, Astro Check | Consistência e prevenção de erros |
| Testes | Vitest + Playwright | Testes unitários e E2E essenciais |

---

## 7. Arquitetura

### 7.1 Princípios

1. **Static-first:** todo conteúdo textual deve ser HTML estático no build.
2. **Progressive enhancement:** o site deve funcionar sem JavaScript; JS adiciona camadas de experiência.
3. **Ilhas de interatividade:** Three.js e animações pesadas ficam isolados em componentes específicos.
4. **Content as code:** posts e projetos vivem no repositório.
5. **Performance como requisito:** cada dependência precisa justificar seu custo.
6. **Acessibilidade não negociável:** animações não podem impedir navegação ou leitura.
7. **Design system mínimo:** tokens de cor, espaçamento, tipografia, radius e motion antes de construir páginas.

### 7.2 Estrutura de pastas

```text
portfolio/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ fonts/
├─ src/
│  ├─ assets/
│  │  └─ images/
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ Button.astro
│  │  │  ├─ Badge.astro
│  │  │  ├─ Card.astro
│  │  │  └─ SectionHeading.astro
│  │  ├─ blog/
│  │  │  ├─ PostCard.astro
│  │  │  ├─ PostMeta.astro
│  │  │  ├─ TagList.astro
│  │  │  └─ ReadingProgress.astro
│  │  ├─ projects/
│  │  │  └─ ProjectCard.astro
│  │  ├─ layout/
│  │  │  ├─ Header.astro
│  │  │  ├─ Footer.astro
│  │  │  ├─ MobileNav.astro
│  │  │  └─ ThemeToggle.astro
│  │  └─ motion/
│  │     ├─ Reveal.astro
│  │     ├─ ScrollProgress.astro
│  │     └─ Hero3D.astro
│  ├─ content/
│  │  ├─ blog/
│  │  │  └─ exemplo-post.md
│  │  └─ projects/
│  │     └─ exemplo-projeto.md
│  ├─ layouts/
│  │  ├─ BaseLayout.astro
│  │  ├─ PostLayout.astro
│  │  └─ ProjectLayout.astro
│  ├─ lib/
│  │  ├─ seo.ts
│  │  ├─ dates.ts
│  │  ├─ reading-time.ts
│  │  └─ three/
│  │     ├─ hero-scene.ts
│  │     └─ shaders/
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ about.astro
│  │  ├─ blog/
│  │  │  ├─ index.astro
│  │  │  ├─ tag/[tag].astro
│  │  │  └─ [slug].astro
│  │  ├─ projects/
│  │  │  ├─ index.astro
│  │  │  └─ [slug].astro
│  │  ├─ 404.astro
│  │  ├─ rss.xml.js
│  │  └─ sitemap.xml.js
│  ├─ styles/
│  │  ├─ global.css
│  │  ├─ typography.css
│  │  └─ tokens.css
│  ├─ content.config.ts
│  └─ env.d.ts
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts
├─ README.md
└─ LICENSE
```

### 7.3 Fluxo de conteúdo

```text
Autor cria .md/.mdx
        |
        v
Frontmatter validado por Zod
        |
        v
Astro Content Collection
        |
        v
Rota dinâmica gera HTML estático
        |
        v
GitHub Actions builda e publica em GitHub Pages
```

---

## 8. Modelo de conteúdo

### 8.1 Blog Post

Arquivo: `src/content/blog/{slug}.md` ou `.mdx`

```md
---
title: "Título do artigo"
description: "Resumo curto para SEO, listagem e compartilhamento."
pubDate: 2026-11-09
updatedDate: 2026-11-09
tags:
  - astro
  - threejs
  - engineering
draft: false
featured: false
cover:
  src: "/images/posts/exemplo.jpg"
  alt: "Descrição acessível da imagem"
readingTime: 6
---

## Introdução

Conteúdo do artigo em Markdown.

```ts
const example = "código";
```

## Conclusão

Texto final.
```

### 8.2 Projeto

Arquivo: `src/content/projects/{slug}.md` ou `.mdx`

```md
---
title: "Nome do projeto"
summary: "Descrição curta do projeto."
description: "Descrição mais completa para a página individual."
startDate: 2025-01-01
endDate: 2025-06-30
role: "Criador e desenvolvedor"
status: "concluído"
featured: true
repository: "https://github.com/usuario/repo"
liveUrl: "https://exemplo.com"
tags:
  - python
  - data
  - ai
cover:
  src: "/images/projects/exemplo.jpg"
  alt: "Descrição acessível da imagem"
metrics:
  - label: "Usuários"
    value: "1.2k"
  - label: "Redução de tempo"
    value: "38%"
---

## Contexto

Descrição do problema.

## Solução

Como o projeto resolve o problema.

## Stack

- Python
- FastAPI
- PostgreSQL

## Resultados

Resultados mensuráveis e aprendizados.
```

### 8.3 Regras de slug

- Slug deve ser gerado a partir do nome do arquivo.
- Usar kebab-case: `meu-primeiro-post.md`.
- Slug deve ser estável; alterá-lo depois quebra URLs e SEO.
- O frontmatter não deve conter `slug`; ele deve vir do nome do arquivo.

---

## 9. Requisitos funcionais

### RF-01 — Home

O site deve exibir uma home contendo:

- Hero com nome, título profissional e chamada para ação.
- CTA para projetos e blog.
- Resumo das competências principais.
- Seleção de 3 a 6 projetos em destaque.
- Seleção dos 3 posts mais recentes.
- Links para GitHub, LinkedIn, e-mail e currículo.
- Rodapé com navegação e informações de contato.

**Critérios de aceite**

- [ ] A home carrega conteúdo principal sem depender de Three.js.
- [ ] O hero 3D é carregado apenas quando suportado e após priorizar conteúdo textual.
- [ ] O usuário consegue navegar para projetos e blog em no máximo dois cliques.
- [ ] A home é responsiva de 320px até 2560px.
- [ ] Todos os CTAs têm foco visível e área de toque adequada.

### RF-02 — Hero 3D

O site deve incluir um hero visual com Three.js.

**Requisitos**

- A cena deve ser leve, com no máximo 1 canvas WebGL.
- Deve respeitar `prefers-reduced-motion`.
- Deve pausar quando a aba está oculta.
- Deve pausar ou reduzir qualidade quando o dispositivo tem bateria baixa, se detectável.
- Deve degradar graciosamente para um fundo estático em dispositivos sem WebGL.
- Deve ser carregado de forma lazy.
- Não deve bloquear a renderização do conteúdo textual.
- Deve suportar interação por mouse, touch e scroll, sem prejudicar a rolagem.

**Critérios de aceite**

- [ ] Conteúdo textual aparece mesmo se WebGL falhar.
- [ ] Animação não roda quando `prefers-reduced-motion: reduce` está ativo.
- [ ] Canvas não captura eventos de scroll indevidamente.
- [ ] FPS médio é >= 45 em um dispositivo móvel intermediário.
- [ ] Nenhum erro de WebGL quebra a página.

### RF-03 — Blog

O site deve oferecer um blog com experiência de leitura de alta qualidade.

**Requisitos**

- Listagem cronológica reversa.
- Paginação ou carregamento incremental a partir de 12 posts.
- Página individual por post.
- Tags clicáveis.
- Página de arquivo por tag.
- Data de publicação e data de atualização.
- Tempo estimado de leitura.
- Índice de conteúdos para posts longos.
- Navegação para próximo e anterior.
- Posts relacionados por tags.
- Botão de copiar código.
- Syntax highlighting.
- Imagens responsivas.
- Tabela de conteúdos opcional.
- RSS feed.
- Compartilhamento via URL limpa e Open Graph.

**Critérios de aceite**

- [ ] Um novo post aparece automaticamente após build.
- [ ] Posts com `draft: true` não aparecem em produção.
- [ ] Posts futuros não aparecem antes da data de publicação.
- [ ] Tags geram páginas funcionais.
- [ ] Código é legível, copiável e com destaque de sintaxe.
- [ ] Imagens possuem `alt` obrigatório.
- [ ] A leitura é confortável em mobile.

### RF-04 — Projetos

O site deve apresentar projetos como estudos de caso.

**Requisitos**

- Listagem de projetos.
- Projetos em destaque na home.
- Página individual por projeto.
- Campos para contexto, problema, solução, stack, papel, resultados e links.
- Métricas opcionais.
- Imagem de capa.
- Links para repositório e demo.
- Filtro por tag ou tecnologia.
- Ordenação por relevância ou data.

**Critérios de aceite**

- [ ] Cada projeto tem página própria com URL estável.
- [ ] Projetos sem `liveUrl` não exibem botão de demo.
- [ ] Projetos sem `repository` não exibem botão de código.
- [ ] Métricas aparecem somente quando fornecidas.
- [ ] Projetos em destaque aparecem na home.

### RF-05 — Sobre

A página “Sobre” deve conter:

- Bio profissional.
- Áreas de atuação.
- Stack técnica.
- Experiência selecionada.
- Formação ou certificações relevantes.
- Links profissionais.
- Forma de contato.

**Critérios de aceite**

- [ ] Conteúdo é atualizável via Markdown/MDX ou componente Astro.
- [ ] Informações de contato são fáceis de localizar.
- [ ] A página comunica diferencial profissional sem parecer currículo puro.

### RF-06 — Navegação

O site deve ter navegação consistente.

**Requisitos**

- Header fixo ou sticky discreto.
- Links para Home, Sobre, Projetos e Blog.
- Menu mobile acessível.
- Indicação visual da página atual.
- Breadcrumb em páginas de conteúdo.
- Rodapé com links principais e redes sociais.
- Botão “voltar ao topo” em posts longos.

**Critérios de aceite**

- [ ] Menu abre e fecha por teclado.
- [ ] Menu mobile não trava o scroll indevidamente.
- [ ] Link ativo é identificável visualmente e programaticamente.
- [ ] Usuário chega a qualquer página principal em no máximo dois cliques.

### RF-07 — Tema claro e escuro

O site deve suportar tema claro e escuro.

**Requisitos**

- Detectar preferência do sistema.
- Permitir alternância manual.
- Persistir escolha em `localStorage`.
- Evitar flash de tema incorreto na carga inicial.
- Garantir contraste em ambos os temas.
- Suportar `prefers-color-scheme`.

**Critérios de aceite**

- [ ] Tema persiste entre navegações.
- [ ] Não há flash branco/preto incorreto.
- [ ] Contraste mínimo AA é atendido.
- [ ] Toggle é acessível por teclado.

### RF-08 — SEO

O site deve ser otimizado para descoberta orgânica.

**Requisitos**

- Title e meta description únicos por página.
- Canonical URL.
- Open Graph e Twitter Cards.
- Sitemap XML.
- robots.txt.
- RSS feed.
- Structured data para `Person`, `BlogPosting` e `CreativeWork`.
- URLs limpas.
- Imagens com dimensões definidas.
- Favicon e ícones sociais.

**Critérios de aceite**

- [ ] Cada página possui title e description únicos.
- [ ] Sitemap é gerado automaticamente.
- [ ] Posts aparecem com dados estruturados válidos.
- [ ] Links compartilhados exibem preview adequado.

### RF-09 — Acessibilidade

O site deve seguir WCAG 2.2 nível AA como base.

**Requisitos**

- HTML semântico.
- Landmarks corretos.
- Contraste mínimo AA.
- Foco visível.
- Navegação completa por teclado.
- `alt` obrigatório em imagens informativas.
- Textos decorativos marcados corretamente.
- Respeito a `prefers-reduced-motion`.
- Sem dependência exclusiva de cor para comunicar estado.
- Alvos de toque com no mínimo 44x44px.
- Skip link para conteúdo principal.

**Critérios de aceite**

- [ ] Usuário navega por todo o site apenas com teclado.
- [ ] Leitor de tela consegue compreender estrutura e conteúdo.
- [ ] Animações podem ser reduzidas ou desativadas.
- [ ] Nenhum elemento interativo possui contraste insuficiente.

### RF-10 — Performance

O site deve ser rápido por padrão.

**Requisitos**

- HTML estático no build.
- JavaScript carregado apenas quando necessário.
- Three.js carregado de forma lazy.
- Imagens otimizadas e responsivas.
- Fontes com preload seletivo e `font-display: swap`.
- CSS crítico inline quando fizer sentido.
- Sem fontes bloqueantes desnecessárias.
- Cache headers adequados no deploy.
- Code splitting automático.
- Sem bibliotecas de animação pesadas em páginas de artigo.

**Critérios de aceite**

- [ ] Home atinge metas Lighthouse definidas.
- [ ] Post carrega sem Three.js.
- [ ] Imagens não causam layout shift.
- [ ] Nenhuma fonte bloqueia renderização por tempo excessivo.

### RF-11 — Deploy

O site deve publicar automaticamente no GitHub Pages.

**Requisitos**

- Build executado em GitHub Actions a cada push em `main`.
- Build de preview para pull requests, se viável.
- Deploy apenas após testes e build bem-sucedidos.
- Configuração de base path compatível com GitHub Pages.
- Cache de dependências no CI.
- Artefato de build validado antes do deploy.

**Critérios de aceite**

- [ ] Push em `main` publica nova versão automaticamente.
- [ ] Falha de build impede deploy.
- [ ] Site funciona em URL de GitHub Pages.
- [ ] Assets carregam corretamente com base path configurado.

---

## 10. Requisitos não funcionais

| Categoria | Requisito |
|---|---|
| Performance | HTML estático, JS mínimo e imagens otimizadas |
| Responsividade | Layout funcional de 320px a 2560px |
| Acessibilidade | WCAG 2.2 AA |
| SEO | Indexação, metadados, sitemap, RSS e structured data |
| Segurança | Sem segredos no repositório; dependências auditadas |
| Privacidade | Analytics respeitoso, sem cookies invasivos no MVP |
| Manutenibilidade | TypeScript, componentes pequenos e convenções claras |
| Portabilidade | Conteúdo em Markdown, sem lock-in de CMS |
| Observabilidade | Erros de runtime capturados por ferramenta leve, se necessário |
| Compatibilidade | Últimas duas versões de Chrome, Firefox, Safari e Edge |
| Resiliência | Fallback estático para recursos 3D e animações |

---

## 11. Design system inicial

### 11.1 Direção visual

A identidade deve equilibrar:

- **Engenharia:** grid, monoespaçado, precisão, estrutura.
- **Arte:** movimento, profundidade, textura, contraste e composição.
- **Leitura:** tipografia confortável, ritmo visual e hierarquia clara.

A estética sugerida é **“technical brutalism refinado”**: fundo escuro profundo, tipografia forte, detalhes monocromáticos, acentos elétricos e elementos WebGL sutis.

### 11.2 Tokens iniciais

```css
:root {
  --color-bg: #05060a;
  --color-surface: #0b0d14;
  --color-surface-2: #12151f;
  --color-border: #1e2330;
  --color-text: #e8ecf4;
  --color-text-muted: #9aa3b5;
  --color-accent: #7c5cff;
  --color-accent-2: #22d3ee;
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-danger: #f87171;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 600ms;
}
```

### 11.3 Tipografia

| Uso | Fonte | Peso | Observação |
|---|---|---:|---|
| Display / títulos | Space Grotesk ou Sora | 600–800 | Identidade forte |
| Corpo | Inter | 400–500 | Legibilidade |
| Código | JetBrains Mono | 400–600 | Leitura técnica |
| Destaques | Inter ou Space Grotesk | 600 | Uso moderado |

### 11.4 Motion principles

- Animações devem comunicar hierarquia, não decorar.
- Duração padrão: 150ms a 600ms.
- Entradas: fade + translateY de 12px a 24px.
- Scroll: revelar apenas uma vez por seção.
- Hover: transform, opacity e cor; evitar animar `width`, `height` e `top`.
- WebGL: movimento sutil, com possibilidade de pausa.
- Sempre respeitar `prefers-reduced-motion`.

---

## 12. Experiência de leitura

A experiência do blog deve lembrar Medium em conforto, mas ter identidade própria.

### Regras de leitura

- Largura máxima do texto: 68ch a 74ch.
- Tamanho base: 17px a 19px em desktop.
- Altura de linha: 1.65 a 1.75.
- Espaçamento entre parágrafos: generoso, mas consistente.
- Headings com hierarquia visual clara.
- Código com fundo contrastante, cópia em um clique e quebra de linha controlada.
- Imagens com legenda opcional.
- Links com estado hover e foco evidente.
- Progresso de leitura discreto no topo.
- Sumário fixo ou flutuante apenas em telas grandes.

### Componentes de conteúdo MDX

- `Callout`
- `CodeBlock`
- `Figure`
- `VideoEmbed`
- `ProjectCard`
- `ComparisonTable`
- `Details`
- `Tabs`
- `MermaidDiagram`, opcional

---

## 13. Estrutura de páginas

### Home

```text
Hero 3D
Quem sou
Projetos em destaque
Últimos artigos
Stack / áreas
CTA de contato
Footer
```

### Blog

```text
Header
Título e descrição
Filtros por tag
Lista de posts
Paginação
Footer
```

### Post

```text
Header
Breadcrumb
Título
Meta: data, tempo de leitura, tags
Capa opcional
Sumário opcional
Conteúdo MDX
Navegação anterior/próxima
Posts relacionados
CTA de contato
Footer
```

### Projetos

```text
Header
Título e descrição
Filtros
Grid de projetos
Footer
```

### Projeto

```text
Header
Breadcrumb
Capa
Título e resumo
Meta: período, papel, stack, status
Contexto
Problema
Solução
Resultados
Links
Próximo projeto
Footer
```

---

## 14. Critérios de aceitação globais

- [ ] O site é 100% estático após build.
- [ ] Todo conteúdo é criado em Markdown ou MDX.
- [ ] Nenhum post ou projeto exige alteração de código para ser publicado.
- [ ] O site funciona sem JavaScript para leitura e navegação básica.
- [ ] Three.js não é carregado em páginas de blog por padrão.
- [ ] O site é responsivo em mobile, tablet e desktop.
- [ ] O tema escuro é o padrão visual, com suporte a tema claro.
- [ ] O repositório contém README com instruções completas.
- [ ] O deploy no GitHub Pages funciona automaticamente.
- [ ] O projeto passa por lint, typecheck, build e testes básicos.

---

## 15. Roadmap de implementação

### Fase 0 — Fundação

**Entregas**

- Repositório criado.
- Astro inicializado com TypeScript.
- Tailwind configurado.
- ESLint, Prettier e Astro Check configurados.
- Estrutura de pastas criada.
- Design tokens iniciais.
- Layout base responsivo.
- Deploy no GitHub Pages.

**Definition of Done**

- Build passa.
- Deploy automático funciona.
- Layout base é responsivo.
- Tema escuro funciona.

### Fase 1 — Blog essencial

**Entregas**

- Content Collection de blog.
- Schema Zod.
- Listagem de posts.
- Página individual de post.
- Tags.
- RSS.
- SEO básico.
- Estilo de leitura.
- Syntax highlighting.
- Tempo de leitura.

**Definition of Done**

- É possível publicar um post apenas adicionando um `.md`.
- Posts aparecem corretamente na listagem e possuem URL própria.
- SEO básico validado.

### Fase 2 — Portfólio

**Entregas**

- Content Collection de projetos.
- Página de listagem.
- Página individual de projeto.
- Cards de projeto.
- Filtro por stack/tag.
- Projetos em destaque na home.
- Página Sobre.

**Definition of Done**

- É possível adicionar um projeto via Markdown.
- Projetos aparecem na home quando marcados como destaque.
- Páginas de projeto possuem estrutura consistente.

### Fase 3 — Identidade visual e motion

**Entregas**

- Hero 3D com Three.js.
- Sistema de animações GSAP.
- Scroll reveals.
- Microinterações.
- Transições discretas entre páginas.
- Cursor ou efeito visual opcional.
- Estados de hover e foco.

**Definition of Done**

- Animações respeitam acessibilidade.
- Performance permanece dentro das metas.
- Visual está consistente entre páginas.

### Fase 4 — Polimento

**Entregas**

- SEO avançado.
- Structured data.
- Open Graph dinâmico.
- Sitemap.
- RSS completo.
- Página 404.
- Testes E2E.
- Lighthouse CI.
- Documentação de contribuição.
- README completo.

**Definition of Done**

- Metas de performance e acessibilidade são atendidas.
- Fluxo de publicação está documentado.
- Deploy é previsível.

---

## 16. Riscos e mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Three.js degradar performance | Alto | Carregar apenas no hero, lazy load, fallback estático e limitar geometrias |
| Animações excessivas | Médio | Design system de motion e `prefers-reduced-motion` |
| MDX virar complexo demais | Médio | Usar `.md` por padrão e `.mdx` apenas quando necessário |
| GitHub Pages e base path | Alto | Configurar `site` e `base` desde o início |
| SEO fraco em SPA-like | Alto | Renderização estática e metadados por rota |
| Escopo criativo crescer demais | Alto | MVP enxuto e roadmap por fases |
| Acessibilidade esquecida | Alto | Critérios de aceite obrigatórios e testes de teclado |
| Dependências pesadas | Médio | Auditar bundle e evitar bibliotecas redundantes |
| Conteúdo desatualizado | Médio | Campos `updatedDate`, status e revisão periódica |

---

## 17. Definition of Done — MVP

O MVP está pronto quando:

- [ ] O site está publicado no GitHub Pages.
- [ ] Home, Sobre, Projetos e Blog estão implementados.
- [ ] É possível criar posts e projetos apenas com Markdown/MDX.
- [ ] Frontmatter é validado.
- [ ] Tags e páginas dinâmicas funcionam.
- [ ] Hero 3D funciona com fallback.
- [ ] GSAP está integrado com animações acessíveis.
- [ ] SEO, sitemap, RSS e Open Graph funcionam.
- [ ] Tema claro/escuro funciona.
- [ ] Site é responsivo.
- [ ] Lighthouse atinge as metas definidas.
- [ ] Deploy automático está funcionando.
- [ ] README documenta setup, estrutura e publicação.

---

## 18. Spec Kit — Instruções de implementação

### 18.1 Comandos iniciais

```bash
npm create astro@latest portfolio -- --template blog --typescript strict --install --no-git
cd portfolio

npx astro add tailwind
npm install three gsap zod
npm install -D @types/three @astrojs/rss @astrojs/sitemap astro-icon lucide-astro
```

### 18.2 Configuração Astro

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://SEU_USUARIO.github.io",
  base: "/portfolio",
  trailingSlash: "never",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
```

**Atenção:** se o repositório for `usuario.github.io`, use `base: "/"`. Se for um repositório comum, como `portfolio`, use `base: "/portfolio"`.

### 18.3 Content Config

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(20).max(220),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z
      .object({
        src: z.string(),
        alt: z.string()
      })
      .optional()
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().min(3).max(120),
    summary: z.string().min(20).max(220),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    role: z.string().optional(),
    status: z.enum(["ideia", "em progresso", "concluído", "arquivado"]).default("concluído"),
    featured: z.boolean().default(false),
    repository: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    cover: z
      .object({
        src: z.string(),
        alt: z.string()
      })
      .optional(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string()
        })
      )
      .optional()
  })
});

export const collections = { blog, projects };
```

### 18.4 Regras de implementação

1. Comece pelo layout base, header, footer e tokens de design.
2. Implemente blog antes de Three.js.
3. Implemente projetos antes de animações avançadas.
4. Use `.md` por padrão.
5. Use `.mdx` apenas para embutir componentes.
6. Nunca importe Three.js em `BaseLayout`.
7. Carregue Three.js apenas em `Hero3D.astro`.
8. Use `client:visible` ou import dinâmico para Three.js.
9. Teste o site com JavaScript desabilitado.
10. Teste navegação apenas com teclado.
11. Rode Lighthouse após cada fase visual.
12. Não adicione bibliotecas sem justificativa de bundle.

### 18.5 Checklist de qualidade

- [ ] HTML semântico.
- [ ] Sem erros de contraste.
- [ ] Foco visível.
- [ ] Navegação por teclado funcional.
- [ ] Imagens com `alt`.
- [ ] Meta tags por página.
- [ ] Sitemap gerado.
- [ ] RSS gerado.
- [ ] Build sem warnings críticos.
- [ ] TypeScript sem erros.
- [ ] Lighthouse performance >= 90.
- [ ] Lighthouse accessibility >= 95.
- [ ] Three.js carregado apenas onde necessário.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Deploy automático validado.

---

## 19. Entregáveis finais

1. Repositório GitHub com código-fonte.
2. Site publicado no GitHub Pages.
3. Template de post Markdown.
4. Template de projeto Markdown.
5. Design system inicial em CSS/Tailwind.
6. Hero 3D funcional.
7. Sistema de animações GSAP.
8. Pipeline de CI/CD.
9. README com instruções de desenvolvimento e publicação.
10. Documentação de conteúdo e convenções de escrita.

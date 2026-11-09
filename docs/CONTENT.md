# Conteúdo como código

## Post

```yaml
title: 'Título do artigo'
description: 'Resumo entre 20 e 220 caracteres para SEO e listagens.'
pubDate: 2026-11-09T09:00:00-03:00
updatedDate: 2026-11-10T09:00:00-03:00 # opcional, nunca antes de pubDate
tags: [astro, dados]
draft: true
featured: false
toc: true
# readingTime: 5 # opcional; caso contrário, estimado em 220 palavras/min
# cover:
#   src: ../../assets/images/capa.jpg
#   alt: Descrição objetiva da imagem
social:
  - platform: linkedin
    url: https://www.linkedin.com/posts/SEU-POST
```

Use no frontmatter entre `---`. As plataformas aceitas são `linkedin`, `x`, `instagram`, `mastodon`, `other`. `publishedAt` é opcional em cada vínculo. Copie/adapte seu texto da rede para Markdown e vincule a versão social. Não há scraping, importação automática, publicação em redes ou necessidade de tokens de terceiros.

`canonicalUrl` é opcional e deve ser HTTP(S). Omita para que seu site seja a origem canônica. Se republicar um artigo cuja origem canônica deva permanecer em outro site, informe sua URL. RSS e navegação sempre apontam para sua página local; metadados e compartilhamento respeitam o canonical escolhido.

## Projeto

Use `npm run new:project`. Campos obrigatórios: `title`, `summary` (20–220 caracteres), `startDate`. O restante está no modelo e no schema. `status`: `ideia`, `em progresso`, `concluído`, `arquivado`. `description`, `endDate`, `role`, `repository`, `liveUrl`, `cover` e `metrics` são opcionais. `featured: true` inclui na seleção da home; `draft: true` mantém fora de todo build público. Projetos são ordenados por destaque, data e slug. Tags têm páginas estáticas de filtro.

## Contratos e publicação

- Nomes de arquivos kebab-case, sem subpastas. Mesmo slug `.md`/`.mdx` é rejeitado.
- Slugs `index`, `tag` e puramente numéricos são reservados para evitar conflito com paginação.
- Não use campo `slug` no frontmatter: o schema estrito rejeita campos desconhecidos.
- Tags ASCII kebab-case; máximo 12. Tags duplicadas são normalizadas.
- Datas inválidas, resumos curtos e alt ausente interrompem o build.
- Rascunhos e posts futuros não geram rota, tag, RSS, sitemap, recomendação ou card.
- Mesmo em desenvolvimento, rascunhos ficam ocultos. Para revisar, altere temporariamente `draft` e a data apenas no seu branch; não faça merge antes de estar pronto. Arquivos no GitHub público continuam públicos mesmo com `draft: true`.
- Listagem e arquivos de tags paginam em 12 itens. O sumário aparece com ao menos três títulos H2. Relacionados priorizam interseção de tags. Sem artigos/projetos, há estados vazios válidos.
- Renomear arquivo publicado quebra a URL. Crie uma página de redirecionamento estática se a mudança for necessária.

## Imagens e componentes MDX

Prefira imagens locais em `src/assets/images/` e referência relativa: `![Descrição](../../assets/images/imagem.jpg)`. Astro infere dimensões e otimiza imagens locais. Capas usam `Image`, widths e sizes. Caminhos `/images/...` em Markdown recebem o base path; arquivos em `public/` são copiados sem otimização, portanto prefira assets locais para evitar layout shift. HTML `<img>` cru é rejeitado: use Markdown ou `Figure`.

Em MDX, importe somente componentes confiáveis do repositório. MDX executa código durante build; não aceite arquivos MDX de fontes não revisadas.

```mdx
import Callout from '../../components/mdx/Callout.astro';
import Figure from '../../components/mdx/Figure.astro';
import image from '../../assets/images/imagem.jpg';

<Callout title="Nota">Uma observação útil.</Callout>
<Figure src={image} alt="Descrição da imagem" caption="Legenda opcional" />
```

Disponíveis: `Callout`, `Figure`, `CodeBlock`, `Details`, `ComparisonTable`, `VideoEmbed`, `ProjectCard` (recebe uma entrada tipada). `Tabs` oferece disclosures nativos acessíveis, sem depender de JS; você pode substituí-lo por tabs ARIA se o design exigir. Vídeos YouTube só criam iframe após clique. Mermaid não foi incluído (opcional no PRD).

## Personalização inicial

1. Edite `src/config/site.ts` e as páginas de Sobre/Currículo.
2. Substitua/remova os dois rascunhos de exemplo.
3. Troque a copy da home e `public/og.png`.
4. Revise a política de privacidade se ativar analytics ou outros serviços.

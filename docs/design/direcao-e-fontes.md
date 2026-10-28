# Direção e fontes — primeira versão

A página é uma folha de gravura: a trajetória que atravessa vendas, desenvolvimento e IA se traduz em planos que se abrem, mantendo cada traço visível. Direção escolhida: page-is-the-object. A folha e os recortes vêm do briefing; as regras genéricas da skill sobre sombras e linhas cedem a essa escolha explícita.

Paleta: papel #ffffff, tinta #151515, plano #f2f2ef, secundário #575754; versão inversa em preto. Sem acento colorido obrigatório. Tipografia: Cormorant Garamond para nome e títulos, Manrope para leitura e navegação. Fontes hospedadas localmente, fallback Georgia e sans-serif.

Argumento: quem é e o que faz → projetos públicos verificáveis → trajetória e método → arquivo de publicações em preparação → contato real. A gravura é o elemento de interação; abrir suas camadas revela o desenho. Não esconder conteúdo atrás de efeitos.

Fontes lidas: index.html/css/js/md; inspiracoes.md; guia-dominio-porkbun.md; textos e catálogo do pacote-codex.tar.gz; exports Maquete Manual/Gerador.dc.html, code.jsx, SVG e previews PNG. Os exports exigem support.js e motor/maquete-motor.js ausentes. O novo SVG e motor são originais para este site.

Dados: bio e experiência geral do rascunho etapa2-estrutura-voz.md. Datas marcadas CONFIRMAR e detalhes familiares omitidos. Não foi encontrado currículo separado, fundacao-identidade.md ou portfolio-schema.yaml. Domínio trajanogui.com é explicitamente um exemplo no guia; wiseforge.pro aparece como candidato. Nenhum domínio configurado.

Projetos verificados pela API pública do GitHub e README em 2026-10-26:
- https://github.com/TrolljanO/sdd_vibe_converter — assistente que organiza ideias em especificações; Python/FastAPI e React. As métricas do README não foram reproduzidas e não são usadas.
- https://github.com/TrolljanO/micro-rag-jump — perguntas e respostas em documentos sobre estoques; Python/FastAPI e FAISS. Nenhuma chamada a LLM ou backend efetuada.
- MYWEBPG — o próprio site, em construção.

Links de contato provenientes dos materiais: LinkedIn /in/trajanogui, GitHub /TrolljanO e X /Gui_Trajano. Sem e-mail inventado.

Arquivo editorial vazio: nenhum post externo importado. Currículo desta versão é um resumo imprimível dos dados disponíveis, a revisar antes de publicar. Descrições dos projetos se baseiam na documentação pública; não afirmam qualificação operacional.

## Atualizações de execução

Usuário confirmou domínio comprado WiseForge, ainda sem decisão de uso. Reforçou criação original com execução profissional; materiais antigos são referência factual, não layout a copiar.

A primeira gravura procedural ficou simples demais na inspeção visual. A composição final combina SVG com duas ilustrações PNG transparentes geradas por imagegen: onda de traços finos e cenário de monte Fuji/pinheiro. O SVG separa céu, montanha, pinheiro e duas ondas em planos com paralaxe e abertura. Trata-se de movimento de planos; os contornos internos de cada PNG ainda não são vetores individualmente animáveis. Crédito de IA aparece na legenda. PNGs originais preservados no workspace.

Prompts de geração (resumo fiel): onda ukiyo-e em traços finos pretos, superfícies de papel branco, fundo transparente, sem volume espesso, sem textura de fundo, sem texto; monte Fuji com pinheiro japonês, hachuras finas, recortes brancos, fundo transparente, sem ondas ou edifícios. Ferramenta integrada imagegen.

Exceções justificadas ao inspector genérico: linhas e caixas representam folhas recortadas solicitadas; imagens vetoriais/conceituais substituem fotografias pessoais inexistentes; pequenos textos dentro das ilustrações são legendas de composição; animação concentrada nas folhas, com opção de pausa, em vez de mínimo arbitrário de elementos em movimento. Rótulos dos projetos indicam seu tipo. Não há vídeo-fonte adequado nem motivo para adicioná-lo como decoração.

Revisão independente: corrigidos foco invisível na seção invertida, contraste de impressão no tema escuro e caminhos da página 404 (base raiz, adequada a domínio dedicado; GitHub Pages em subdiretório exige ajustar base antes do deploy).


## Implementação consolidada — 2026-10-26

A identidade foi ampliada por decisão do usuário: software, dados, IA e experiência de negócio; AEC é uma das aplicações. Site completo primeiro, depois profundidade da arte. WiseForge não determina a marca e o domínio segue sem configuração.

Conteúdo separado em Markdown com frontmatter YAML. Templates compartilhados geram home, dois casos, currículo, privacidade, arquivo e 404 em dist/. As antigas páginas geradas na raiz foram removidas para evitar duas versões divergentes. Curadoria manual de publicações; nenhum texto do Second Brain foi acessado ou publicado. Datas profissionais não comprovadas continuam omitidas.

A hero usa o motor Maquete (papercut procedural): presets `ukiyo` e `porcelana` em `assets/motor/maquete-kittiwake.js`, render em `scripts/render-engraving.mjs` → `assets/engraving.svg`. Substitui o pipeline imagegen/vetorização/`compose-engraving.py` para a abertura. Detalhes em `docs/design/maquete-kittiwake.md`. O pacote Grok em `pacote-codex/` permanece referência de conteúdo e DS técnico laranja, não da arte da home.

Fontes WOFF2 com caracteres latinos/portugueses e setas: Cormorant 89.768 bytes e Manrope 29.596 bytes. Os originais e licenças são preservados. Sem dependências externas no navegador. Arte inline e thumbnail compartilham definições SVG; PNGs de estudo não entram no pacote público.

A aprovação estética final continua sendo uma avaliação do usuário, distinta de checks funcionais. A ausência de vídeo é intencional; não há fonte de vídeo necessária ao conteúdo.

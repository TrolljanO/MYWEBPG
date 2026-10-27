# Hero papercut construída pelo motor Maquete

## Objetivo e limites

Criar uma primeira dobra de ponta a ponta com nuvens ornamentais em preto, branco e cinza, construídas em folhas SVG independentes pelo motor existente. Integrar navegação, nome, apresentação e ação principal aos espaços livres da composição.

Preservar os textos e as seções posteriores. Não acrescentar animais, ondas, montanhas ou medalhões nesta rodada. Não publicar o site. A primeira entrega será estática, com geometria preparada para movimento; a animação depende da avaliação visual.

## 1. Construção da arte

- Usar `assets/motor/maquete-kittiwake.js` como extensão do motor, preservando o preset `gravura`. Acrescentar o preset `hero-nuvens` e um gerador próprio de folhas ornamentais.
- Usar o padrão de nuvens aprovado como referência de **silhueta, espirais e recortes internos**. Os estudos de ondas orientam somente espessura, sobreposição e revelação entre folhas.
- Construir um motivo vetorial mestre com curvas Bézier: lóbulos arredondados, pontas espiraladas e cinco folhas encaixadas. Cada folha terá áreas sólidas e aberturas reais; linhas desenhadas não substituirão os vazados.
- Gerar a geometria mestre uma vez por nuvem. Derivar todas as folhas dessa geometria, com offsets controlados e continuidade nas pontas. Não sortear contornos diferentes em cada profundidade nem simular camadas reduzindo a escala da silhueta inteira.
- Fixar a semente inicial em `2718`. A semente controla pequenas variações de posição, escala e espelhamento; nunca altera a identidade de uma nuvem entre suas folhas.
- Empilhar fundo e cinco planos de papel, do carvão ao branco. Aplicar sombras curtas para baixo e à direita, coerentes com luz superior esquerda. Evitar espessura de papelão, relevos arredondados e textura raster.
- Preservar o contrato do motor — caminhos, linhas, dimensões e camadas. Não adicionar dependências nem modificar o design system de referência.

**Primeiro artefato de revisão:** uma nuvem isolada, em repouso e com as mesmas folhas separadas para inspeção. Comprovar que as aberturas revelam desenho inferior antes de integrar a hero.

## 2. Composição e integração

- Criar dois enquadramentos explícitos com os mesmos motivos: desktop `1440 × 900` e celular `375 × 850`. Tablet usa o enquadramento desktop com redistribuição das bordas, sem comprimir a área de leitura.
- Desktop: massas ornamentais nos cantos e laterais, com maior presença na direita e na base. Reservar aproximadamente os 55% centrais para conteúdo; manter margem segura entre os recortes e os textos.
- Celular: concentrar nuvens no topo, na base e nas bordas externas. Reservar uma coluna central com pelo menos 24 px de margem lateral. Permitir crescimento vertical conforme o conteúdo.
- Fazer o espaço de leitura nascer da disposição dos motivos. Remover o PNG de fundo e o grande painel branco arredondado introduzidos na tentativa anterior.
- Manter texto e controles em HTML, fora dos SVGs decorativos. Cormorant no nome, Montserrat local no corpo e na navegação; corpo de 18 px, controles de pelo menos 14 px e alvos de toque de 44 px.
- Ampliar o exportador existente para emitir SVGs distintos por enquadramento, com IDs exclusivos. Incluir somente os assets necessários no build de `dist/`.
- Remover o expansível criado na tentativa anterior. Preservar a gravura antiga como asset e manter a miniatura do projeto funcionando; os links de exploração apontam para a nova composição, sem links quebrados.
- Manter as folhas identificadas para futura ligação a `Maquete.animar()`. Nesta etapa, não ativar paralaxe, respiro ou dobradura e não exibir controles de movimento sem função.

## 3. Verificação e avaliação visual

- Verificar determinismo: configuração e semente iguais produzem geometria idêntica.
- Verificar cinco folhas reais, caminhos finitos, vazados, IDs únicos e ausência de imagens raster dentro da nova arte.
- Inspecionar a nuvem isolada antes de compor a página: espirais contínuas, folhas finas, recortes legíveis e desenho inferior presente.
- Executar build, checker e testes existentes uma vez após a integração. Repetir apenas os checks afetados por correções.
- Inspecionar a hero em 375, 768 e 1440 px, temas claro e escuro, teclado e zoom de 200%. Confirmar contraste, acentos, título legível, ação acessível e ausência de sobreposição ou overflow na área alterada.
- Registrar separadamente falhas preexistentes fora do escopo. Não usar testes aprovados como prova de aprovação estética.
- Entregar capturas desktop e celular, além da nuvem isolada. Limitar a rodada a uma composição e uma correção visual orientada pelos problemas observados; não gerar alternativas indefinidamente.

**Critério de aceite visual:** a profundidade deve existir dentro das nuvens e de seus ornamentos; a hero deve parecer composta com folhas recortadas, com o conteúdo integrado aos espaços livres.

## 4. Salvar e entregar este plano no GitHub

Esta é a entrega solicitada agora; a implementação acima fica para uma execução posterior.

- Salvar em `docs/superpowers/plans/2026-10-27-hero-papercut-motor.md`.
- Revisar somente esse arquivo e fazer commit exclusivo dele, sem incluir alterações anteriores, arquivos staged, imagens ou implementação.
- Mensagem: `docs: plan motor-driven papercut hero`.
- Destino: `TrolljanO/MYWEBPG`, branch de documentação `docs/hero-papercut-plan`, baseada na `main` remota. A branch local `TrolljanO/kittiwake` contém commits não publicados e deve permanecer intacta.
- Antes do push, verificar os commits pendentes para não enviar trabalho alheio junto. Não usar force push.
- Confirmar o hash remoto e entregar o link do plano no GitHub.

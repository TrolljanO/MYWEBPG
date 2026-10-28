# Achados — performance

Medição em 2026-10-28 no dist servido em `http://127.0.0.1:4174/` (`/tmp/kittiwake-review/dist`). Chromium headless via CDP, cache desligado. Viewports: 1440×900 e 390×844. O servidor é `SimpleHTTP/0.6` e não envia `Content-Encoding`. CLS observado desde o início da navegação: 0 após o load e 0 depois de uma rolagem de 6000 px. C1 fica confirmado na contagem e nos atributos; o número de bytes não. C2 fica confirmado nos mortos que nomeia; o par bege não compartilha hash.

| ID | Sev | Achado | Evidência | Regra | Onda |
|---|---|---|---|---|---|
| PERF-1 | P2 | C1 estima ≈2,3 MB de PNG decorativo na home. Os 18 `<img>` somam 2845172 B (2,71 MiB); os 17 `.cut` somam 2663532 B (2,54 MiB). A carga fria da home transfere 3304208 B, dos quais 2850572 B são essas imagens. | `/tmp/kittiwake-review/dist` 2845172 B nos 18 PNG citados em `index.html:22`, `:27`, `:36`, `:41`, `:45`; `performance.transferSize` 3304208 B (documento 13474 B, corpo 13174 B) | awwwards §6 performance | performance |
| PERF-2 | P2 | Nenhum dos 66 arquivos do dist compartilha SHA-256. O fundo que C2 chama de duplicado, `assets/gravura/koi/beige-background.png`, tem 813408 B e 1095×1336; o fundo usado na home, `assets/gravura/koi-school/beige-background.png`, tem 884646 B e 1094×1341. | SHA-256 `d054969e7a3a718a63a037c4eefaa9e9897da4376ea9ebebc446a67916ad6aed` e `56369a8776c3e2c320e2f7fe6890ca16e805a150f1ea1068237c90901df23d7d`; 66 arquivos, 66 hashes, 0 grupos | higiene | build |

## Imagens da home

Dezoito `<img>` nos dois viewports. Nenhum tem `loading`, `width`, `height` ou `decoding`. Nenhum tem `srcset`. Os 17 `.cut` computam `drop-shadow(rgba(21, 21, 21, 0.16) 6px 10px 0px)` (`index.css:1364`); `.print-thumbnail` computa `filter: none`. O byte size é o tamanho do arquivo no dist (o corpo transferido de cada PNG coincidiu com esse número). A rede foi capturada uma vez, na carga fria em 1440×900; em 390 os `src` são os mesmos.

A exibição de `.print-thumbnail` a 766,51 px em 1440 confirma B5. A sombra dos `.cut` permanece de propósito.

```
src                                                                 bytes   natural    disp 1440×900    disp 390×844    fit
assets/gravura/pagoda/mountain-peaks-1.png                         181936  505×401    680×539,95       249,59×198,19   fill
assets/gravura/pagoda/mountain-peaks-2.png                          41041  241×176    280×204,47       117×85,44       fill
assets/gravura/pagoda/stylized-clouds-1.png                         64825  446×184    340×140,27       140,39×57,91    fill
assets/gravura/pagoda/stylized-clouds-2.png                         88396  587×187    280×89,19        117×37,27       fill
assets/gravura/pagoda/pagoda-temple.png                            138966  351×438    240×299,48       101,39×126,52   fill
assets/gravura/koi-school/beige-background.png                     884646  1094×1341  1440×640         390×640         cover
assets/gravura/koi-school/concentric-water-ripples-1.png           123373  239×267    280×312,80       124,80×139,41   fill
assets/gravura/koi-school/concentric-water-ripples-2.png           114997  231×256    260×288,13       117×129,66      fill
assets/gravura/koi-school/white-koi-fish-1.png                     112045  305×415    180×244,91       93,59×127,34    fill
assets/gravura/koi-school/orange-koi-fish-1.png                    107615  235×434    160×295,48       85,80×158,44    fill
assets/gravura/koi-school/black-koi-fish.png                        61461  230×294    140×178,95       70,19×89,70     fill
assets/gravura/koi/orange-koi-fish.png                             181640  330×513    766,51×392,20    371×318         cover
assets/gravura/sakura/cherry-blossom-tree.png                      601153  666×652    460×450,33       187,19×183,25   fill
assets/gravura/sakura/falling-petals-1.png                           1131   26×23      42×37,14         42×37,14       fill
assets/gravura/sakura/falling-petals-15.png                          1472   35×22      42×26,39         42×26,39       fill
assets/gravura/sakura/falling-petals-36.png                          1320   29×23      42×33,30         42×33,30       fill
/assets/gravura/sakura/exposed-roots.png                            66942  425×147    420×145,27       179,39×62,05    fill
/assets/gravura/sakura/mossy-ground.png                             72213  690×135    520×101,73       226,19×44,25    fill
```

Em 390 o viewport mediu `scrollWidth` 390. O mesmo PNG da árvore (601153 B, 666×652) aparece a 187,19×183,25. O fundo bege (884646 B) ocupa a caixa 1440×640 em 1440 e 390×640 em 390, com `object-fit: cover` (`index.css:1372`).

## Transferência da home

`performance.transferSize` soma 3304208 B: documento 13474 B (corpo 13174 B, igual a `Content-Length`) mais 28 sub-recursos. A soma `Network.loadingFinished.encodedDataLength` deu 3300996 B em 29 respostas, todas HTTP 200. Não houve pedido falho. Montserrat entra nessa carga: `assets/fonts/montserrat.ttf` 149168 B de corpo (`index.css:1216`), na ordem dos 145 KiB de C3.

Fora as imagens, o restante transferido é 453636 B (HTML, CSS, JS, três fontes e o favicon).

## Dist sem referência em HTML ou CSS

O dist tem 66 arquivos e 6179358 B no disco. Há 37 PNG em `assets/gravura/`. Estes 29 caminhos não aparecem no HTML nem no CSS. Os três SVG e o bege de `koi/` confirmam os nomes e os tamanhos de C2 (hero-desktop 520742 B, hero-mobile 486537 B, engraving 3161 B, bege 813408 B). `assets/social-card.png` (68000 B) tem assinatura JFIF (`FF D8 FF E0`).

```
404.html                                                         2856
assets/engraving.svg                                             3161
assets/fonts/cormorantgaramond-OFL.txt                           4387
assets/fonts/manrope-OFL.txt                                     4387
assets/fonts/montserrat-OFL.txt                                  4400
assets/gravura/koi/beige-background.png                        813408
assets/gravura/koi/ripples/concentric-water-ripples-1.png      122240
assets/gravura/koi/ripples/concentric-water-ripples-2.png      114813
assets/gravura/koi/ripples/concentric-water-ripples-3.png       54857
assets/gravura/koi/ripples/concentric-water-ripples-4.png       43386
assets/gravura/koi/ripples/concentric-water-ripples-5.png       33141
assets/gravura/koi/ripples/concentric-water-ripples-6.png       30165
assets/gravura/koi/ripples/concentric-water-ripples-7.png       48745
assets/gravura/koi-school/concentric-water-ripples-3.png        43818
assets/gravura/koi-school/orange-koi-fish-2.png                 49901
assets/gravura/pagoda/mountain-peaks-3.png                      54054
assets/gravura/pagoda/staircases.png                             4631
assets/gravura/pagoda/stylized-clouds-3.png                     21872
assets/gravura/sakura/falling-petals-22.png                      1263
assets/gravura/sakura/falling-petals-4.png                       1360
assets/gravura/sakura/falling-petals-8.png                        714
assets/gravura/sakura/pink-flowers.png                           3578
assets/gravura/sakura/soft-pink-background.png                 210911
assets/gravura/sakura/twisted-trunk.png                        110037
assets/hero-desktop.svg                                        520742
assets/hero-mobile.svg                                         486537
assets/social-card.png                                          68000
manifest.json                                                    2845
sitemap.xml                                                       466
```

`404.html` é a página de erro. `manifest.json` lista os assets, e essa lista não conta como referência de HTML ou CSS. A soma desses 29 arquivos é 2860675 B. Nenhum deles entrou na carga da home.

## Checagem do focus-5

Confirmado, e fora desta tabela: em 1440×1400 com `documentElement.style.zoom = 2`, `scrollWidth` 1447 e `innerWidth` 1440 (delta 7). A amostra de `.cut` sobre texto em `.wrap` voltou vazia. Os nós que passam de `innerWidth` e alargam o documento são `.contact-copy`, o `p`, o `a.button` e `.inline-links` dentro de `index.html:42`, cada um com `right` 1447. Três recortes absolutos pintam além da viewport (`.mtn-side` right 1526,4; `.sakura-tree` 1497,6; `.ripple-b` 1468,8) e não entram no `scrollWidth`. focus-1 e focus-2 não foram remedidos: continuam o B6.

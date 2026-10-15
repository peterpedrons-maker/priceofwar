# Raridades das cartas (PLANO do dono, rodada 26; ainda NÃO implementado)

O sistema de raridade ainda não existe no jogo. Hoje a abertura de booster usa rótulos provisórios (Comum / Rara = custo 3 ou mais / Full Art), só para a legenda.

## Cartas padrão (moldura amarela dos soldados, prata das Táticas/equipamentos, champanhe das Emboscadas: as cores se mantêm)
| Raridade | Efeito visual |
|---|---|
| **Comum** | chapada, sem brilho nenhum |
| **Rara** | só a **arte** (o miolo) brilha um pouco; bordas e nome não |
| **Ultra rara** | brilha a arte **e as letras do nome** (cor diferenciada só nas letras, não no container; como no Yu-Gi-Oh) |

## Cartas Full Art
| Raridade | Efeito visual |
|---|---|
| **Comum** | a Full Art normal, sem brilho |
| **Rara** | como a arte cobre a carta inteira, brilham **só as letras do nome** |
| **Ultra rara** | a carta inteira brilha (holográfico na frente, como no visualizador 3D) |

## Regras gerais
- O **verso** (backplate) é igual em todas as cartas e **nunca brilha**.
- **Futuro (só planejado, não fazer agora):** cartas **Secretas** de Full Art: outra Full Art, com outra arte e brilhos ainda melhores. Exigem imagens novas; deixar o campo previsto (`rarity: 'secreta'`) quando o sistema for feito.
- Onde vai mexer: campo `rarity` na carta (dados, não código por nome), sorteio dos boosters (`rollBooster`), efeito de brilho em `CardFace*` (máscara da arte, máscara do nome), `CardViewer3D` e `src/boosterOpen3d.ts` (cor do halo por raridade).

## Implementado (rodada 26, 2ª parte)
- `src/rarity.ts`: tipos (`comum`/`rara`/`ultra`/`secreta`), probabilidades por cópia (`RARITY_ODDS`: padrão 72/24/4 %, Full Art 70/22/8 %; **toda carta pode vir em qualquer raridade**), `shineOf` (o que brilha em cada caso) e a numeração de coleção `cardCode(nome, raridade)` = `0032UR` (número = posição no catálogo `CARD_DEFS`; **carta nova entra no FIM da lista**, senão os números mudam; o sufixo é C, R, UR ou S).
- Booster: `rollBooster` sorteia a raridade de cada cópia; a melhor cópia (raridade, depois Full Art, depois custo) é a última revelada e, se for Ultra rara, tem o momento grande. **Sem legenda**: quem avisa é só o efeito visual.
- Coleção: `store.rarities[nome] = { rara, ultra, secreta }` conta as cópias não comuns (o total continua em `collection`); fica só neste aparelho, **ainda não sincroniza com a nuvem**.
- Na carta (`CardFace`, mão e zoom): brilho da arte (`.rar-art-shine`), letras do nome com degradê animado (`.rar-name`) e o número pequeno embaixo no centro. Brilho da carta inteira (Full Art ultra) recortado pela silhueta real. Teste: `?debug&rar=ultra` põe a raridade nas cartas da partida.
- Na abertura 3D (`boosterOpen3d.ts`): o mesmo brilho em shader (máscara da arte, das letras do nome por contraste com a placa, ou da carta toda), que fica ligado depois da revelação.
- **Livro de coleção (rodada 26):** agrupa por número (0001…). O slot mostra a MAIOR raridade que o jogador tem, com o código (`0005UR`) e o total de cópias (×N); carta que não tem fica como `?` + número. Se tem mais de uma versão, o toque abre a folha "versões" (cada versão com código, raridade e quantidade) e dali vai ao 3D. `CollectionRoom` recebe `stock()` (lido de `loadDeckStore`: comum = total − rara − ultra − secreta). O botão "VER TUDO (TESTE)" finge a coleção completa em todas as versões.
- **Editor de deck por versão:** na Reserva e no Deck, cada versão é um grupo próprio (3 Trabucos comuns agrupados ×3; o raro aparece à parte ×1). `slot.rar[nome] = { rara, ultra, secreta }` guarda quantas cópias do deck não são comuns (o resto de `slot.cards[nome]` são comuns; o motor e a nuvem só veem os totais). "Preencher automático" usa as comuns primeiro. A raridade ainda não chega à partida (só o editor mostra).
- **Falta (próximo):** mostrar na partida a versão escolhida do deck (hoje cosmético só no editor); sincronizar `rarities` e `slot.rar` na nuvem; os mini-cartões do tabuleiro ainda não brilham; Secretas.

## Probabilidades (revisadas, nível TCG)
Pesquisa: Pokémon (Surging Sparks): Ilustração Rara ~1 a cada 13 pacotes, Ultra Rara ~1 a cada 15, Especial ~1 a cada 87, Hiper ~1 a cada 189; uma Especial específica chega a ~1 em mais de mil pacotes (Black Bolt/White Flare). Yu-Gi-Oh: ~4 Ultra e ~2 Secret por caixa de 24 pacotes (Ultra ~1 a cada 6 pacotes, Secret ~1 a cada 12; oficiais não são publicados).
No jogo (`src/rarity.ts`, por cópia; booster de 5): padrão Rara 3,5 % e Ultra 0,25 %; Full Art Rara 12 % e Ultra 3 %; e só **1 pacote em 8 traz uma Full Art** (antes elas eram sorteadas como qualquer carta). Simulado: Rara ou melhor ≈ 1 pacote em 5, **Ultra rara ≈ 1 pacote em 60**, Full Art ≈ 1 em 8.

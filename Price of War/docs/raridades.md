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

# Efeitos por tipo

Nenhuma carta tem código próprio. O catálogo (`src/engine/catalog.ts`) descreve **o que cada carta faz** com um vocabulário
fixo de **tipos de efeito**; o motor (`game.ts`), a IA (`ai.ts`) e a tela (`App.tsx`) só conhecem esses tipos, nunca o nome de uma
carta. Criar uma carta nova = combinar tipos que já existem (e, só quando aparecer uma regra realmente nova, ensinar um tipo novo ao motor).

Uma carta tem três coisas, todas opcionais:

| Campo | O que é |
|---|---|
| `abilities` | habilidades: **quando** (`on`) acontece + **o que** acontece (`do`, uma lista de tipos de efeito) |
| `passives` | o que ela faz sozinha enquanto está em campo (auras e marcas) |
| `faction` | só nos Generais: a "tendência" (usada por efeitos que comparam Generais) |

Os gatilhos do vocabulário do jogo (`trigger`: Convocação, Ofensiva, Queda, Manobra, Comando, Postura, Reforço) são só o **rótulo**
que aparece na carta; quem faz a regra são as habilidades abaixo. Um teste (`engine-rules`) confere que o rótulo e os efeitos combinam.

## Quando (`on`)

| `on` | Quando acontece | Exemplo de uso |
|---|---|---|
| `play` | Tática jogada da mão (`phases`: fases **extras** além de Preparação; Táticas valem também na Movimentação) | Dízimo de Guerra, Balestra |
| `ability` | habilidade ativa, tocada por quem joga (`phases`, `once`, `cost`) | Mercador, Hospitalário, General Cardeal |
| `place` | a carta entrou em campo | Barão da Procissão (convoca fichas) |
| `attack` | a carta atacou | Fanático (+ATK), Jorge (dano atrás) |
| `after_attack` | logo depois de atacar e sobreviver | Batedor (movimento grátis) |
| `destroyed` | a carta caiu | Vigia do Último Salmo (compra 2) |
| `move` | a carta se reposicionou | Capitão de Formação |
| `healed` | a carta foi curada | Noviço Renascido (+1 ATK) |
| `turn_start` / `turn_end` | início / fim do turno do dono | Intendente / Aurelion, Soldado Tático |
| `front_fell` | a carta da frente da coluna caiu | Sentinela do Claustro (Reforço) |
| `ambush` | Emboscada ativada | as quatro Emboscadas |

## O que (tipos de efeito, `do`)

**Recursos:** `gold {amount}` · `draw {amount}` · `refill_hand {to}` · `extra_moves {amount}`

**Dano e cura:** `damage {amount, target | all:'enemy'}` (uma unidade, uma fileira ou todas as inimigas + General) ·
`heal {amount, target, withAuras?}` (`withAuras`: soma os bônus de cura, como o Cálice)

**Atributos e proteção:** `buff {atk?, hp?, target?}` (sem `target`: a própria carta) · `equip {atk?, hp?, target}` (fica presa à unidade) ·
`guard_adjacent {amount, target}` · `buff_adjacent {atk}` (até o próximo turno do dono) · `buff_moved {count, atk, hp}` ·
`reinforce {shield}`

**Posição:** `retreat {heal, target}` · `displace {target}` · `swap_adjacent` · `free_move`

**Cartas:** `look_top {count, keepMin, keepMax, rest?}` (`rest: 'graveyard'`: o que não fica vai para o cemitério em vez do fundo) · `search {zone:'deck'|'graveyard', filter}` ·
`summon_deck {max, filter}` · `summon_token {token}`

**Combate:** `attack_bonus {amount, ifEnemyGeneral?}` · `splash_behind {amount}`

**Emboscada:** `cancel_attack {ifAdjacentAlly?}` · `swap_defender` · `displace_attacker` · `buff_defender {atk, hp}`

### Alvos (`target`)
`{ side: 'own'|'enemy', area: 'unit'|'row', where?: 'front'|'back', types?: [...], needs?: 'moved'|'damaged', optional?, prompt }`.
Cada efeito com `target` pede uma escolha no tabuleiro, na ordem em que aparecem (a 1ª vai em `target`, a 2ª em `target2` da ação).
`optional`: só é exigido se alguma unidade serve (a habilidade precisa de pelo menos um alvo válido). `prompt` é a frase mostrada ao jogador.

### Passivas (`passives`)
- `aura { who, from?, when?, atk?, combatHp?, reduce?, healBonus?, attacks? }`: bônus para quem casa com `who`
  (`self`, `own` ou `enemy`, com `row`, `types`, `slots`, `facing`). `from`: só vale com a carta nessa fileira; `when`: só nessa coluna.
  `atk` ataque · `combatHp` vida extra só no combate · `reduce` dano sofrido a menos · `healBonus` cura do General · `attacks` ataques extras por turno.
- `flag { flag, from? }`: `row_swap` (troca com qualquer um da fileira) · `blocks_ambush` (o adversário não usa Emboscadas contra o seu ataque) ·
  `locks_general` (se o General sofre dano, ele não usa a habilidade no próximo turno).

## Como criar uma carta

1. Escolha os tipos de efeito que descrevem a carta. Exemplo — "Tática, custo 2: cause 2 de dano a uma unidade inimiga e compre 1 carta":
   ```ts
   { name: "Golpe Sagrado", cardType: "Tática", atk: 0, hp: 0, cost: 2, effect: "Cause 2 de dano a um inimigo e compre 1 carta.",
     abilities: [{ on: 'play', do: [
       { kind: 'damage', amount: 2, target: { ...ENEMY_UNIT, prompt: 'Escolha o inimigo que recebe 2 de dano.' } },
       { kind: 'draw', amount: 1 },
     ] }] },
   ```
   *(uma Tática pede no máximo uma escolha no tabuleiro; habilidades de unidades (`ability`) podem pedir duas, como o Samaritano de Aço.)*
2. Coloque a carta num baralho (`DECK_RECIPES`) e a arte em `App.tsx` (mapa de arte por nome).
3. Rode `npm test`: o teste do catálogo confere que a descrição está completa e as partidas IA×IA exercitam a carta (a IA joga qualquer
   Tática pelos tipos de efeito dela, sem código novo).

Se a carta precisar de uma regra que nenhum tipo cobre, o certo é **criar um tipo novo**: declare-o em `types.ts` (`Verb`), ensine
`runVerb` em `game.ts` a executá-lo e, se for uma Tática, dê um critério de uso em `ai.ts` (`tacticPlay`). Aí ele vale para todas as cartas futuras.

## Manutenção, dispensa e Relíquia com modos (experimental)
Usados pelo deck Mercenários (cartas no `catalog.ts`, receita em `DECK_RECIPES.mercenarios`; `src/engine/experimental.ts` só reexporta o que o laboratório usa). Tudo em dados:
- `CardDef.upkeep` (ouro por turno) e `dismiss: 'hand'` (ao ser dispensada, a carta volta para a mão em vez de ir ao cemitério). Na fase de Suprimentos, depois do ouro do turno, o motor abre `pending: { kind: 'upkeep', entries, discount }` e o dono responde `{ type: 'upkeep', keep: [ids] }`: as que ficam pagam a soma da manutenção menos o desconto; as outras são dispensadas.
- `on: 'dismissed'` (Rescisão): efeito de quem foi dispensado; só verbos sem escolha de alvo (`draw`, `gold`...).
- `CardDef.modes` (Relíquia): cada modo é `{ id, name, effect, upkeepFlat?, loot?: { gold, cap }, atk? }`. A Relíquia entra no primeiro modo e o dono troca com `{ type: 'relic_mode', mode }` só na Movimentação (fim do turno); vale até o fim do turno seguinte. `upkeepFlat` abate do total de manutenção; `loot` dá ouro por unidade inimiga destruída (teto por ciclo, `PlayerState.loot`); `atk` dá ATK às cartas com manutenção. O modo fica em `Card.mode`.
- A IA (`ai.ts`) responde à manutenção (`upkeepAnswer`) e escolhe o modo (`wantedRelicMode`).

## O que não é efeito
- A tela tem fluxos próprios só para *como pedir* os alvos (qual toque vem primeiro), nunca para *o que a carta faz*.

## Cardeal Anselmo (rodada 20): peças de motor novas
- Aura `abilityUses` (Cálice das Duas Bênçãos): soma usos extras da habilidade do General (`maxGeneralAbilityUses` em `rules.ts`).
- Gatilho `ally_healed`: roda na carta vizinha quando um aliado é curado (Paladino do Alvorecer).
- Verbo `buff_self_temp`: +ATK até o início do próximo turno do dono.
- `equip` com `block: true` concede Guarda (Couraça do Mártir).
- `GameState.statOverrides` (só tutorial): números fixos por nome de carta.

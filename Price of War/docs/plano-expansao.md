# Plano de expansão: facções, mecânicas, cartas e boosters (diagnóstico, rodada 26; NADA implementado)

Pedido do dono: analisar o código antes de qualquer carta nova, a partir de uma proposta de 10 facções feita por outra IA. **[Fato]** = confirmado no código/medições; **[Inferência]** = leitura minha; **[Proposta]** = o que eu faria. Nenhum código foi alterado.

## 1. Estado atual (fatos)
- 4 decks de 50 cartas: Capitão (24 cartas diferentes), Cardeal (30), Mercenários (23), Campo (29). Catálogo: 115 cartas (32 Infantaria, 12 Cavalaria, 7 Arqueiro, 1 Artilharia, 40 Táticas, 9 Emboscadas, 5 Relíquias, 5 Terrenos, 4 Generais). Limite de cópias: 22 cartas com 1, 26 com 2, 67 com 3.
- Efeitos 100% em dados (`catalog.ts`): ~30 verbos (`Verb`) e 14 gatilhos (`AbilityOn`). Regra nova = verbo/gatilho novo em `types.ts` + `game.ts` (+ critério em `ai.ts` se for Tática).
- Todas as mortes passam por **um funil**: `sendDestroyed` (`game.ts:137`). Cemitério é uma zona; `search zone:'graveyard'` leva carta **para a mão** (nunca para o campo).
- Emboscada **não fica armada no tabuleiro**: fica na **mão** e o defensor é perguntado quando um ataque o atinge (`pending.kind === 'ambush'`, `game.ts` ~833); a mão é redigida em `view.ts`, então a informação escondida já é de graça.
- Combate: corpo a corpo com inimigo à frente só acerta a coluna da frente; **Arqueiro/Artilharia e corpo a corpo com a frente livre olham 3 colunas** (`getValidAttackTargets`, `rules.ts:230`). Fases: Combate vem **antes** de Movimentação (não existe "mover e atacar" no mesmo turno).
- Medido (IA × IA, 300 por confronto): vitória média Campo 61%, Mercenários 50%, Capitão 48%, **Cardeal 41%** (pior confronto Cardeal × Campo 26×74); quem começa vence 47%; partida média 8,2 rodadas (63% passam da 6ª). **Cardeal e Capitão são os decks iniciais** (decisão do dono).
- Boosters: 1 por facção, 5 cartas, peso por custo (6/4/2/1) e **a última sempre custo ≥ 3**; o pool repete cada carta pelo nº de cópias, então única/forte é naturalmente rara. Raridade (72/24/4, Full Art 1 pacote em 8) é **só visual**, qualquer carta pode vir em qualquer raridade, o motor não conhece raridade. `TEST_FREE_BOOSTERS = true` (boosters grátis e sem fim); abertura no cliente; sem compensação de repetidas nem proteção contra azar (economia 150 coroas / repetidas 5-15-50 já decidida, ainda não ligada).

## 2. As quatro facções existentes
- **Capitão** [Fato]: movimento importa de verdade: General dá +2/+1 a quem se moveu (`buff_moved`), Batedor/Escolta (`free_move` após atacar), Passo Cadenciado, Cavaleiro Tático (`row_swap`), Tenente (compra ao mover). Lacuna: quase nada recompensa **formação** (colunas/vizinhos): só 2 `buff_adjacent`, 1 `guard_adjacent` e o Campo de Treino. 10 cartas novas já entraram na rodada 23 (8 só nos boosters).
- **Cardeal** [Fato]: a **cura é rala**: o verbo `heal` aparece em 2 cartas no catálogo inteiro (+ General, Cálice, `retreat`+cura); o deck tem 10 cópias de Cavalaria e 21 Táticas (busca, dano, equipamento). Sem resposta forte contra cura (só `locks_general`). As 4 cartas propostas (Sacerdote do Altar, Muralha de Fé, Bênção do Peregrino, Vigília Eterna) **nunca foram criadas**. [Inferência] a identidade "cura" não aparece no código, e é o deck mais fraco **e** inicial: prioridade nº 1.
- **Mercenários** [Fato]: identidade melhor representada: manutenção com escolha de quem paga (`pending upkeep`), Rescisão (`dismissed`, 8 cartas), Relíquia com modos e `loot` com teto por ciclo. Gasta tudo (sobra 1,3 de ouro/turno). Risco de espiral coberto pela escolha de quem dispensar e por Rescisões que dão carta.
- **Campo** [Fato]: 6 equipamentos, 4 Terrenos (2 com modos), auras `armed`/`perEquip`, `recover_equipment`. É o mais forte (61%). Respostas a pilha de equipamento: só dano/deslocar e Emboscadas `ifArmed`; **não existe verbo de desarmar**.

## 3. Auditoria das seis mecânicas
| Mecânica | Existe? | Onde | Reaproveita | Falta | Risco | Decisão nova? |
|---|---|---|---|---|---|---|
| **Flanco** | **Parcial**: a regra de alcance já deixa Arqueiro/Artilharia (e corpo a corpo com frente livre) atingir 3 colunas | `rules.ts:230` | `attack_bonus` + condições | condição "alvo isolado/coluna ao lado" (pequena) e, opcional, flag `flank` para furar a regra de frente (pequena em código, **grande** em equilíbrio: a frente deixa de proteger) | alto se global; usar só em cartas específicas | sim (posicionar o ataque) |
| **Morte e retorno** | **Parcial**: evento e funil existem; gatilho só da carta que morre (2 cartas) | `game.ts:137`, `AbilityOn: destroyed` | funil único, `summon_token`, teto por ciclo como o `loot`, custo em ouro para rejogar | gatilho `ally_destroyed`, `reason` no evento (combate/tática/dispensa/terreno), verbo sacrificar, `summon_graveyard` (campo) | loops: travar com 1 vez por turno/ciclo e pagar ouro | sim |
| **Preparação** | **Não** como regra geral; só pedaços (Relíquia/Terreno, `buff_adjacent` até o próximo turno, `loot` por ciclo) | `types.ts`, `game.ts` | Terreno/Relíquia como "estrutura" (só 2 vagas) | contador/estado por carta (a carta não sabe há quantos turnos está em campo), ou vaga nova no tabuleiro (mexe na UI mobile) | lento demais (partidas já têm 8 rodadas), oponente precisa de janela de resposta | sim, a mais cara |
| **Investida** | **Quase**: "mover e depois atacar com bônus" já é `buff_moved` do Capitão; `free_move` depois de atacar; `attacks` (ataques extras) | `rules.ts`, `catalog.ts` | tudo isso | só a ordem de fases impede "mover e atacar" no mesmo turno | sobreposição com o Capitão | pouca |
| **Intriga** | **Parcial**: a Emboscada já é resposta escondida, mas só reage a "minha unidade foi atacada" | `game.ts` ~833, `view.ts` | Emboscada, mão oculta | janelas novas de reação (cada uma = novo `pending`, UI, IA, ida e volta online) | confusão e latência online | só se o gatilho for novo |
| **Aprimoramento** | **Sim**: `equip`, `buff` permanente, `perEquip`, `recover_equipment` | `Verb` | tudo | nada de motor | acúmulo numa unidade só | não: é o Campo com outro nome |

## 4. As seis facções novas
- **Legião dos Mortos**: **a melhor**. Encaixa no funil de mortes, é diferente do Cardeal (valor das perdas, não cura) e a fraqueza combina. Custo: 4 peças pequenas de motor (acima) e a IA precisa valorar morte própria. **Fazer primeiro.**
- **Companhia da Floresta**: boa; o motor pede pouco. Cuidado: só há 8 cartas à distância no catálogo (7 Arqueiros, 1 Artilharia) e o **Campo já usa 7 Arqueiros**; quase toda carta teria de ser nova e o Capitão já cobre "mover". Diferenciar por **alcance/ataque lateral e Emboscada**, não por movimento. **Segunda.**
- **Engenheiros do Cerco**: a mais cara (estado de preparação ou vaga nova) e a mais lenta. **Adiar** até decidir a mecânica de Preparação com dados de jogadores.
- **Ordem da Cavalaria**: **a mais fraca**: sobrepõe o Capitão (mover e atacar) e "Cavalaria" hoje é só um nome de tipo sem regra (o Cardeal tem 10 cópias). Para existir, o tipo Cavalaria precisa ganhar uma regra própria. **Adiar/fundir** com o Capitão.
- **Corte das Sombras**: **adiar** (sobrepõe a Floresta nas armadilhas e exige janelas de reação).
- **Clãs da Forja**: **descartar**: Aprimoramento é o Campo; só se separaria por "reciclar do cemitério", que é a Legião.
- Já existe uma 5ª facção **projetada**: **Bardos (Aldric)** em `docs/deck-bardos.md` (bloqueado no mapa de Desafios). O plano da outra IA o ignora; precisa entrar na comparação.

## 5. Quantas facções
[Proposta] **Não oito agora.** Confirmar as 4 com gente → Legião (5) → Floresta ou Bardos (6) → 7ª e 8ª só depois dos dados. Motivos: (1) gargalo é **arte** (13 cartas sem arte, cada facção nova = ~25 artes + General + booster + pino + retratos); (2) confrontos crescem rápido: 4→6, 6→15, **8→28**, 10→45, e cada um pede centenas de partidas no laboratório (hoje 1.800 para 4 decks); (3) o deck inicial (Cardeal) ainda perde; (4) ninguém testou os 4 com pessoas.

## 6. Plano de cartas (separando diferentes de cópias)
- Deck de 50 = ~24-30 cartas **diferentes** (hoje 23-30); expansão de ~10 **diferentes** (não 10 cópias). A hipótese "10 por facção = 40" parece **alta**: o Capitão já ganhou 10 e os Mercenários 3.
- [Proposta]: **Cardeal 8-10** (densidade de cura, recompensas por cura, resposta a ele; é a prioridade), **Campo 6** (desarmar, anti-pilha de equipamento, mais respostas, não mais força), **Capitão 4-6** (recompensar formação; as 8 que só estão nos boosters entram em deck antes de criar mais), **Mercenários 4-6** (as "novas de motor" de `docs/novas-cartas-capitao-mercenarios.md`). Total ≈ **25**, não 40.
- Neutras: hoje as Táticas "emprestadas" não têm pool próprio; um pequeno conjunto neutro (~10-12 genéricas) simplificaria boosters e novas facções. [Proposta], não é urgente.

## 7. Boosters
Manter: 5 cartas, última de custo alto, raridade só visual (decks competitivos sem raras: **continua verdadeiro**, o motor ignora raridade), pool que repete por cópias. Mudar (depois do servidor abrir boosters): preço 150, repetidas viram coroas (5/15/50), **proteção suave contra azar** (1 carta que o jogador ainda não tem nas primeiras aberturas, desligando-se sozinha conforme a coleção cresce), compensação de repetidas e abertura no servidor (`TEST_FREE_BOOSTERS = false`). Booster por facção enquanto forem poucas; misto só com 6+ e um pool neutro. Novas cartas entram no FIM de `CARD_DEFS` (a numeração `0032UR` não pode mudar).

## 8. Balanceamento e testes com pessoas
Começar **já** com os 4 decks (grupo fechado de amigos, depois divulgação). Registrar (o servidor já guarda todos os passos de cada partida, dá para calcular depois sem telemetria nova): vitória por deck e por confronto, quem começa, duração (rodadas e minutos), partidas abandonadas/por tempo, vitória por dano ao General vs. mesa limpa, **carta jogada em partidas ganhas vs. perdidas**, ouro sobrando/faltando, quantas partidas o jogador faz e onde desiste (tutorial, 1ª partida). IA × IA continua só como alarme. Alarmes atuais: Cardeal fraco (inicial), Campo forte, Cardeal × Campo 26×74.

## 9. Plano técnico
`catalog.ts` (DeckId, receitas, `BOOSTER_EXTRA`, novas cartas no fim de `CARD_DEFS`), `types.ts` (`Verb`/`AbilityOn`), `game.ts` (`runVerb`, `sendDestroyed`), `rules.ts` (`getValidAttackTargets`), `ai.ts` (valor de morte/sacrifício), `view.ts` (se algo ficar escondido), `server/handler.ts` (`botDeck`, nomes de deck) + `npm run build:edge`, `App.tsx` (ALL_DECK_IDS, BOOSTERS, mapas de arte, pinos de Desafios), `tests/engine-rules.ts`, `tests/engine-sim.ts`, `tests/balance-todos.ts`. Riscos: IA planejadora (simula o turno: verbo novo precisa de valor), repetição de partida online (verbos puros e com a mesma semente), UI mobile (cada prompt novo), coleção/numeração e `cloud.ts` (nomes de carta).

## 10. Ordem de implementação [Proposta]
1. **Boosters/economia no servidor** (já na fila: sem coleção real não há teste real).
2. **Teste fechado com os 4 decks** + corrigir o Cardeal (cura de verdade, cartas já pensadas).
3. Peças de motor pequenas e reutilizáveis: `ally_destroyed`, `reason` na morte, `summon_graveyard`, condição "alvo isolado".
4. **Legião dos Mortos**, depois Floresta (ou Bardos, que já tem projeto).
5. Decidir Preparação/Engenheiros com dados; Cavalaria, Sombras e Forja: adiar, fundir ou descartar.

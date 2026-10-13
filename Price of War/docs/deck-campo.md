# Deck de Campo: soldados Armados (EXPERIMENTAL: motor e laboratório prontos, ainda fora do jogo)

> **Versão atual = a seção "Versão 2 (rodada 24)" no fim deste documento.** O que vem antes é a proposta inicial e a primeira implementação (4 Terrenos presos a tipos de unidade), mantidas só como histórico.

Ideia do dono (vinda de um amigo): um deck que vive de **equipamentos** (Táticas que equipam uma unidade, no estilo das que o jogo já tem, mas aqui **todas novas**) e de **Terrenos** ("campos"). Cartas que ficam melhores **por estarem armadas**, e Terrenos que dão vantagem a um tipo de unidade (exemplo do dono: a **Campina** dá +1 de ATK às suas Cavalarias e atrapalha os inimigos). **As 30 cartas diferentes são todas novas** (nenhum nome repete o catálogo atual). Os três decks iniciais **não mudam**.

> Interpretações minhas (confirmar): (1) o segundo efeito da Campina é "o inimigo à frente de cada Cavalaria sua tem −1 ATK"; (2) "equipamento" = Táticas que usam o verbo `equip` (que o motor já tem), mas com cartas novas.

## A forma do deck (para ser eficiente e divertido)
Dois planos que se ajudam, sem depender de uma única carta:
1. **Alto (armar):** uma unidade boa recebe 1 a 3 equipamentos e vira ameaça. O risco clássico é perder 3 cartas num único abate; por isso o deck **recupera o equipamento** (volta para a mão ou do cemitério).
2. **Largo (campo):** um Terreno barato dá +1 a um tipo inteiro de unidade. Não gasta carta por unidade: é a parte "segura" do deck.

Para o plano funcionar sempre, o deck **compra o que precisa**: unidades que, ao entrar, trazem do baralho um Equipamento ou um Terreno. Como só existe **um espaço de Terreno** por jogador, o Terreno novo substitui o anterior (é a **única** forma de um Terreno sair: Terreno não tem vida e nenhum ataque o alcança) e vale a pena ter vários baratos para trocar conforme o tabuleiro (quando o adversário muda de plano, você muda de campo). A decisão "qual campo agora?" e "em quem armo?" é a graça do deck.

Ritmo esperado: turnos 1 e 2 unidades baratas que trazem peças; turno 3 um Terreno; turno 4 em diante armar quem sobrevive e trocar o campo. Fraquezas naturais: dano em área (Catapulta, Trabuco), Silenciar, e partidas em que o adversário abate a unidade armada antes de ela atacar.

**General: Margrave Osric, Senhor das Marcas** (30 de vida; nome provisório).
*Passiva:* Relíquia sua recebe −1 de dano; unidades suas armadas recebem −1 de dano de ataques (a passiva do Terreno some: **Terreno não tem vida e não pode ser atacado**). *Comando* (pague 2, uma vez por turno): leve 1 Equipamento do cemitério para a mão ("recolher o espólio do campo").

## Lista (60 cartas, 30 diferentes)
"Armada" = tem pelo menos 1 equipamento preso. "Equipamento" = Tática com o verbo `equip` (o motor reconhece pelo efeito, sem marcar nada à mão). "Com Terreno" = você tem um Terreno em campo.

### Unidades, núcleo (3 a 4 cópias)
| Carta | Cópias | Tipo, ATK/HP, custo | Efeito |
|---|---|---|---|
| Escudeiro de Campanha | 4 | Infantaria 2/3, 2 | **Postura:** +1 ATK por equipamento preso (máx. +2). |
| Cavaleiro da Marca | 4 | Cavalaria 3/3, 3 | **Postura:** com Terreno, +1 ATK. |
| Besteiro de Posto | 3 | Arqueiro 1/3, 2 | **Convocação:** leve 1 Equipamento do baralho para a mão. |
| Mapeador de Marchas | 3 | Arqueiro 1/2, 1 | **Convocação:** leve 1 Terreno do baralho para a mão. |
| Guarda de Fronteira | 3 | Infantaria 2/4, 3 | **Postura:** com Terreno, +1 HP em combate. |

### Unidades, apoio (2 cópias)
| Carta | Tipo, ATK/HP, custo | Efeito |
|---|---|---|
| Armeiro de Campanha | Infantaria 1/4, 2 | **Queda:** leve 1 Equipamento do cemitério para a mão. |
| Lanceiro Montado | Cavalaria 3/4, 3 | **Ofensiva:** se estiver armada, 2 de dano à carta atrás. |
| Arqueiro de Colina | Arqueiro 2/3, 3 | **Postura:** na Retaguarda, +1 ATK por equipamento preso (máx. +2). |
| Sargento de Marcha | Infantaria 2/3, 2 | **Convocação:** com Terreno, compre 1 carta. |
| Escudeiro Veterano | Infantaria 2/4, 3 | **Queda:** o equipamento preso volta para a sua mão. |

### Unidades, únicas (1 cópia)
| Carta | Tipo, ATK/HP, custo | Efeito |
|---|---|---|
| Campeão da Marca | Cavalaria 3/5, 4 | **Postura:** +1/+1 por equipamento preso (máx. +3). |
| Lorde das Campinas | Cavalaria 4/4, 4 | **Postura:** suas outras Cavalarias +1 ATK. |
| Mestre de Armas | Infantaria 2/4, 3 | **Comando:** pague 1 de ouro: mude um equipamento de uma unidade sua para outra unidade sua (do mesmo tipo permitido pelo equipamento). |

### Equipamentos (Táticas, 13; todos novos, cada um com um papel)
| Carta | Cópias | Custo | Efeito |
|---|---|---|---|
| Cota Remendada | 3 | 1 | Infantaria ou Cavalaria: +1 ATK e +1 HP. |
| Escudo de Carvalho | 2 | 1 | Infantaria ou Cavalaria: Guarda (absorve o primeiro golpe inteiro). |
| Lança de Fresno | 3 | 1 | Cavalaria: +2 ATK. |
| Arco Longo de Teixo | 2 | 1 | Arqueiro: +1 ATK e +1 HP. |
| Machado de Guerra | 1 | 2 | Infantaria: +3 ATK. |
| Sela Reforçada | 2 | 2 | Cavalaria: +2 ATK e +2 HP. |

### Terrenos (6; sem vida, nenhum ataque os alcança; um espaço só, cada um troca o anterior)
| Carta | Cópias | Custo | Efeito |
|---|---|---|---|
| Campina Aberta | 2 | 2 | Suas Cavalarias +1 ATK; o inimigo à frente de cada Cavalaria sua tem −1 ATK. |
| Colina Fortificada | 1 | 2 | Suas Infantarias na Vanguarda +1 HP em combate e −1 de dano de ataques. |
| Floresta Espessa | 1 | 2 | Seus Arqueiros +1 HP em combate; Arqueiros na Retaguarda recebem −1 de dano. |
| Forja de Campanha | 1 | 3 | Suas unidades armadas +1 HP em combate. |
| Vau do Rio | 1 | 2 | Unidades suas que se movem ganham +1 ATK até o próximo turno. |

### Outras Táticas, Emboscadas e Relíquia
| Carta | Cópias | Tipo, custo | Efeito |
|---|---|---|---|
| Intendência de Campanha | 2 | Tática, 1 | Leve 1 Equipamento do baralho para a mão. |
| Reconhecimento do Terreno | 2 | Tática, 1 | Veja as 3 cartas do topo: leve 1 Terreno ou Equipamento, o resto vai para o fundo. |
| Marcha Forçada | 2 | Tática, 1 | Uma unidade sua se move 1 casa de graça. |
| Contra-Carga | 2 | Emboscada, 2 | A unidade atacada, se estiver armada, ganha +2 ATK e +1 HP até o fim do turno. |
| Armadilha de Estacas | 1 | Emboscada, 2 | O atacante recebe 3 de dano. |
| Arsenal do Marquês | 2 | Relíquia (5 de vida), 3 | Suas unidades armadas recebem −1 de dano. |

Contagem: 17 (núcleo) + 10 (apoio) + 3 (únicas) + 13 (equipamentos) + 6 (Terrenos) + 6 (Táticas) + 3 (Emboscadas) + 2 (Relíquia) = **60**. Cartas diferentes: 5 + 5 + 3 + 6 + 5 + 3 + 2 + 1 = **30**.

## O que o motor ainda não sabe (trabalho de motor antes de testar)
1. **Por equipamento preso** (`perEquip`): aura/efeito que soma ATK ou HP por equipamento da própria carta, com teto. O motor já guarda os equipamentos presos (`equippedWeapons`).
2. **Condições de fonte** nos efeitos: "armada" (tem equipamento) e "com Terreno" (o dono tem Terreno em campo), em auras e em habilidades. Ex.: Cavaleiro da Marca, Guarda de Fronteira, Sargento de Marcha, Forja de Campanha, Arsenal.
3. **Filtro "Equipamento"** na busca (`search`) do baralho e do cemitério: reconhecer a Tática pelo verbo `equip` (sem marca manual). O Reconhecimento do Terreno precisa de `look_top` com filtro (ou vira "compre 2 e descarte 1").
4. **Verbos novos:** `return_equipment` (na Queda, o equipamento volta para a mão) e `move_equipment` (Mestre de Armas).
5. **Terrenos novos com aura por tipo** (Campina, Colina, Floresta): o motor já tem aura por `types`, `row` e `facing`; falta só a de "dano de ataques" por tipo/fileira para a Colina e a Floresta, que reaproveita `reduce`.
6. **Vau do Rio** (bônus ao mover) depende de um gatilho "ao mover" em Terreno; se for caro, troque por outro Terreno.
7. A **IA** precisa saber escolher o alvo dos equipamentos e escolher o Terreno certo (já equipa com as Táticas atuais; falta o critério de trocar Terreno).
8. Rótulos novos de vocabulário: **Armada** e **Com Terreno** (`docs/vocabulario.md`); gatilhos usados: Convocação, Postura, Queda, Ofensiva, Comando.

## Riscos de equilíbrio (a medir no laboratório)
- **Empilhar equipamento:** o teto por carta (+2/+3) existe por isso; sem teto não entra. Medir a unidade armada vs. dano em área e vs. um abate único.
- **Compra do que precisa** (Besteiro, Mapeador, Intendência, Reconhecimento, General recolhendo): pode deixar o deck consistente demais. Se a taxa de vitória subir, tirar cópias de busca antes de mexer em atributos.
- **Campina + Lorde das Campinas + Lâmina/Lança:** Cavalaria pode somar +1, +1, +2. Conferir o teto de ATK da Cavalaria.
- **Recolher o espólio** (General, Armeiro, Escudeiro Veterano): três fontes de recuperação; se o deck ficar longo demais, tirar uma.
- **Tempo:** com 15 de ouro no começo e +5 por turno, equipamentos de custo 1 são baratos. Se ficar rápido demais, subir o custo de 2 ou 3 equipamentos.
- Antes de qualquer teste: o dono já decidiu que **novos decks só entram depois de o equilíbrio dos três atuais estar bom** (`docs/visao-geral.md`). Este deck concorre com o dos Bardos pelo quarto lugar.


---

## Rodada 24: o que foi construído (experimental, só laboratório e testes)

As cartas e a receita ficam em `src/engine/experimental.ts` (`CAMPO_DEFS`, `CAMPO_RECIPE`, `registerCampo()`); **não** estão no catálogo, nos boosters nem no cliente. Testes das regras novas: `tests/campo-rules.ts` (12). Laboratório: `tests/balance-campo.ts` (contra Cardeal, Capitão e Mercenários).

### Motor (dados, nada por nome de carta)
- **Por equipamento preso:** aura com `perEquip: { cap }` multiplica o bônus pelos equipamentos da própria carta (teto `cap`).
- **Condições de quem dá a aura:** `needs: 'armed'` (a fonte tem equipamento) e `needs: 'terrain'` (o dono tem Terreno em campo).
- **Condições de quem recebe:** `Who.armed` (só unidades armadas) e `Who.facingOwn` (só o inimigo de frente para uma unidade do dono da aura dos tipos listados; a Campina Aberta usa isso).
- **Busca por Equipamento:** `CardFilter.equipment` (o motor reconhece a Tática pelo verbo `equip`); junto com `types`, vale uma OU outra (Reconhecimento do Terreno: Equipamento ou Terreno).
- **`recover_equipment`:** ao cair, o equipamento preso volta para a mão em vez de ir ao cemitério (Escudeiro Veterano).
- **`ifArmed`** em `splash_behind` (Lanceiro Montado) e em `buff_defender` (Contra-Carga).
- Correção geral: um efeito que dispara sozinho (Queda, Convocação) e não acha nada para escolher agora segue em frente ("Nada para escolher."), em vez de travar a partida com uma escolha sem opções.

### Mudanças em relação à proposta acima
- **Cortados por custo de motor:** Vau do Rio (bônus ao mover) e o verbo `move_equipment` (Mestre de Armas) e `return_equipment` por carta. Entraram: **Colina Fortificada ×2** no lugar do Vau, e o **Mestre de Armas** virou "suas unidades armadas: +1 ATK".
- **Armadilha de Estacas** (3 de dano ao atacante) virou **Cerca de Estacas** (+3 HP à unidade atacada até o fim do turno): o motor ainda não tem dano ao atacante numa Emboscada.
- **Sargento de Marcha** sem a condição de Terreno (compra 1 carta ao entrar, custo 3). **Marcha Forçada**: 2 movimentos extras. **Lorde das Campinas**: "suas Cavalarias +1 ATK" (inclui ele).
- Textos no padrão da rodada 24 (`docs/textos-cartas.md`): efeito principal primeiro, "N de dano a menos por ataque", "Equipe …: +A ATK e +H HP".
- **Atributos** subiram depois da primeira medição (ver abaixo); as tabelas acima trazem os números originais.

### Lista final (60 cartas, 30 nomes)
Núcleo: Escudeiro de Campanha 3/4 (c2) ×3, Cavaleiro da Marca 3/4 (c3) ×3, Besteiro de Posto 2/3 (c2) ×3, Mapeador de Marchas 1/3 (c1) ×3, Guarda de Fronteira 2/5 (c3) ×3. Apoio: Armeiro de Campanha 2/4 (c2) ×2, Lanceiro Montado 3/5 (c3) ×2, Arqueiro de Colina 2/4 (c3) ×3, Sargento de Marcha 2/4 (c3) ×3, Escudeiro Veterano 2/5 (c3) ×2. Únicas: Campeão da Marca 4/6 (c4), Lorde das Campinas 3/5 (c4), Mestre de Armas 2/5 (c3). Equipamentos: Cota Remendada +1 ATK e +2 HP ×3, Escudo de Carvalho (Guarda) ×2, Lança de Fresno +2 ATK e +1 HP ×3, Arco Longo de Teixo +2 ATK e +1 HP ×2, Machado de Guerra +3 ATK ×1, Sela Reforçada +2/+2 ×2. Terrenos: Campina Aberta (Cavalarias +2 ATK, inimigos de frente para elas -2 ATK) ×2, Colina Fortificada (Infantarias na Vanguarda +2 HP em combate e 1 de dano a menos) ×2, Floresta Espessa (Arqueiros +2 HP em combate; Retaguarda 1 de dano a menos) ×1, Forja de Campanha (armadas +2 HP em combate) ×1. Táticas: Intendência de Campanha ×2, Reconhecimento do Terreno ×2, Marcha Forçada ×2. Emboscadas: Contra-Carga ×2, Cerca de Estacas ×1. Relíquia: Arsenal do Marquês (armadas recebem 2 de dano a menos) ×2. General: Margrave Osric, Senhor das Marcas (nome provisório).

### Medição (laboratório, IA × IA)
Ver `docs/balanceamento.md`, rodada 24. Antes de entrar no jogo faltam: **artes** das 30 cartas (prompts), registrar o deck no catálogo/cliente (DeckId, cartas, boosters, ícones), e o dono confirmar o nome do General.

Resultado (IA × IA, 200 partidas por confronto, versão final): **Campo 73,0% contra o Cardeal, 44,5% contra o Capitão, 60,0% contra os Mercenários** (referência: Cardeal × Capitão 42/58; Mercenários 49/51,5 contra Cardeal/Capitão). Caminho: a primeira versão, com os atributos da proposta, perdia feio (45% × Cardeal, 18% × Capitão, 28% × Mercenários); subir os núcleos resolveu contra o Cardeal e os Mercenários, mas contra o Capitão (o deck mais agressivo) ficou em 33–42%; subir os Terrenos e a Relíquia (+2) devolveu importância ao "campo" e levou o Capitão a 44,5%. **Leitura:** o deck ainda é forte demais contra os decks lentos e um pouco fraco contra o Capitão; a IA joga o Terreno com pouca prioridade (turno 2–3 no lugar de uma unidade), então os Terrenos tendem a aparecer abaixo do que valem para uma pessoa. Se o dono quiser equilibrar mais antes de entrar no jogo, o próximo passo é testar -1 nos núcleos e +1 de custo nos 2 equipamentos mais fortes.

### Direção do dono (rodada 24, depois da primeira medição)
- A identidade do deck é **"soldado armado", de qualquer tipo** (Infantaria, Cavalaria, Arqueiro), não "Cavalaria + Terreno". Isso pede equipamentos e Terrenos que sirvam a qualquer armada, e não Campina/Colina/Floresta presos a um tipo. O deck também leva efeitos gerais (busca, Comando, Manobra) em menor escala.
- **Ideia dos Terrenos com modos:** em vez de 4 Terrenos de efeito fixo, 2 Terrenos com 2 modos cada, e o dono escolhe o modo no fim do turno (como o Códice das Mil Dívidas dos Mercenários). Avaliação e proposta de cartas: ver a conversa da rodada 24; ainda não aplicada no motor.


---

## Versão 2 (rodada 24): identidade "soldado Armado, de qualquer tipo"

**Decisões do dono:** (1) a identidade do deck é estar **Armado** (a unidade tem pelo menos 1 equipamento preso), seja Infantaria, Cavalaria ou Arqueiro; (2) o deck também leva efeitos gerais (busca, Comando, Manobra, compra), em menor escala; (3) **dois Terrenos com dois modos cada**, escolhidos no fim do turno do dono e valendo até o fim do turno seguinte (como o Códice das Mil Dívidas), para o adversário poder punir a escolha errada; (4) **Armada** vira uma **etiqueta** no texto (como Contrato e os gatilhos), e o equipamento diz "Ela fica **Armada**".

**Motor novo nesta versão:** modos em **Terreno** (`modeAt(board, 11)`, ação `relic_mode` com `slot: 11`), `RelicMode.passives` (auras que só valem no modo escolhido), a IA escolhe o modo do Terreno (`wantedTerrainMode`), e o modo Saque (comprar ao destruir) também vale num Terreno. Equipamentos agora servem a **qualquer unidade** (sem `types` no alvo). A parte do cliente (tela de escolha do modo do Terreno) **ainda não existe**: hoje só o laboratório e os testes usam. No tabuleiro o equipamento já aparece preso atrás da unidade (as cartas espiando por trás), então a unidade Armada já se vê.

### Lista (60 cartas, 30 nomes; cópias com ×)
| Carta | Tipo, custo | Efeito |
|---|---|---|
| Margrave Osric, Senhor das Marcas | General 30 de vida, custo 0 | Comando: Pague 2 de ouro: leve 1 Equipamento do cemitério para a mão. Passiva Suas Armadas e a Relíquia recebem 1 de dano a menos por ataque. |
| Escudeiro de Campanha ×3 | Infantaria 2/4, custo 2 | Postura: +1 ATK por equipamento preso (máx. +2). |
| Cavaleiro da Marca ×3 | Cavalaria 3/4, custo 3 | Postura: Armada: +1 ATK. |
| Guarda de Fronteira ×3 | Infantaria 2/4, custo 3 | Postura: Armada: +1 HP em combate. |
| Lanceiro Montado ×3 | Cavalaria 3/4, custo 3 | Ofensiva: Armada: 2 de dano à carta atrás. |
| Arqueiro de Colina ×2 | Arqueiro 2/3, custo 3 | Postura: Na Retaguarda, +1 ATK por equipamento preso (máx. +2). |
| Besteiro de Posto ×3 | Arqueiro 1/3, custo 2 | Convocação: Leve 1 Equipamento do baralho para a mão. |
| Armeiro de Campanha ×3 | Infantaria 1/4, custo 2 | Queda: Leve 1 Equipamento do cemitério para a mão. |
| Escudeiro Veterano ×2 | Infantaria 2/4, custo 3 | Queda: O equipamento preso volta para a sua mão. |
| Mapeador de Marchas ×2 | Arqueiro 1/3, custo 1 | Convocação: Leve 1 Terreno do baralho para a mão. |
| Sargento de Marcha ×2 | Infantaria 2/3, custo 3 | Convocação: Compre 1 carta. |
| Intendente de Marcha ×2 | Infantaria 2/3, custo 3 | Comando: Pague 1 de ouro: compre 1 carta. |
| Cavaleiro Batedor ×2 | Cavalaria 2/3, custo 2 | Manobra: +1 ATK até o próximo turno. |
| Campeão da Marca ×1 | Cavalaria 3/5, custo 4 | Postura: +1/+1 em combate por equipamento preso (máx. +3). |
| Mestre de Armas ×1 | Infantaria 2/4, custo 3 | Postura: Suas Armadas: +1 ATK. |
| Cota Remendada ×3 | Tática, custo 1 | Equipe uma unidade: +1 ATK e +2 HP. Ela fica Armada. |
| Escudo de Carvalho ×2 | Tática, custo 1 | Equipe uma unidade: Guarda (absorve o primeiro golpe inteiro). Ela fica Armada. |
| Espada de Posto ×3 | Tática, custo 1 | Equipe uma unidade: +2 ATK. Ela fica Armada. |
| Elmo Ferrado ×2 | Tática, custo 1 | Equipe uma unidade: +3 HP. Ela fica Armada. |
| Machado de Guerra ×1 | Tática, custo 2 | Equipe uma unidade: +3 ATK. Ela fica Armada. |
| Armadura de Placas ×2 | Tática, custo 2 | Equipe uma unidade: +2 ATK e +1 HP. Ela fica Armada. |
| Forja de Campanha ×2 | Terreno, custo 3 | Escolha 1 modo no fim do seu turno. Muralha: suas Armadas têm +2 HP em combate. Afiação: suas Armadas têm +2 ATK. |
| Posto de Marcha ×2 | Terreno, custo 2 | Escolha 1 modo no fim do seu turno. Trincheira: suas Armadas recebem 1 de dano a menos por ataque. Saque: ao destruir uma unidade inimiga, compre 1 carta (máx. 1 por ciclo). |
| Intendência de Campanha ×2 | Tática, custo 1 | Leve 1 Equipamento do baralho para a mão. |
| Reconhecimento do Terreno ×2 | Tática, custo 2 | Leve 1 Equipamento ou Terreno do baralho para a mão. |
| Reforços da Marca ×1 | Tática, custo 2 | Leve 1 soldado do baralho para a mão. |
| Marcha Forçada ×1 | Tática, custo 1 | 2 movimentos extras neste turno. |
| Contra-Carga ×2 | Emboscada, custo 2 | Armada: a unidade atacada ganha +2 ATK e +1 HP até o fim do turno. |
| Cerca de Estacas ×1 | Emboscada, custo 2 | A unidade atacada ganha +3 HP até o fim do turno. |
| Arsenal do Marquês ×2 | Relíquia (5 de vida), custo 3 | Postura: Suas Armadas recebem 2 de dano a menos por ataque. |


Estrutura: 14 unidades (9 de identidade Armada, 3 de efeito geral, 2 únicas), 6 equipamentos (13 cópias), 2 Terrenos com modos (4 cópias), 4 Táticas gerais, 2 Emboscadas e 1 Relíquia.

**Modos dos Terrenos.** *Forja de Campanha*: **Muralha** (Armadas +2 HP em combate) ou **Afiação** (Armadas +2 ATK). *Posto de Marcha*: **Trincheira** (Armadas recebem 1 de dano a menos por ataque) ou **Saque** (ao destruir uma unidade inimiga, compre 1 carta, máx. 1 por ciclo). O Terreno entra no primeiro modo; o dono troca na Movimentação.

### Medição (IA × IA, 200 partidas por confronto)
**72,0% × Cardeal, 42,5% × Capitão, 60,0% × Mercenários.** A primeira montagem com equipamento universal e os atributos anteriores deu 86% / 68,5% / 80%: forte demais, porque qualquer equipamento em qualquer unidade rende mais. Reduzi os atributos dos núcleos e dois equipamentos (Espada de Posto +2 ATK, Armadura de Placas +2/+1); com isso as duas cartas de Terreno passaram a ajudar (+5,3 e +2,8 pontos na vitória ao comprar, antes ficavam abaixo das unidades). Perfil parecido com o da versão 1: forte contra os decks lentos e abaixo do Capitão.


### Nomes provisórios e Full Art (rodada 24)
**Nomes:** os nomes das cartas desta lista são provisórios e **genéricos demais** (Armeiro de Campanha, Escudeiro Veterano, Mapeador de Marchas, Sargento de Marcha, Guarda de Fronteira, Intendente de Marcha, Besteiro de Posto etc.). O dono mandou **trocar todos**, no estilo dos nomes do deck Mercenários (ver `docs/criacao-de-cartas.md`, seção "Nomes"), **depois de receber as imagens**, para o nome combinar com a arte. Não renomear antes.

### Quais cartas ganhar Full Art (proposta, a confirmar)
Sim (6): **Margrave Osric** (General, já é Full Art), **Campeão da Marca** (única, o herói do deck, cena heroica vertical), **Arsenal do Marquês** (Relíquia, a sala de armas é uma cena grandiosa), **Forja de Campanha** (Terreno de dois modos, a forja à noite funciona bem em retrato), **Armadura de Placas** (o objeto-símbolo da identidade "Armada", figura alta e central) e **Mestre de Armas** (única, retrato de personagem). Não: Táticas de busca e movimento, as emboscadas, os equipamentos simples, as unidades de 3 cópias. Cada Full Art precisa de uma **segunda arte** diferente da Padrão (ver `art-prompts/README.md`). Nada disso existe no jogo ainda (booster com arte alternativa e raridade vem depois).

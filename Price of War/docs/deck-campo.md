# Deck de Campo: soldados Armados (NO JOGO desde a rodada 25)

> **Rodada 25:** o deck entrou no catálogo (`src/engine/catalog.ts`, `DECK_RECIPES.campo`; `experimental.ts` só reexporta os nomes para o laboratório). Receita final com **50 cartas** (as 60 da Versão 2 perderam 1 cópia de Cabide de Ferro, Cavaleiro do Pinhal Cinzento, Vigia da Torre Mofada, Cavaleiro Rompe-Escudos, Bigorna Andarilha, Cota de Mil Remendos, Espada do Posto Esquecido, Recolhe-Espadas, Rédea-de-Vento e O Contador de Lanças). Medido com N=100 (IA × IA): 78,5% × Cardeal, 46,5% × Capitão, 56% × Mercenários. Entra no jogo como 4º espaço de deck (aparelho), Booster Campo e adversário no mapa de Desafios (Torre das Marcas).

> **Versão atual = a seção "Versão 2 (rodada 24)" no fim deste documento.** O que vem antes é a proposta inicial e a primeira implementação (4 Terrenos presos a tipos de unidade), mantidas só como histórico.

Ideia do dono (vinda de um amigo): um deck que vive de **equipamentos** (Táticas que equipam uma unidade, no estilo das que o jogo já tem, mas aqui **todas novas**) e de **Terrenos** ("campos"). Cartas que ficam melhores **por estarem armadas**, e Terrenos que dão vantagem a um tipo de unidade (exemplo do dono: a **Campina** dá +1 de ATK às suas Cavalarias e atrapalha os inimigos). **As 30 cartas diferentes são todas novas** (nenhum nome repete o catálogo atual). Os três decks iniciais **não mudam**.

> Interpretações minhas (confirmar): (1) o segundo efeito da Campina é "o inimigo à frente de cada Cavalaria sua tem −1 ATK"; (2) "equipamento" = Táticas que usam o verbo `equip` (que o motor já tem), mas com cartas novas.

## A forma do deck (para ser eficiente e divertido)
Dois planos que se ajudam, sem depender de uma única carta:
1. **Alto (armar):** uma unidade boa recebe 1 a 3 equipamentos e vira ameaça. O risco clássico é perder 3 cartas num único abate; por isso o deck **recupera o equipamento** (volta para a mão ou do cemitério).
2. **Largo (campo):** um Terreno barato dá +1 a um tipo inteiro de unidade. Não gasta carta por unidade: é a parte "segura" do deck.

Para o plano funcionar sempre, o deck **compra o que precisa**: unidades que, ao entrar, trazem do baralho um Equipamento ou um Terreno. Como só existe **um espaço de Terreno** por jogador, o Terreno novo substitui o anterior (é a **única** forma de um Terreno sair: Terreno não tem vida e nenhum ataque o alcança) e vale a pena ter vários baratos para trocar conforme o tabuleiro (quando o adversário muda de plano, você muda de campo). A decisão "qual campo agora?" e "em quem armo?" é a graça do deck.

Ritmo esperado: turnos 1 e 2 unidades baratas que trazem peças; turno 3 um Terreno; turno 4 em diante armar quem sobrevive e trocar o campo. Fraquezas naturais: dano em área (Catapulta, Trabuco), Silenciar, e partidas em que o adversário abate a unidade armada antes de ela atacar.

**General: Margrave Osric, Senhor das Marcas** (30 de vida; nome aprovado pelo dono).
*Passiva:* Relíquia sua recebe −1 de dano; unidades suas armadas recebem −1 de dano de ataques (a passiva do Terreno some: **Terreno não tem vida e não pode ser atacado**). *Comando* (pague 2, uma vez por turno): leve 1 Equipamento do cemitério para a mão ("recolher o espólio do campo").

## Lista (60 cartas, 30 diferentes)
"Armada" = tem pelo menos 1 equipamento preso. "Equipamento" = Tática com o verbo `equip` (o motor reconhece pelo efeito, sem marcar nada à mão). "Com Terreno" = você tem um Terreno em campo.

### Unidades, núcleo (3 a 4 cópias)
| Carta | Cópias | Tipo, ATK/HP, custo | Efeito |
|---|---|---|---|
| Cabide de Ferro | 4 | Infantaria 2/3, 2 | **Postura:** +1 ATK por equipamento preso (máx. +2). |
| Cavaleiro do Pinhal Cinzento | 4 | Cavalaria 3/3, 3 | **Postura:** com Terreno, +1 ATK. |
| Olho-de-Névoa | 3 | Arqueiro 1/3, 2 | **Convocação:** leve 1 Equipamento do baralho para a mão. |
| Traça-Vales | 3 | Arqueiro 1/2, 1 | **Convocação:** leve 1 Terreno do baralho para a mão. |
| Vigia da Torre Mofada | 3 | Infantaria 2/4, 3 | **Postura:** com Terreno, +1 HP em combate. |

### Unidades, apoio (2 cópias)
| Carta | Tipo, ATK/HP, custo | Efeito |
|---|---|---|
| Bigorna Andarilha | Infantaria 1/4, 2 | **Queda:** leve 1 Equipamento do cemitério para a mão. |
| Cavaleiro Rompe-Escudos | Cavalaria 3/4, 3 | **Ofensiva:** se estiver armada, 2 de dano à carta atrás. |
| Arqueiro do Último Sol | Arqueiro 2/3, 3 | **Postura:** na Retaguarda, +1 ATK por equipamento preso (máx. +2). |
| Grita-Passo | Infantaria 2/3, 2 | **Convocação:** com Terreno, compre 1 carta. |
| Recolhe-Espadas | Infantaria 2/4, 3 | **Queda:** o equipamento preso volta para a sua mão. |

### Unidades, únicas (1 cópia)
| Carta | Tipo, ATK/HP, custo | Efeito |
|---|---|---|
| Aldric Mil-Armas, Campeão das Marcas | Cavalaria 3/5, 4 | **Postura:** +1/+1 por equipamento preso (máx. +3). |
| Lorde das Campinas | Cavalaria 4/4, 4 | **Postura:** suas outras Cavalarias +1 ATK. |
| Mestre Pedra-de-Amolar | Infantaria 2/4, 3 | **Comando:** pague 1 de ouro: mude um equipamento de uma unidade sua para outra unidade sua (do mesmo tipo permitido pelo equipamento). |

### Equipamentos (Táticas, 13; todos novos, cada um com um papel)
| Carta | Cópias | Custo | Efeito |
|---|---|---|---|
| Cota de Mil Remendos | 3 | 1 | Infantaria ou Cavalaria: +1 ATK e +1 HP. |
| Escudo Porco-Espinho | 2 | 1 | Infantaria ou Cavalaria: Guarda (absorve o primeiro golpe inteiro). |
| Lança de Fresno | 3 | 1 | Cavalaria: +2 ATK. |
| Arco Longo de Teixo | 2 | 1 | Arqueiro: +1 ATK e +1 HP. |
| Machado Racha-Tronco | 1 | 2 | Infantaria: +3 ATK. |
| Sela Reforçada | 2 | 2 | Cavalaria: +2 ATK e +2 HP. |

### Terrenos (6; sem vida, nenhum ataque os alcança; um espaço só, cada um troca o anterior)
| Carta | Cópias | Custo | Efeito |
|---|---|---|---|
| Campina Aberta | 2 | 2 | Suas Cavalarias +1 ATK; o inimigo à frente de cada Cavalaria sua tem −1 ATK. |
| Colina Fortificada | 1 | 2 | Suas Infantarias na Vanguarda +1 HP em combate e −1 de dano de ataques. |
| Floresta Espessa | 1 | 2 | Seus Arqueiros +1 HP em combate; Arqueiros na Retaguarda recebem −1 de dano. |
| A Forja que Nunca Apaga | 1 | 3 | Suas unidades armadas +1 HP em combate. |
| Vau do Rio | 1 | 2 | Unidades suas que se movem ganham +1 ATK até o próximo turno. |

### Outras Táticas, Emboscadas e Relíquia
| Carta | Cópias | Tipo, custo | Efeito |
|---|---|---|---|
| Caixotes de Palha e Aço | 2 | Tática, 1 | Leve 1 Equipamento do baralho para a mão. |
| Dois Olhos na Crista | 2 | Tática, 1 | Veja as 3 cartas do topo: leve 1 Terreno ou Equipamento, o resto vai para o fundo. |
| Noite Sem Parar | 2 | Tática, 1 | Uma unidade sua se move 1 casa de graça. |
| A Mata Devolve | 2 | Emboscada, 2 | A unidade atacada, se estiver armada, ganha +2 ATK e +1 HP até o fim do turno. |
| Armadilha de Estacas | 1 | Emboscada, 2 | O atacante recebe 3 de dano. |
| Arsenal dos Mil Invernos | 2 | Relíquia (5 de vida), 3 | Suas unidades armadas recebem −1 de dano. |

Contagem: 17 (núcleo) + 10 (apoio) + 3 (únicas) + 13 (equipamentos) + 6 (Terrenos) + 6 (Táticas) + 3 (Emboscadas) + 2 (Relíquia) = **60**. Cartas diferentes: 5 + 5 + 3 + 6 + 5 + 3 + 2 + 1 = **30**.

## O que o motor ainda não sabe (trabalho de motor antes de testar)
1. **Por equipamento preso** (`perEquip`): aura/efeito que soma ATK ou HP por equipamento da própria carta, com teto. O motor já guarda os equipamentos presos (`equippedWeapons`).
2. **Condições de fonte** nos efeitos: "armada" (tem equipamento) e "com Terreno" (o dono tem Terreno em campo), em auras e em habilidades. Ex.: Cavaleiro do Pinhal Cinzento, Vigia da Torre Mofada, Grita-Passo, A Forja que Nunca Apaga, Arsenal.
3. **Filtro "Equipamento"** na busca (`search`) do baralho e do cemitério: reconhecer a Tática pelo verbo `equip` (sem marca manual). O Dois Olhos na Crista precisa de `look_top` com filtro (ou vira "compre 2 e descarte 1").
4. **Verbos novos:** `return_equipment` (na Queda, o equipamento volta para a mão) e `move_equipment` (Mestre Pedra-de-Amolar).
5. **Terrenos novos com aura por tipo** (Campina, Colina, Floresta): o motor já tem aura por `types`, `row` e `facing`; falta só a de "dano de ataques" por tipo/fileira para a Colina e a Floresta, que reaproveita `reduce`.
6. **Vau do Rio** (bônus ao mover) depende de um gatilho "ao mover" em Terreno; se for caro, troque por outro Terreno.
7. A **IA** precisa saber escolher o alvo dos equipamentos e escolher o Terreno certo (já equipa com as Táticas atuais; falta o critério de trocar Terreno).
8. Rótulos novos de vocabulário: **Armada** e **Com Terreno** (`docs/vocabulario.md`); gatilhos usados: Convocação, Postura, Queda, Ofensiva, Comando.

## Riscos de equilíbrio (a medir no laboratório)
- **Empilhar equipamento:** o teto por carta (+2/+3) existe por isso; sem teto não entra. Medir a unidade armada vs. dano em área e vs. um abate único.
- **Compra do que precisa** (Besteiro, Mapeador, Intendência, Reconhecimento, General recolhendo): pode deixar o deck consistente demais. Se a taxa de vitória subir, tirar cópias de busca antes de mexer em atributos.
- **Campina + Lorde das Campinas + Lâmina/Lança:** Cavalaria pode somar +1, +1, +2. Conferir o teto de ATK da Cavalaria.
- **Recolher o espólio** (General, Armeiro, Recolhe-Espadas): três fontes de recuperação; se o deck ficar longo demais, tirar uma.
- **Tempo:** com 15 de ouro no começo e +5 por turno, equipamentos de custo 1 são baratos. Se ficar rápido demais, subir o custo de 2 ou 3 equipamentos.
- Antes de qualquer teste: o dono já decidiu que **novos decks só entram depois de o equilíbrio dos três atuais estar bom** (`docs/visao-geral.md`). Este deck concorre com o dos Bardos pelo quarto lugar.


---

## Rodada 24: o que foi construído (experimental, só laboratório e testes)

As cartas e a receita ficam em `src/engine/experimental.ts` (`CAMPO_DEFS`, `CAMPO_RECIPE`, `registerCampo()`); **não** estão no catálogo, nos boosters nem no cliente. Testes das regras novas: `tests/campo-rules.ts` (12). Laboratório: `tests/balance-campo.ts` (contra Cardeal, Capitão e Mercenários).

### Motor (dados, nada por nome de carta)
- **Por equipamento preso:** aura com `perEquip: { cap }` multiplica o bônus pelos equipamentos da própria carta (teto `cap`).
- **Condições de quem dá a aura:** `needs: 'armed'` (a fonte tem equipamento) e `needs: 'terrain'` (o dono tem Terreno em campo).
- **Condições de quem recebe:** `Who.armed` (só unidades armadas) e `Who.facingOwn` (só o inimigo de frente para uma unidade do dono da aura dos tipos listados; a Campina Aberta usa isso).
- **Busca por Equipamento:** `CardFilter.equipment` (o motor reconhece a Tática pelo verbo `equip`); junto com `types`, vale uma OU outra (Dois Olhos na Crista: Equipamento ou Terreno).
- **`recover_equipment`:** ao cair, o equipamento preso volta para a mão em vez de ir ao cemitério (Recolhe-Espadas).
- **`ifArmed`** em `splash_behind` (Cavaleiro Rompe-Escudos) e em `buff_defender` (A Mata Devolve).
- Correção geral: um efeito que dispara sozinho (Queda, Convocação) e não acha nada para escolher agora segue em frente ("Nada para escolher."), em vez de travar a partida com uma escolha sem opções.

### Mudanças em relação à proposta acima
- **Cortados por custo de motor:** Vau do Rio (bônus ao mover) e o verbo `move_equipment` (Mestre Pedra-de-Amolar) e `return_equipment` por carta. Entraram: **Colina Fortificada ×2** no lugar do Vau, e o **Mestre Pedra-de-Amolar** virou "suas unidades armadas: +1 ATK".
- **Armadilha de Estacas** (3 de dano ao atacante) virou **Dentes da Cerca** (+3 HP à unidade atacada até o fim do turno): o motor ainda não tem dano ao atacante numa Emboscada.
- **Grita-Passo** sem a condição de Terreno (compra 1 carta ao entrar, custo 3). **Noite Sem Parar**: 2 movimentos extras. **Lorde das Campinas**: "suas Cavalarias +1 ATK" (inclui ele).
- Textos no padrão da rodada 24 (`docs/textos-cartas.md`): efeito principal primeiro, "N de dano a menos por ataque", "Equipe …: +A ATK e +H HP".
- **Atributos** subiram depois da primeira medição (ver abaixo); as tabelas acima trazem os números originais.

### Lista final (60 cartas, 30 nomes)
Núcleo: Cabide de Ferro 3/4 (c2) ×3, Cavaleiro do Pinhal Cinzento 3/4 (c3) ×3, Olho-de-Névoa 2/3 (c2) ×3, Traça-Vales 1/3 (c1) ×3, Vigia da Torre Mofada 2/5 (c3) ×3. Apoio: Bigorna Andarilha 2/4 (c2) ×2, Cavaleiro Rompe-Escudos 3/5 (c3) ×2, Arqueiro do Último Sol 2/4 (c3) ×3, Grita-Passo 2/4 (c3) ×3, Recolhe-Espadas 2/5 (c3) ×2. Únicas: Aldric Mil-Armas, Campeão das Marcas 4/6 (c4), Lorde das Campinas 3/5 (c4), Mestre Pedra-de-Amolar 2/5 (c3). Equipamentos: Cota de Mil Remendos +1 ATK e +2 HP ×3, Escudo Porco-Espinho (Guarda) ×2, Lança de Fresno +2 ATK e +1 HP ×3, Arco Longo de Teixo +2 ATK e +1 HP ×2, Machado Racha-Tronco +3 ATK ×1, Sela Reforçada +2/+2 ×2. Terrenos: Campina Aberta (Cavalarias +2 ATK, inimigos de frente para elas -2 ATK) ×2, Colina Fortificada (Infantarias na Vanguarda +2 HP em combate e 1 de dano a menos) ×2, Floresta Espessa (Arqueiros +2 HP em combate; Retaguarda 1 de dano a menos) ×1, A Forja que Nunca Apaga (armadas +2 HP em combate) ×1. Táticas: Caixotes de Palha e Aço ×2, Dois Olhos na Crista ×2, Noite Sem Parar ×2. Emboscadas: A Mata Devolve ×2, Dentes da Cerca ×1. Relíquia: Arsenal dos Mil Invernos (armadas recebem 2 de dano a menos) ×2. General: Margrave Osric, Senhor das Marcas (nome aprovado).

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
| Cabide de Ferro ×3 | Infantaria 2/4, custo 2 | Postura: +1 ATK por equipamento preso (máx. +2). |
| Cavaleiro do Pinhal Cinzento ×3 | Cavalaria 3/4, custo 3 | Postura: Armada: +1 ATK. |
| Vigia da Torre Mofada ×3 | Infantaria 2/4, custo 3 | Postura: Armada: +1 HP em combate. |
| Cavaleiro Rompe-Escudos ×3 | Cavalaria 3/4, custo 3 | Ofensiva: Armada: 2 de dano à carta atrás. |
| Arqueiro do Último Sol ×2 | Arqueiro 2/3, custo 3 | Postura: Na Retaguarda, +1 ATK por equipamento preso (máx. +2). |
| Olho-de-Névoa ×3 | Arqueiro 1/3, custo 2 | Convocação: Leve 1 Equipamento do baralho para a mão. |
| Bigorna Andarilha ×3 | Infantaria 1/4, custo 2 | Queda: Leve 1 Equipamento do cemitério para a mão. |
| Recolhe-Espadas ×2 | Infantaria 2/4, custo 3 | Queda: O equipamento preso volta para a sua mão. |
| Traça-Vales ×2 | Arqueiro 1/3, custo 1 | Convocação: Leve 1 Terreno do baralho para a mão. |
| Grita-Passo ×2 | Infantaria 2/3, custo 3 | Convocação: Compre 1 carta. |
| O Contador de Lanças ×2 | Infantaria 2/3, custo 3 | Comando: Pague 1 de ouro: compre 1 carta. |
| Rédea-de-Vento ×2 | Cavalaria 2/3, custo 2 | Manobra: +1 ATK até o próximo turno. |
| Aldric Mil-Armas, Campeão das Marcas ×1 | Cavalaria 3/5, custo 4 | Postura: +1/+1 em combate por equipamento preso (máx. +3). |
| Mestre Pedra-de-Amolar ×1 | Infantaria 2/4, custo 3 | Postura: Suas Armadas: +1 ATK. |
| Cota de Mil Remendos ×3 | Tática, custo 1 | Equipe uma unidade: +1 ATK e +2 HP. Ela fica Armada. |
| Escudo Porco-Espinho ×2 | Tática, custo 1 | Equipe uma unidade: Guarda (absorve o primeiro golpe inteiro). Ela fica Armada. |
| Espada do Posto Esquecido ×3 | Tática, custo 1 | Equipe uma unidade: +2 ATK. Ela fica Armada. |
| Elmo das Três Rendições ×2 | Tática, custo 1 | Equipe uma unidade: +3 HP. Ela fica Armada. |
| Machado Racha-Tronco ×1 | Tática, custo 2 | Equipe uma unidade: +3 ATK. Ela fica Armada. |
| Casca de Aço ×2 | Tática, custo 2 | Equipe uma unidade: +2 ATK e +1 HP. Ela fica Armada. |
| A Forja que Nunca Apaga ×2 | Terreno, custo 3 | Escolha 1 modo no fim do seu turno. Muralha: suas Armadas têm +2 HP em combate. Afiação: suas Armadas têm +2 ATK. |
| Posto do Fogo-Sinal ×2 | Terreno, custo 2 | Escolha 1 modo no fim do seu turno. Trincheira: suas Armadas recebem 1 de dano a menos por ataque. Saque: ao destruir uma unidade inimiga, compre 1 carta (máx. 1 por ciclo). |
| Caixotes de Palha e Aço ×2 | Tática, custo 1 | Leve 1 Equipamento do baralho para a mão. |
| Dois Olhos na Crista ×2 | Tática, custo 2 | Leve 1 Equipamento ou Terreno do baralho para a mão. |
| A Coluna do Amanhecer ×1 | Tática, custo 2 | Leve 1 soldado do baralho para a mão. |
| Noite Sem Parar ×1 | Tática, custo 1 | 2 movimentos extras neste turno. |
| A Mata Devolve ×2 | Emboscada, custo 2 | Armada: a unidade atacada ganha +2 ATK e +1 HP até o fim do turno. |
| Dentes da Cerca ×1 | Emboscada, custo 2 | A unidade atacada ganha +3 HP até o fim do turno. |
| Arsenal dos Mil Invernos ×2 | Relíquia (5 de vida), custo 3 | Postura: Suas Armadas recebem 2 de dano a menos por ataque. |


Estrutura: 14 unidades (9 de identidade Armada, 3 de efeito geral, 2 únicas), 6 equipamentos (13 cópias), 2 Terrenos com modos (4 cópias), 4 Táticas gerais, 2 Emboscadas e 1 Relíquia.

**Modos dos Terrenos.** *A Forja que Nunca Apaga*: **Muralha** (Armadas +2 HP em combate) ou **Afiação** (Armadas +2 ATK). *Posto do Fogo-Sinal*: **Trincheira** (Armadas recebem 1 de dano a menos por ataque) ou **Saque** (ao destruir uma unidade inimiga, compre 1 carta, máx. 1 por ciclo). O Terreno entra no primeiro modo; o dono troca na Movimentação.

### Medição (IA × IA, 200 partidas por confronto)
**72,0% × Cardeal, 42,5% × Capitão, 60,0% × Mercenários.** A primeira montagem com equipamento universal e os atributos anteriores deu 86% / 68,5% / 80%: forte demais, porque qualquer equipamento em qualquer unidade rende mais. Reduzi os atributos dos núcleos e dois equipamentos (Espada do Posto Esquecido +2 ATK, Casca de Aço +2/+1); com isso as duas cartas de Terreno passaram a ajudar (+5,3 e +2,8 pontos na vitória ao comprar, antes ficavam abaixo das unidades). Perfil parecido com o da versão 1: forte contra os decks lentos e abaixo do Capitão.


### Nomes e Full Art (rodada 24)
**Nomes (feito):** o dono mandou trocar os nomes genéricos por nomes com personalidade (estilo do deck Mercenários; ver `docs/criacao-de-cartas.md`, "Nomes") depois de ver as imagens. Margrave Osric ficou. Como o deck ainda não está no jogo, não há nome antigo salvo em coleção nenhuma (não precisa de `LEGACY_CARD_NAMES`).

| Nome antigo (genérico) | Nome atual |
|---|---|
| Escudeiro de Campanha | Cabide de Ferro |
| Cavaleiro da Marca | Cavaleiro do Pinhal Cinzento |
| Guarda de Fronteira | Vigia da Torre Mofada |
| Lanceiro Montado | Cavaleiro Rompe-Escudos |
| Arqueiro de Colina | Arqueiro do Último Sol |
| Besteiro de Posto | Olho-de-Névoa |
| Armeiro de Campanha | Bigorna Andarilha |
| Escudeiro Veterano | Recolhe-Espadas |
| Mapeador de Marchas | Traça-Vales |
| Sargento de Marcha | Grita-Passo |
| Intendente de Marcha | O Contador de Lanças |
| Cavaleiro Batedor | Rédea-de-Vento |
| Campeão da Marca | Aldric Mil-Armas, Campeão das Marcas |
| Mestre de Armas | Mestre Pedra-de-Amolar |
| Cota Remendada | Cota de Mil Remendos |
| Escudo de Carvalho | Escudo Porco-Espinho |
| Espada de Posto | Espada do Posto Esquecido |
| Elmo Ferrado | Elmo das Três Rendições |
| Machado de Guerra | Machado Racha-Tronco |
| Armadura de Placas | Casca de Aço |
| Forja de Campanha | A Forja que Nunca Apaga |
| Posto de Marcha | Posto do Fogo-Sinal |
| Intendência de Campanha | Caixotes de Palha e Aço |
| Reconhecimento do Terreno | Dois Olhos na Crista |
| Reforços da Marca | A Coluna do Amanhecer |
| Marcha Forçada | Noite Sem Parar |
| Contra-Carga | A Mata Devolve |
| Cerca de Estacas | Dentes da Cerca |
| Arsenal do Marquês | Arsenal dos Mil Invernos |


### Quais cartas ganhar Full Art (proposta, a confirmar)
Sim (6): **Margrave Osric** (General, já é Full Art), **Aldric Mil-Armas, Campeão das Marcas** (única, o herói do deck, cena heroica vertical), **Arsenal dos Mil Invernos** (Relíquia, a sala de armas é uma cena grandiosa), **A Forja que Nunca Apaga** (Terreno de dois modos, a forja à noite funciona bem em retrato), **Casca de Aço** (o objeto-símbolo da identidade "Armada", figura alta e central) e **Mestre Pedra-de-Amolar** (única, retrato de personagem). Não: Táticas de busca e movimento, as emboscadas, os equipamentos simples, as unidades de 3 cópias. Cada Full Art precisa de uma **segunda arte** diferente da Padrão (ver `art-prompts/README.md`). Nada disso existe no jogo ainda (booster com arte alternativa e raridade vem depois).

### Artes (rodada 24)
**Todas as 30 artes recebidas** (rodada 24), conferidas contra as artes do jogo (nenhuma repetida; sem texto legível). Salvas em `src/assets/campo/<nome-sem-acento>.webp` com os nomes novos; **ainda não ligadas ao cliente** (o deck não está no catálogo): quando entrar no jogo, ligar por nome como `src/assets/capitao/`. **Uma precisa ser refeita:** *Dois Olhos na Crista* saiu com **binóculos e arma de fogo**, equipamento moderno que não existe no mundo do jogo; o prompt foi refeito (`art-prompts/deck-campo.md`, item 25) com "strictly medieval, no binoculars, no firearms". A arte atual fica só como provisória.

**Atualização (equipamento em uso):** por decisão do dono, os prompts do **Machado Racha-Tronco** (item 20) e da **Casca de Aço** (item 21) foram refeitos mostrando o equipamento **em uso por um soldado em ação** (rachando uma tora; resistindo a flechas numa brecha), e não mais o objeto exposto. Os 4 equipamentos já recebidos (Cota, Escudo, Espada, Elmo) ficam como objeto exposto.


### Efeito visual ao jogar (proposta, rodada 25; mockup dos 5 primeiros pronto em `public/mockups/efeitos-campo/`, ver `docs/animacoes.md`)
O Campo ainda não tem efeitos próprios (só a animação comum de equipar). Ordem sugerida, das que mais valem à pena:
1. **A Forja que Nunca Apaga** (Terreno): a forja acende no chão do campo, faíscas de bigorna; modo Muralha = brasa cinza-laranja com reflexo de pedra nas Armadas, modo Afiação = faíscas brancas de afiar; fica um brilho permanente baixo.
2. **Posto do Fogo-Sinal** (Terreno): uma torre de sinal acende na borda e a chama passa de uma ponta do tabuleiro à outra, coluna de fumaça; Saque solta brasas que viram uma carta, Trincheira levanta um barranco de terra.
3. **Noite Sem Parar** (Tática): a tela escurece para azul-noite, rastros de tocha seguem a unidade nos dois movimentos extras, lua fina.
4. **A Mata Devolve** (Emboscada): galhos e folhas estouram do chão em volta de quem foi atacado, onda verde-dourada e +2/+1 subindo.
5. **Casca de Aço** e **Machado Racha-Tronco** (equipamentos): a armadura se fecha peça por peça com estalos; o machado racha o chão com lascas de madeira e onda de choque.
6. **Arsenal dos Mil Invernos** (Relíquia, Full Art): armas sobem de uma geada, cristais de gelo cobrem a borda das Armadas, neve fina e fria permanente.
7. **Aldric Mil-Armas** (única): as armas dele se abrem em leque atrás do corpo, um número +1/+1 por equipamento.
8. Extras: **Dentes da Cerca** (estacas de madeira sobem à frente de quem defende), **Cavaleiro Rompe-Escudos** (onda quebra o escudo da carta de trás, estilhaços), **Margrave Osric** (Comando: equipamentos sobem do cemitério em chuva de metal), **Dois Olhos na Crista** (feixe varre o baralho e a carta achada voa à mão).

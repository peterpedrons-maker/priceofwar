# Reformulação dos textos das cartas (aplicada)

Aplicada em `src/engine/catalog.ts` (campo `effect`) com a etiqueta de bronze (estilo G) para a palavra do gatilho. O Cardeal Anselmo ganhou o gatilho Comando.

## Estilo (formato de TCG)

1. **Telegráfico.** Sem verbo quando o símbolo já diz: "+1 HP a uma unidade aliada", "3 de dano a uma unidade inimiga", "+2 ATK a …". Verbo só quando o efeito é uma ação ("Mova…", "Leve…", "Compre…", "Convoque…").
2. **Ganho de vida é sempre "+N HP"**, nunca "cure": no jogo a vida não tem teto, então o +HP vale para qualquer unidade, de vida cheia ou não, sem nota "mesmo com a vida cheia". Só o Samaritano de Aço diz "aliado ferido", porque exige uma unidade machucada.
3. **O gatilho carrega o que é padrão.** **Comando** quer dizer "habilidade ativa, 1×/turno" (por isso nenhuma carta repete "1×/turno"). **Manobra** é "ao mover". **Queda** é "ao ser destruída". Isso entra no glossário do jogo, não no rosto da carta.
4. **Condição primeiro, efeito depois**: "Na Vanguarda, …", "Se a da frente cair, …".
5. **Números e siglas fixos**: dígitos, "ATK", "HP", "+1/+1", "de ouro".
6. **Sem repetir o que a moldura já diz**: nada de "Permanente" em Relíquia/Terreno, nada de "equipado", nada de "à sua escolha".
7. **Nomes fixos**: unidade, aliado, inimigo, Vanguarda, Retaguarda, fileira, coluna, cemitério, baralho, mão.
8. Carta sem efeito (Penitente de Pedra, Paladino do Alvorecer) fica sem texto, em vez do "—".

### A palavra de gatilho (ainda em escolha)

Ver as imagens de estilos. Ideia atual: **etiqueta** antes do texto, em vez de só negrito — assim ela não se mistura com o resto. Opções: E (palavra numa linha própria com filete), F (selo escuro com letras claras), G (selo de bronze com o ícone do gatilho, a mesma cor do ícone ao lado do tipo).

## Textos propostos

Cartas com gatilho (Reforço, Postura, Comando, …) mostram a palavra automaticamente: o texto da coluna "Proposta" vem depois dela.

| Carta | Hoje | Proposta |
|---|---|---|
| Comandante Aurelion (General) | Após Remanejamento: até 2 unidades que se moveram ganham +2/+1 no próximo combate. Passiva: unidades adjacentes recebem -1 de dano. | **Fim do turno:** até 2 unidades que se moveram ganham +2/+1 no próximo combate. **Passiva:** Relíquia e Terreno recebem -1 de dano. |
| Cardeal Anselmo (General) | Fase Principal: cure 1 HP de um soldado aliado (grátis, 1 vez por turno; 2 vezes com o Cálice das Duas Bênçãos), mesmo com HP cheio. | **Comando:** +1 HP a uma unidade aliada. |
| Soldado Tático | Troca com aliado adjacente no fim do turno. | No fim do turno, troca de lugar com um aliado ao lado. |
| Escudeiro de Linha | Postura: Na Vanguarda: a unidade logo atrás dele, na mesma coluna, recebe -1 de dano. | **Postura:** recebe -1 de dano. Na Vanguarda, a carta atrás também recebe -1 de dano. |
| Capitão de Formação | Manobra: Adjacentes ganham +1 ATK. | **Manobra:** aliados ao lado ganham +2 ATK até o próximo turno. |
| Batedor | Move após combate. | Depois de atacar, move-se 1 casa de graça e ganha +1 ATK para sempre. |
| Lanceiro de Controle | Postura: Inimigo à sua frente recebe -1 ATK. | **Postura:** o inimigo à frente tem -2 ATK. |
| Cavaleiro Tático | Troca com qualquer aliado na linha. | Troca de lugar com qualquer aliado da fileira. Ao se mover, aliados ao lado ganham +1 ATK até o próximo turno. |
| Veterano de Guerra | Postura: +2 ATK na coluna 3. | **Postura:** +2 ATK na coluna central e +1 ATK na Vanguarda. |
| Reformar Linhas | Reorganiza até 3 unidades. | 3 movimentos extras neste turno. Compre 1 carta. |
| Avanço Coordenado | Após mover: +2 ATK. | +3 ATK a uma unidade que se moveu neste turno. |
| Reposicionamento Rápido | Move inimigo 1 slot. | Mova um inimigo para um espaço livre ao lado. |
| Linha Fechada | Adjacentes recebem menos dano. | -2 de dano, para sempre, nos aliados ao lado da unidade escolhida. |
| Ordem de Retirada | Move para a Retaguarda + cura. | Mova uma unidade da Vanguarda para a Retaguarda: +2 HP. |
| Bloqueio Instantâneo | Cancela ataque se houver adjacente. | Cancela um ataque a uma unidade com aliado ao lado. |
| Contra-Manobra | Troca posições durante o ataque. | Troca a unidade atacada com um aliado ao lado, que recebe o golpe. |
| Formação Quebrada | Move inimigo aleatoriamente. | Move o atacante para um espaço livre aleatório. O ataque falha. |
| Estandarte da Legião | Permanente. Todas as unidades aliadas ganham +1 ATK enquanto esta relíquia estiver no campo. | +1/+1 em combate às suas cartas em campo. |
| Fortaleza de Pedra | Permanente. Unidades aliadas na Retaguarda recebem -1 de dano de ataques inimigos. | Suas unidades na Retaguarda: -1 de dano de ataques. |
| Pântano Maldito | Permanente. Unidades inimigas na Vanguarda sofrem -1 ATK enquanto este terreno estiver no campo. | Inimigos na Vanguarda: -1 ATK. |
| Cálice das Duas Bênçãos | Permanente. A cura do General Cardeal Anselmo aumenta de 1 para 2 HP. | Seu General dá +2 HP em vez de +1. |
| Penitente de Pedra | — | (sem texto) |
| Cambista do Dízimo | Comando: Uma vez por turno, pague 1 de ouro: veja as 2 cartas do topo do deck. Adicione 1 à mão e mande a outra para o cemitério. | **Comando:** pague 1 de ouro: veja 2 cartas do topo do baralho, fique com 1 e mande a outra para o cemitério. |
| Confessor Silencioso | Postura: Na Vanguarda: impede Emboscadas inimigas. Se o General aliado receber dano, no próximo turno não poderá usar sua habilidade. | **Postura:** na Vanguarda, Emboscadas inimigas não ativam. Se seu General sofrer dano, ele fica sem habilidade no próximo turno. |
| Zeloso da Pira | Ofensiva: Se o General inimigo for de tipo oposto, ganha +2 ATK. | **Ofensiva:** +2 ATK contra General de facção oposta. |
| Noviço Renascido | Ao ser curado: recebe +1 ATK permanente. | Quando é curado: +1 ATK para sempre. |
| Despenseiro do Mosteiro | Comando: Uma vez por turno: se você tiver menos de 2 cartas na mão, compre até ficar com 2. | **Comando:** no início do turno, compre até ter 2 cartas na mão. |
| Sentinela do Claustro | Reforço: Se a carta da frente da coluna cair, esta desce e ganha Escudo 2. | **Reforço:** se a da frente cair, desce e ganha Escudo 2. |
| Jorge, Lança Sagrada | Ofensiva: Contra a Vanguarda, causa 2 de dano à unidade na Retaguarda da mesma coluna. | **Ofensiva:** ao atacar a Vanguarda, 2 de dano à carta atrás. |
| Samaritano de Aço | Comando: Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a um inimigo na Vanguarda. | **Comando:** +1 HP a um aliado ferido e 1 de dano a um inimigo da Vanguarda. |
| Barão da Procissão | Convocação: Convoca Acólitos Leais (1 ATK / 1 HP) nos slots adjacentes livres da mesma fileira. | **Convocação:** Acólitos Leais (1/1) nos espaços livres ao lado. |
| Paladino do Alvorecer | — | (sem texto) |
| Marechal do Sol Poente | Postura: Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK e +1 HP durante o combate. | **Postura:** na Vanguarda, seus Infantaria e Arqueiros têm +1/+1 em combate. |
| Arqueiro de Dois Sinos | Pode atacar duas vezes por rodada. | Ataca 2 vezes por rodada. |
| Vigia do Último Salmo | Queda: Compre 2 cartas. | **Queda:** compre 2 cartas. |
| Trabuco da Trombeta Final | Causa 2 de dano a TODAS as unidades inimigas. | 2 de dano a todas as unidades inimigas e ao General. |
| Catapulta do Dilúvio de Pedra | Escolha uma fileira inimiga. Todas as unidades naquela fileira recebem 2 de dano. | 2 de dano a todas as unidades de uma fileira inimiga. |
| Balestra da Penitência | Causa 3 de dano a uma unidade inimiga à sua escolha. | 3 de dano a uma unidade inimiga. |
| Couraça do Mártir | Infantaria equipada recebe +2 HP. | Equipe uma Infantaria: +2 HP. |
| Gibão Bento | Arqueiro, Plebeu ou Infantaria equipada recebe +1 HP. | Equipe uma Infantaria ou Arqueiro: +1 HP. |
| Setas de Cicuta | Arqueiro equipado recebe +1 ATK. | Equipe um Arqueiro: +1 ATK. |
| Lâmina do Juramento | Cavalaria, Infantaria ou Plebeu equipado recebe +2 ATK. | Equipe uma Infantaria ou Cavalaria: +2 ATK. |
| Preces na Sombra | Durante um ataque inimigo: um soldado aliado recebe +2 ATK e +1 HP até o fim do turno. | A unidade atacada ganha +2 ATK e +1 HP até o fim do turno. |
| Chamado do Túmulo Santo | Adicione um soldado do cemitério à sua mão. | Leve 1 soldado do cemitério para a mão. |
| Peregrinação ao Graal | Adicione uma carta de Terreno ou Relíquia do deck à sua mão. | Leve 1 Terreno ou Relíquia do baralho para a mão. |
| Sermão da Estratégia | Adicione uma carta de Tática do deck à sua mão. | Leve 1 Tática do baralho para a mão. |
| Alistamento do Púlpito | Adicione um soldado do deck à sua mão. | Leve 1 soldado do baralho para a mão. |
| Convocação dos Veteranos de Fé | Veja as 4 cartas do topo. Adicione 2 à mão e coloque 2 no fundo do deck. | Veja 4 cartas do topo: fique com 1 ou 2, o resto vai para o fundo. |
| Dízimo de Guerra | Ganhe 1 ouro adicional neste turno. | +1 de ouro neste turno. |
| Toque dos Sinos de Guerra | Convoque do deck até 2 soldados com 0 ATK para slots livres na Vanguarda. Embaralhe o deck. | Convoque até 2 soldados de 0 ATK do baralho para a Vanguarda. Embaralhe. |

## Erros de texto encontrados (o texto atual não bate com o que a carta faz)

- **Trabuco da Trombeta Final** também atinge o **General** inimigo; o texto só fala em unidades.
- **Aurelion**: a passiva reduz o dano da **Relíquia e do Terreno**, não de "unidades adjacentes".
- **Lâmina do Juramento** e **Gibão Bento** citam "Plebeu", um tipo que não existe no jogo. A Lâmina do Juramento só equipa Infantaria e Cavalaria; a Couraça, Infantaria e Arqueiro.
- **Preces na Sombra**: o bônus vai para a **unidade atacada**, não para "um soldado aliado".
- **Linha Fechada**: o -2 de dano é **permanente** (acumula), e o texto não diz.
- **Reformar Linhas**: dá 3 movimentos extras (cada unidade ainda se move uma vez), não "reorganiza 3 unidades".
- **Cálice das Duas Bênçãos / Cardeal Anselmo / Retirada**: o jogo chama de "cura", mas é só +HP sem teto; os textos passam a dizer +HP. O **Noviço Renascido** continua dizendo "cura", porque só dispara com efeitos de cura (não com Armadura ou outros bônus de HP).
- **Despenseiro do Mosteiro**: é automático no início do turno, não "uma vez por turno" por ativação.

## Como entra no jogo

- O texto vem de `src/engine/catalog.ts` (campo `effect`); é uma troca de strings, sem mexer em regras.
- Para a palavra de gatilho: em `FitEffectText` (App.tsx) passar para o rótulo a **mesma cor do texto**, mantendo negrito e dois-pontos. Para o General e outras cartas sem gatilho, o negrito vem do próprio texto.
- O tutorial cita alguns textos de carta; ficam como estão por enquanto.

## Símbolos dentro do texto (aplicado)

O catálogo continua com texto simples ("+2 ATK", "+1 HP", "3 de dano", "+1/+1"). Só na hora de desenhar a carta, `renderEffectText` (App.tsx, usado por `FitEffectText`) troca esses trechos pelos símbolos do jogo, sempre com o número **antes** do ícone:

- `+2 ATK` → **+2** e a espada (`ui-icon-sword.webp`); `-1 ATK` também.
- `+1 HP` → **+1** e o coração vermelho (`ui-icon-heart.webp`).
- `+1/+1` → os dois, um depois do outro.
- `3 de dano` → a estrela de dano com o 3 dentro. Redução ("-1 de dano") continua em palavras.

Os ícones são a arte dos efeitos de buff sem o "+" desenhado (o sinal é texto). Tamanhos em `em`, um pouco menores que duas linhas para que símbolos em linhas vizinhas não se encostem. O coração do efeito "+HP" (sheet `fx-hp-up-sheet` e o still) agora é vermelho; `tools/vfx/recolor_hp_up_red.py` refaz a recoloração e recorta os ícones de texto.

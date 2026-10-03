# Vocabulário do jogo

Linguagem única para textos de carta, avisos da partida, dicas, tutorial e conversa entre jogadores.
Regra de ouro: **cada ideia tem uma palavra só, e essa palavra é a mesma em todo lugar.**

**Status:** vocabulário aprovado. Já no jogo: a troca "invocar → convocar" nos textos e a **infraestrutura dos gatilhos** (ícone na linha do tipo +
nome em dourado no começo do efeito). **Gatilhos já aplicados** em 13 cartas (tabela da seção 5; o campo `trigger` está em `src/engine/catalog.ts` e sem ele a carta fica como era).
Ficaram de fora, por precisarem de decisão: Aurelion (dois gatilhos: Manobra + Postura), os Generais, Táticas/Emboscadas, Soldado Tático,
Batedor e Cavaleiro Tático. Nenhuma carta usa Reforço ainda.

## 1. Gatilhos (o *quando* do efeito)

Um gatilho é o momento em que o efeito da carta acontece. Na carta, a linha começa com o **ícone + nome do gatilho** em
dourado e depois o efeito em texto normal, como no Yu-Gi-Oh ("Efeito Flip: ..."):

> `[ícone] CONVOCAÇÃO — Convoca Soldados Leais nos slots adjacentes livres.`

| Gatilho | Quando acontece | Verbo que o jogador usa | Símbolo do ícone |
| --- | --- | --- | --- |
| **Convocação** | ao entrar em campo | convocar | corneta de guerra com flâmula |
| **Ofensiva** | ao atacar (corpo a corpo ou à distância) | atacar | lança e flecha cruzadas |
| **Queda** | ao ser destruída em campo | cair | elmo caído de lado, com pluma pendendo |
| **Manobra** | ao mover ou trocar de lugar | manobrar | mapa de guerra com rota tracejada |
| **Comando** | você ativa, uma vez por turno | comandar | manopla com o indicador apontando |
| **Postura** | passiva: vale enquanto a carta está em campo (e na posição certa) | — | torre de castelo |
| **Reforço** | a carta da frente da mesma coluna foi destruída: esta desce e ativa o efeito | reforçar | dois escudos, o de trás surgindo atrás do da frente |

Ícones: medalhão redondo, **sempre da mesma cor** (bronze envelhecido sobre fundo escuro), cada um com **um objeto claro e reconhecível** (sem tabuleiro, sem diagrama), legíveis a ~40 px. Bronze foi escolhido por contrastar com as molduras de ouro, prata e champanhe das cartas.
Prompts na seção 4z2 de `art-prompts/README.md`; arquivos esperados
`art-prompts/reference/ui-trigger-<nome>.jpg`: `summon`, `offensive`, `fall`, `maneuver`, `command`, `stance`, `reinforce`.

### Reforço (regras decididas)

- **Só quando a carta da frente é destruída.** Sair da coluna por outro motivo não dispara (mais fácil de equilibrar).
- **Só Infantaria** (tema: a cavalaria vai à frente, a infantaria vem atrás). Um deck de formação com cavalaria na
  frente e infantaria atrás é um arquétipo possível no futuro.
- **Não é universal.** Só cartas com a palavra "Reforço" descem sozinhas e têm o efeito. O Escudo 2 de hoje vira apenas um dos
  efeitos possíveis de uma carta com Reforço. Infantaria sem Reforço fica como reserva e só anda na Movimentação.
- A carta com Reforço tem **um efeito principal**: o Reforço conta como esse efeito. Balanceamento pela ficha da carta.
- A descida é automática; só pergunta algo se o efeito tiver escolha.
- **No motor (feito):** só desce a Infantaria cujo cartão tem o gatilho `reforco` (`canReinforce` em `src/engine/rules.ts` lê `card.trigger`, copiado do
  catálogo). A única carta marcada hoje é **Soldados da Ordem** ("Se a carta da frente da coluna cair, esta desce e ganha Escudo 2."), que também
  mantém o Tutorial 1 funcionando. As outras Infantarias ficam onde estão; marque outras cartas com `trigger: "reforco"` no catálogo.

## 2. Verbos fixos

| Ideia | Verbo | Exemplo |
| --- | --- | --- |
| Colocar uma unidade em campo | **convocar** | "Eu convoco o Cavaleiro da Luz." |
| Jogar uma Tática | **usar** | "Eu uso Balestra de Precisão." |
| Colocar uma Emboscada | **armar** | "Eu armo Bloqueio Instantâneo." |
| Mudar de casa | **mover** / **trocar** | "Move 1 casa." / "Troca com aliado adjacente." |
| Carta destruída em campo | **cair** / **destruída** | "A Devotos caiu." |

"Invocar" não existe mais. Tudo que traz tropas ao campo é **convocar**
(já trocado em Nobre da Cruzada, Chamado às Armas, descrição do Deck Cardeal Pedro e nas mensagens da partida).

## 3. Lugares e palavras de campo

- **Vanguarda** (frente) e **Retaguarda** (trás) são as duas **fileiras**.
- **Coluna** é de cima a baixo (1 a 5). Nada de "linha" solta nos textos.
- **Fase de Movimentação**: o nome da fase continua, mas dentro dos textos de carta o verbo é **mover** (não "Remanejamento",
  "Reposicionamento", "Reorganiza").

## 4. Palavras-chave com número

Não são gatilhos: são mecânicas. Ficam em **negrito** no texto, sem ícone próprio por enquanto:
**Escudo N**, **Bloqueio**.

## 5. Como cada carta atual se encaixa (referência)

| Gatilho | Cartas de hoje |
| --- | --- |
| Convocação | Nobre da Cruzada |
| Ofensiva | Fanático da Cruzada ("Ao atacar"), Jorge, Lança Sagrada ("Ao atacar a Vanguarda") |
| Queda | Atirador da Cruzada (hoje diz "ao ir ao cemitério"; passa a valer só para destruída em campo) |
| Manobra | Capitão de Formação, Aurelion ("Após Remanejamento"), Avanço Coordenado ("Após mover") |
| Comando | Mercador, Intendente, Hospitalário e as habilidades dos Generais |
| Postura | Escudeiro de Linha, Lanceiro de Controle, Comandante da Ordem, Veterano de Guerra, Infiltrado da Ordem, passiva do Aurelion |
| Reforço | nenhuma ainda |

Sem gatilho próprio por ora (texto simples): "ao ser curada" (Recruta Devoto), "fim do turno" (Soldado Tático) e
"após o combate" (Batedor). Se aparecerem mais cartas assim, criar gatilho. Táticas e Emboscadas **não** levam ícone de
gatilho: o tipo da carta já é a identidade. Relíquias e Terrenos seguem com "Permanente." (ficam na casa), diferente de Postura.

## 6. Como o vocabulário vira linguagem de verdade

1. Mesmas palavras nos textos de carta, nos avisos que aparecem quando o efeito dispara
   (ex.: "Queda: compre 2 cartas"), no tutorial e nas dicas.
2. Glossário curto: tocar no rótulo da carta aberta mostra a definição em uma linha.
3. Ensinar na lição de habilidades (Tutorial 2), quando as regras estiverem fechadas.

## 7. Pendências de nomes

- A Emboscada **Reforços Ocultos** tem a palavra do gatilho: renomear (sugestão: "Tropas de Flanco").
  *Couraça Reforçada* é só adjetivo e pode ficar.
- Atirador da Cruzada: "ao ir ao cemitério" → Queda (apenas destruída em campo; descarte por limite de mão não conta).
- Cartas com "Remanejamento", "Reposicionamento" e "Reorganiza" nos textos: padronizar em **mover/trocar**.
- Aplicar gatilhos e rótulos nas cartas só quando os ícones estiverem prontos e o mockup for aprovado.

## 8. Como o gatilho aparece na carta (implementado)

- **Dado:** `trigger?: Trigger` em cada entrada de `CARD_DEFS` (`src/engine/catalog.ts`); tipos e rótulos em `src/engine/types.ts`
  (`Trigger`, `TRIGGER_LABEL`). Exemplo: `{ name: "Nobre da Cruzada", trigger: "convocacao", ... }`.
- **Ícones:** `src/assets/trigger-<nome>.webp` (256 px, bronze, **sem aro**, borda esfumada nos 7% finais), ligados em `src/triggers.ts`.
  Origem: folha enviada pelo usuário (`art-prompts/reference/ui-trigger-sheet.jpg`), recortada em círculo.
- **Linha do tipo:** o ícone fica à direita do tipo (ex.: "INFANTARIA ●"). Moldura padrão: altura = 72% da caixa do tipo (7% da carta ≈ 5%
  da altura). A abertura da faixa na arte tem ~4,4% da altura da carta, **constante entre 30% e 70% da largura**, então mover o ícone
  para o centro não ganha altura; acima do limite a moldura, desenhada por cima, corta o ícone. Arte cheia: 1,5 em da fonte do tipo.
- **Texto:** o nome do gatilho entra em dourado e negrito como primeira palavra do efeito ("Queda: ao cair, compre 2 cartas").
- **Onde aparece:** carta aberta, carta levantada na mão e leque (parcial). Cartas pequenas do campo não mostram texto nem ícone.

Textos já ajustados para não repetir o gatilho: Nobre da Cruzada ("Convoca Soldados Leais..."), Fanático da Cruzada ("Se o General inimigo
for de tipo oposto, ganha +2 ATK."), Jorge ("Contra a Vanguarda, causa 2 de dano..."), Atirador da Cruzada ("Compre 2 cartas.", que no motor
já só vale quando ela é destruída em campo) e Capitão de Formação ("Adjacentes ganham +1 ATK."). Comando e Postura mantêm o texto
(o "uma vez por turno" continua escrito).

## 9. Brilho quando o efeito dispara (implementado)

- **Um brilho só, dourado, para todos os gatilhos** (`TRIGGER_GLOW` em `src/triggers.ts`). O ícone e o nome do gatilho dizem qual efeito foi;
  o brilho só diz "o efeito desta carta disparou". Sem faíscas e sem extras por gatilho (decisão do usuário).
- **A carta brilha com o contorno exato dela** (nunca um retângulo): `TriggerBurst` em `src/App.tsx` usa as mesmas máscaras de silhueta do
  `AbilityReadyGlow` (`silhouetteFor`). Camadas: brilho externo, lavagem de cor, faixa de luz atravessando e uma onda com o formato da carta
  que cresce e some (CSS `tb-*` em `src/index.css`, cerca de 1 s).
- **O ícone brilha onde já existe** (carta aberta ou em destaque), sem mudar de tamanho (`TriggerIcon`, classe `tb-icon`). As cartas pequenas
  do tabuleiro continuam sem ícone.
- **Quando dispara:** Convocação quando a carta aparece no tabuleiro; Queda quando ela cai; Ofensiva no evento `attack`; Manobra no evento
  `move`; Comando no evento `ability`. Postura e Reforço não têm brilho de disparo (Postura é passiva; Reforço ainda não tem cartas).
- **Comando, antes de ativar:** continua valendo o brilho de "efeito pronto" que já existia (`AbilityReadyGlow`).
- **Teste manual:** com `?debug`, `window.__powBurst('player', slot)` toca o brilho da carta daquele espaço.

## 10. Fluxo do efeito: a carta flutua, brilha com o som e espera a decisão (implementado)

1. **A carta flutua** para fora do espaço (a de verdade fica escondida, `holdsRef`), com a mesma pose de elevação do equipar
   (`TriggerFloatLayer`, z 213 a 215: acima do tabuleiro e **abaixo** dos pedidos de escolha e de alvo, z 220).
2. **O brilho dourado toca sincronizado com o som** `src/assets/sfx-efeito-magico.mp3` (1,9 s): o som cresce a partir de ~0,2 s, tem um
   primeiro golpe em ~0,4 s e o golpe principal em ~0,73 s. As animações `tb-*` em `src/index.css` seguem esses marcos (brilho sobe, pico em
   ~0,73 s, onda em 0,7 s, ícone em 0,45 s). Se trocar o som, reajuste esses tempos.
3. **A carta continua flutuando enquanto alguém ainda tem de decidir** (`startTriggerFx(..., hold)`, `holdForSeat`): o jogador escolhendo uma
   carta ou um alvo (Mercador, Hospitalário). O que o efeito pergunta só aparece **depois do brilho** (`whenGlowDone`). Quando a decisão
   termina, a carta pousa. Efeitos automáticos flutuam, brilham (~1,5 s) e pousam.
4. **Bloqueio do adversário (futuro):** a janela em que o adversário decide se bloqueia o efeito entra no mesmo `hold`: enquanto ela estiver
   aberta, a carta continua no ar. Hoje não existe bloqueio de efeitos, então só a decisão do jogador segura a carta.
5. **Quais gatilhos flutuam:** Convocação (quando a carta aparece no tabuleiro), Manobra (depois que ela se move) e Comando (ao ativar).
   **Queda** (a carta está queimando) e **Ofensiva** (a carta está no meio do ataque) só brilham no lugar e tocam o som, sem flutuar.
6. Teste manual (`?debug`): `window.__powTrigger('player', slot, holdMs)` roda o fluxo completo; `window.__powBurst('player', slot)` só o brilho.

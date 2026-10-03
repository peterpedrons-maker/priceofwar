# Vocabulário do jogo

Linguagem única para textos de carta, avisos da partida, dicas, tutorial e conversa entre jogadores.
Regra de ouro: **cada ideia tem uma palavra só, e essa palavra é a mesma em todo lugar.**

**Status:** vocabulário aprovado. Já no jogo: a troca "invocar → convocar" nos textos e a **infraestrutura dos gatilhos** (ícone na linha do tipo +
nome em dourado no começo do efeito). **Nenhuma carta usa gatilho ainda**: cada carta recebe o seu quando o texto dela for revisado
(campo `trigger` em `src/engine/catalog.ts`; sem o campo a carta fica como era).

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
- Hoje o motor ainda aplica a descida e o Escudo 2 a toda Infantaria (`canReinforce` / `reinforceFrom`); **mudança pendente**.

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

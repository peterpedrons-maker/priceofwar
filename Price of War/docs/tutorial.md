# Tutoriais (como funcionam por dentro)

O menu **Tutoriais** abre uma lista (`TutorialList`, `src/tutorial/ui.tsx`). Hoje existe o tutorial 1, **"Seu primeiro duelo"**
(roteiro em `docs/tutorial-1-roteiro.md`); os outros dois (habilidades das cartas; táticas e emboscadas) aparecem como "Em breve".
Para criar outro tutorial: acrescentar em `TUTORIALS` e escrever o roteiro dele (hoje há um roteiro só, `STEPS`/`BEATS` em `src/tutorial/script.ts`).

## Peças

| Arquivo | O que tem |
| --- | --- |
| `src/tutorial/script.ts` | Dados puros: a lista, a partida fixa (`createTutorialMatch`: mãos e compras escritas à mão), as jogadas do treinador (`ENEMY_SCRIPT`), os passos (`STEPS`) e as falas do treinador (`BEATS`). Testado sem tela em `tests/tutorial-script.ts` (o jogador vence no 4º turno). |
| `src/tutorial/ui.tsx` | O Aldric (`NpcPortrait`, `NpcPanel`), a mãozinha (`TapHand`), o escurecimento com buracos (`Spotlight`), a lista e a conversa de abertura. |
| `src/App.tsx` | O diretor (`tutShow`, `tutNext`, `tutSignal`, `tutBeat`…), o palco (`TutorialStage`, que mede o tabuleiro e acende o que o passo aponta) e a trava de toques. |

## Passos

Cada passo (`Step`) é de **ler** (botão ENTENDI), de **fazer** (só o que está aceso responde; `until` diz o que conta como feito),
de **esperar** (`wait`) ou a vez do treinador (`enemy`). `targets` diz o que acender: uma casa/carta (`{ sel: '#player-3' }`), várias
(`{ sels }`), a mão (`{ hand: true }`) ou uma carta da mão pelo nome (`{ handCard: 'Sentinela do Claustro' }`).
O passo só aparece quando o tabuleiro está quieto (sem faixa de fase nem animação). A vez do treinador chama `tutBeat('start' | 'afterAttack')`
para parar e explicar entre as jogadas dele (`BEATS['enemy<rodada>:<momento>']`).

## O visual

- **Buraco exato:** uma carta no tabuleiro é recortada com a silhueta dela (as mesmas máscaras de `AbilityReadyGlow`, `mask-*.webp`), e o contorno
  dourado que pulsa usa a máscara de borda (`-rim`). Cartas da mão usam `mask-hand-*.webp` (gerados por `tools/vfx/card_masks.py`). Uma carta
  inclinada no leque da mão mantém o leque aceso e ganha só o contorno, inclinado igual a ela. Casas vazias, ouro e painel de fases são retângulos arredondados.
- **Mãozinha:** `tut-hand.webp`; ela aperta e solta, emite ondas e **pisca devagar** (animações `tut-tap`, `tut-blink`, `tut-ripple` em `index.css`).
- **O Aldric:** as imagens `src/assets/npc-instrutor-<neutral|point|happy|warn|think|cheer>.webp` são pegas sozinhas (`import.meta.glob`);
  sem elas aparece uma silhueta. Prompts em `art-prompts/README.md` (4z).
- Cada fala tem **REPETIR** (toca de novo) e **VOLTAR** (volta ao passo de leitura anterior); **PULAR** sai do tutorial.

## A trava de toques

Enquanto o tutorial roda, um ouvinte na janela (fase de captura) engole todo toque, menos os do painel do instrutor (`data-tut-ui`) e, num passo
de fazer, os que caem dentro de um retângulo aceso (o palco publica a lista em `tutAllowRef` a cada quadro). Por isso o jogador não consegue sair do roteiro.
No tutorial: Compra e Suprimentos só andam quando o jogador toca nelas (a partida normal continua automática), a habilidade do General fica desligada,
o adversário joga o roteiro e o pop-up de carta fica desligado.

## Teste

`npx tsx tests/tutorial-script.ts` (também em `npm test`) joga o duelo inteiro no motor e confere: mãos só de soldados, passos sem repetição,
vitória do jogador no 4º turno.

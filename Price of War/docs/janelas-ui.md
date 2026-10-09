# Janelas do jogo e o kit de interface (levantamento + mockup)

Pedido do dono: aplicar o kit de interface (o mesmo da tela de Desafios) às demais janelas, aos poucos. Primeiro passo: levantar o que existe e mostrar 5 janelas com o kit para aprovar (`/mockups/janelas/`, com botão Antes/Depois; comparativos em `docs/janelas/`). **Passo 1 aplicado no jogo** (ver "No jogo" no fim).

## O que existe hoje (em `src/App.tsx`, `src/ui/ThinFrame.tsx`)
Duas famílias de peças:
- **Janelas de menu:** `WindowOverlay` (fundo escuro + centraliza) → `FramedWindow` (moldura ornamentada `ui-window-frame` em 9 fatias + couro estampado) → `WindowTitle` (Cinzel Decorative + `WindowDivider`), `WindowText`, `WindowOption` (linha tocável), `WindowButton` (usa `ThinFrame`), `ToggleRow`, `VolumeRow`, `ArtChip` (aba/pílula).
- **Partida:** `ThinFrame` (moldura fina dourada em 9 fatias) → `GameBox` (caixa de aviso) e `GameButton` (botão com tons primary/danger/neutral/gold). Todos os avisos, dicas, toasts e botões em jogo usam isso.

Uso (contagem de `<Componente>` em `App.tsx`): WindowButton 41, FramedWindow 16, WindowTitle 16, GameButton 15, WindowOverlay 11, WindowText 11, ThinFrame 10, GameBox 5, ToggleRow/VolumeRow/WindowOption/ArtChip 3 cada.

## Janelas e telas (e o que usam)
| Tela | Componente | Base atual | Prioridade |
|---|---|---|---|
| Opções (Avisos, Efeitos, Som) | `OptionsModal` | FramedWindow + ToggleRow/VolumeRow/WindowButton | 1 |
| Configurações (conta) | `SettingsModal` | FramedWindow + WindowButton | 1 |
| Online (Casual/Ranqueado) | `OnlineModeModal` | FramedWindow + WindowOption | 1 |
| Escolha de avatar | `AvatarPickerModal` | FramedWindow | 2 |
| "Em breve", Instalar app | `ComingSoonModal`, `InstallPrompt` | FramedWindow | 2 |
| Escolha de deck (Online casual) | `DeckPickerModal` | FramedWindow + WindowOption | 2 (some quando o casual ganhar a tela nova) |
| Editor de decks | `DeckEditor` (tela cheia) | ThinFrame, ArtChip, WindowButton | 1 (a mais confusa hoje) |
| Loja | `ShopScreen` (cena do mercador + fala) | FramedWindow/ThinFrame na fala | 1 |
| Sala de Coleção | `CollectionRoom.tsx` | arte própria | 3 |
| Login, criar perfil | `LoginScreen`, `ProfileSetupScreen` | campos próprios | 2 |
| Buscando adversário, carregando | `MatchSearchOverlay`, `OnlineSearchOverlay`, `LoadingScreen` | FramedWindow/avulso | 3 |
| Em partida: prompts (emboscada, manutenção, modo da Relíquia, escolher carta, cemitério, fim de jogo, recompensa) | GameBox/GameButton | ThinFrame | **por último, só com mockup aprovado** |

## Como aplicar (proposta)
1. **Componentes do kit** (novo arquivo, ex. `src/ui/Kit.tsx` + CSS): `KitWindow` (moldura `modal-frame` + título com divisor), `KitButton` (primário dourado com espadas, secundário escuro, desabilitado), `KitRow` (linha com encaixe de retrato, normal/selecionada/bloqueada), `KitToggle` (ON/OFF), `KitSlider`, `KitTab`, `KitChip`, `KitIconButton`.
2. **Trocar por dentro** `FramedWindow`, `WindowTitle`, `WindowButton`, `WindowOption`, `ToggleRow`, `VolumeRow`, `ArtChip` para usarem o kit: as janelas que já usam esses componentes mudam sozinhas (≈16 janelas).
3. Telas feitas à mão (Editor de decks, Loja, Login) ficam para uma segunda rodada, uma por vez.
4. A partida (`GameBox`/`GameButton`) fica fora até haver mockup aprovado; é onde mais importa a leitura das cartas e o peso no celular.

## Peças que ainda faltam no kit (gerar com a IA, como foi o kit)
Abas (ativa/inativa, hoje o mockup usa CSS), campo de texto (busca, nome, login), barra de rolagem, balão de fala/aviso, selo de moeda e de XP (a moeda do mockup é CSS), caixa de seleção, botão de perigo (vermelho), botão com ícone. Dá para gerar tudo numa folha, no formato de `art-prompts/ui-kit.md`.

## O que o mockup mostra (e o que muda de verdade)
As janelas atuais já são coerentes e bonitas; o ganho do kit é mais de **hierarquia e consistência** do que de beleza:
- botão principal sempre dourado com espadas, secundário sempre escuro, nunca dois iguais lado a lado;
- interruptores com ON/OFF escrito, controles de volume mais "táteis", linhas com encaixe de retrato (decks, Online);
- título com dourado em degradê e divisor ornamentado, iguais ao da tela de Desafios.
Pontos de atenção: o texto da descrição fica um pouco maior (Crimson Pro 13,5 px); o editor de decks ganha cabeçalho mais limpo, mas continua com a mesma grade de cartas; a Loja só troca o quadro de fala e os botões (a cena do mercador continua igual).

## Peças novas do kit (já extraídas)
- Em `public/mockups/janelas/kit/`: abas (`tab_on/off`), campo de busca, contador, botão de perigo (vermelho), moeda "+", balão de fala, botão do slider e ícones (`i_voltar`, `i_busca`, `i_filtro`, `i_carta`, `i_lista`, `i_grade`, lixeira etc.). O mockup `public/mockups/janelas/` já usa todas.
- Ressalvas: os ícones têm contorno vinho escuro, um pouco mais "cartoon" que o resto do kit; textos que a IA pôs nos selos foram apagados; conferido só no navegador de computador (390×844), não no celular.
- Próximo passo (depois da aprovação do dono): criar `src/ui/Kit.tsx` e trocar o interior de FramedWindow/WindowTitle/WindowButton/WindowOption/ToggleRow/VolumeRow/ArtChip.

## No jogo (passo 1, aplicado)
- `src/ui/Kit.tsx` + `src/ui/kit.css` + `src/assets/kit/`: `KitWindow`, `KitTitle`, `KitButton` (normal/gold/danger), `KitRow`, `KitTab`, `KitToggle`, `KitRange`.
- `FramedWindow`, `WindowTitle`, `WindowButton` (novo `danger`), `WindowOption`, `ArtChip`, `ToggleRow`, `VolumeRow` em `App.tsx` agora só chamam o kit; as ≈16 janelas mudaram sozinhas (conferidas: Opções, Configurações, Online). "Sair da conta" usa o botão vermelho.
- `WindowOption` usa a linha do kit sem encaixe de retrato (o conteúdo traz o próprio ícone).
- **Editor de decks (passo 2, aplicado):** moldura simples escura (sem a moldura ornamentada), botão de voltar e de visualização com `KitIconButton`, abas Deck 1–3 e Salvar com `KitTab`, placa do deck com o retrato do General no encaixe (`KitPlate`) e contador `KitCount` (verde; vermelho se fora do limite), Deck/Reserva em abas grandes, busca `KitSearch`, Filtros como `KitButton` (dourado com contador quando há filtro) e rodapé Limpar deck (vermelho) / Preencher automático (dourado). A grade e a lista de cartas não mudaram. Peças novas em `src/ui/Kit.tsx`.
- **Loja (passo 3, aplicado):** a fala do mercador, o detalhe do booster e os botões já vinham do kit (passo 1); agora o saldo de Coroas na prateleira é a pílula com moeda (`KitCoins`). O balão com rabinho do mockup não foi usado (a janela de fala continua a moldura do kit).
- **Login e Criar perfil (passo 4, aplicado):** `AuthButton` agora usa `KitButton` (cinza ou dourado) e os campos de texto usam `KitField` (moldura `campo.png`, acende no foco). A moldura e o título já vinham do kit.
- Os ícones de Google e Discord do login são os logotipos oficiais (SVG de gilbarbara/logos, em `src/assets/brand/`), não desenhos nossos.
- Ainda no estilo antigo: só a partida (GameBox/GameButton, avisos e prompts), que fica por último, com mockup aprovado antes. `ThinFrame`, `uiWindowFrame` e `.vol-range` seguem usados por essas telas.
- Correção: `KitRow` com `icon` usa a arte com encaixe de retrato (o ícone vai dentro do encaixe, como no mockup); sem `icon`, usa a faixa lisa do botão secundário. Antes a arte do encaixe era esticada nas linhas sem retrato e aparecia uma moldura deslocada (tela Online).

## Mockup dos prompts da partida (aguardando aprovação; nada aplicado no jogo)
`public/mockups/partida/` (https://peterpedrons-maker.github.io/priceofwar/mockups/partida/): cinco telas com botão Antes/Depois sobre uma captura real do tabuleiro: Tabuleiro (Opções/Sair, aviso de ouro, dica "Arraste a carta"), Emboscada, Manutenção, modo da Relíquia e Escolher carta. O "antes" do tabuleiro é a captura real; os demais "antes" são réplicas do `GameBox`/`GameButton` atuais (`src/ui/ThinFrame.tsx`). As cartas dos prompts são capturas reais de outras cartas (só ilustram).
Decisões propostas (a aprovar): botão afirmativo (Ativar, Pagar, Confirmar, Encerrar turno) passa de **verde** para **dourado com espadas**; neutro = escuro do kit; Cancelar = vermelho (perigo); caixas de pergunta/aviso = faixa `toast.png` (vermelha para Emboscada); títulos grandes no estilo das janelas; seletor redondo (`radio`) nas linhas do modo da Relíquia; carta escolhida brilha em dourado (hoje verde).
Se aprovado, a troca é por dentro de `GameBox` e `GameButton` (`src/ui/ThinFrame.tsx`) mais os títulos dos prompts em `App.tsx`; pesar a leitura das cartas e testar no celular.

- **Botão dourado sem espadas (pedido do dono):** as espadas cruzadas das pontas foram apagadas da arte `btn-primary` (e das versões `-dark` e `-off`) por interpolação do dourado; vale para o jogo (`src/assets/kit/`, `src/assets/desafios/ui/`) e para os mockups. As pontas do botão ficaram mais curtas (`border-width` 24 px no kit, 34 px no Batalha). Original com espadas: `git show 7cea410:"Price of War/public/mockups/desafios/ui/btn-primary.png"`.

- **Mockup, cartas sem caixa:** as cartas do mockup `partida/` agora são recortes com transparência real (capturadas duas vezes, sobre preto e sobre branco, e separadas por diferença), então o brilho segue o contorno da carta. Antes havia um retângulo escuro em volta (erro do mockup, não do jogo).
- **Botão de fase (central):** tela "Botão de fase" do mockup com 3 ideias curtas (o dono achou a primeira rodada com muito texto): A "PRÓXIMA FASE »"; B "ENCERRAR PREPARAÇÃO »" / "ENCERRAR COMBATE »" / "ENCERRAR MOVIMENTO »" (combina com "ENCERRAR TURNO") com o próximo medalhão pulsando; C só visual (seta animada + próximo medalhão pulsando). Hoje (`src/TurnTracker.tsx`) a faixa mostra o nome da fase e `››`; tocar avança a fase (da última, encerra o turno). Recomendação: B. Mockup: `/mockups/partida/`.

- **Botão de fase aplicado no jogo (opção B, aprovada):** `TurnTracker` ganhou a prop `action`; a faixa mostra o nome da fase enquanto ela é automática (COMPRA, SUPRIMENTOS) e durante o banner "Fase de ..."; **depois que o banner acaba** vira "ENCERRAR PREPARAÇÃO »", "ENCERRAR COMBATE »" ou "ENCERRAR MOVIMENTAÇÃO »", e o próximo medalhão pulsa. Controle: `bannerDoneKey` em `App.tsx` (fase do turno cujo banner já passou), desligado no tutorial e no turno do adversário. GIF do jogo real: `docs/janelas/fase-botao.gif`.

## Partida com o kit (aplicado)
- `GameButton` e `GameBox` (`src/ui/ThinFrame.tsx`) agora usam a arte do kit: botão **dourado** (tons `primary`/`gold`), **escuro** (`neutral`), **vermelho** (`danger`) e caixa de aviso/dica `toast.png`. Botões pequenos (fonte ≤ 12) usam a versão compacta (34 px). As dicas "Arraste a carta para o campo", "Segure e arraste..." e o motivo de carta bloqueada viraram `GameBox`; o "Cancelar" da carta selecionada é um `GameButton danger`.
- Decisão do dono: **os dois botões de uma mesma pergunta têm a mesma cor** (dourado): Não ativar/Ativar (Emboscada), Pagar/Dispensar (Manutenção), Voltar/Encerrar turno (modo da Relíquia), Começar/Ir depois (moeda). O estado "dispensado" da Manutenção aparece na carta apagada e na nota, não na cor do botão. A carta escolhida no "escolher carta" brilha em dourado (era verde).
- Cuidado: **não use `all: unset` em `kit.css`**; ele apagava `position: fixed`/`z-index` vindos do Tailwind (os botões Opções/Sair sumiram do topo). Resets agora são explícitos.
- Não mudaram: a barra de fase e o ENCERRAR TURNO (arte própria), os títulos grandes dos prompts de carta (Manutenção, Relíquia) e o resto do HUD; ver o mockup `/mockups/partida/` para a próxima rodada (títulos no estilo das janelas, seletor redondo nas linhas do modo da Relíquia).

- **Correção de entendimento (botões do meio):** "os dois botões na mesma cor" era sobre a **faixa de fase + "ENCERRAR TURNO"** do meio da tela, não sobre os pares Ativar/Não ativar. Agora o segmento "Encerrar turno" usa a mesma cor da faixa: **verde nos dois** na vez do jogador (apagado enquanto não puder encerrar) e **vermelho nos dois** na vez do adversário (`.trk-end` usa `--b1/--b2/--glow` da paleta de `TurnTracker`). Os pares Ativar/Não ativar etc. ficaram dourados, o que continua valendo.

- **Turno do meio (decisão final):** a faixa mostra "TURNO DO ADVERSÁRIO" (vermelha) na vez dele; o segmento "Encerrar turno" é **verde aceso** quando dá para tocar e **cinza apagado** quando não dá (vez do adversário, Compra/Suprimentos, banner). A cor da faixa diz de quem é o turno; a do botão diz se está disponível.

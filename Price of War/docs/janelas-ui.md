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

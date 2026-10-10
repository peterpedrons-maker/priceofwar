# Price of War — teste no Godot

Projeto de teste, **separado do jogo web** (a pasta `Price of War/` não foi tocada). Serve só para
ver como o jogo ficaria no Godot.

## Como abrir
1. Abra o Godot (versão **4.3 ou mais nova**; testado na 4.3.1 estável, renderizador *GL Compatibility*).
2. **Importar** → escolha o arquivo `project.godot` desta pasta → **Importar e editar**.
3. Na primeira abertura ele importa as imagens (leva alguns segundos). Aperte **F5** para rodar.

A janela abre em 390x844 (proporção de celular). Para simular outros tamanhos, mude em
*Projeto → Configurações do Projeto → Tela (Display) → Janela*.

## O que já está aqui
Só o **menu principal**, refeito com as mesmas artes do jogo web: fundo, logo, placa de perfil
(avatar, nível, nome, XP), pílula de Coroas, os 4 botões (Desafios, Online, Meu Deck, Loja) e a
fileira de ícones. O avatar troca (toque nele) e a escolha fica salva; os demais botões abrem um
aviso "em breve", igual ao web. **Ainda não existe partida** — o tabuleiro, as cartas e as regras
continuam só na versão web.

## Onde mexer
- `scenes/main_menu.tscn` — cena principal (só um nó com o script).
- `scripts/main_menu.gd` — monta toda a tela por código; as medidas em fração (0 a 1) são as
  mesmas da versão web. Um comentário no topo explica.
- `assets/` — cópias das artes e das fontes Cinzel usadas no menu.

## Teste sem abrir o editor (opcional)
`godot --path . -- --shot=print.png` salva um print do menu e fecha. Também aceita
`--open=avatar` ou `--open=soon` para abrir uma das janelas antes do print.

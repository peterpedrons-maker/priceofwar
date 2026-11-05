# Tutorial 1 — "Seu primeiro duelo" (roteiro)

Primeiro item do menu **Tutoriais**. Duelo roteirizado, completo, em que o jogador **sempre vence no 4º turno dele**.
Este documento é o roteiro: o que aparece, o que o jogador é obrigado a tocar e o que o painel explica.
Os mockups visuais estão em `art-prompts`/conversa; o duelo foi testado no motor real em `tests/tutorial-script.ts`.

## Regras do tutorial

- **Só unidades de soldados** na mão e no baralho: Infantaria e Cavalaria sem efeito. Nada de Tática, Emboscada,
  Relíquia ou Terreno (ficam para o Tutorial 2 e 3).
- **Todas as habilidades desativadas** (General e cartas). Habilidades de busca/cemitério/baralho = Tutorial 2.
- **Táticas e Emboscadas** = Tutorial 3. O jogo avisa isso uma única vez ("Você aprende isso em outro tutorial").
- O jogador começa (a moeda sempre cai para ele). General dele: Cardeal Anselmo. Adversário ("o treinador"): Comandante Aurelion.
- Mão, ordem das compras e jogadas do treinador são fixas. Só o que está em destaque pode ser tocado.
- Todo passo é de **ler** (botão ENTENDI) ou de **fazer** (só o alvo em destaque responde; mãozinha animada).
- Botão PULAR sempre visível. Dicas ligam/desligam nas configurações.
- Compra e Suprimentos só pedem toque **neste tutorial**, nos dois primeiros turnos. Depois são automáticas, com aviso.

## Cartas e números (verificados no motor)

Mão inicial (7): Penitente de Pedra (0/3, custo 1), Sentinela do Claustro ×3 (3/4, custo 2), Paladino do Alvorecer (4/5, custo 3), Devotos, Soldados.
Compras: T1 Soldados, T2 Paladino do Alvorecer, depois Soldados. Ouro: 15 no início, +5 a partir da 2ª rodada.
Treinador: Sentinela do Claustro e Penitente de Pedra. General dele: 20 de vida (o treinador é mais fraco; numa partida de verdade cada General tem 30).

## Capítulos (14)

### 1. A moeda
A moeda aparece e gira. Painel: "Cara ou coroa decide quem joga primeiro." Cai a favor do jogador: "Você começa."
Explica: quem começa age primeiro, mas **não pode atacar no primeiro turno**.

### 2. O campo (leitura, destaque item a item)
Seu General (30 de vida; chegar a 0 = derrota) · General do adversário (derrubá-lo = vitória) · Vanguarda (frente) ·
Retaguarda (trás), 5 colunas · casas de Relíquia e Terreno ao lado do General · Baralho · Cemitério.

### 3. Suas cartas
Destaque na mão. "Você começa com **7 cartas**. O máximo no fim do turno é **10** (o excesso vai para o cemitério)."
Passo de fazer: tocar numa carta para ler (custo, ataque, vida, tipo).

### 4. O ouro (mockup 1)
Destaque nos dois ouros, setas e etiquetas "SEU OURO" / "DO ADVERSÁRIO". "Você começa com 15. Ganha +5 por turno,
a partir da 2ª rodada, e acumula. Serve para jogar cartas."

### 5. Fase de Compra (mockup 2)
Pausa com 7 cartas. Fase "Compra" destacada no painel de fases, mãozinha tocando. Fazer: tocar em **Compra**.
A 8ª carta voa para a mão. "No começo de todo turno você compra 1 carta. **Só no tutorial** você toca aqui."

### 6. Fase de Suprimentos
Mesma estrutura. Fazer: tocar em **Suprimentos**. Ouro em destaque; na 1ª rodada ninguém ganha ouro ("o +5 começa na 2ª rodada").

### 7. Preparação: Vanguarda (mockup 3)
Painel: "Fase principal: aqui você joga cartas, gastando ouro." Fazer: tocar na **Devotos** (fraca) e na casa da Vanguarda
(única casa acesa, com ATACA). "Ela ataca dali, mas também apanha."

### 8. Preparação: Retaguarda, Reforço e fechar a fase
Fazer: **Sentinela do Claustro** na Retaguarda, **atrás** da Devotos (única casa acesa, com RESERVA). Painel do Reforço:
"Se a carta da frente cair, esta desce **de graça** e ganha **Escudo 2**. Aqui atrás ela ainda não ataca." Depois:
**Paladino do Alvorecer** na Vanguarda (coluna 3), ouro descendo 15 → 9, e toque em **Finalizar preparação**.
Como é o 1º turno de quem começa, o Combate não existe: o painel explica por que as fases de ataque aparecem trancadas.

### 9. Movimentação (turno 1)
Leitura: "Aqui você ajusta a formação para o próximo turno: cada carta pode andar **uma casa** para o lado ou para frente/trás."
Fazer: tocar em **Finalizar turno**. (Mover de verdade é praticado no turno 3.)

### 10. Turno do adversário 1 — ataque e **REFORÇO** (mockup 4)
Tela mais leve, painel narra: "O adversário jogou Soldados e Devotos." O treinador ataca a Devotos e a destrói.
Pausa dramática: **Reforço** — a Soldados de trás desce com Escudo 2 (animação de descer + escudo aparecendo).
Painel: "A Devotos caiu, então a Soldados de trás desceu de graça e ganhou Escudo 2 (absorve 2 de dano)."

### 11. Turno 2 — automático, Combate e abrir caminho
Compra e Suprimentos agora acontecem sozinhas, com aviso curto e o **+5** de ouro destacado.
Preparação: **Paladino do Alvorecer** na coluna 2 e **Soldados** na Retaguarda (reserva). Combate (primeira vez):
1. Cavaleiro (coluna 2) ataca o **Soldados inimigo** (Vanguarda coluna 1): setas verdes nos alvos válidos; dano = ATK;
   o defensor **revida** (o Cavaleiro perde 3); o inimigo cai.
2. Com a coluna livre, a Soldados com escudo ataca **direto o General** (−3).
3. Cavaleiro da coluna 3 derruba a **Devotos** inimiga.
Também: tocar na reserva mostra "Infantaria na Retaguarda não ataca" (sem alcance).

### 12. Pós-combate, Movimentação e o escudo em ação
Pós-combate: "Aqui só entram Táticas, Relíquias e Terrenos." Você não tem, toque em avançar. Movimentação: leitura.
Turno do adversário 2: ele joga Soldados na frente e na reserva e **ataca a Soldados com escudo**:
o **Escudo absorve 2** e só 1 passa para a vida.

### 13. Turno 3 — ataque direto, mover e o 2º Reforço
Combate: três ataques direto ao **General** (3 + 4 + 4): ele cai de 17 para 6. Movimentação (fazer): mover a reserva
uma casa para ficar **atrás da Soldados da frente** ("agora ela protege essa carta"). Turno do adversário: ele ataca e derruba
a Soldados da frente → **Reforço de novo**, a reserva desce com Escudo 2 (e o adversário também usa o dele).

### 14. Turno 4 — vencer
Treinador deixou um bloqueio na coluna 2. Combate: derrubar o bloqueio (o caminho abre) e atacar o General: 4 + 3 ≥ 6.
O General cai: tela de **Vitória**. Resultado: o que a vitória dá (Coroas e XP), selo de tutorial concluído,
botão para o próximo tutorial.

## Sequência de turnos (para conferência)

| Turno | Jogador | Treinador |
| --- | --- | --- |
| 1 | Devotos (Vang.), Soldados (Ret.), Cavaleiro; sem combate | Soldados + Devotos; **mata a Devotos → Reforço** |
| 2 | Cavaleiro (col. 2), Soldados (reserva); mata Soldados, 3 no General, mata Devotos (General 17) | Soldados ×2; ataca a Soldados com escudo (absorve 2) |
| 3 | 3 ataques ao General (General 6); move a reserva | Devotos na coluna 2; ataca e mata a Soldados → **Reforço** |
| 4 | Derruba o bloqueio e mata o General | — |

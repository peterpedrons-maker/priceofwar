# Comunidade: amigos, guilda, chat, código de deck e replay (rodada 27)

**Pedido do dono:** compartilhar deck, replay de partida, lista de amigos, uma janela "Comunidade" (balão de conversa) com chat fora da batalha e guildas **sem nenhuma vantagem**, só grupos fechados para jogar com quem a pessoa quer. Mockup: `public/mockups/comunidade/?v=menu|amigos|conversa|guilda|decks|replay` (aguardando aprovação do dono antes de construir a parte de servidor).

## Estado
| Peça | Estado |
|---|---|
| Compartilhar deck por código (`POW1-…`) | **No jogo** (editor de deck: Compartilhar deck / Importar deck). `src/deckCode.ts`, teste `tests/deck-code.ts`. Sem servidor: o código carrega o deck todo. |
| Amigos, chat, guilda | Mockup pronto, falta aprovar e construir (servidor + SQL 15) |
| Replay | Mockup pronto, falta construir |

## Desenho (proposta)
- **Botão Comunidade** no rodapé do menu (entre Config. e Opções), com bolinha de mensagens e pedidos novos. Janela com 4 abas: Amigos, Guilda, Decks (atalho do código de deck), Replays.
- **Amigos:** adicionar pelo nome ou pelo código pessoal (ex. `K7P-29X`); pedido precisa ser aceito; lista com bolinha (online / jogando / visto há…); Desafiar (usa o convite de partida privada que já existe), Conversar, Bloquear. Só amigos mandam mensagem e desafio.
- **Chat:** conversa com um amigo e chat da guilda. Texto livre curto: 200 letras, sem links, filtro de palavrões (o mesmo de `src/nameFilter.ts`), limite de mensagens (ex. 6 a cada 10 s), frases rápidas prontas, silenciar/bloquear e denunciar mensagem (vai para o painel GM, como as denúncias de partida). Guarda só as últimas 100 mensagens de cada conversa, por 14 dias. Atualiza por consulta a cada poucos segundos com a janela aberta (o servidor já funciona assim).
- **Guilda (sem vantagens):** criar (nome 3 a 20 letras, passa pelo filtro) ou entrar por código; até 30 membros; líder expulsa e convida; chat e lista com quem está online; desafiar membro. Uma guilda por jogador.
- **Replay:** o servidor já guarda todas as jogadas (`match_steps`) e a semente. Op nova devolve a partida para quem participou (ou por link de leitura); o cliente reexecuta o motor passo a passo (play/pause/passo/velocidade 1x 2x 4x). Mãos escondidas aparecem só ao fim. Guarda as últimas 20 partidas por jogador.

## Segurança (Reddit: tudo validado no servidor)
- Toda escrita passa pelo servidor (`server/handler.ts`), tabelas sem permissão de escrita do aparelho (igual `missions`/`collection`).
- Pedidos validados e com limite por conta; mensagens filtradas no servidor; bloqueio impede mensagem e pedido; nada de links nem imagens; denúncia de mensagem com contexto.
- Dados mínimos: nenhum e-mail aparece para outros jogadores; o código de amigo é um código aleatório, não o id da conta.
- Chat global **não existe** (evita abuso e moderação em massa).

## Tabelas previstas (SQL 15, ainda não escrito)
`friends(user_id, friend_id, status, created_at)` · `blocks(user_id, blocked_id)` · `friend_codes(user_id, code)` · `chat_messages(id, scope, sender, text, created_at)` com `scope` = `dm:<a>:<b>` ou `guild:<id>` · `guilds(id, name, code, owner, created_at)` · `guild_members(guild_id, user_id, role)` · `replay_shares(code, match_id)`.

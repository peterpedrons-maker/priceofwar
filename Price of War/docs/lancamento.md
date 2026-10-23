# Antes de divulgar o jogo (lista do dono)

O que o código já faz está em `docs/anti-trapaca.md`. Esta página é o que **só o dono** consegue conferir, nas contas dele.

## 1. SQL e função (uma vez)
- [ ] SQL partes 6, 7 e 8 rodados (`docs/supabase-online-6.sql`, `-7.sql`, `-8.sql`).
- [ ] Segredo `ADMIN_EMAILS` no Supabase (Edge Functions → Secrets) com o e-mail do dono; entrar no jogo com esse e-mail (Google ou Discord) e ver o botão GM.
- [ ] Ação "Deploy game server" verde no GitHub (Actions) depois do último commit.

## 2. Limites do plano grátis do Supabase (conferir no painel: Settings → Usage / Billing)
Os números mudam; confira os atuais em supabase.com/pricing. O que costuma pesar num pico de divulgação:
- **Usuários ativos por mês** (contas que entram no mês): quanto o plano grátis aceita?
- **Chamadas da função do servidor por mês** (cada ação de partida online é uma chamada).
- **Tráfego de dados (egress)** e **tamanho do banco**: cada partida guarda as jogadas e as visões dos dois jogadores.
- **Envio de e-mails de confirmação** (cadastro com e-mail e senha): o plano grátis limita por hora. Login com Google e Discord e o modo convidado não dependem disso.
- **Pausa por inatividade:** o projeto grátis pausa depois de cerca de uma semana sem acesso; o `keepalive-supabase.yml` evita nas semanas vazias. Se o jogo "sumir", abra o projeto no Supabase e clique em Restore.
- **Sem backup automático no plano grátis:** se quiser segurança, baixe uma cópia do banco de vez em quando (Database → Backups, ou exporte as tabelas `profiles`, `collection`, `decks`, `ranked_profiles`).
- Se o pico passar dos limites: o plano pago mais barato resolve; avise o jogo para não ficar fora do ar no dia da divulgação.

## 3. Cadastro e contas
- [ ] Em Authentication → Providers: confirmar quais logins estão ligados e se o **e-mail precisa de confirmação**.
- [ ] Em Authentication → Rate limits: conferir os limites de cadastro por hora (barram robôs que criam milhares de contas).
- [ ] Considerar ligar o **captcha** (Authentication → Attack Protection) se aparecerem contas falsas em massa (o painel GM mostra "Contas novas por dia").

## 4. No dia da divulgação
- [ ] Deixar o painel GM aberto (atualiza a cada 20 s): online agora, fluxo por dia, denúncias.
- [ ] Banir pelo painel: denúncia → Banir. Conta com "nome suspeito" também tem botão Banir.
- [ ] Postar primeiro num lugar pequeno (por exemplo r/playmygame ou r/WebGames), com data e hora em que você estará online para responder.
- [ ] Ter à mão uma resposta curta sobre dados: "sem anúncios, sem rastreadores, dá para excluir a conta em Configurações" (a página `privacidade.html` explica).

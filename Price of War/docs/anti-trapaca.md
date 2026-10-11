# Jogo justo: o que protege o jogo contra trapaça

Não existe anti-cheat de verdade num jogo no navegador: quem controla o aparelho controla o que o aparelho mostra. A defesa é **nunca confiar no aparelho**: o servidor é quem decide tudo que vale (regras, sorteios, relógio, pontos e recompensas) e o aparelho só pede e desenha.

## O que já protege (e como testar)
- **Regras só no servidor** (online): cada ação passa pelo motor no servidor (`applyStep` em `server/handler.ts`); ação ilegal, fora de hora ou de quem não é a vez é recusada. Fuzz de ações aleatórias em `tests/engine-rules.ts`.
- **Informação escondida:** cada jogador recebe só a visão dele (`match_views`); a mão e o baralho do adversário nunca saem do servidor. O banco não deixa o jogador ler `matches`/`match_steps` (têm a semente e os dois decks: quem tem os dois calcula as próximas cartas). Teste "Redaction".
- **Relógio do servidor:** tempo estourado joga o turno por você e a segunda vez seguida derrota; sair da partida conta como desistência. Não adianta mexer no relógio do celular.
- **Deck conferido:** o servidor confere o deck contra a coleção da conta e as regras de montagem antes de entrar na fila.
- **Pontos, XP e coroas só pelo servidor:** `profiles`, `ranked_*` e recompensas não aceitam escrita do aparelho (só nome e avatar). Cada partida paga uma única vez; a temporada fecha uma única vez; o resgate paga uma única vez.
- **Elo escondido** nunca vai para o aparelho (há teste).
- **Partida curta demais não rende nada** (nem pontos): impede subir "vencendo" partidas que ninguém jogou.
- **Atalhos de teste** (`?debug`, `window.__pow...`, que mexem no estado do jogo local) só existem quando o jogo roda neste computador (`localhost`); no site publicado o console não tem como alcançá-los.
- **Pedidos validados** (`badRequest` em `server/handler.ts`, e o limite de 100 KB e o `POST` obrigatório em `server/edge.ts`): operação desconhecida, números de cartas absurdos, textos gigantes, ação grande demais e JSON quebrado são recusados antes de qualquer leitura. Teste "requests".

## Novo nesta rodada
- **Mesmo adversário demais (combinar resultado / duas contas do mesmo dono):** depois de 3 partidas ranqueadas em 24 horas entre as mesmas duas contas, a próxima **não move pontos** (a tela de fim de partida avisa). Valor em `REPEAT_LIMIT`. Teste "fair play".
- **Pareamento por Elo:** quem tem Elo muito diferente não é pareado de cara (a janela começa em 100 e abre 50 a cada 5 s de espera), o que também dificulta "jogar contra o amigo de propósito": a fila escolhe o mais próximo.

## O que ainda é risco (e o que fazer)
1. **Coleção escrita pelo aparelho (maior risco quando as coroas valerem de verdade).** Hoje os boosters são grátis e abertos no aparelho (`TEST_FREE_BOOSTERS`), então a coleção é escrita direto pelo jogador e quem souber chamar a API pode se dar qualquer carta. Enquanto os boosters forem grátis isso não muda o equilíbrio (qualquer um abre quantos quiser), mas **antes de cobrar coroas** é preciso: tirar as permissões de escrita da tabela `collection` e abrir o booster por uma função no servidor (sorteia e debita as coroas no servidor).
2. **Ajuda externa (calculadora de jogadas, IA fazendo as jogadas):** não dá para impedir. Mitigações possíveis: tempo por turno curto no ranqueado (já há relógio), e olhar jogadas suspeitas depois (o servidor guarda todas as ações de cada partida em `match_steps`, dá para auditar).
3. **Contas extras para dar vitórias a uma conta principal:** o limite de repetição ajuda, mas quem usa várias contas diferentes passa. Ideia: limitar pontos ganhos contra contas muito novas ou com poucas partidas, e verificar e-mail/login social.
4. **Abandono para não perder pontos:** sair e deixar o relógio acabar já conta como derrota com −6 a mais; fechar o app também vira derrota pelo relógio.
5. **Denúncia e banimento:** ainda não existe. Passo simples: tabela `reports` e uma lista de contas banidas que o servidor consulta ao entrar na fila.
6. **Excesso de pedidos (spam de requisições):** o servidor valida o formato, mas ainda não limita a quantidade por segundo. O Supabase tem limites próprios; um limite por conta pode vir depois.

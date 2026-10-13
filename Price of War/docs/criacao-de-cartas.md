# Como criar cartas, nomes e prompts de arte (leia ANTES de criar qualquer carta nova)

Ponto de entrada único. Reúne as decisões do dono sobre **nome**, **arte** (estilo e Padrão x Full Art), **texto** e **identidade do deck**. Quando for criar carta, deck ou prompt de arte, siga esta lista e abra só os documentos que ela indica.

## Checklist
1. **Identidade do deck:** `docs/visao-geral.md`, seção "Como desenhar um deck base" (identidade própria, mas não exclusiva; não prender a um tipo de unidade).
2. **Nome da carta:** seção "Nomes" abaixo.
3. **Texto da carta:** `docs/textos-cartas.md` (hierarquia dos efeitos, sinais, frase de redução de dano, três estilos: etiqueta = gatilho/efeito, negrito = nome de regra, itálico = explicação) e `docs/vocabulario.md`.
4. **Arte:** seção "Arte" abaixo e `art-prompts/README.md`.
5. **Padrão ou Full Art:** seção "Padrão x Full Art" abaixo; ao entregar prompts, **dizer quais cartas merecem Full Art e por quê**.
6. **General ou personagem marcante?** Entregar também o prompt do **retrato de rosto** (sempre o mesmo estilo, o do Aurelion): `art-prompts/retratos-generais.md`.
6. Conferir semelhança entre artes: `python3.11 -I tools/art-parecidas.py` (ver `art-prompts/cartas-novas-rodada-23.md`).
7. Depois: atualizar o documento do deck, `npm test`, `npm run map` se mudou estrutura.

## Nomes (decisão do dono, rodada 24)
**Os nomes têm que ter personalidade**, como Magic e Yu-Gi-Oh: evocar um personagem, um objeto ou um acontecimento, de preferência com uma imagem ou uma história de uma linha. Os melhores exemplos já no jogo são os do deck Mercenários renomeados na rodada 18: *Capa-Rota*, *Florete de Aposta*, *Rato da Muralha*, *Cavaleiro do Escudo Raspado*, *Quillon Contamoedas*, *Os Dois do Beco*, *O Dia em que a Muralha Caiu*, *Ninguém Fica na Lama*, *Códice das Mil Dívidas*. O dono aprovou esse estilo.

**Evitar o nome genérico "função + lugar/verbo"**, que foi o erro do deck de Campo ("Armeiro de Campanha", "Escudeiro Veterano", "Mapeador de Marchas", "Sargento de Marcha", "Guarda de Fronteira"): descreve o que a carta é, mas não evoca nada e se confunde com as outras. Também não repetir a mesma palavra do deck em muitas cartas (Campanha, Marcha, Marca).

Receitas que funcionam (misturar, uma por carta, nunca todas iguais):
- **Apelido composto ou epíteto:** *Capa-Rota*, *Boca-de-Fogo*, *Brann Meia-Coroa, Comprador de Guerras* (Nome, Epíteto).
- **Objeto com dono ou história:** *Peitoral de Muitos Donos*, *Espada de Mil Mãos*, *Elmo que Já Ouviu Três Rendições*.
- **Acontecimento ou frase:** *O Dia em que a Muralha Caiu*, *Ninguém Fica na Lama*.
- **Nome próprio mais ofício** (só para as únicas e os Generais): *Jorge, Lança Sagrada*; *Quillon Contamoedas*.
- **Número ou detalhe curioso:** *Os Dois do Beco*, *Chuva de Ferro Barato*.

Regras de forma: português, curto o bastante para caber na faixa do nome (a carta encolhe o texto, mas nomes muito longos ficam miúdos), sem acento esquisito, nada que pareça nome de outro jogo. Ao renomear, **atualizar** `LEGACY_CARD_NAMES` (renomeações antigas) para decks e coleções salvos, e as tabelas de nome nos documentos do deck.

**Feito (deck de Campo):** os nomes genéricos foram trocados por nomes com personalidade assim que o dono mandou as imagens, para combinar com a arte (tabela antigo → novo em `docs/deck-campo.md`). Exemplos novos: *Cabide de Ferro*, *Bigorna Andarilha*, *Recolhe-Espadas*, *Traça-Vales*, *O Contador de Lanças*, *Cota de Mil Remendos*, *Elmo das Três Rendições*.

## Arte (estilo)
Regra completa em `art-prompts/README.md` ("Variedade de estilo pictórico") e lições em `art-prompts/cartas-novas-rodada-23.md`. Em resumo:
- **Nunca o mesmo estilo em todas.** Misturar o que Yu-Gi-Oh, Magic e outros TCGs fazem, alternando a técnica pelo clima da carta (gráfico de cores chapadas na ação, claro-escuro em retratos e noite, pincelada impressionista em paisagens e momentos calmos, gravura/manuscrito em cartas de ordem e mapa, semi-abstrato para movimento e táticas, aquarela/nanquim para neblina) e variando pose, enquadramento e ângulo (de baixo, de cima, de costas, close, silhueta, plano aberto). Algumas mais abstratas.
- **Nunca** escrever "realismo", "foto", "fotográfico", "cinematográfico" (vira foto de gente) nem o nome de um jogo (vira carta completa com ataque e defesa). Usar só a técnica de pintura e fechar com "Stylized painterly characters, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no attack or defense numbers, no cost, no icons, no text boxes, no letters, no readable writing, full-bleed artwork."
- **Lições do deck de Campo:** (1) estilo de **gravura/xilogravura/manuscrito** costuma ganhar uma **moldura ou borda de pergaminho** na imagem: usar só quando a carta pede e sempre repetir "no border, no frame, runs fully to all four edges"; (2) para **objeto-herói** (arma, armadura), não pôr o objeto do tamanho dos personagens: pedir **objeto de tamanho normal, muito perto da câmera, em primeiro plano, com os personagens pequenos e desfocados ao fundo por estarem longe** (perspectiva, não objeto gigante).
- **Arte de equipamento (decisão do dono, rodada 24): não precisa ser sempre o objeto exposto** (na estante, sobre a mesa, em natureza-morta). **De vez em quando mostrar o equipamento em uso, vestido ou empunhado por um personagem fazendo algo** (golpeando, resistindo a flechas, avançando), com a energia de ação heroica de um card game de ilustração dinâmica (inspiração: *Flesh and Blood*; **nunca citar o nome do jogo no prompt**, só descrever: pose heroica de ação, rim light, contraste forte, rastro de movimento). Misturar: mais ou menos metade objeto, metade em uso, para o deck ter variedade. Objeto em uso: tamanho normal, nunca gigante.
- **Sem anacronismos:** a IA tende a desenhar **binóculos, armas de fogo e equipamento tático moderno** em cenas de batedores e soldados (aconteceu em *Dois Olhos na Crista*). Em prompt de personagem, acrescentar "strictly medieval, no binoculars, no telescopes, no firearms, no modern tactical gear" e conferir cada imagem recebida.
- Mapas, contratos e manuscritos: pedir "no readable writing, only lines and symbols".
- Cabeçalho de proporção e identidade do deck (cores e emblema) no começo do prompt; o molde pronto está em `art-prompts/deck-campo.md` (gerado por script).
- Arte entregue pelo dono: conferir semelhança com `tools/art-parecidas.py`, conferir texto legível dentro da imagem (cobrir ou refazer), depois salvar em `src/assets/<deck>/<nome-sem-acento>.webp` e ligar por nome.

## Padrão x Full Art (decisão do dono)
- **Padrão:** janela de arte paisagem (~16:10) no topo da moldura, com o texto num painel de pergaminho embaixo.
- **Full Art:** retrato (~0,72:1 ou 2:3), a arte preenche a carta e nome, custo, tipo, números e texto ficam por cima.
- **Algumas cartas terão as DUAS artes.** As versões **Full Art** vão vir **só em booster, para quem tiver sorte** (raridade). Isso **ainda não existe no jogo**: hoje cada carta tem **uma** arte, definida por `isFullArt` na definição da carta. O sistema de boosters com arte alternativa e raridades será construído **depois** (junto com `docs/planos-economia-e-ranqueado.md`). Por isso, ao criar carta nova, **já pensar** em quais merecem ter uma versão Full Art.
- **As duas artes de uma carta têm que ser DUAS ARTES DIFERENTES de verdade** (outro momento, ângulo ou cenário, nunca a mesma cena reenquadrada). Regra em `art-prompts/README.md`.
- **Ao escrever prompts de um deck, sempre incluir uma proposta de quais cartas ganhar Full Art, com o motivo.** Critérios:
  - **Sim:** o General (já é Full Art); cartas **únicas** (1 cópia) ou muito marcantes; o **herói** do deck; cenas **grandiosas e verticais** (fortaleza, Relíquia, Terreno de paisagem, o objeto-símbolo do deck); cartas que **definem a identidade** do deck e que o jogador quer mostrar.
  - **Não:** Táticas baratas e utilitárias (busca, compra, movimento extra), unidades de preenchimento sem personalidade, cartas de muitas cópias (o jogador veria a mesma Full Art repetida).
  - Ordem de grandeza: **uns 15% a 25%** das cartas diferentes de um deck (3 a 7 em 30), sem contar o General.
  - Uma carta que já nasce Full Art (hoje: os Generais e algumas) continua tendo uma versão Padrão se fizer sentido no booster.
- Proposta atual para o deck de Campo: ver `docs/deck-campo.md`, "Quais cartas ganhar Full Art".

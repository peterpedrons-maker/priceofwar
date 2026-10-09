# Migração para o Godot (plano e regras de convivência)

Decisão do dono: **vamos migrar o jogo para o Godot em breve.** Este documento diz como fazer isso sem quebrar a versão web, que continua sendo o jogo "de verdade" até o Godot alcançá-la. O que está **decidido** e o que está **aberto** vem marcado.

## 1. Regra de ouro: o Godot nunca mexe na versão web (decidido)
- Todo o trabalho em Godot fica **só** em `Price of War Godot/`. Nenhum arquivo de `Price of War/` (app web), `supabase/` ou `.github/` é alterado por causa do Godot, **exceto** o que este documento lista na seção 7 (e, mesmo assim, só com o dono sabendo).
- O Godot **não lê** nada de `Price of War/` em tempo de execução nem de exportação. Artes, fontes e dados são **copiados** para `Price of War Godot/assets/` (ou `data/`) por um script; a cópia é o que vale no Godot. Assim mexer num lado nunca muda o outro.
- O contrário também vale: o app web não importa nada da pasta do Godot.
- O deploy do site (GitHub Pages) **ignora commits que só mexem em `Price of War Godot/`** (`paths-ignore` em `.github/workflows/deploy-pages.yml`). O deploy do servidor já só reage a `supabase/**`.
- Commits misturando os dois lados devem ser evitados: um commit é "web" ou é "Godot" (a mensagem começa com `Godot:` quando for o caso).
- O que o Godot precisa do jogo web (regras, catálogo) sai de **arquivos gerados** pelo web (seção 4), nunca de edição manual dos dois lados.

## 2. Estado de hoje
`Price of War Godot/` tem só o **menu principal** (fundo, logo, placa de perfil, Coroas, botões, avatares; sem partida). Foi feito para ver como o jogo ficaria. Leia `Price of War Godot/README.md` (como abrir, rodar e tirar print sem editor). Versão mínima do Godot: 4.3, renderizador GL Compatibility, janela 390×844.

## 3. O que o web tem e o Godot precisa reproduzir
Ordem sugerida (do mais barato ao mais caro), cada item termina com algo que se toca no celular:
1. Menu principal e janelas (já existe o menu; falta Opções, Config, Online, avatar). As janelas do web usam o kit de interface (`docs/janelas-ui.md`, assets em `src/assets/kit/`): no Godot cada 9-fatias vira `StyleBoxTexture` com as mesmas margens (as margens estão em `src/ui/kit.css`).
2. Telas sem regra: Desafios (mapa + pinos), Loja, Coleção, Editor de decks (dados vêm do catálogo).
3. **Partida**: tabuleiro, mão, cartas, animações, efeitos (`src/combatFx.ts`, `src/terrainFx.ts`, `docs/animacoes.md`).
4. Online (Supabase).
5. Tutorial (`docs/tutorial.md`), áudio (`docs/audio.md`).

## 4. A questão central: onde rodam as regras (ABERTO, recomendação abaixo)
O motor (`src/engine`, cerca de 2,4 mil linhas com a IA; mais `server/`, 600) é TypeScript puro, **determinístico** (gerador com semente em `rng.ts`: mesma semente + mesmas ações = mesma partida) e já tem testes (`npm test`: regras, IA × IA, tutorial, servidor). O Godot não executa TypeScript. Três caminhos:

| Caminho | O que é | Prós | Contras |
|---|---|---|---|
| **A. Só cliente, regras no servidor** | O Godot desenha e envia ações; o servidor Supabase (que já roda o motor TS) valida e devolve as "visões". | Zero reescrita de regras; já existe o protocolo online (`docs/online-setup.md`). | Contra a IA também precisaria de internet (ou servidor local); a IA roda onde? |
| **B. Portar o motor para GDScript** | Reescrever `catalog/rules/game/ai/view` em GDScript (ou C#), mesmo comportamento. | Funciona offline, sem dependência do servidor, uma só linguagem no cliente. | Reescrita de ~2,4 mil linhas e risco de divergência de regras; o servidor continua em TS (duas implementações). |
| **C. Embutir um interpretador de JS** | Rodar o motor TS compilado dentro do Godot (QuickJS via extensão). | Uma só implementação das regras. | Extensão nativa por plataforma, difícil de exportar para celular e de depurar. |

**Recomendação:** começar por **A** (telas e partida jogáveis cedo, contra a IA do servidor) e fazer **B** em paralelo, com a rede de segurança abaixo, para o modo offline. Não adotar C. Se B ficar pronto e provado, o cliente deixa de depender do servidor para jogar contra a IA; o servidor TS continua sendo a autoridade no online. **Esta escolha é do dono.**

### Rede de segurança para o porte (vale para B)
- O web passa a exportar **partidas gravadas** (semente + deck + lista de ações + estado final por passo) como JSON em `Price of War/tests/golden/`, geradas pelas simulações que já existem (`tests/engine-sim.ts`).
- O Godot ganha um teste sem tela (`godot --headless`) que reexecuta cada gravação no motor GDScript e compara o estado a cada passo. Só se considera o porte "igual" quando todas as gravações passam.
- O catálogo de cartas (`src/engine/catalog.ts`, 387 linhas de dados) é exportado para JSON por um script do web (`npm run export:godot`, **a criar**); o Godot lê esse JSON em vez de redigitar cartas. Regra do projeto vale aqui também: o que a carta faz fica em dados, nunca em código por nome.
- Mudou regra no web durante a migração? Regera as gravações e o JSON, e o teste do Godot acusa o que precisa acompanhar.

## 5. Pontos do web que dão trabalho no Godot (levantamento)
- **Efeitos em canvas** (`combatFx.ts`, `terrainFx.ts`: luz noturna, brilho aditivo, blur): no Godot viram `GPUParticles2D`, `Light2D`/`CanvasModulate` e shaders; deve ficar mais leve no celular. Os sprites e as folhas já estão em `src/assets/`.
- **Cartas**: hoje desenhadas em React/CSS (`CardFace`, `FitText` que auto-ajusta o texto). No Godot: cena de carta com `Label`/`RichTextLabel` e ajuste de tamanho de fonte por código.
- **9-fatias e fontes**: ver seção 3; fontes Cinzel, Cinzel Decorative e Crimson Pro em `src/assets/fonts/` (copiar).
- **Texto do jogo** em português: manter os mesmos textos (`docs/textos-cartas.md`, `docs/vocabulario.md`). Considerar um arquivo de traduções do Godot desde o começo.
- **Salvar progresso**: web usa `localStorage` + nuvem (Supabase). Godot: arquivo local (`user://`) + o mesmo Supabase por HTTP (a API é REST; não há SDK oficial do Supabase para Godot).
- **Login** (Google/Discord/e-mail): em celular nativo exige fluxo próprio (navegador externo + retorno por link). Estudar cedo, é o que mais costuma atrasar.
- **Exportar para celular**: Android (APK/AAB) e iOS exigem contas, certificados e um Mac para iOS. Decidir plataformas-alvo antes de começar.
- **Áudio**: sons do web são feitos em Web Audio por código (`playBannerSfx`, `playCoinSfx`…); no Godot precisam virar arquivos ou `AudioStreamGenerator`. Música em `docs/audio.md`.

## 6. Perguntas abertas para o dono
1. Quais plataformas? (Android primeiro? iOS? só celular?)
2. O jogo contra a IA deve funcionar **sem internet** (então precisa do caminho B)?
3. A versão web continua existindo depois da migração (como site/teste) ou é desligada?
4. Prazo: "em breve" quer dizer começar já? O que fica congelado no web enquanto isso (só correções)?
5. Linguagem: **GDScript** (mais simples, nativo) ou **C#** (mais rápido para lógica, mas exportação para iOS/web é mais difícil)?
6. As artes de interface do kit continuam as mesmas, ou o Godot é a chance de refazer a interface?

## 7. Mudanças fora de `Price of War Godot/` permitidas por este plano
Só estas, e cada uma em commit separado:
- `.github/workflows/deploy-pages.yml`: `paths-ignore` para a pasta do Godot (**feito**).
- `Price of War/package.json`: script `export:godot` (catálogo e gravações em JSON) e `Price of War/tests/golden/` (**a criar**, só quando o dono aprovar o caminho B).
- `CLAUDE.md` e `docs/`: regras e este plano (**feito**).
Fora isso, nenhuma mudança por causa do Godot em código do web, do servidor ou do banco.

## 8. Próximos passos (se o dono aprovar)
1. Responder a seção 6.
2. Definir o caminho A, B ou A+B e a linguagem.
3. Criar a estrutura em `Price of War Godot/`: `scenes/`, `scripts/`, `assets/` (cópias), `data/` (JSON gerado), `tests/` (teste sem tela).
4. Escrever o script de cópia de artes (web → Godot) e, se B, o `export:godot`.
5. Migrar na ordem da seção 3, com um print do celular a cada etapa, como no web.

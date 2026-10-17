// Prompts de arte do deck Mercenários (uma entrada por carta, 22). Fonte única dos textos:
//   npx tsx tools/mercenarios-prompts.ts
// regera (1) a seção "Deck Mercenários" de art-prompts/README.md e (2) a página pública public/mockups/prompts-mercenarios/index.html
// (lista no celular, com botão "Copiar prompt" por carta). Os dados da carta (tipo, ATK/HP, efeito) vêm do catálogo.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { CARD_DEFS, DECK_RECIPES } from '../src/engine/catalog';

const slug = (name: string) => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Identidade do deck, repetida (em inglês, curta) dentro de cada prompt para as 22 artes parecerem do mesmo baralho.
const LOOK = 'Deck look: a mercenary free company — weathered olive-green and oxblood rust, tarnished brass and coin-gold, black leather, bone-white linen; mismatched scavenged armor pieces (no two soldiers dressed alike), coin-purses, contract parchments with wax seals; the company standard is a black banner with a worn gold coin pierced by a short sword.';
const LAND = 'WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px — noticeably wider than tall, NOT a vertical/portrait image. ';
const TALL = 'TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px — noticeably taller than wide, full-art trading-card illustration. ';
const END_LAND = ' Landscape orientation (about 1600×1000px, wider than tall). Full-bleed illustration: the scene runs to all four edges of the canvas like a cropped film still, with no text, no letters and no watermark.';
const END_TALL = ' Vertical portrait orientation (about 1024×1424px, taller than wide). Full-bleed illustration: the scene runs to all four edges of the canvas like a cropped film still, with no text, no letters and no watermark.';

type Entry = { name: string; full?: boolean; style: string; scene: string; note: string };

const ENTRIES: Entry[] = [
  {
    name: 'Brann Meia-Coroa, Comprador de Guerras', full: true, style: 'Realismo cinematográfico pintado, luz de fim de tarde',
    scene: 'Cinematic painterly realism, low three-quarter hero angle looking slightly up. Commander Brann, a scarred, weather-beaten man of about fifty with a grey-streaked beard and a shrewd half-smile, stands on a captured stone rampart at dusk. He wears a battered breastplate with one mismatched brass pauldron, a long black leather coat with a worn fur collar, a heavy sword at his hip. In his raised right hand he flips a single gold coin, caught mid-air and glinting like a tiny sun; his left hand rests on a fat coin-purse on his belt. Behind him, out of focus, a ragged but disciplined column of sellswords of every height and armor type, a black company banner with a gold coin pierced by a sword snapping in the wind, smoke from a burning village on the horizon. Warm orange sunset against cold teal shadows, strong rim light on his shoulders, rich textures: scratched steel, cracked leather, frayed wool. He must look like a professional who treats war as a business — confident, calculating, not heroic in the saintly sense.',
    note: 'General — Full Art (retrato). Rosto reconhecível: será o rosto que o jogador vê na partida inteira. Moeda no ar = a ideia de "pague ouro, compre carta".',
  },
  {
    name: 'Lanceiro Pés-de-Lama', style: 'Pintura realista suja, chuva e lama',
    scene: 'Gritty painterly realism, ground-level camera. A hired spearman, young and tired, braces a long pike against his hip on a muddy road at the foot of a wooden bridge in heavy rain, leaning slightly forward as if holding a line against an unseen charge. Mismatched gear: a dented kettle helmet two sizes too big, a faded olive gambeson with a patched shoulder, one steel gauntlet and one bare hand, a small brass pay-token on a string around his neck. Rain streaks, puddle reflections, a few other pikes poking in from the edges of the frame, grey-green sky with a thin warm band on the horizon. Cold desaturated palette with a single accent of brass.',
    note: 'Infantaria 2/2 — o soldado comum do deck. Ar de quem está ali pelo pagamento, não pela causa.',
  },
  {
    name: 'Besteiro Dedo-Ligeiro', style: 'Estilização gráfica ousada, diagonal dinâmica',
    scene: 'Bold graphic stylization — flat color blocks, confident ink-like linework, dynamic diagonal composition, in the energy of a premium collectible card game monster illustration. A hired crossbowman kneels behind a stack of grain sacks on a hay wagon, cranking back the windlass of a heavy crossbow with a bolt already on the rail, eyes locked on a target off-frame. Olive-green hood, oxblood scarf, leather bracers, a quiver of bolts and a small coin-purse swinging from his belt. Background: a blurred line of enemy shields far across a golden wheat field, bolts from allied crossbows already streaking across the sky as thin bright lines. Warm yellow-gold light from the left against cool olive shadows.',
    note: 'Arqueiro 2/2 — momento de recarregar, não de disparar, para diferenciar do Bombardeiro (fogo) e da Chuva de Ferro Barato (tática).',
  },
  {
    name: 'Capa-Rota', style: 'Estilização gráfica ousada (energia de monstro de Yu-Gi-Oh)',
    scene: 'Bold graphic stylization — flat color blocks, confident linework, strong diagonal composition, warm-against-cool light contrast, the energy of a premium collectible card game attack illustration. A hired swordsman in mid-lunge across the center of the frame, long arming sword slashing diagonally from lower left to upper right, body leaning hard into the strike, a torn oxblood cloak flaring behind him. Light mismatched armor: one brass-rimmed pauldron, leather jerkin, bare forearm with a coin tattoo. His opponent is only a suggested silhouette at the right edge, a parried blade throwing a fan of sparks. Background: a smoky battlefield in warm orange haze, a black company banner leaning in the distance. Motion lines, dramatic rim light.',
    note: 'Infantaria 4/3, manutenção 2 — ação pura. É a mesma energia do Jorge, Lança Sagrada Padrão (a referência de ação do projeto).',
  },
  {
    name: 'Rato da Muralha', style: 'Realismo cinematográfico noturno, contraste forte',
    scene: 'Cinematic night realism, strong contrast, tense and furtive mood. A mercenary deserter slips over the top of a stone camp wall at night, one leg already over the edge, looking back over his shoulder with a guilty, frightened face. He carries a bulging coin-purse clutched to his chest, and has torn off and dropped his company tabard — a black cloth with a gold coin emblem lies crumpled in the foreground mud, blurred and lit by a distant campfire. In the far background, the glow of the camp, small figures, a sentry lantern swinging. Moonlight cold blue on his face and the wall stones, warm orange campfire glow only on the far camp. Fine details: wet stone, rope, sweat on his forehead.',
    note: 'Infantaria 2/2 com Rescisão (compra 1 carta). A tabard no chão conta a história — "ele abandonou o contrato".',
  },
  {
    name: 'Capitão Barba-de-Corvo', full: true, style: 'Realismo heroico pintado, ação de linha de frente',
    scene: 'Heroic painterly realism, dramatic low angle, full body. The Captain of the Company — a broad, sturdy sergeant-type veteran in his forties, bald under a dented helmet with a frayed olive-green plume, thick black beard — roars an order at the front of a shield line, sword thrust forward over the heads of his soldiers, his other fist clenched. Heavy patched mail, a brass-studded leather coat in oxblood, a battered round shield with the black-and-gold-coin emblem scratched across it. Arrows streak through the rain-lit air around him, one stuck in his shield. Behind him, ragged soldiers surge forward with spears and swords, a standard-bearer lifting the black company banner. Smoky amber sky, mud and torn earth underfoot, strong warm backlight outlining him, a few gold coins spilled in the mud at his boots. He must clearly be a different man from the Commander Brann: a rank-and-file leader, not the boss.',
    note: 'Infantaria 3/5, manutenção 2, Full Art (retrato). Não pode parecer o General: o Capitão é o sargento da linha de frente (careca, barba preta, elmo amassado), o General é o chefe calculista (grisalho, casaco de couro).',
  },
  {
    name: 'Cavaleiro do Escudo Raspado', full: true, style: 'Pincelada solta e impressionista, clima calmo',
    scene: 'Loose, impressionistic brushwork with visible painterly strokes, calm melancholic mood, soft atmospheric depth. A lone knight rides a tired grey horse along a misty dirt road at dawn, seen in a gentle three-quarter side view, small against a vast landscape of rolling fields and a distant ruined tower. His armor is old, mended and unmatched, the heraldry on his shield scraped away to bare wood, a faded olive surcoat, a bedroll and a small coin-purse strapped behind the saddle, his helmet hanging from the saddle horn so his tired, bearded face is visible. Pale golden sun rising through the fog, long soft shadows, dew-bright grass, a single crow overhead. Muted palette of sage green, pale gold and warm grey, with one small accent of oxblood in the surcoat.',
    note: 'Cavalaria 4/5, manutenção 1, volta à mão se dispensado, Full Art (retrato). Ele "vai e volta": a cena é de partida/estrada, calma e solitária, bem diferente das cenas de ação.',
  },
  {
    name: 'Florete de Aposta', style: 'Realismo cinematográfico, luz de tocha na praça',
    scene: 'Cinematic realism, torch-lit night square, dramatic chiaroscuro. A swaggering freelance duelist faces off in a ring of onlookers in a rain-slicked cobblestone square, rapier in his right hand pointed straight at the viewer and a main-gauche dagger low in his left, weight on the back foot in a perfect fencing stance, confident smirk. Stylish but unmatched clothes — a brass-buttoned crimson doublet, a long olive cape thrown over one shoulder, a feathered hat — and a thin gold earring. Around the ring: blurred mercenaries and townsfolk holding up coins and wagers, torches casting warm orange light, wet stones reflecting it. His opponent is only a hand and sword tip entering from the left edge. Shallow depth of field, rich skin and metal detail.',
    note: 'Infantaria 5/2, manutenção 2, volta à mão. Duelista autônomo: "paga bem e vai embora". Apostas na plateia reforçam a ideia de dinheiro.',
  },
  {
    name: 'Boca-de-Fogo', style: 'Estilização gráfica com fumaça e fogo',
    scene: 'Bold graphic stylization with strong shapes and a hot orange-and-black palette, dynamic composition. A hired gunner crouches on a stone wall behind a short, heavy hand-bombard (a squat iron tube on a wooden stock braced on a merlon), holding a smoking slow-match to the touch-hole just as the weapon fires — a huge cone of orange flame and white smoke blasting from the muzzle toward the right of frame. His face is half-hidden by a soot-blackened scarf and goggles; leather apron with burn marks, a powder horn and a small barrel at his side, a coin-purse tied to the barrel. Singed olive-green sleeves, rust-colored iron. In the distance, enemy banners wavering in the smoke. High contrast between fire glow and deep shadow.',
    note: 'Artilharia 3/2, manutenção 1, ataca à distância. Infantaria com lançador de fogo (não é um canhão de roda). Mostra o clarão do disparo.',
  },
  {
    name: 'Vigia da Última Brasa', style: 'Pincelada solta e impressionista, noite calma',
    scene: 'Loose impressionistic painting, calm and quiet night mood. A lone sentinel stands watch beside a dying campfire at the edge of a sleeping mercenary camp, leaning on his spear, wrapped in a heavy olive-green cloak with a hood, an unlit lantern hanging at his belt. Behind him, rows of tents and sleeping men are only soft shapes; in front, the dark empty field and a faint blue-grey dawn line on the horizon. He is older and weathered, with a kind, tired face lit from below by the embers, a frayed but carefully mended black company armband on his sleeve — the one man in the company who stays without being paid. Warm ember orange against cool indigo night, mist rising from the grass.',
    note: 'Infantaria 2/4, sem manutenção (por isso "fiel": fica de graça). A cena é humana e silenciosa — contraste com o resto do deck, que é dinheiro e ação.',
  },
  {
    name: 'Quillon Contamoedas', style: 'Realismo de interior à luz de vela',
    scene: 'Warm candle-lit interior realism, rich textures. The company paymaster sits at a heavy wooden campaign table inside a canvas command tent, counting stacks of gold coins into neat columns, a large open ledger beside him, an iron-bound strongbox open at his feet full of coins. He is a thin, sharp-eyed man in round brass spectacles, ink-stained fingers, a dark olive doublet with a chain of keys at his belt, a quill behind his ear. A tall armed guard in the background shadow watches the entrance. Hanging lantern and candles throw golden light on the coins, the parchment and his face; canvas walls glow orange; dust motes. A black company banner folded on a chest. Cozy but slightly menacing — the one man everyone in camp is afraid of.',
    note: 'Infantaria 1/3 que gera 1 de ouro por turno. É a "economia" do deck em forma de personagem: mesa de contagem, cofre aberto.',
  },
  {
    name: 'Códice das Mil Dívidas', full: true, style: 'Realismo pintado de objeto, cena cinematográfica de cofre, luz de janela alta',
    scene: 'A cinematic painterly-realistic scene that fills the whole canvas edge to edge, like a cropped film still or a photograph — a real physical object in a real place, NOT a decorative page, NOT a manuscript illustration, NOT a picture hanging on a wall. Camera at a three-quarter high angle looking down at a huge ancient ledger-book, thick as a paving stone, bound in cracked black leather with worn brass corner-guards and a coin-shaped brass clasp, lying open on a heavy carved stone lectern inside a dark stone vault. The two open pages are aged cream paper covered in ink columns drawn only as abstract lines, with two hand-inked symbols drawn right on the paper: on the left page two crossed swords doubled like an echo, with small neat stacks of real gold coins standing on the page beside it; on the right page a clenched fist gripping a small folded parchment. Fat red wax seals hang from ribbons off the page edges, a long quill stands in a brass inkwell, a heavy dagger lies across the book as a paperweight, a few loose gold coins are scattered on the lectern. A single shaft of warm golden light falls from a high narrow window onto the open book, dust floating in the beam, while the rest of the vault dissolves into deep shadow: iron-bound chests, a barred grate, a hanging black company banner at the very back. The book is the clear hero of the composition, large and centered in the lower two thirds, richly textured: cracked leather, scuffed brass, creased paper, dripping wax, glinting coin edges. The whole vault scene continues to the very edges of the canvas.',
    note: 'Relíquia, Full Art (retrato). Reescrito: o prompt anterior pedia "manuscrito iluminado" com borda de hera e moedas, e a IA desenhava uma moldura/quadro. Agora é um OBJETO real em uma cena que ocupa a tela inteira; os dois modos (Soldo em Dobro e Saque) aparecem como símbolos à tinta nas páginas, sem letras. É o coração do deck: tem que parecer um objeto precioso.',
  },
  {
    name: 'Escriba do Códice', style: 'Realismo de interior, luz de vela, detalhe rico',
    scene: 'Warm candle-lit interior realism with rich texture detail. A company scribe stands on a wooden ladder in a cramped archive tent-room walled with shelves of rolled contracts and leather ledgers, pulling one thick black book bound with a brass clasp off the top shelf; a rolled parchment tucked under his arm, a satchel of seals and a small ink pot on his belt. He is a stooped middle-aged man in a faded olive robe and ink-stained gloves, looking up with the pleased expression of someone who has found exactly what he was looking for. Stacks of papers and red wax seal sticks on a desk below, a candle in a brass holder, floating dust in a shaft of light. Golden-brown palette with oxblood accents.',
    note: 'Tática custo 1: busca uma Relíquia (o Códice das Mil Dívidas). A ação é literal: tirar o livro certo da estante.',
  },
  {
    name: 'Chuva de Ferro Barato', style: 'Semi-abstrato: cena real com elementos diagramáticos brilhantes',
    scene: 'Semi-abstract tactical illustration — a realistic battle scene overlaid with bright diagrammatic elements. Seen from a slightly raised angle behind a line of hired crossbowmen at the left, a coordinated volley of dozens of bolts arcs across the frame in perfect curves, each trajectory traced by a thin glowing gold line like a ballistic diagram, all converging on one single horizontal row of enemy shield-bearers at the right, who are highlighted by a faint pulsing oxblood-red band along the ground to show exactly the row being hit. The bolts are caught at the moment just before impact, shields starting to splinter. The crossbowmen are silhouettes with olive hoods and the black company banner. Hazy golden-hour sky, bold graphic geometry on top of painterly realism.',
    note: 'Tática: 2 de dano em toda uma fileira inimiga. A faixa vermelha no chão reforça "fileira inteira".',
  },
  {
    name: 'Pacto do Punhal Vermelho', style: 'Semi-abstrato: pergaminho, punhal e moeda, luz dramática',
    scene: 'Dramatic semi-abstract still-life with narrative overlay. A dark wooden table seen from a high three-quarter angle: a large sealed contract parchment lies flat, a bright red target-like circle inked on it, a heavy dagger driven through the center of the circle and pinning the parchment to the wood. A single gold coin spins on its edge beside the dagger, mid-fall, and a gloved hand in a black leather glove withdraws into the shadow at the edge, as if the deal was just done. A red wax seal with a sword-and-coin sigil, a burnt candle, and a few spilled coins complete the scene. In the blurred background, the faint silhouette of a lone enemy officer\'s tent. Strong chiaroscuro with one cold-white and one warm-orange light, painterly realism with crisp graphic edges.',
    note: 'Tática: 3 de dano a uma unidade. "Execução" por contrato: punhal cravado no pergaminho, sem mostrar violência explícita.',
  },
  {
    name: 'O Dia em que a Muralha Caiu', full: true, style: 'Estilização gráfica explosiva, fogo e fumaça',
    scene: 'Explosive bold graphic stylization with painterly smoke, vertical composition, dramatic contrast of black, orange and olive-green. A sapper sprints away from the lower left foreground, glancing back over his shoulder, a smoldering fuse trailing behind him across a dark tunnel floor, while in the center of the frame a stack of powder barrels beneath an enemy fortress wall detonates — a colossal column of orange fire, white-hot core, stone blocks and timber thrown into the air, the wall splitting open upward, enemy soldiers tiny silhouettes tumbling in the blast, an enemy banner flying away in the shockwave. Sparks and glowing embers fill the frame, a ring-shaped shockwave spreading across the smoke. His olive cloak and the black company banner on a pole at the tunnel mouth are lit by the fire. Intense, loud, unmistakably devastating.',
    note: 'Tática Full Art (retrato): 2 de dano a todas as unidades inimigas e ao General. A explosão sob a muralha mostra o alcance total.',
  },
  {
    name: 'Peitoral de Muitos Donos', style: 'Realismo macro hiperdetalhado, natureza-morta de equipamento',
    scene: 'Macro hyper-detailed still-life of equipment, shallow depth of field, tactile materials. A well-used steel breastplate with old dents and a fresh brass rivet repair hangs on a wooden armor stand in an armorer\'s cramped stall, a blank leather rental tag tied to a shoulder strap with coarse string and stamped only with a small gold coin mark (no writing), a chain-mail coif and an oxblood padded undershirt folded on a barrel beside it, a rag, a small hammer and a bowl of rivets on the workbench. Dust and a few steel shavings in a shaft of warm sunlight from the stall opening; scratches, polish marks, rust freckles clearly visible on the metal; a few coins in a dish as the deposit. Warm amber light with cool shadows.',
    note: 'Tática custo 1: equipa uma Infantaria com +2 HP. A etiqueta de aluguel (sem texto) é o detalhe que conta a ideia.',
  },
  {
    name: 'Espada de Mil Mãos', style: 'Realismo macro hiperdetalhado, natureza-morta de equipamento',
    scene: 'Macro hyper-detailed still-life of a single weapon, extreme close-up with shallow depth of field, tactile materials. A plain but well-kept arming sword lies across a worn wooden counter, its steel blade catching a long highlight, small nicks along the edge from past duels, the grip wrapped in dark leather with a visible repair stitch, a blank leather rental tag knotted around the crossguard with coarse string. Beside it, a small stack of gold coins rests on the counter as a deposit, and a brass scale and a weapons rack with other swords blur softly behind. A thin beam of warm window light slides along the blade; a scatter of dust, a faint reflection of the shop interior in the steel. Cool steel blue against warm amber wood.',
    note: 'Tática custo 1: equipa Infantaria/Cavalaria com +2 ATK. Par visual da Peitoral de Muitos Donos (mesma etiqueta), mas com ângulo e luz diferentes.',
  },
  {
    name: 'Tambor do Soldo Fácil', style: 'Pintura de cena de mercado, vivaz e bem composta',
    scene: 'Lively painterly market-square scene, wide establishing composition, rich color. A mercenary recruitment stall in the middle of a busy town square: a long table under a black awning with the gold-coin-and-sword sigil, a recruiting sergeant behind it with a thick register book and an inkpot, a drummer beating a snare drum beside him to attract attention, a stack of coin pouches on the table. A line of hopeful volunteers waits in front — a burly farmhand, a lean archer, a former knight in rusted armor, a young swordsman — each pressing an inked thumbprint on the register while the sergeant sizes them up. Banners, pigeons, shop signs without readable text, warm afternoon sunlight, long golden shadows, bright and busy.',
    note: 'Tática custo 2: busca 1 soldado do baralho. Cena organizada de cadastro — contrasta com o Os Dois do Beco (beco, à noite).',
  },
  {
    name: 'Ninguém Fica na Lama', style: 'Pincelada solta e impressionista, clima sombrio',
    scene: 'Loose impressionistic painting with expressive brushwork, somber but hopeful mood. A battlefield at dusk after the fight: a muscular mercenary hauls a wounded comrade out of the churned mud by the straps of his breastplate, dragging him towards a waiting supply wagon, the wounded man\'s arm slung over his shoulder, a broken spear and scattered shields around them. Behind them, long shadows, the glow of burning wagons far away, a few vultures against a smoky red-orange sky. In the foreground a gold coin pouch has spilled in the mud — the ransom — and a black company banner lies half-buried. Muted browns, olive and oxblood with a warm gold light on the two figures, soft edges everywhere.',
    note: 'Tática custo 1: leva 1 soldado do cemitério para a mão. "Resgate": o camarada que não foi deixado para trás (ou comprado de volta).',
  },
  {
    name: 'Os Dois do Beco', style: 'Realismo cinematográfico noturno, beco',
    scene: 'Cinematic night realism, narrow back-alley composition with depth. In a rain-wet cobblestone alley lit by a single hanging lantern and the warm door glow of a tavern, a mercenary captain in a dark coat (seen partly from behind) drops two heavy coin purses into the open hands of two rough sellswords stepping out of the shadows — one a tall scarred brawler with a flail, one a hooded crossbowman — sealing a deal with a handshake over a barrel. More silhouettes of ruffians lurk in doorways, a stray dog, steam from a grate, rain falling through the lantern light. Gritty, dangerous and a little funny. Warm orange against deep teal-black, strong reflections on the wet stones.',
    note: 'Tática custo 3: compra 2 cartas. Os dois contratados saindo da sombra = "2 cartas". Contrasta com a Agência (cena diurna e organizada).',
  },
  {
    name: 'O Peso da Bolsa', style: 'Realismo cinematográfico noturno, close sombrio',
    scene: 'Cinematic night realism, tight, tense close-up composition with shallow depth of field. Inside a dim campaign tent lit by a single oil lamp, a gloved hand slides a fat leather purse across a table into the hand of an enemy cavalry officer in a plumed helmet and richly embroidered coat; a few gold coins have spilled out and glint in the lamplight. The officer\'s face is half in shadow, eyes narrowed, one hand already raising his signet ring to the seal of a written order lying under the purse — the cancelled order to charge. Through the gap of the tent flap behind them, out of focus, a column of cavalry sits stopped in the torch-lit dark, lances lowered, waiting. The briber is only a shoulder and an olive-and-oxblood sleeve at the left edge of the frame. Deep shadows, warm gold highlights.',
    note: 'Emboscada custo 2: cancela um ataque a uma unidade sua. A cavalaria parada à espera da ordem é o "ataque cancelado".',
  },
];

const defs = new Map(CARD_DEFS.map(c => [c.name, c]));
const recipe = DECK_RECIPES.mercenarios;
const order = [recipe.general, ...Object.keys(recipe.cards)];
if (ENTRIES.length !== order.length || !order.every(n => ENTRIES.some(e => e.name === n))) throw new Error('Os prompts não cobrem exatamente as cartas do deck');

// Cartas cuja arte real já foi entregue e está em src/assets/merc/: saem da lista de prompts (fluxo do projeto: o prompt já cumpriu o papel).
const DELIVERED = new Set(ENTRIES.map(e => e.name));   // todas entregues e no jogo; para reabrir uma carta, tire-a daqui
const promptOf = (e: Entry) => (e.full ? TALL : LAND) + e.scene + ' ' + LOOK + (e.full ? END_TALL : END_LAND);
const kind = (e: Entry) => { const d = defs.get(e.name)!; return d.cardType === 'General' ? 'General' : d.cardType; };
const stats = (e: Entry) => { const d = defs.get(e.name)!; return d.cardType === 'General' ? `ATK 0 / HP ${d.hp} / custo 0` : ['Tática', 'Emboscada'].includes(d.cardType) ? `custo ${d.cost}` : d.cardType === 'Relíquia' ? `HP ${d.hp} / custo ${d.cost}` : `ATK ${d.atk} / HP ${d.hp} / custo ${d.cost}`; };
const cleanEffect = (e: Entry) => (defs.get(e.name)!.effect ?? '').replace(/\*\*/g, '') || 'só atributos';

// ── README ──────────────────────────────────────────────────────────────────────
const allOrdered = order.map(n => ENTRIES.find(e => e.name === n)!);
const numberOf = (e: Entry) => allOrdered.indexOf(e) + 1;
const ordered = allOrdered.filter(e => !DELIVERED.has(e.name));
let md = `## 5. Deck Mercenários — Companhia do Soldo (${ordered.length ? `${ordered.length} por gerar de ${allOrdered.length}` : 'todas as artes entregues'})\n\n`;
md += 'Terceiro deck. **Identidade visual:** uma companhia de mercenários — verde-oliva desbotado e ferrugem/vinho, latão e ouro de moeda envelhecido, couro preto, linho cru; armaduras de peças desencontradas (nenhum soldado veste igual ao outro), bolsas de moedas, contratos com selo de cera. O estandarte da companhia é um pano preto com uma moeda de ouro gasta atravessada por uma espada curta. Sem tom religioso (Cardeal) e sem uniforme de exército regular (Capitão): aqui o clima é negócio, lama e ouro.\n\n';
md += 'O deck tem 22 cartas: 17 Padrão (paisagem ~16:10, 1600×1000) e 5 Full Art (retrato ~0,72:1, 1024×1424): o General, o Capitão Barba-de-Corvo, o Cavaleiro do Escudo Raspado, o Códice das Mil Dívidas e a O Dia em que a Muralha Caiu (as cinco que usam a moldura Full Art no jogo). **Já entregues e no jogo (' + DELIVERED.size + '):** ' + [...DELIVERED].join(', ') + '. ' + (ordered.length ? 'Abaixo ficam só as que faltam.' : 'Nenhuma arte falta: os prompts ficam guardados em `tools/mercenarios-prompts.ts` (para refazer uma carta, tire o nome dela de DELIVERED e rode o gerador).') + ' Cada prompt já começa com a proporção e repete a identidade do deck, para as 22 artes ficarem com cara de mesmo baralho.\n\n';
md += 'Os nomes dos arquivos são o nome da carta sem acento, em minúsculas e com hífen (ex.: `lanceiro-pes-de-lama.webp`); basta colocar a arte nova em `src/assets/merc/` com o mesmo nome para trocar a arte provisória. Página para copiar os prompts no celular: `/mockups/prompts-mercenarios/`. A lista é gerada por `npx tsx tools/mercenarios-prompts.ts` (fonte única dos textos).\n\n';
ordered.forEach(e => {
  md += `### 5.${numberOf(e)} ${e.name} — ${e.full ? 'Full Art' : 'Padrão'}\n\n`;
  md += `**Carta:** ${kind(e)} (${stats(e)}) · ${cleanEffect(e)}\n**Estilo pictórico:** ${e.style} · **Arquivo:** \`${slug(e.name)}.webp\` · **Status:** pronto pra gerar\n\n\`\`\`\n${promptOf(e)}\n\`\`\`\n\n**Notas:** ${e.note}\n\n`;
});
const readmePath = 'art-prompts/README.md';
let readme = readFileSync(readmePath, 'utf8');
const start = readme.indexOf('## 5. Deck Mercenários');
if (start >= 0) {
  const rest = readme.slice(start + 10);
  const m = rest.search(/\n## /);
  readme = readme.slice(0, start) + md.trimEnd() + '\n' + (m >= 0 ? rest.slice(m) : '');
} else {
  const anchor = readme.indexOf('\n---\n', readme.indexOf('## Deck Capitão'));
  readme = readme.slice(0, anchor) + '\n\n' + md.trimEnd() + '\n' + readme.slice(anchor);
}
writeFileSync(readmePath, readme);

// ── Página pública ──────────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cards = ordered.map((e, i) => `<article class="card" id="c${numberOf(e)}">
  <header><span class="n">${numberOf(e)}</span><div><h2>${esc(e.name)}</h2><p class="meta">${esc(kind(e))} · ${esc(stats(e))}</p></div><span class="tag ${e.full ? 'full' : 'pad'}">${e.full ? 'Full Art · retrato' : 'Padrão · paisagem'}</span></header>
  <p class="eff">${esc(cleanEffect(e))}</p>
  <p class="sty"><b>Estilo:</b> ${esc(e.style)} · <b>arquivo:</b> <code>${slug(e.name)}.webp</code></p>
  <textarea readonly rows="7">${esc(promptOf(e))}</textarea>
  <div class="row"><button class="copy" data-t="${i}">Copiar prompt</button></div>
  <p class="note">${esc(e.note)}</p>
</article>`).join('\n');
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prompts de arte — Mercenários</title>
<style>
  :root { --bg:#17110c; --panel:#241a12; --line:#4a3826; --gold:#e9c46a; --txt:#f1e6cf; --mut:#b9a98a; --green:#8fe0a4; }
  * { box-sizing:border-box; } body { margin:0; background:var(--bg); color:var(--txt); font:15px/1.45 system-ui,sans-serif; padding:16px; max-width:760px; margin-inline:auto; }
  h1 { color:var(--gold); font-size:21px; margin:6px 0 4px; } .lead { color:var(--mut); font-size:13.5px; margin:0 0 14px; }
  .idx { display:flex; flex-wrap:wrap; gap:6px; margin:0 0 16px; } .idx a { color:var(--gold); text-decoration:none; border:1px solid var(--line); border-radius:999px; padding:4px 10px; font-size:12.5px; }
  .card { background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:12px; margin-bottom:14px; }
  .card header { display:flex; gap:10px; align-items:flex-start; } .n { background:var(--gold); color:#2a1d0e; font-weight:800; border-radius:8px; min-width:28px; text-align:center; padding:2px 0; }
  h2 { font-size:16px; margin:0; color:var(--gold); } .meta { margin:2px 0 0; color:var(--mut); font-size:12.5px; } header > div { flex:1; }
  .tag { font-size:11px; border-radius:999px; padding:3px 8px; white-space:nowrap; border:1px solid var(--line); } .tag.full { color:#ffd7a0; border-color:#a8742f; } .tag.pad { color:#bfe3c8; border-color:#3f7a52; }
  .eff { margin:8px 0 2px; font-size:13.5px; } .sty { margin:2px 0 8px; font-size:12.5px; color:var(--mut); } code { color:var(--txt); }
  textarea { width:100%; background:#120d09; color:var(--txt); border:1px solid var(--line); border-radius:10px; padding:10px; font:13px/1.4 ui-monospace,monospace; resize:vertical; }
  .row { display:flex; gap:8px; margin-top:8px; } button { background:var(--gold); color:#2a1d0e; border:0; border-radius:10px; padding:12px 16px; font-weight:800; font-size:15px; flex:1; }
  button.ok { background:var(--green); } .note { font-size:12.5px; color:var(--mut); margin:8px 0 0; }
</style></head><body>
<h1>Prompts de arte — Mercenários</h1>
<p class="lead">${ordered.length ? `${ordered.length} cartas que faltam (as outras ${DELIVERED.size} já têm arte), uma por vez.` : 'Todas as 22 artes já foram entregues e estão no jogo.'} Configure a proporção no gerador antes (Padrão 16:10, 1600×1000 · Full Art 0,72:1, 1024×1424), toque em <b>Copiar prompt</b> e cole. Salve com o nome de arquivo indicado.</p>
<nav class="idx">${ordered.map(e => `<a href="#c${numberOf(e)}">${numberOf(e)}</a>`).join('')}</nav>
${cards}
<script>
  var P = ${JSON.stringify(ordered.map(promptOf))};
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = P[+b.dataset.t], ta = b.closest('.card').querySelector('textarea');
      var done = function () { b.textContent = 'Copiado!'; b.classList.add('ok'); setTimeout(function () { b.textContent = 'Copiar prompt'; b.classList.remove('ok'); }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { ta.select(); document.execCommand('copy'); done(); });
      else { ta.select(); document.execCommand('copy'); done(); }
    });
  });
</script>
</body></html>
`;
mkdirSync('public/mockups/prompts-mercenarios', { recursive: true });
writeFileSync('public/mockups/prompts-mercenarios/index.html', html);
console.log(`ok: ${ordered.length} prompts pendentes de ${allOrdered.length} (${ordered.filter(e => e.full).length} Full Art)`);

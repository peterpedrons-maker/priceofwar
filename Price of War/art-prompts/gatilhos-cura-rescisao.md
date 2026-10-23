> **Cancelado (rodada 24):** o dono decidiu não criar ícones de cura nem de Rescisão. Estes prompts ficam só como registro.

# Dois gatilhos novos: Cura e Rescisão (prompts)

Os sete medalhões atuais (`src/assets/trigger-*.webp`, folha em `art-prompts/reference/ui-trigger-sheet.jpg`) são **baixo-relevo em bronze**, sem aro, um objeto claro por medalhão. Faltam dois para completar as cartas que ficaram sem ícone:

- **Cura** (ao ser curada / quando uma unidade ao lado é curada): Noviço Renascido, Paladino do Alvorecer.
- **Rescisão** (o contrato do mercenário termina quando o ouro não paga a manutenção): Capa-Rota, Florete, Cavaleiro do Escudo Raspado, Boca-de-Fogo, Rato da Muralha.

**Como pedir:** mande a folha de referência dos sete medalhões como imagem e use o texto abaixo. Fundo cinza RGB 125,125,125 (eu recorto). Se vier colorido: "monochrome, only warm antique bronze on dark charcoal".

## Cura
```
Same medallion style as the reference sheet (round bronze bas-relief badge, no rim, dark charcoal-brown disc, warm antique bronze relief, painted soft shading), on a flat solid mid-gray background (RGB 125,125,125), square 1:1 canvas, one single clear subject: an armored gauntlet-hand with a small glowing cross-shaped bandage seen from the front, with soft rays of light around it; or, simpler, a medieval healer's hand holding a small chalice with a few soft light rays rising from it. Nothing else, no text, no numbers, no background scenery. Same size and same lighting (soft warm light from the upper left) as the other seven medallions so they read as one family at 40 px wide.
```

## Rescisão
```
Same medallion style as the reference sheet (round bronze bas-relief badge, no rim, dark charcoal-brown disc, warm antique bronze relief, painted soft shading), on a flat solid mid-gray background (RGB 125,125,125), square 1:1 canvas, one single clear subject: a rolled parchment contract torn in half, with a broken wax seal on it and one small coin falling beside the tear. Nothing else, no text, no letters, no numbers, no background scenery. Same size and same lighting (soft warm light from the upper left) as the other seven medallions so they read as one family at 40 px wide.
```

Depois de aprovar: me mande as duas imagens e eu recorto, ligo como gatilhos `Cura` e `Rescisão` (rótulos em `src/engine/types.ts`, ícones em `src/triggers.ts`, vocabulário em `docs/vocabulario.md`) e aplico nas cartas acima.

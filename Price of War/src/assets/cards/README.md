# Card Art Assets

Place card artwork images in this folder.

## Required dimensions

| Use | Width | Height | Aspect ratio |
|-----|-------|--------|--------------|
| **Full resolution** | 905 px | 1287 px | 905:1287 |
| **Half resolution** | 452 px | 643 px | same |
| **Thumbnails** | 181 px | 258 px | same |

Accepted formats: `.webp` (preferred), `.png`, `.jpg`

## Naming convention

Name each file after the card's unique id used in the code, e.g.:

```
infantaria-01.webp
cavalaria-lendaria.webp
artilharia-pesada.webp
```

## How to reference an image in a card

In the card data array (wherever `CardData` objects are defined), add the `art` field:

```ts
import infantariaImg from './assets/cards/infantaria-01.webp';

const myCard: CardData = {
  id: 'infantaria-01',
  name: 'Soldado Raso',
  type: 'Infantaria',
  art: infantariaImg,
  // ...
};
```

The `CardFace` component already reads `card.art` and renders it as a full-bleed background illustration.

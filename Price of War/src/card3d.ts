// Shared by the 3D card viewer and the script that renders the card textures (tools/card3d): a card's name as a file name.
export const cardSlug = (name: string): string =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

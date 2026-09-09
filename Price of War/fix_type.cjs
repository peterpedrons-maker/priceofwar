const fs = require('fs');
let f = fs.readFileSync('src/App.tsx', 'utf8');
f = f.replace(
  /export type CardType = 'Infantaria' \| 'Cavalaria' \| 'Artilharia' \| 'Arqueiro' \| 'Tática' \| 'Lendário' \| 'Suporte';/g,
  `export type CardType = 'Infantaria' | 'Cavalaria' | 'Artilharia' | 'Arqueiro' | 'Tática' | 'Lendário' | 'Suporte' | 'General';`
);
fs.writeFileSync('src/App.tsx', f);
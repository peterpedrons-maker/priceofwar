import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /if \(startupPhase === 'drawing' && gameMode\)\s*{\s*const pSlots =[^;]*;\s*const nSlots =[^;]*;\s*pSlots\[12\][^;]*;(\s*setHand\(\[\]\);.*?)/m;

const replacement = `if (startupPhase === 'drawing' && gameMode) {
        const pSlots = Array(13).fill(null);
        const nSlots = Array(13).fill(null);
        pSlots[12] = deck.find(c => c.cardType === 'General') || DECK_1.find(c => c.cardType === 'General') || null;
        nSlots[12] = deck.find(c => c.cardType === 'General') || DECK_1.find(c => c.cardType === 'General') || null;
        setPlayerSlots(pSlots);
        setNpcSlots(nSlots);

$1`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('done!');

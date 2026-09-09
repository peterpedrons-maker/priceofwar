const fs = require('fs');
let data = fs.readFileSync('src/App.tsx', 'utf8');
data = data.replace(/setJokenpoResult\('win'\);/g, 'setJokenpoResult(\'win\'); audio.playVictory();');
data = data.replace(/setJokenpoResult\('lose'\);/g, 'setJokenpoResult(\'lose\'); audio.playDefeat();');
// showToast com curou 
data = data.replace(/showToast\(\Cardeal Pedro: curou/g, 'audio.playHeal(); showToast(\Cardeal Pedro: curou');
fs.writeFileSync('src/App.tsx', data, 'utf8');

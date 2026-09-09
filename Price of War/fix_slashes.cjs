const fs = require('fs');
let data = fs.readFileSync('src/App.tsx', 'utf8');
data = data.replace(/playAttack\(\);\\\\n/g, 'playAttack();\n');
data = data.replace(/setIsImpacting\(true\);\\\\n/g, 'setIsImpacting(true);\n');
fs.writeFileSync('src/App.tsx', data, 'utf8');


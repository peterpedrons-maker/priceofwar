import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// replace slot sizes
code = code.replace(/h-40 md:h-\[250px\]/g, 'h-48 md:h-[290px]');

// replace thickness
const oldThickness = `            {/* Card Thickness Layers */}
            <div className="absolute inset-0 bg-[#2a1b0c] rounded-xl pointer-events-none" style={{ transform: 'translateZ(-1px)' }} />
            <div className="absolute inset-0 bg-[#1a0f05] rounded-xl pointer-events-none" style={{ transform: 'translateZ(-2px)' }} />
            <div className="absolute inset-0 bg-[#0c0602] rounded-xl pointer-events-none shadow-[0_15px_25px_rgba(0,0,0,0.8)]" style={{ transform: 'translateZ(-3px)' }} />`;

const newThickness = `            {/* Robust 3D Card Thickness Layers */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={\`thick-\${i}\`} 
                className={\`absolute inset-0 rounded-[0.4rem] md:rounded-xl pointer-events-none \${
                  i === 5 ? 'bg-[#0c0602] shadow-[0_20px_40px_rgba(0,0,0,0.95)]' : 'bg-[#1a0f05] border border-black/50'
                }\`} 
                style={{ transform: \`translateZ(-\${(i + 1) * 3}px)\` }} 
              />
            ))}`;

code = code.replace(oldThickness, newThickness);
fs.writeFileSync('src/App.tsx', code);
console.log('done!');

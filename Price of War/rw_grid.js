import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/className="w-\[1240px\] md:w-\[1300px\] h-\[1600px\] md:h-\[1850px\] grid grid-rows-2 gap-\[5rem\] p-12 relative"/g, 'className="w-[1240px] md:w-[1300px] h-[1800px] md:h-[2200px] grid grid-rows-2 gap-[12rem] md:gap-[20rem] p-12 relative"');
fs.writeFileSync('src/App.tsx', code);
console.log('done!');

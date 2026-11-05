// As versões (raridades) vão para a nuvem sem mudar o banco: viram linhas/chaves "<carta>#<raridade>". Ida e volta têm que devolver o mesmo.
import { splitRar, joinRar } from '../src/services/cloud';
let ok = 0, bad = 0;
const check = (c: boolean, m: string) => { if (c) ok++; else { bad++; console.error('FALHOU:', m); } };
const rar = { 'Trabuco': { rara: 1, ultra: 2 }, 'Batedor': { rara: 3 } };
const joined = joinRar({ 'Trabuco': 5, 'Batedor': 4 }, rar);
check(joined['Trabuco#rara'] === 1 && joined['Trabuco#ultra'] === 2 && joined['Batedor#rara'] === 3 && joined['Trabuco'] === 5, 'join escreve as chaves #');
const back = splitRar(joined);
check(JSON.stringify(back.plain) === JSON.stringify({ 'Trabuco': 5, 'Batedor': 4 }), 'split devolve as cartas puras');
check(JSON.stringify(back.rar) === JSON.stringify(rar), 'split devolve as versões');
check(Object.keys(splitRar({ 'Carta #1': 2 }).plain).length === 1, 'um # que não é raridade continua nome de carta');
check(Object.keys(joinRar({ A: 1 }, undefined)).length === 1, 'sem versões não muda nada');
console.log(`${ok} passed, ${bad} failed`); if (bad) process.exit(1);

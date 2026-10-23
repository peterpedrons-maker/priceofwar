// Filtro de nomes ofensivos (primeira barreira, não a única: denúncia e banimento cobrem o resto).
// O mesmo critério roda no banco (docs/supabase-online-8.sql, gerado por tools/gerar-filtro-sql.ts a partir DESTA lista), então não dá para burlar escrevendo direto na API.
// Normaliza como quem tenta enganar escreve: sem acento, "leet" (4=a, 3=e, 1=i, 0=o, 5=s, 7=t, @=a, $=s), sem separadores e sem letras repetidas.

// Pedaços que não aparecem dentro de palavras comuns: vale em qualquer lugar do nome (já normalizado e sem separadores).
export const BAD_SUBSTR = [
  'caralho', 'porra', 'buceta', 'boceta', 'viado', 'viadinho', 'arrombad', 'cuzao', 'filhodaputa', 'putaria', 'putinha', 'vagabund', 'otario', 'retardad',
  'estupr', 'pedofil', 'nazista', 'hitler', 'bosta', 'merda', 'foder', 'foda-se'.replace('-', ''), 'punheta', 'xereca', 'prostitut',
  'fuck', 'shit', 'bitch', 'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut', 'rapist', 'porn', 'nazi', 'pedophil', 'molest',
];
// Palavras curtas ou que existem dentro de outras: só valem como palavra do nome (separada por espaço, "_", "." ou "-"), começando com ela.
export const BAD_WORD_START = ['puta', 'puto', 'pedo', 'cuz', 'anus', 'cunt'];
// Só quando a palavra é exatamente esta.
export const BAD_WORD_EXACT = ['cu', 'ass', 'fdp', 'pqp', 'vsf', 'tnc', 'kkk', 'vtnc', 'fodase', 'sexo', 'xxx', 'dick', 'cock', 'pica', 'rola'];

const ACCENTS: Record<string, string> = { á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a', é: 'e', è: 'e', ê: 'e', ë: 'e', í: 'i', ì: 'i', î: 'i', ï: 'i', ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o', ú: 'u', ù: 'u', û: 'u', ü: 'u', ç: 'c', ñ: 'n' };
const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a', '$': 's', '!': 'i' };
export const squash = (s: string) => s.replace(/(.)\1+/g, '$1');   // "fuuuck" -> "fuck", "ass" -> "as" (the lists are squashed the same way)
const clean = (s: string) => squash([...s.toLowerCase()].map(ch => ACCENTS[ch] ?? LEET[ch] ?? ch).join('').replace(/[^a-z]/g, ''));

export const isNameAllowed = (name: string): boolean => {
  let words = name.toLowerCase().split(/[\s_.\-]+/).filter(Boolean).map(clean).filter(Boolean);
  const all = words.join('');
  if (words.length > 1 && words.every(w => w.length === 1)) words = [all];   // "p.u.t.a", "c u": letters spelled one by one count as one word
  if (BAD_SUBSTR.some(b => all.includes(squash(clean(b))))) return false;
  if (words.some(w => BAD_WORD_START.some(b => w.startsWith(squash(clean(b)))))) return false;
  if (words.some(w => BAD_WORD_EXACT.some(b => w === squash(clean(b))))) return false;
  return true;
};
export const NAME_REFUSED = 'Esse nome não é permitido. Escolha outro.';

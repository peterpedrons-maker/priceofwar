// Imported first by tests/balance-lab.ts: puts the patch's `rules` (start gold, gold per turn, first combat round...) where rules.ts reads them.
import { readFileSync } from 'node:fs';
if (process.env.PATCH) {
  const rules = JSON.parse(readFileSync(process.env.PATCH, 'utf8')).rules;
  if (rules) (globalThis as { __POW_RULES__?: unknown }).__POW_RULES__ = rules;
}

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { resolve } from 'node:path';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const dataDir = resolve(process.cwd(), 'public/data');
const clean = (value) => value.replace(/\s+/g, '');
const part0 = clean(await readFile(resolve(dataDir, 'public-data.00.b64'), 'utf8'));
const part1 = clean(await readFile(resolve(dataDir, 'public-data.01.b64'), 'utf8'));

const expectedCounts = {
  guides: 26,
  builds: 18,
  raids: 31,
  codes: 14,
  collections: 314,
  content_creators: 2,
  roadmap_items: 6,
};

let repaired = null;
let repair = null;
const boundary = part0.length;
const searchStart = Math.max(0, boundary - 64);
const searchEnd = Math.min(part0.length + part1.length, boundary + 64);
const joined = `${part0}${part1}`;

for (let position = searchStart; position <= searchEnd && !repaired; position += 1) {
  for (const character of alphabet) {
    try {
      const encoded = `${joined.slice(0, position)}${character}${joined.slice(position)}`;
      const decoded = gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');
      const candidate = JSON.parse(decoded);
      const valid = Object.entries(expectedCounts).every(
        ([name, count]) => Array.isArray(candidate[name]) && candidate[name].length === count,
      );

      if (valid) {
        repaired = candidate;
        repair = { position, character };
        break;
      }
    } catch {
      // Continue until gzip, JSON and all expected dataset counts validate.
    }
  }
}

if (!repaired || !repair) {
  throw new Error('Could not repair the public archive near the 8,000-character split boundary');
}

console.log(`Recovered missing base64 character ${repair.character} at position ${repair.position}`);

await mkdir(dataDir, { recursive: true });
for (const [name, expectedCount] of Object.entries(expectedCounts)) {
  const rows = repaired[name];
  await writeFile(resolve(dataDir, `${name}.json`), JSON.stringify(rows), 'utf8');
  console.log(`Verified ${name}: ${rows.length}/${expectedCount} rows`);
}

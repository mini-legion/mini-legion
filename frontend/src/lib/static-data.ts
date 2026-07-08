import type { Build, Code, ContentCreator, GearCollection, Guide, Raid, RoadmapItem } from './database.types';

type PublicData = {
  guides: Guide[];
  builds: Build[];
  raids: Raid[];
  codes: Code[];
  collections: GearCollection[];
  content_creators: ContentCreator[];
  roadmap_items: RoadmapItem[];
};

let publicDataPromise: Promise<PublicData> | null = null;

async function loadArchive(): Promise<PublicData> {
  const [part0, part1] = await Promise.all([
    fetch('/data/public-data.00.b64').then((response) => {
      if (!response.ok) throw new Error('Public data archive part 0 could not be loaded');
      return response.text();
    }),
    fetch('/data/public-data.01.b64').then((response) => {
      if (!response.ok) throw new Error('Public data archive part 1 could not be loaded');
      return response.text();
    }),
  ]);

  const encoded = `${part0.trim()}${part1.trim()}`;
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream('gzip'));
  const json = await new Response(stream).text();

  return JSON.parse(json) as PublicData;
}

export function getPublicData(): Promise<PublicData> {
  if (!publicDataPromise) publicDataPromise = loadArchive();
  return publicDataPromise;
}

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

type DatasetName = keyof PublicData;

const DATASETS: DatasetName[] = [
  'guides',
  'builds',
  'raids',
  'codes',
  'collections',
  'content_creators',
  'roadmap_items',
];

let publicDataPromise: Promise<PublicData> | null = null;

async function loadDataset<T>(name: DatasetName): Promise<T[]> {
  const response = await fetch(`/data/${name}.json`, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Public dataset ${name} could not be loaded (${response.status})`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`Public dataset ${name} is invalid`);
  }

  return data as T[];
}

async function loadPublicData(): Promise<PublicData> {
  const values = await Promise.all(DATASETS.map((name) => loadDataset(name)));

  return DATASETS.reduce((result, name, index) => {
    result[name] = values[index] as never;
    return result;
  }, {} as PublicData);
}

export function getPublicData(): Promise<PublicData> {
  if (!publicDataPromise) {
    publicDataPromise = loadPublicData().catch((error) => {
      publicDataPromise = null;
      throw error;
    });
  }

  return publicDataPromise;
}

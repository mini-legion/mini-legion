export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  itemCount?: number;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export interface Build {
  id: string;
  name: string;
  heroClass: string;
  tier: 'S' | 'A' | 'B' | 'C';
  description: string;
  author: string;
  likes: number;
  image: string;
}

export interface ImportantDrop {
  name: string;
  image?: string;
}

export interface BossSkill {
  name: string;
  description: string;
}

export interface BossStats {
  hp: number;
  attack: string;
  armor: number;
  fireRes: number;
  frostRes: number;
  arcaneRes: number;
  natureRes: number;
  shadowRes: number;
  holyRes: number;
  armorPen: string;
  spellPen: number;
  ignoreArmor: number;
  hit: string;
  dodge: string;
  critical: string;
  criticalRes: string;
  expertise: string;
  parry: string;
  block: string;
  dmgAmp: string;
  dmgRed: string;
}

export interface Boss {
  name: string;
  level: number;
  image?: string;
  stats: BossStats;
  skills: BossSkill[];
}

export interface SubRaid {
  id: string;
  name: string;
  level: number;
  recommendedGearLvl: number;
  gearDrop: string;
  importantDrop: string;
  bosses: Boss[];
}

export interface Raid {
  id: string;
  name: string;
  difficulty: 'Normal' | 'Hard' | 'Extreme';
  subcategory: string;
  minLevel: number;
  rewards: string[];
  description: string;
  image: string;
  stats?: {
    sta: number;
    armor: number;
    gearLvlDrop: number;
    importantDrop: string;
    importantDrops?: ImportantDrop[];
  };
  subraids?: SubRaid[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  date: string;
  version?: string;
}

export interface Code {
  id: string;
  code: string;
  rewards: string[];
  expiresAt: string | null;
  isActive: boolean;
  dateAdded: string;
}

export interface ContentCreator {
  id: string;
  name: string;
  platform: 'YouTube' | 'Twitch' | 'TikTok' | 'Twitter';
  avatar: string;
  followers: string;
  description: string;
  url: string;
  featured: boolean;
}


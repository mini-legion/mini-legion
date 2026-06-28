// Tipos generados para Supabase Database
// Basados en la estructura de Mini Legion API

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Tipos de secciones de guías
export interface GuideSection {
  type: 'tips' | 'steps' | 'text' | 'image' | 'video' | 'table' | 'warning' | 'note'
  title?: string
  content?: string
  tips?: { title: string; description: string }[]
  steps?: { step: number; title: string; description: string }[]
  image?: string
  imageCaption?: string
  videoUrl?: string
  videoTitle?: string
  videoCreator?: string
  videoCreatorUrl?: string
  tableHeaders?: string[]
  tableRows?: string[][]
}

// Tipos de builds
export interface BuildImages {
  skills?: string
  skills2?: string
  tree1?: string
  tree2?: string
  tree3?: string
  dungeonGear?: string
  adventureGear?: string
}

export interface BuildRune {
  skill: string
  runeName: string
  description: string
  icon: string
}

export interface BuildGearGuide {
  // Legacy format (for healer builds)
  dungeonStats?: { priority: string[]; description: string }
  adventureStats?: {
    armor: { priority: string[]; description: string }
    accessories: { priority: string[]; description: string }
  }
  // New format (for DPS builds like Hunter Survival)
  weapon?: {
    title?: string
    recommendation: string
    note?: string
  }
  trinkets?: {
    title?: string
    recommendation: string
    priority?: string[]
  }
  stats?: {
    title?: string
    expertise?: string
    note?: string
  }
}

export interface BuildRefinesGuide {
  priority?: string[]
  // Legacy format (for healer builds)
  details?: { slot: string; stats: string[] }[]
  tips?: string
  // New format (for DPS builds like Hunter Survival)
  notes?: string[]
  tip?: string
}

export interface BuildSpellGuide {
  skill: string
  rune: string
  description: string
  icon: string
  priority?: number
  autocast: boolean
}

// Tipos de raids
export interface RaidStats {
  sta?: number
  armor?: number
  gearLvlDrop?: number
  importantDrop?: string
  importantDrops?: { name: string; type?: string; dropRate?: string; image?: string }[]
}

export interface BossStats {
  hp: number
  attack: number | string
  armor: number | string
  armorPen: number | string
  hit: number | string
  dodge: number | string
  critical: number | string
  criticalRes: number | string
  expertise: number | string
  parry: number | string
  block: number | string
  ignoreArmor: number | string
  dmgAmp: number | string
  dmgRed: number | string
  spellPen: number | string
  fireRes: number
  frostRes: number
  arcaneRes: number
  natureRes: number
  shadowRes: number
  holyRes: number
}

export interface BossSkill {
  name: string
  description: string
}

export interface Boss {
  name: string
  level: number
  image?: string
  stats: BossStats
  skills: BossSkill[]
}

export interface SubRaid {
  id: string
  name: string
  level: number
  recommendedGearLvl: number | string
  gearDrop: number | string
  importantDrop: string
  description?: string
}

export interface RaidMechanic {
  title: string
  description: string
  icon?: string
}

export interface RaidReward {
  name: string
  type?: string
  image?: string
  dropRate?: string
}

export interface Guide {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  category: string
  subcategory: string
  image?: string
  author: string
  date: string
  read_time: string
  tags: string[]
  sections: GuideSection[]
  created_at: string
  updated_at: string
}

export interface Build {
  id: string
  title: string
  description: string
  hero_class: string
  spec: string
  role?: 'DPS' | 'Healer' | 'Tank'
  tier: 'S' | 'A' | 'B' | 'C'
  content_type: string[]
  image?: string
  images: BuildImages
  author: string
  likes: number
  intro_text?: string
  sections?: unknown
  runes: BuildRune[]
  gear_guide: BuildGearGuide
  refines_guide: BuildRefinesGuide
  spells_guide: BuildSpellGuide[]
  autocast_order: string[]
  healing_tips: string[]
  talent_tips?: string
  created_at: string
  updated_at: string
}

export interface Raid {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  difficulty: string
  min_level: number
  recommended_gear: string
  image?: string
  bosses: Boss[]
  sub_raids?: SubRaid[]
  mechanics: RaidMechanic[]
  rewards: RaidReward[]
  tips: string[]
  created_at: string
  updated_at: string
}

export interface Code {
  id: string
  code: string
  rewards: string
  description: string
  date_added: string
  expiry_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContentCreator {
  id: string
  name: string
  platform: string
  avatar?: string | null
  followers?: string
  description: string
  url: string
  featured: boolean
  youtube_channel_id?: string | null
  created_at: string
}

export interface RoadmapItem {
  id: string
  title: string
  description: string
  status: 'planned' | 'in-progress' | 'completed'
  date: string
  version?: string
  image?: string
  created_at: string
}

export interface GearCollection {
  'Gear Collection Name': string
  'Set Bonus 2 Pieces': string
  'Set Bonus 4 Pieces': string
  'Location': string
  'Boss': string
  'Gear Drop': string
}

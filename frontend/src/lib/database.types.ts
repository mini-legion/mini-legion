export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface GuideSection {
  type: 'tips' | 'steps' | 'text' | 'image' | 'video' | 'table' | 'warning' | 'note'
  title?: string
  content?: string
  tips?: { icon?: string; title: string; description: string }[]
  steps?: { step?: number; stepNumber?: number; title: string; description: string }[]
  image?: string
  imageCaption?: string
  videoUrl?: string
  videoTitle?: string
  videoCreator?: string
  videoCreatorUrl?: string
  tableHeaders?: string[]
  tableRows?: string[][]
}

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
  priority?: number
}

export interface BuildGearGuide {
  dungeonStats?: { priority: string[]; description: string }
  adventureStats?: {
    armor: { priority: string[]; description: string }
    accessories: { priority: string[]; description: string }
  }
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
  [key: string]: unknown
}

export interface BuildRefinesGuide {
  priority?: string[]
  details?: { slot: string; stats: string[] }[]
  tips?: string
  notes?: string[]
  tip?: string
  [key: string]: unknown
}

export interface BuildSpellGuide {
  skill: string
  rune: string
  description: string
  icon: string
  priority?: number
  autocast: boolean
}

export interface RaidDrop {
  name: string
  type?: string
  dropRate?: string
  image?: string
}

export interface RaidStats {
  sta?: number
  armor?: number
  gearLvlDrop?: number
  importantDrop?: string
  importantDrops?: RaidDrop[]
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
  bosses?: Boss[]
  description?: string
}

export interface Guide {
  id: string
  user_id?: string | null
  slug: string
  title: string
  subtitle?: string | null
  description: string
  category: string
  subcategory: string
  image: string | null
  author: string
  date: string
  read_time: string
  tags: string[]
  sections: GuideSection[]
  related_guides?: string[]
  created_at: string
  updated_at: string
}

export interface Build {
  id: string
  user_id?: string | null
  title: string
  description: string
  hero_class: string
  spec: string
  role?: 'DPS' | 'Healer' | 'Tank'
  tier: 'S' | 'A' | 'B' | 'C'
  content_type: string[]
  image?: string | null
  images: BuildImages
  author: string
  likes: number
  view_count?: number
  intro_text?: string | null
  sections?: unknown
  runes: BuildRune[]
  gear_guide: BuildGearGuide
  refines_guide: BuildRefinesGuide
  spells_guide: BuildSpellGuide[]
  autocast_order: string[]
  healing_tips: string[]
  talent_tips?: string | null
  created_at: string
  updated_at: string
}

export interface Raid {
  id: string
  name: string
  description: string
  subcategory: string
  difficulty: string
  min_level: number
  image?: string | null
  stats: RaidStats
  rewards: string[]
  subraids: SubRaid[]
  created_at: string
  updated_at: string
}

export interface Code {
  id: string
  code: string
  rewards: string[]
  date_added: string
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export interface ContentCreator {
  id: string
  name: string
  platform: string
  avatar: string | null
  followers?: string
  description: string
  url: string
  featured: boolean
  youtube_channel_id: string | null
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
  id?: number
  'Collection Status'?: string
  'Gear Collection Name': string
  'Drop Item Name': string
  'Location': string
  'Affix': string
  'Attribute 1': string
  'Attribute 2': string
  'Affix Type'?: string
  'Affix Value': string
  'Upstar Item'?: string
  'Attribute Type'?: string
  'Attribute Value': number
  'Attribute 2 Type'?: string
  'Attribute 2 Value': number
  'Upgrade Item'?: string
}

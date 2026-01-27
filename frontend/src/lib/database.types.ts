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
  type: 'tips' | 'steps' | 'text' | 'image' | 'table' | 'warning' | 'note'
  title?: string
  content?: string
  tips?: { title: string; description: string }[]
  steps?: { step: number; title: string; description: string }[]
  image?: string
  imageCaption?: string
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
  dungeonStats?: { priority: string[]; description: string }
  adventureStats?: {
    armor: { priority: string[]; description: string }
    accessories: { priority: string[]; description: string }
  }
}

export interface BuildRefinesGuide {
  priority: string[]
  details: { slot: string; stats: string[] }[]
  tips?: string
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
  rewards?: string[]
  stats?: RaidStats
  bosses: Boss[]
}

// Database schema
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          icon?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          description?: string | null
          created_at?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          category_id: string | null
          name: string
          icon: string | null
          description: string | null
          item_count: number
          created_at: string
        }
        Insert: {
          id: string
          category_id?: string | null
          name: string
          icon?: string | null
          description?: string | null
          item_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          icon?: string | null
          description?: string | null
          item_count?: number
          created_at?: string
        }
      }
      guides: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string | null
          description: string | null
          category: string
          subcategory: string
          image: string | null
          author: string
          date: string
          read_time: string | null
          tags: string[]
          sections: GuideSection[]
          related_guides: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          slug: string
          title: string
          subtitle?: string | null
          description?: string | null
          category: string
          subcategory: string
          image?: string | null
          author: string
          date?: string
          read_time?: string | null
          tags?: string[]
          sections?: GuideSection[]
          related_guides?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          category?: string
          subcategory?: string
          image?: string | null
          author?: string
          date?: string
          read_time?: string | null
          tags?: string[]
          sections?: GuideSection[]
          related_guides?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      builds: {
        Row: {
          id: string
          hero_class: string
          spec: string | null
          title: string
          description: string | null
          author: string
          tier: 'S' | 'A' | 'B' | 'C'
          content_type: string[]
          role: 'DPS' | 'Healer' | 'Tank' | null
          likes: number
          image: string | null
          images: BuildImages
          runes: BuildRune[]
          gear_guide: BuildGearGuide
          refines_guide: BuildRefinesGuide
          spells_guide: BuildSpellGuide[]
          healing_tips: string[]
          autocast_order: string[]
          talent_tips: string | null
          intro_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          hero_class: string
          spec?: string | null
          title: string
          description?: string | null
          author: string
          tier?: 'S' | 'A' | 'B' | 'C'
          content_type?: string[]
          role?: 'DPS' | 'Healer' | 'Tank' | null
          likes?: number
          image?: string | null
          images?: BuildImages
          runes?: BuildRune[]
          gear_guide?: BuildGearGuide
          refines_guide?: BuildRefinesGuide
          spells_guide?: BuildSpellGuide[]
          healing_tips?: string[]
          autocast_order?: string[]
          talent_tips?: string | null
          intro_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_class?: string
          spec?: string | null
          title?: string
          description?: string | null
          author?: string
          tier?: 'S' | 'A' | 'B' | 'C'
          content_type?: string[]
          role?: 'DPS' | 'Healer' | 'Tank' | null
          likes?: number
          image?: string | null
          images?: BuildImages
          runes?: BuildRune[]
          gear_guide?: BuildGearGuide
          refines_guide?: BuildRefinesGuide
          spells_guide?: BuildSpellGuide[]
          healing_tips?: string[]
          autocast_order?: string[]
          talent_tips?: string | null
          intro_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      raids: {
        Row: {
          id: string
          name: string
          difficulty: 'Normal' | 'Hard' | 'Extreme' | 'Heroic' | 'Mythic' | 'Abyss'
          subcategory: string
          min_level: number | null
          rewards: string[]
          description: string | null
          image: string | null
          stats: RaidStats
          subraids: SubRaid[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          difficulty: 'Normal' | 'Hard' | 'Extreme' | 'Heroic' | 'Mythic' | 'Abyss'
          subcategory: string
          min_level?: number | null
          rewards?: string[]
          description?: string | null
          image?: string | null
          stats?: RaidStats
          subraids?: SubRaid[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          difficulty?: 'Normal' | 'Hard' | 'Extreme' | 'Heroic' | 'Mythic' | 'Abyss'
          subcategory?: string
          min_level?: number | null
          rewards?: string[]
          description?: string | null
          image?: string | null
          stats?: RaidStats
          subraids?: SubRaid[]
          created_at?: string
          updated_at?: string
        }
      }
      codes: {
        Row: {
          id: string
          code: string
          rewards: string[]
          expires_at: string | null
          is_active: boolean
          date_added: string
          created_at: string
        }
        Insert: {
          id: string
          code: string
          rewards?: string[]
          expires_at?: string | null
          is_active?: boolean
          date_added?: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          rewards?: string[]
          expires_at?: string | null
          is_active?: boolean
          date_added?: string
          created_at?: string
        }
      }
      content_creators: {
        Row: {
          id: string
          name: string
          platform: 'YouTube' | 'Twitch' | 'TikTok' | 'Twitter' | 'Discord'
          avatar: string | null
          followers: string | null
          description: string | null
          url: string | null
          featured: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          platform: 'YouTube' | 'Twitch' | 'TikTok' | 'Twitter' | 'Discord'
          avatar?: string | null
          followers?: string | null
          description?: string | null
          url?: string | null
          featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          platform?: 'YouTube' | 'Twitch' | 'TikTok' | 'Twitter' | 'Discord'
          avatar?: string | null
          followers?: string | null
          description?: string | null
          url?: string | null
          featured?: boolean
          created_at?: string
        }
      }
      roadmap_items: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'planned' | 'in-progress' | 'completed'
          date: string | null
          version: string | null
          created_at: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          status?: 'planned' | 'in-progress' | 'completed'
          date?: string | null
          version?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'planned' | 'in-progress' | 'completed'
          date?: string | null
          version?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Type helpers para usar en el código
export type Guide = Database['public']['Tables']['guides']['Row']
export type GuideInsert = Database['public']['Tables']['guides']['Insert']
export type Build = Database['public']['Tables']['builds']['Row']
export type BuildInsert = Database['public']['Tables']['builds']['Insert']
export type Raid = Database['public']['Tables']['raids']['Row']
export type RaidInsert = Database['public']['Tables']['raids']['Insert']
export type Code = Database['public']['Tables']['codes']['Row']
export type CodeInsert = Database['public']['Tables']['codes']['Insert']
export type ContentCreator = Database['public']['Tables']['content_creators']['Row']
export type RoadmapItem = Database['public']['Tables']['roadmap_items']['Row']

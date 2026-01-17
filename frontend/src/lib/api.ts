import { supabase, getImageUrl } from './supabase'
import type { Guide, Build, Raid, Code, ContentCreator, RoadmapItem } from './database.types'

// ============================================
// GUIDES API
// ============================================

export async function getGuides() {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data as Guide[]
}

export async function getGuidesBySubcategory(subcategory: string) {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('subcategory', subcategory)
    .order('date', { ascending: false })

  if (error) throw error
  return data as Guide[]
}

export async function getGuideBySlug(slug: string) {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Guide
}

export async function getGuideById(id: string) {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Guide
}

// ============================================
// BUILDS API
// ============================================

export async function getBuilds() {
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .order('tier', { ascending: true })

  if (error) throw error
  return data as Build[]
}

export async function getBuildsByClass(heroClass: string) {
  // Case-insensitive match for hero_class
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .ilike('hero_class', heroClass)
    .order('tier', { ascending: true })

  if (error) throw error
  return data as Build[]
}

export async function getBuildById(id: string) {
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Build
}

export async function getBuildsByTier(tier: 'S' | 'A' | 'B' | 'C') {
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .eq('tier', tier)

  if (error) throw error
  return data as Build[]
}

// ============================================
// RAIDS API
// ============================================

export async function getRaids() {
  const { data, error } = await supabase
    .from('raids')
    .select('*')
    .order('min_level', { ascending: true })

  if (error) throw error
  return data as Raid[]
}

export async function getRaidsBySubcategory(subcategory: string) {
  const { data, error } = await supabase
    .from('raids')
    .select('*')
    .eq('subcategory', subcategory)
    .order('min_level', { ascending: true })

  if (error) throw error
  return data as Raid[]
}

export async function getRaidsByDifficulty(difficulty: string) {
  const { data, error } = await supabase
    .from('raids')
    .select('*')
    .eq('difficulty', difficulty)
    .order('min_level', { ascending: true })

  if (error) throw error
  return data as Raid[]
}

export async function getRaidById(id: string) {
  const { data, error } = await supabase
    .from('raids')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Raid
}

// ============================================
// CODES API
// ============================================

export async function getCodes() {
  const { data, error } = await supabase
    .from('codes')
    .select('*')
    .order('date_added', { ascending: false })

  if (error) throw error
  return data as Code[]
}

export async function getActiveCodes() {
  const { data, error } = await supabase
    .from('codes')
    .select('*')
    .eq('is_active', true)
    .order('date_added', { ascending: false })

  if (error) throw error
  return data as Code[]
}

// ============================================
// CONTENT CREATORS API
// ============================================

export async function getContentCreators() {
  const { data, error } = await supabase
    .from('content_creators')
    .select('*')
    .order('featured', { ascending: false })

  if (error) throw error
  return data as ContentCreator[]
}

export async function getFeaturedCreators() {
  const { data, error } = await supabase
    .from('content_creators')
    .select('*')
    .eq('featured', true)

  if (error) throw error
  return data as ContentCreator[]
}

// ============================================
// ROADMAP API
// ============================================

export async function getRoadmapItems() {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data as RoadmapItem[]
}

export async function getRoadmapByStatus(status: 'planned' | 'in-progress' | 'completed') {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .eq('status', status)
    .order('date', { ascending: false })

  if (error) throw error
  return data as RoadmapItem[]
}

// ============================================
// STORAGE HELPERS
// ============================================

export const storage = {
  // Generic helper for paths stored in DB (e.g., "guides/afk/afk-guide1.png")
  getUrl: (path: string | null | undefined) => path ? getImageUrl('images', path) : null,

  guides: {
    getImageUrl: (path: string) => getImageUrl('images', `guides/${path}`),
  },
  builds: {
    getImageUrl: (path: string) => getImageUrl('images', `builds/${path}`),
  },
  raids: {
    getImageUrl: (path: string) => getImageUrl('images', `raids/${path}`),
  },
  creators: {
    getImageUrl: (path: string) => getImageUrl('images', `creators/${path}`),
  },
  items: {
    getImageUrl: (path: string) => getImageUrl('images', `items/${path}`),
  },
  bosses: {
    getImageUrl: (path: string) => getImageUrl('images', `bosses/${path}`),
  },
  classes: {
    getImageUrl: (path: string) => getImageUrl('images', `classes/${path}`),
  },
  roadmap: {
    getImageUrl: (path: string) => getImageUrl('images', `roadmap/${path}`),
  },
}

// ============================================
// SUBCATEGORIES (Static data - these rarely change)
// ============================================

export const guidesSubcategories = [
  { id: 'beginner', name: 'Beginner Guides', icon: '📖', description: 'Start your journey here' },
  { id: 'raids-dungeons', name: 'Raids & Dungeons', icon: '⚔️', description: 'Conquer every challenge' },
  { id: 'farming', name: 'Farming & Resources', icon: '💰', description: 'Maximize your gains' },
  { id: 'pvp-guilds', name: 'PVP & Guilds', icon: '🏆', description: 'Dominate the arena and lead your guild' },
]

export const buildsSubcategories = [
  { id: 'hunter', name: 'Hunter', icon: '🏹', description: 'Ranged DPS builds' },
  { id: 'priest', name: 'Priest', icon: '✨', description: 'Healing builds' },
  { id: 'mage', name: 'Mage', icon: '🔮', description: 'Magic DPS builds' },
  { id: 'warrior', name: 'Warrior', icon: '🛡️', description: 'Tank and melee builds' },
  { id: 'rogue', name: 'Rogue', icon: '🗡️', description: 'Stealth and burst builds' },
  { id: 'paladin', name: 'Paladin', icon: '⚜️', description: 'Holy warrior builds' },
]

const STORAGE_BASE = 'https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/images'

export const raidsSubcategories = [
  { id: 'normal', name: 'Normal', icon: `${STORAGE_BASE}/raids/normal.png`, description: 'Standard events designed to be completed solo with a single character.', itemCount: 11 },
  { id: 'heroic', name: 'Heroic', icon: `${STORAGE_BASE}/raids/heroic.png`, description: 'Challenging events you can tackle solo with your 5 characters or team up with other players to complete.', itemCount: 17 },
  { id: 'raid', name: 'Raid', icon: `${STORAGE_BASE}/raids/raid.png`, description: 'Epic 25-player cooperative encounters. The first tier of end-game content where team coordination is essential.', itemCount: 2 },
  { id: 'abyss', name: 'Abyss', icon: `${STORAGE_BASE}/raids/abyss.png`, description: 'Elite 25-player events featuring enhanced raid encounters with significantly higher difficulty and superior rewards.', itemCount: 0 },
  { id: 'mythic', name: 'Mythic+', icon: `${STORAGE_BASE}/raids/mythic.png`, description: 'The ultimate high-end challenge. A 5-player multi-floor dungeon experience designed for the most coordinated squads.', itemCount: 0 },
]

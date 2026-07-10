import { getPublicData } from './static-data'
import type { Guide, Build, Raid, Code, ContentCreator, RoadmapItem, GearCollection } from './database.types'

function byDateDesc(a: string | null | undefined, b: string | null | undefined) {
  return new Date(b || 0).getTime() - new Date(a || 0).getTime()
}

function byName(a: string | null | undefined, b: string | null | undefined) {
  return (a || '').localeCompare(b || '')
}

type PublicOverrides = {
  guides: Record<string, Partial<Guide>>
  builds: Record<string, Partial<Build>>
}

let overridesPromise: Promise<PublicOverrides> | null = null

async function getPublicOverrides(): Promise<PublicOverrides> {
  if (!overridesPromise) {
    overridesPromise = fetch('/api/public-overrides', { cache: 'no-cache' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Override API failed (${response.status})`)
        const data = await response.json() as Partial<PublicOverrides>
        return {
          guides: data.guides && typeof data.guides === 'object' ? data.guides : {},
          builds: data.builds && typeof data.builds === 'object' ? data.builds : {},
        }
      })
      .catch(() => ({ guides: {}, builds: {} }))
  }

  return overridesPromise
}

function mergeById<T extends { id: string }>(base: T[], overrides: Record<string, Partial<T>>) {
  const merged = new Map(base.map((item) => [item.id, { ...item }]))

  Object.entries(overrides).forEach(([id, override]) => {
    const current = merged.get(id)
    merged.set(id, { ...(current || { id } as T), ...override, id } as T)
  })

  return [...merged.values()]
}

// ============================================
// GUIDES API — STATIC CDN DATA + D1 OVERRIDES
// ============================================

export async function getGuides() {
  const [data, overrides] = await Promise.all([getPublicData(), getPublicOverrides()])
  return mergeById(data.guides as Guide[], overrides.guides)
    .sort((a, b) => byDateDesc(a.date, b.date))
}

export async function getGuidesBySubcategory(subcategory: string) {
  const guides = await getGuides()
  return guides.filter((guide) => guide.subcategory === subcategory)
}

export async function getGuideBySlug(slug: string) {
  const guides = await getGuides()
  const guide = guides.find((item) => item.slug === slug)
  if (!guide) throw new Error('Guide not found')
  return guide
}

export async function getGuideById(id: string) {
  const guides = await getGuides()
  const guide = guides.find((item) => item.id === id)
  if (!guide) throw new Error('Guide not found')
  return guide
}

// ============================================
// BUILDS API — STATIC CDN DATA + D1 OVERRIDES
// ============================================

export async function getBuilds() {
  const [data, overrides] = await Promise.all([getPublicData(), getPublicOverrides()])
  return mergeById(data.builds as Build[], overrides.builds)
    .sort((a, b) => byDateDesc(a.created_at, b.created_at))
}

export async function getLatestBuilds(limit = 6) {
  const builds = await getBuilds()
  return builds.slice(0, limit)
}

export async function getMostViewedBuilds(limit = 6) {
  const builds = await getBuilds()
  return [...builds]
    .sort((a, b) => {
      const viewsA = Number((a as Build & { view_count?: number }).view_count || 0)
      const viewsB = Number((b as Build & { view_count?: number }).view_count || 0)
      return viewsB - viewsA || byDateDesc(a.created_at, b.created_at)
    })
    .slice(0, limit)
}

export async function trackBuildView(id: string) {
  if (!id) return 0
  const builds = await getBuilds()
  const build = builds.find((item) => item.id === id) as (Build & { view_count?: number }) | undefined
  return Number(build?.view_count || 0)
}

export async function getBuildsByClass(heroClass: string) {
  const builds = await getBuilds()
  return builds.filter((build) => build.hero_class.toLowerCase() === heroClass.toLowerCase())
}

export async function getBuildById(id: string) {
  const builds = await getBuilds()
  const build = builds.find((item) => item.id === id)
  if (!build) throw new Error('Build not found')
  return build
}

export async function getBuildsByTier(tier: 'S' | 'A' | 'B' | 'C') {
  const builds = await getBuilds()
  return builds.filter((build) => build.tier === tier)
}

// ============================================
// RAIDS API — STATIC CDN DATA
// ============================================

export async function getRaids() {
  const data = await getPublicData()
  return [...data.raids].sort((a, b) => Number(a.min_level || 0) - Number(b.min_level || 0)) as Raid[]
}

export async function getRaidsBySubcategory(subcategory: string) {
  const raids = await getRaids()
  return raids.filter((raid) => raid.subcategory === subcategory)
}

export async function getRaidsByDifficulty(difficulty: string) {
  const raids = await getRaids()
  return raids.filter((raid) => raid.difficulty === difficulty)
}

export async function getRaidById(id: string) {
  const data = await getPublicData()
  const raid = data.raids.find((item) => item.id === id)
  if (!raid) throw new Error('Raid not found')
  return raid as Raid
}

// ============================================
// CODES API — STATIC CDN DATA
// ============================================

export async function getCodes() {
  const data = await getPublicData()
  return [...data.codes].sort((a, b) => byDateDesc(a.date_added, b.date_added)) as Code[]
}

export async function getActiveCodes() {
  const codes = await getCodes()
  return codes.filter((code) => code.is_active)
}

// ============================================
// CONTENT CREATORS API — STATIC CDN DATA
// ============================================

export async function getContentCreators() {
  const data = await getPublicData()
  return [...data.content_creators].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))) as ContentCreator[]
}

export async function getFeaturedCreators() {
  const creators = await getContentCreators()
  return creators.filter((creator) => creator.featured)
}

// ============================================
// ROADMAP API — STATIC CDN DATA
// ============================================

export async function getRoadmapItems() {
  const data = await getPublicData()
  return [...data.roadmap_items].sort((a, b) => byDateDesc(a.date, b.date)) as RoadmapItem[]
}

export async function getRoadmapByStatus(status: 'planned' | 'in-progress' | 'completed') {
  const items = await getRoadmapItems()
  return items.filter((item) => item.status === status)
}

// ============================================
// GEAR COLLECTIONS API — STATIC CDN DATA
// ============================================

export async function getGearCollections() {
  const data = await getPublicData()
  return [...data.collections].sort((a, b) => byName(a['Gear Collection Name'], b['Gear Collection Name'])) as GearCollection[]
}

export async function getGearCollectionsByLocation(location: string) {
  const collections = await getGearCollections()
  return collections.filter((item) => item['Location'] === location)
}

// ============================================
// STORAGE HELPERS
// ============================================

const SUPABASE_STORAGE_PREFIX = 'https://mmjplyofgdpaqajaxjbc.supabase.co/storage/'

export const storage = {
  getUrl: (path: string | null | undefined) => {
    if (!path) return null
    if (path.startsWith(SUPABASE_STORAGE_PREFIX)) return null
    if (path.includes('://')) return path
    return `/images/${path}`
  },

  guides: {
    getImageUrl: (path: string) => `/images/guides/${path}`,
  },
  builds: {
    getImageUrl: (path: string) => `/images/builds/${path}`,
  },
  raids: {
    getImageUrl: (path: string) => `/images/raids/${path}`,
  },
  creators: {
    getImageUrl: (path: string) => `/images/creators/${path}`,
  },
  items: {
    getImageUrl: (path: string) => `/images/items/${path}`,
  },
  bosses: {
    getImageUrl: (path: string) => `/images/bosses/${path}`,
  },
  classes: {
    getImageUrl: (path: string) => `/images/classes/${path}`,
  },
  roadmap: {
    getImageUrl: (path: string) => `/images/roadmap/${path}`,
  },
}

// ============================================
// SUBCATEGORIES
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
  { id: 'shaman', name: 'Shaman', icon: '🌩️', description: 'Elemental and support builds' },
  { id: 'druid', name: 'Druid', icon: '🌿', description: 'Nature, healing and hybrid builds' },
]

export const raidsSubcategories = [
  { id: 'normal', name: 'Normal', icon: '/images/raids/normal.png', description: 'Standard events designed to be completed solo with a single character.', itemCount: 11 },
  { id: 'heroic', name: 'Heroic', icon: '/images/raids/heroic.png', description: 'Challenging events you can tackle solo with your 5 characters or team up with other players to complete.', itemCount: 17 },
  { id: 'raid', name: 'Raid', icon: '/images/raids/raid.png', description: 'Epic 25-player cooperative encounters. The first tier of end-game content where team coordination is essential.', itemCount: 2 },
  { id: 'abyss', name: 'Abyss', icon: '/images/raids/abyss.png', description: 'Elite 25-player events featuring enhanced raid encounters with significantly higher difficulty and superior rewards.', itemCount: 0 },
  { id: 'mythic', name: 'Mythic+', icon: '/images/raids/mythic.png', description: 'The ultimate high-end challenge. A 5-player multi-floor dungeon experience designed for the most coordinated squads.', itemCount: 0 },
]

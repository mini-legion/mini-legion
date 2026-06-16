import { useState, useEffect } from 'react'
import {
  getGuides,
  getGuideById,
  getGuidesBySubcategory,
  getBuilds,
  getLatestBuilds,
  getMostViewedBuilds,
  getBuildById,
  getBuildsByClass,
  getRaids,
  getRaidById,
  getRaidsBySubcategory,
  getCodes,
  getContentCreators,
  getRoadmapItems,
  getGearCollections
} from './api'
import type { Guide, Build, Raid, Code, ContentCreator, RoadmapItem, GearCollection } from './database.types'
import { fetchYouTubeVideos, type YouTubeVideo } from './youtube'

// Generic hook for fetching data
function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    queryFn()
      .then((result) => {
        if (isMounted) {
          setData(result)
          setError(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}

// ============================================
// GUIDES HOOKS
// ============================================

export function useGuides() {
  return useSupabaseQuery<Guide[]>(getGuides)
}

export function useGuide(id: string) {
  return useSupabaseQuery<Guide>(() => getGuideById(id), [id])
}

export function useGuidesBySubcategory(subcategory: string) {
  return useSupabaseQuery<Guide[]>(
    () => getGuidesBySubcategory(subcategory),
    [subcategory]
  )
}

// ============================================
// BUILDS HOOKS
// ============================================

export function useBuilds() {
  return useSupabaseQuery<Build[]>(getBuilds)
}

export function useLatestBuilds(limit = 6) {
  return useSupabaseQuery<Build[]>(() => getLatestBuilds(limit), [limit])
}

export function useMostViewedBuilds(limit = 6) {
  return useSupabaseQuery<Build[]>(() => getMostViewedBuilds(limit), [limit])
}

export function useBuild(id: string) {
  return useSupabaseQuery<Build>(() => getBuildById(id), [id])
}

export function useBuildsByClass(heroClass: string) {
  return useSupabaseQuery<Build[]>(
    () => getBuildsByClass(heroClass),
    [heroClass]
  )
}

// ============================================
// RAIDS HOOKS
// ============================================

export function useRaids() {
  return useSupabaseQuery<Raid[]>(getRaids)
}

export function useRaid(id: string) {
  return useSupabaseQuery<Raid>(() => getRaidById(id), [id])
}

export function useRaidsBySubcategory(subcategory: string) {
  return useSupabaseQuery<Raid[]>(
    () => getRaidsBySubcategory(subcategory),
    [subcategory]
  )
}

// ============================================
// CODES HOOKS
// ============================================

export function useCodes() {
  return useSupabaseQuery<Code[]>(getCodes)
}

// ============================================
// CONTENT CREATORS HOOKS
// ============================================

export function useContentCreators() {
  return useSupabaseQuery<ContentCreator[]>(getContentCreators)
}

// ============================================
// ROADMAP HOOKS
// ============================================

export function useRoadmapItems() {
  return useSupabaseQuery<RoadmapItem[]>(getRoadmapItems)
}

// ============================================
// GEAR COLLECTIONS HOOKS
// ============================================

export function useGearCollections() {
  return useSupabaseQuery<GearCollection[]>(getGearCollections)
}

// ============================================
// YOUTUBE VIDEOS HOOKS
// ============================================

export function useYouTubeVideos(channelId: string | null, maxResults: number = 3) {
  const [data, setData] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!channelId) {
      setData([])
      return
    }

    let isMounted = true
    setLoading(true)

    fetchYouTubeVideos(channelId, maxResults)
      .then((videos) => {
        if (isMounted) {
          setData(videos)
          setError(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [channelId, maxResults])

  return { data, loading, error }
}

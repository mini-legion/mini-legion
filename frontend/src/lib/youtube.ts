// YouTube RSS Feed utilities

export interface YouTubeVideo {
  id: string
  title: string
  link: string
  thumbnail: string
  published: string
  channelName: string
}

const CORS_PROXY = 'https://api.allorigins.win/raw?url='
const FALLBACK_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='

function getYouTubeFeedUrl(channelSource: string) {
  const source = channelSource.trim()

  if (source.startsWith('user:')) {
    return `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(source.replace('user:', '').trim())}`
  }

  if (source.startsWith('channel:')) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(source.replace('channel:', '').trim())}`
  }

  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(source)}`
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)

  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    window.clearTimeout(timeout)
  }
}

function parseXmlVideos(xmlText: string, maxResults: number): YouTubeVideo[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
  const entries = xmlDoc.querySelectorAll('entry')
  const videos: YouTubeVideo[] = []
  const channelName = xmlDoc.querySelector('author > name')?.textContent || ''

  for (let i = 0; i < Math.min(entries.length, maxResults); i++) {
    const entry = entries[i]
    const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent || ''
    const title = entry.querySelector('title')?.textContent || ''
    const link = entry.querySelector('link')?.getAttribute('href') || `https://www.youtube.com/watch?v=${videoId}`
    const published = entry.querySelector('published')?.textContent || ''

    if (!videoId || !title) continue

    videos.push({
      id: videoId,
      title,
      link,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      published,
      channelName
    })
  }

  return videos
}

async function fetchFallback(feedUrl: string, maxResults: number): Promise<YouTubeVideo[]> {
  try {
    const response = await fetchWithTimeout(`${FALLBACK_PROXY}${encodeURIComponent(feedUrl)}`)
    if (!response.ok) return []

    const payload = await response.json()
    const items = Array.isArray(payload.items) ? payload.items : []
    const channelName = payload.feed?.title || ''

    return items.slice(0, maxResults).map((item: any) => {
      const link = item.link || ''
      const videoId = link.split('v=')[1]?.split('&')[0] || item.guid || ''

      return {
        id: videoId,
        title: item.title || '',
        link: link || `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        published: item.pubDate || item.published || '',
        channelName
      }
    }).filter((video: YouTubeVideo) => video.id && video.title)
  } catch {
    return []
  }
}

export async function fetchYouTubeVideos(
  channelId: string,
  maxResults: number = 3
): Promise<YouTubeVideo[]> {
  const feedUrl = getYouTubeFeedUrl(channelId)

  try {
    const response = await fetchWithTimeout(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`)

    if (response.ok) {
      const xmlText = await response.text()
      const videos = parseXmlVideos(xmlText, maxResults)
      if (videos.length > 0) return videos
    }

    return await fetchFallback(feedUrl, maxResults)
  } catch (error) {
    console.error(`Error fetching YouTube videos for channel ${channelId}:`, error)
    return await fetchFallback(feedUrl, maxResults)
  }
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

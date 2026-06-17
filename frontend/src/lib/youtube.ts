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

function getYouTubeFeedUrl(channelSource: string) {
  const source = channelSource.trim()

  if (source.startsWith('http') && source.includes('/feeds/videos.xml')) {
    return source
  }

  if (source.startsWith('user:')) {
    const username = source.replace('user:', '').trim()
    return `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(username)}`
  }

  if (source.startsWith('channel:')) {
    const channelId = source.replace('channel:', '').trim()
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`
  }

  if (source.startsWith('http')) {
    try {
      const url = new URL(source)
      const channelMatch = url.pathname.match(/\/channel\/([^/]+)/)
      if (channelMatch?.[1]) {
        return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelMatch[1])}`
      }

      const handleOrUser = url.pathname.split('/').filter(Boolean)[0]
      if (handleOrUser) {
        return `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(handleOrUser.replace('@', ''))}`
      }
    } catch {
      // Fall through to default channel id handling.
    }
  }

  if (source.startsWith('@')) {
    return `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(source.replace('@', ''))}`
  }

  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(source)}`
}

export async function fetchYouTubeVideos(
  channelId: string,
  maxResults: number = 3
): Promise<YouTubeVideo[]> {
  const feedUrl = getYouTubeFeedUrl(channelId)

  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`)

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube feed')
    }

    const xmlText = await response.text()
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
  } catch (error) {
    console.error(`Error fetching YouTube videos for channel ${channelId}:`, error)
    return []
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

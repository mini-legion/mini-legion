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

export async function fetchYouTubeVideos(
  channelId: string,
  maxResults: number = 3
): Promise<YouTubeVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

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
      const link = entry.querySelector('link')?.getAttribute('href') || ''
      const published = entry.querySelector('published')?.textContent || ''

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

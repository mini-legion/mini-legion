import { useRef } from 'react';
import { PageHeader, Card, Badge } from '../components/UI';
import { useContentCreators, useYouTubeVideos } from '../lib/hooks';
import { formatRelativeDate } from '../lib/youtube';
import type { ContentCreator } from '../lib/database.types';

// YouTube Videos Swiper Component
const YouTubeVideosSwiper = ({ creators }: { creators: ContentCreator[] }) => {
  // Get all YouTube creators with channel IDs
  const youtubeCreators = creators.filter(c => c.platform === 'YouTube' && c.youtube_channel_id);

  if (youtubeCreators.length === 0) return null;

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span className="text-red-500">📺</span> Latest Videos
      </h2>

      {youtubeCreators.map((creator) => (
        <CreatorVideos key={creator.id} creator={creator} />
      ))}
    </div>
  );
};

const CreatorVideos = ({ creator }: { creator: ContentCreator }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: videos, loading } = useYouTubeVideos(creator.youtube_channel_id, 6);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={creator.avatar || 'https://placehold.co/40x40/1F2937/FFFFFF?text=?'}
            alt={creator.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
          />
          <div>
            <h3 className="text-lg font-semibold text-slate-200">{creator.name}</h3>
            <p className="text-sm text-slate-500">Loading videos...</p>
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 aspect-video bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Creator Header */}
      <div className="flex items-center gap-3 mb-4">
        <a
          href={creator.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <img
            src={creator.avatar || 'https://placehold.co/40x40/1F2937/FFFFFF?text=?'}
            alt={creator.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-red-500/50 transition-colors"
          />
          <div>
            <h3 className="text-lg font-semibold text-slate-200 group-hover:text-red-400 transition-colors">
              {creator.name}
            </h3>
            <p className="text-sm text-slate-500">{creator.followers}</p>
          </div>
        </a>
      </div>

      {/* Videos Swiper */}
      <div className="relative group/swiper">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-all opacity-0 group-hover/swiper:opacity-100 -translate-x-1/2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-all opacity-0 group-hover/swiper:opacity-100 translate-x-1/2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Videos Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/video flex-shrink-0 w-72"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 group-hover/video:border-red-500/30 transition-colors">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/video:bg-black/30 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover/video:opacity-100 scale-75 group-hover/video:scale-100 transition-all">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-medium text-slate-200 line-clamp-2 group-hover/video:text-red-400 transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{formatRelativeDate(video.published)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const getPlatformStyles = (platform: string) => {
  switch (platform) {
    case 'YouTube':
      return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', icon: '📺' };
    case 'Twitch':
      return { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400', icon: '🎮' };
    case 'TikTok':
      return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-300', icon: '📱' };
    case 'Twitter':
      return { bg: 'bg-sky-500/20', border: 'border-sky-500/30', text: 'text-sky-400', icon: '🐦' };
    case 'Discord':
      return { bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', text: 'text-indigo-400', icon: '💬' };
    default:
      return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400', icon: '🌐' };
  }
};

export const ContentCreators = () => {
  const { data: creators, loading, error } = useContentCreators();

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Creators"
          subtitle="Amazing people making Mini Legion content"
          gradient="purple"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Creators"
          subtitle="Amazing people making Mini Legion content"
          gradient="purple"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card className="p-8 text-center">
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Error loading creators</h3>
            <p className="text-slate-500">Please try again later</p>
          </Card>
        </div>
      </div>
    );
  }

  const allCreators = creators || [];
  const featuredCreators = allCreators.filter(c => c.featured);
  const otherCreators = allCreators.filter(c => !c.featured);

  return (
    <div>
      <PageHeader
        title="Creators"
        subtitle="Amazing people making Mini Legion content"
        gradient="purple"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* YouTube Videos Swiper - Now at the top! */}
        <YouTubeVideosSwiper creators={allCreators} />

        {/* Featured Creators */}
        {featuredCreators.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              <span>⭐</span> Featured Creators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCreators.map((creator) => {
                const platformStyles = getPlatformStyles(creator.platform);

                return (
                  <a
                    key={creator.id}
                    href={creator.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="p-6 h-full relative overflow-hidden" glow="purple">
                      {/* Featured badge */}
                      <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-amber-500/30 to-transparent">
                        <span className="text-amber-400 text-xs font-bold">⭐ FEATURED</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={creator.avatar || 'https://placehold.co/64x64/1F2937/FFFFFF?text=?'}
                            alt={creator.name}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 group-hover:border-amber-500/50 transition-colors"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${platformStyles.bg} ${platformStyles.border} border flex items-center justify-center text-xs`}>
                            {platformStyles.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-100 truncate group-hover:text-amber-400 transition-colors">
                            {creator.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" size="sm">
                              {creator.platform}
                            </Badge>
                            <span className="text-slate-500 text-sm">{creator.followers}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                        {creator.description}
                      </p>

                      <div className={`flex items-center gap-2 ${platformStyles.text} text-sm font-medium`}>
                        <span>Visit Channel</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </Card>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* All Creators */}
        {otherCreators.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">All Creators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherCreators.map((creator) => {
                const platformStyles = getPlatformStyles(creator.platform);

                return (
                  <a
                    key={creator.id}
                    href={creator.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="p-4 h-full" glow="none">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <img
                            src={creator.avatar || 'https://placehold.co/48x48/1F2937/FFFFFF?text=?'}
                            alt={creator.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700 group-hover:border-amber-500/50 transition-colors"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${platformStyles.bg} ${platformStyles.border} border flex items-center justify-center text-[10px]`}>
                            {platformStyles.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-amber-400 transition-colors">
                            {creator.name}
                          </h3>
                          <p className="text-slate-500 text-xs">{creator.followers}</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-2">
                        {creator.description}
                      </p>
                    </Card>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Become a Creator CTA */}
        <Card className="mt-16 p-8 text-center relative overflow-hidden" hover={false}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-amber-500/5" />
          <div className="relative">
            <div className="text-5xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold text-slate-100 mb-4">
              Are You a Creator?
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto mb-6">
              Create Mini Legion content? We'd love to feature you! Get in touch with us to be added to our creators list.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=matias.riselegion@gmail.com&su=I'm a content creator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Apply Now
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

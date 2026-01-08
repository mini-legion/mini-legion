import { PageHeader, Card, Badge } from '../components/UI';
import { dummyCreators } from '../data';

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
    default:
      return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400', icon: '🌐' };
  }
};

export const ContentCreators = () => {
  const featuredCreators = dummyCreators.filter(c => c.featured);
  const otherCreators = dummyCreators.filter(c => !c.featured);

  return (
    <div>
      <PageHeader 
        title="Creators" 
        subtitle="Amazing people making Mini Legion content"
        gradient="purple"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Featured Creators */}
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
                  href={creator.url}
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
                          src={creator.avatar} 
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

        {/* All Creators */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-6">All Creators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCreators.map((creator) => {
              const platformStyles = getPlatformStyles(creator.platform);
              
              return (
                <a 
                  key={creator.id} 
                  href={creator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="p-4 h-full" glow="none">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <img 
                          src={creator.avatar} 
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


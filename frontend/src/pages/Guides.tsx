import { useParams, Link } from 'react-router-dom';
import { PageHeader, SubcategoryCard, Card } from '../components/UI';
import { useGuides, useGuidesBySubcategory } from '../lib/hooks';
import { guidesSubcategories, storage } from '../lib/api';

interface GuideCardData {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  author: string;
  read_time: string | null;
  subcategory?: string | null;
  tags?: string[] | null;
}

const getGuideThumbnailTheme = (guide: GuideCardData) => {
  const text = `${guide.title} ${guide.subcategory || ''} ${(guide.tags || []).join(' ')}`.toLowerCase();

  if (text.includes('afk')) return { icon: '🌙', label: 'AFK', gradient: 'from-indigo-500/35 via-slate-800 to-slate-950', ring: 'border-indigo-400/40' };
  if (text.includes('raid')) return { icon: '🐉', label: 'RAID', gradient: 'from-red-500/35 via-orange-950/70 to-slate-950', ring: 'border-red-400/40' };
  if (text.includes('dungeon') || text.includes('warband')) return { icon: '⚔️', label: 'DUNGEON', gradient: 'from-orange-500/35 via-slate-800 to-slate-950', ring: 'border-orange-400/40' };
  if (text.includes('guild') || text.includes('pvp')) return { icon: '🏆', label: 'GUILD', gradient: 'from-purple-500/35 via-slate-800 to-slate-950', ring: 'border-purple-400/40' };
  if (text.includes('auction') || text.includes('bank')) return { icon: '💰', label: 'ECONOMY', gradient: 'from-emerald-500/35 via-slate-800 to-slate-950', ring: 'border-emerald-400/40' };
  if (text.includes('rune') || text.includes('skill') || text.includes('talent')) return { icon: '⚡', label: 'BUILD BASICS', gradient: 'from-cyan-500/35 via-slate-800 to-slate-950', ring: 'border-cyan-400/40' };
  if (text.includes('class') || text.includes('race')) return { icon: '🧙', label: 'CLASS', gradient: 'from-amber-500/35 via-slate-800 to-slate-950', ring: 'border-amber-400/40' };
  if (text.includes('resource') || text.includes('progression') || text.includes('upgrade')) return { icon: '📈', label: 'PROGRESSION', gradient: 'from-green-500/35 via-slate-800 to-slate-950', ring: 'border-green-400/40' };
  if (text.includes('f2p') || text.includes('p2p') || text.includes('value')) return { icon: '💎', label: 'VALUE', gradient: 'from-sky-500/35 via-slate-800 to-slate-950', ring: 'border-sky-400/40' };

  return { icon: '📖', label: 'BEGINNER', gradient: 'from-amber-500/35 via-slate-800 to-slate-950', ring: 'border-amber-400/40' };
};

const AutoGuideThumbnail = ({ guide }: { guide: GuideCardData }) => {
  const theme = getGuideThumbnailTheme(guide);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
      <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(251,191,36,0.22),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute left-5 top-5 flex items-center gap-2">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-slate-950/55 text-2xl shadow-xl ${theme.ring}`}>
          {theme.icon}
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">Mini Legion</div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-300">{theme.label}</div>
        </div>
      </div>
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border border-white/10 bg-white/5" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full border border-amber-400/10 bg-amber-400/5" />
      <div className="absolute bottom-5 left-5 right-5">
        <div className="mb-2 inline-flex rounded-full border border-amber-400/25 bg-slate-950/45 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
          Guide Thumbnail
        </div>
        <h3 className="line-clamp-2 text-2xl font-black leading-tight text-white drop-shadow-lg">
          {guide.title}
        </h3>
      </div>
    </div>
  );
};

const GuideCard = ({ guide }: { guide: GuideCardData }) => (
  <Link to={`/guides/detail/${guide.id}`}>
    <Card className="overflow-hidden group h-full flex flex-col cursor-pointer" glow="amber">
      <div className="aspect-video relative overflow-hidden shrink-0">
        {guide.image ? (
          <img
            src={storage.getUrl(guide.image) || 'https://placehold.co/400x250/1F2937/FFFFFF?text=Guide'}
            alt={guide.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
            <AutoGuideThumbnail guide={guide} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <span className="text-xs text-slate-500">{guide.read_time || '5 min'}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
          {guide.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 flex-1">{guide.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-700/50">
          <span>By {guide.author}</span>
        </div>
      </div>
    </Card>
  </Link>
);

const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
  </div>
);

const ErrorState = () => (
  <Card className="p-8 text-center">
    <div className="text-5xl mb-4">😕</div>
    <h3 className="text-xl font-bold text-slate-300 mb-2">Error loading guides</h3>
    <p className="text-slate-500">Please try again later</p>
  </Card>
);

// Subcategory view component
const SubcategoryView = ({ subcategory }: { subcategory: string }) => {
  const { data: guides, loading, error } = useGuidesBySubcategory(subcategory);
  const currentSubcategory = guidesSubcategories.find(s => s.id === subcategory);

  if (loading) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link to="/guides" className="text-slate-400 hover:text-amber-400 transition-colors">Guides</Link>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400">{currentSubcategory?.name}</span>
          </nav>
        </div>
        <PageHeader
          title={currentSubcategory?.name || 'Guides'}
          subtitle={currentSubcategory?.description}
          icon={currentSubcategory?.icon}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title={currentSubcategory?.name || 'Guides'}
          subtitle={currentSubcategory?.description}
          icon={currentSubcategory?.icon}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ErrorState />
        </div>
      </div>
    );
  }

  const filteredGuides = guides || [];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <Link to="/guides" className="text-slate-400 hover:text-amber-400 transition-colors">Guides</Link>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400">{currentSubcategory?.name}</span>
        </nav>
      </div>

      <PageHeader
        title={currentSubcategory?.name || 'Guides'}
        subtitle={currentSubcategory?.description}
        icon={currentSubcategory?.icon}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No guides found</h3>
            <p className="text-slate-500">Guides for this category are coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main guides view component
const MainGuidesView = () => {
  const { data: guides, loading, error } = useGuides();

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Guides"
          subtitle="Comprehensive guides to master every aspect of Mini Legion"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Guides"
          subtitle="Comprehensive guides to master every aspect of Mini Legion"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ErrorState />
        </div>
      </div>
    );
  }

  const allGuides = guides || [];

  return (
    <div>
      <PageHeader
        title="Guides"
        subtitle="Comprehensive guides to master every aspect of Mini Legion"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {guidesSubcategories.map((sub) => (
            <SubcategoryCard key={sub.id} subcategory={sub} basePath="/guides" />
          ))}
        </div>

        {/* Recent Guides */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Latest Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGuides.slice(0, 6).map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Guides = () => {
  const { subcategory } = useParams();

  if (subcategory) {
    return <SubcategoryView subcategory={subcategory} />;
  }

  return <MainGuidesView />;
};
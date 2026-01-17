import { useParams, Link } from 'react-router-dom';
import { PageHeader, SubcategoryCard, Card } from '../components/UI';
import { useGuides, useGuidesBySubcategory } from '../lib/hooks';
import { guidesSubcategories, storage } from '../lib/api';

const GuideCard = ({ guide }: { guide: { id: string; title: string; description: string | null; image: string | null; author: string; read_time: string | null } }) => (
  <Link to={`/guides/detail/${guide.id}`}>
    <Card className="overflow-hidden group h-full flex flex-col cursor-pointer" glow="amber">
      <div className="aspect-video relative overflow-hidden shrink-0">
        <img
          src={storage.getUrl(guide.image) || 'https://placehold.co/400x250/1F2937/FFFFFF?text=Guide'}
          alt={guide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
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

import { useParams, Link } from "react-router-dom";
import { PageHeader, Badge, Card } from "../components/UI";
import { useBuilds, useBuildsByClass, useMostViewedBuilds } from "../lib/hooks";
import { buildsSubcategories, storage, trackBuildView } from "../lib/api";
import type { Build } from "../lib/database.types";

const classColors: Record<string, { gradient: string; icon: string }> = {
  hunter: { gradient: "from-green-500 to-emerald-600", icon: "/images/classes/hunter-logo.png" },
  priest: { gradient: "from-amber-200 to-amber-400", icon: "/images/classes/priest-logo.png" },
  mage: { gradient: "from-cyan-400 to-blue-500", icon: "/images/classes/mage-logo.png" },
  warrior: { gradient: "from-amber-600 to-orange-700", icon: "/images/classes/warrior-logo.png" },
  rogue: { gradient: "from-yellow-400 to-amber-500", icon: "/images/classes/rogue-logo.png" },
  paladin: { gradient: "from-pink-400 to-rose-500", icon: "/images/classes/paladin-logo.png" },
};

const getViewCount = (build: Build) => Number((build as Build & { view_count?: number }).view_count || 0);

const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

const ErrorState = () => (
  <Card className="p-8 text-center">
    <div className="text-5xl mb-4">😕</div>
    <h3 className="text-xl font-bold text-slate-300 mb-2">Error loading builds</h3>
    <p className="text-slate-500">Please try again later</p>
  </Card>
);

const BuildCard = ({ build, glow = "amber", showViews = true }: { build: Build; glow?: "amber" | "green"; showViews?: boolean }) => {
  const colors = classColors[build.hero_class.toLowerCase()] || classColors.hunter;
  const views = getViewCount(build);

  return (
    <Link key={build.id} to={`/builds/detail/${build.id}`} onClick={() => trackBuildView(build.id)}>
      <Card className="overflow-hidden group h-full" glow={glow}>
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
            {build.images?.skills && (
              <img
                src={storage.getUrl(build.images.skills) || ""}
                alt={`${build.hero_class} ${build.spec} Skills`}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-10 left-4 w-24 h-24 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
            <img src={colors.icon} alt={build.hero_class} className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>
        </div>

        <div className="p-6 pt-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {(build.content_type || []).slice(0, 2).map((type) => (
              <Badge key={type} variant="info" size="sm">
                {type}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-1">
            {build.hero_class} {build.spec}
          </h3>
          <p className="text-sm text-slate-500 mb-1">{build.title}</p>
          <p className="text-xs text-amber-500/80 mb-3">By {build.author}</p>
          <p className="text-slate-400 text-sm line-clamp-2">{build.description}</p>

          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {showViews ? `${views} ${views === 1 ? "View" : "Views"}` : `${(build.runes || []).length} Recommended Runes`}
            </span>
            <span className="text-xs text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
              View Build
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const CompactBuildCard = ({ build, subcategoryName }: { build: Build; subcategoryName?: string }) => {
  const colors = classColors[build.hero_class.toLowerCase()] || classColors.hunter;
  const views = getViewCount(build);

  return (
    <Link key={build.id} to={`/builds/detail/${build.id}`} onClick={() => trackBuildView(build.id)}>
      <Card className="overflow-hidden group h-full" glow="green">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-24 h-24 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shrink-0">
              <img
                src={colors.icon}
                alt={build.spec || build.hero_class}
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {(build.content_type || []).slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="info" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                {build.spec || build.hero_class}
              </h3>
              <p className="text-xs text-slate-500">
                {subcategoryName || build.hero_class} • <span className="text-amber-500/80">By {build.author}</span>
              </p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{build.title}</p>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{views} {views === 1 ? "View" : "Views"}</span>
              <span className="text-xs text-green-400 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                View Build
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const SubcategoryView = ({ subcategory }: { subcategory: string }) => {
  const { data: builds, loading, error } = useBuildsByClass(subcategory);
  const currentSubcategory = buildsSubcategories.find((s) => s.id === subcategory);
  const colors = classColors[subcategory] || classColors.hunter;

  if (loading) {
    return (
      <div>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3`} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link to="/builds" className="text-slate-400 hover:text-amber-400 transition-colors">Builds</Link>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400">{currentSubcategory?.name}</span>
          </nav>
        </div>
        <PageHeader title={currentSubcategory?.name || "Builds"} subtitle={currentSubcategory?.description} gradient="green" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title={currentSubcategory?.name || "Builds"} subtitle={currentSubcategory?.description} gradient="green" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ErrorState />
        </div>
      </div>
    );
  }

  const allBuilds = builds || [];

  return (
    <div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br ${colors.gradient} opacity-3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <Link to="/builds" className="text-slate-400 hover:text-amber-400 transition-colors">Builds</Link>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400">{currentSubcategory?.name}</span>
        </nav>
      </div>

      <PageHeader title={currentSubcategory?.name || "Builds"} subtitle={currentSubcategory?.description} gradient="green" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {allBuilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBuilds.map((build) => (
              <CompactBuildCard key={build.id} build={build} subcategoryName={currentSubcategory?.name} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 flex items-center justify-center text-6xl mx-auto mb-6 opacity-50 shrink-0">
              <img src={colors.icon} alt={currentSubcategory?.name} className="w-full h-full object-contain filter drop-shadow-lg" />
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-3">{currentSubcategory?.name} Builds Coming Soon</h3>
            <p className="text-slate-500 max-w-md mx-auto">We're working on adding the best builds for this class. Check back soon!</p>
            <Link to="/builds" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Browse Other Classes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const MainBuildsView = () => {
  const { data: builds, loading, error } = useBuilds();
  const { data: popularBuilds } = useMostViewedBuilds(6);

  if (loading) {
    return (
      <div>
        <PageHeader title="Builds" subtitle="Optimized hero builds for every class and playstyle" gradient="green" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Builds" subtitle="Optimized hero builds for every class and playstyle" gradient="green" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ErrorState />
        </div>
      </div>
    );
  }

  const allBuilds = builds || [];
  const latestBuilds = allBuilds.slice(0, 6);
  const mostViewedBuilds = popularBuilds && popularBuilds.length > 0 ? popularBuilds : allBuilds.slice(0, 6);

  const buildCountByClass: Record<string, number> = {};
  allBuilds.forEach((build) => {
    const classId = build.hero_class.toLowerCase();
    buildCountByClass[classId] = (buildCountByClass[classId] || 0) + 1;
  });

  return (
    <div>
      <PageHeader title="Builds" subtitle="Optimized hero builds for every class and playstyle" gradient="green" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {buildsSubcategories.map((sub) => {
            const buildCount = buildCountByClass[sub.id] || 0;
            const colors = classColors[sub.id] || classColors.hunter;

            return (
              <Link key={sub.id} to={`/builds/${sub.id}`} className="group">
                <Card className="p-4 text-center h-full" glow="green">
                  <div className="w-24 h-24 flex items-center justify-center text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <img src={colors.icon} alt={sub.name} className="w-full h-full object-contain filter drop-shadow-lg" />
                  </div>
                  <h3 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-1">{sub.name}</h3>
                  <p className="text-xs text-slate-500">{buildCount} {buildCount === 1 ? "Build" : "Builds"}</p>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl">🆕</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Latest Builds</h2>
              <p className="text-sm text-slate-500">Newest community and guide builds first.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestBuilds.map((build) => <BuildCard key={build.id} build={build} />)}
          </div>

          {allBuilds.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">Builds Coming Soon</h3>
              <p className="text-slate-500">We're working on curating the best builds for each class!</p>
            </div>
          )}
        </div>

        {mostViewedBuilds.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl">📊</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Most Viewed Builds</h2>
                <p className="text-sm text-slate-500">Based on build page clicks from now on.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostViewedBuilds.map((build) => <BuildCard key={build.id} build={build} glow="green" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Builds = () => {
  const { subcategory } = useParams();

  if (subcategory) {
    return <SubcategoryView subcategory={subcategory} />;
  }

  return <MainBuildsView />;
};

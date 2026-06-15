import { Link } from "react-router-dom";
import { Card, Badge } from "../components/UI";
import { useGuides, useBuilds, useCodes, useContentCreators } from "../lib/hooks";
import { storage } from "../lib/api";

const quickLinks = [
  {
    name: "Guides",
    path: "/guides",
    icon: "📚",
    description: "Master every aspect of the game",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Builds",
    path: "/builds",
    icon: "⚔️",
    description: "Optimize your hero loadouts",
    color: "from-red-500 to-rose-500",
  },
  {
    name: "Raids",
    path: "/raids",
    icon: "🐉",
    description: "Conquer challenging content",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Codes",
    path: "/codes",
    icon: "🎁",
    description: "Get free rewards",
    color: "from-green-500 to-emerald-500",
  },
];

export const Home = () => {
  const { data: guides } = useGuides();
  const { data: builds } = useBuilds();
  const { data: codes } = useCodes();
  const { data: creators } = useContentCreators();

  const activeCodes = codes?.filter((c) => c.is_active) || [];

  // Calculate stats from fetched data
  const homeStats = {
    totalGuides: guides?.length || 0,
    totalBuilds: builds?.length || 0,
    activeCodes: activeCodes.length,
    creators: creators?.length || 0,
  };

  // Featured content - first guide and specific builds
  const featuredGuide = guides?.find(g => g.slug === 'afk-farming') || guides?.[0];
  const featuredBuilds = builds?.filter(b =>
    ['hunter-survival', 'priest-healing', 'fire-mage'].includes(b.id)
  ).slice(0, 3) || [];

  // Class icon URLs
  const classIcons: Record<string, string> = {
    hunter: storage.classes.getImageUrl('hunter-logo.png'),
    priest: storage.classes.getImageUrl('priest-logo.png'),
    mage: storage.classes.getImageUrl('mage-logo.png'),
    warrior: storage.classes.getImageUrl('warrior-logo.png'),
    rogue: storage.classes.getImageUrl('rogue-logo.png'),
    paladin: storage.classes.getImageUrl('paladin-logo.png'),
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <span className="text-2xl">⚔️</span>
              <span className="text-amber-400 font-medium">
                Mini Legion Game Guide
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Forge Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                Legion
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Your ultimate companion for Mini Legion. Comprehensive guides,
              optimized builds, and strategies to dominate every challenge.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/guides"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Guides
              </Link>
              <Link
                to="/builds"
                className="px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-lg hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300"
              >
                View Builds
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Guides", value: homeStats.totalGuides, icon: "📚" },
            { label: "Builds", value: homeStats.totalBuilds, icon: "⚔️" },
            { label: "Active Codes", value: homeStats.activeCodes, icon: "🎁" },
            { label: "Creators", value: homeStats.creators, icon: "🎬" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 text-center" glow="amber">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-400">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-8">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path} className="group">
              <Card className="p-6 h-full" glow="amber">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">
                  {link.name}
                </h3>
                <p className="text-slate-400 text-sm">{link.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
            Featured Content
          </h2>
          <Link
            to="/builds"
            className="text-amber-400 hover:text-amber-300 font-medium text-sm flex items-center gap-1"
          >
            View All Builds
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Guide */}
          {featuredGuide && (
            <Link
              to={`/guides/detail/${featuredGuide.id}`}
              className="lg:col-span-2 group"
            >
              <Card className="overflow-hidden h-full" glow="amber">
                <div className="aspect-video bg-gradient-to-br from-amber-500/20 to-slate-800 relative">
                  <img
                    src={storage.getUrl(featuredGuide.image) || undefined}
                    alt={featuredGuide.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium mb-3">
                      Featured Guide
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">
                      {featuredGuide.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {featuredGuide.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Featured Builds */}
          <div className="flex flex-col gap-4">
            {featuredBuilds.map((build) => (
              <Link
                key={build.id}
                to={`/builds/detail/${build.id}`}
                className="group"
              >
                <Card className="overflow-hidden h-full" glow="purple">
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 flex items-center justify-center shrink-0">
                        <img
                          src={classIcons[build.hero_class.toLowerCase()] || classIcons.hunter}
                          alt={build.hero_class}
                          className="w-full h-full object-contain filter drop-shadow-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                            {build.hero_class} {build.spec}
                          </h3>
                          <Badge variant="info" size="sm">
                            {Array.isArray(build.content_type) ? build.content_type[0] : build.content_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-amber-500/80">
                          By {build.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Active Codes Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
            Active Codes
          </h2>
          <Link
            to="/codes"
            className="text-amber-400 hover:text-amber-300 font-medium text-sm flex items-center gap-1"
          >
            View All Codes
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCodes.slice(0, 3).map((code) => (
            <Card key={code.id} className="p-5" glow="green">
              <div className="flex items-center justify-between mb-3">
                <code className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 font-mono font-bold text-sm">
                  {code.code}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(code.code)}
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="Copy code"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {code.rewards.slice(0, 2).map((reward, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 text-xs"
                  >
                    {reward}
                  </span>
                ))}
                {code.rewards.length > 2 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-500 text-xs">
                    +{code.rewards.length - 2} more
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

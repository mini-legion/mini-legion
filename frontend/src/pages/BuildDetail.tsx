import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge } from '../components/UI';
import { useBuild } from '../lib/hooks';
import { storage } from '../lib/api';

export const BuildDetail = () => {
  const { buildId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: build, loading, error } = useBuild(buildId || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Error Loading Build</h2>
          <p className="text-slate-400 mb-6">Please try again later.</p>
          <Link
            to="/builds"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Back to Builds
          </Link>
        </div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Build Not Found</h2>
          <p className="text-slate-400 mb-6">The build you're looking for doesn't exist.</p>
          <Link
            to="/builds"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Back to Builds
          </Link>
        </div>
      </div>
    );
  }

  const classColors: Record<string, { gradient: string; bg: string; border: string; text: string }> = {
    hunter: { gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    priest: { gradient: 'from-amber-200 to-amber-400', bg: 'bg-amber-200/10', border: 'border-amber-300/30', text: 'text-amber-200' },
    mage: { gradient: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    warrior: { gradient: 'from-amber-600 to-orange-700', bg: 'bg-amber-600/10', border: 'border-amber-600/30', text: 'text-amber-500' },
    rogue: { gradient: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    paladin: { gradient: 'from-pink-400 to-rose-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400' },
  };

  // Class logos served locally to reduce Supabase egress
  const classIcons: Record<string, string> = {
    hunter: '/images/classes/hunter-logo.png',
    priest: '/images/classes/priest-logo.png',
    mage: '/images/classes/mage-logo.png',
    warrior: '/images/classes/warrior-logo.png',
    rogue: '/images/classes/rogue-logo.png',
    paladin: '/images/classes/paladin-logo.png',
  };

  const colors = classColors[build.hero_class.toLowerCase()] || classColors.hunter;
  const icon = classIcons[build.hero_class.toLowerCase()] || '⚔️';
  const isHealer = build.role === 'Healer';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3`} />
          <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3`} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI5M2IiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwSDI0VjBoOHYzNHptLTEwIDBoLTJWMGgydjM0em0tNCAwSDB2LTJoMTh2Mnom+</g></g></svg>')] opacity-20" />
        </div>

        {/* Breadcrumb */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link to="/builds" className="text-slate-400 hover:text-amber-400 transition-colors">Builds</Link>
            <span className="text-slate-600">/</span>
            <Link to={`/builds/${build.hero_class.toLowerCase()}`} className={`text-slate-400 hover:${colors.text} transition-colors`}>
              {build.hero_class}
            </Link>
            <span className="text-slate-600">/</span>
            <span className={colors.text}>{build.spec}</span>
          </nav>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Class Icon */}
            <div className="w-32 h-32 lg:w-44 lg:h-44 flex items-center justify-center text-6xl lg:text-7xl shrink-0 animate-float">
              {icon.length > 4 || icon.startsWith('/') ? (
                <img src={icon} alt={build.hero_class} className="w-full h-full object-contain filter drop-shadow-2xl" />
              ) : (
                icon
              )}
            </div>
            
            {/* Title & Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {build.content_type && build.content_type.length > 0 ? (
                  build.content_type.map((tag, idx) => (
                    <Badge key={idx} variant={
                      tag.toLowerCase().includes('leveling') ? 'info' :
                      tag.toLowerCase().includes('early') ? 'warning' :
                      tag.toLowerCase().includes('end game') ? 'tier-s' :
                      tag.toLowerCase().includes('raid') ? 'warning' :
                      tag.toLowerCase().includes('mythic') ? 'info' :
                      'default'
                    } size="md">{tag}</Badge>
                  ))
                ) : (
                  <>
                    <Badge variant="tier-s" size="md">End Game Build</Badge>
                    <Badge variant="warning" size="md">Raid Ready</Badge>
                    <Badge variant="info" size="md">Mythic+</Badge>
                  </>
                )}
                {isHealer && <Badge variant="success" size="md">Healer</Badge>}
              </div>
              <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-3`}>
                {build.hero_class} {build.spec}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xl lg:text-2xl text-slate-300 font-medium">{build.title}</p>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">By {build.author}</span>
              </div>
              <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">{build.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        
        {/* Introduction (for healer builds) */}
        {build.intro_text && (
          <section>
            <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent" glow="amber">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                  👋
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-2">Welcome</h3>
                  <p className="text-slate-300 leading-relaxed">{build.intro_text}</p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Skills Section - Show as single overview if all images are the same */}
        {build.images.skills === build.images.tree1 && build.images.tree1 === build.images.tree2 ? (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                📋
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Complete Build Overview</h2>
            </div>
            <Card className="overflow-hidden p-6" glow={isHealer ? 'amber' : 'green'}>
              <p className="text-slate-400 text-sm mb-4 text-center">
                This infographic contains all skills, talent trees, and stat priorities
              </p>
              <div className="flex justify-center">
                <img
                  src={storage.getUrl(build.images.skills) || ''}
                  alt="Complete Build Overview"
                  className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-2xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                  onClick={() => setSelectedImage(storage.getUrl(build.images.skills))}
                />
              </div>
            </Card>
          </section>
        ) : (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                ⚡
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Active Skills & Runes</h2>
            </div>
            <Card className="overflow-hidden p-6" glow={isHealer ? 'amber' : 'green'}>
              <div className="flex justify-center">
                <img
                  src={storage.getUrl(build.images.skills) || ''}
                  alt="Build Skills"
                  className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-2xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                  onClick={() => setSelectedImage(storage.getUrl(build.images.skills))}
                />
              </div>
            </Card>
          </section>
        )}

        {/* Gear Section with Images (for builds with gear images) */}
        {(build.images.dungeonGear || build.images.adventureGear) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                ⚔️
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Gear Setup</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {build.images.dungeonGear && (
                <Card className="overflow-hidden p-6" glow="purple">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">🏰</span>
                    Dungeon Gear (BIS Example)
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src={storage.getUrl(build.images.dungeonGear) || ''}
                      alt="Dungeon Gear Setup"
                      className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                      onClick={() => setSelectedImage(storage.getUrl(build.images.dungeonGear))}
                    />
                  </div>
                </Card>
              )}
              {build.images.adventureGear && (
                <Card className="overflow-hidden p-6" glow="amber">
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">🗺️</span>
                    Adventure Gear
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src={storage.getUrl(build.images.adventureGear) || ''}
                      alt="Adventure Gear Setup"
                      className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                      onClick={() => setSelectedImage(storage.getUrl(build.images.adventureGear))}
                    />
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Gear Priority Section - Only show if build has gearGuide data */}
        {build.gear_guide && (build.gear_guide.dungeonStats || build.gear_guide.adventureStats) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                🎯
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Stat Priority</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dungeon Stats */}
              {build.gear_guide.dungeonStats && (
                <Card className="p-6 h-full" glow="purple">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl shadow-lg">
                      🏰
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-400">Dungeon Gear</h3>
                      <p className="text-slate-400 text-sm">Primary Stats</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <span className="text-lg">⭐</span> Stat Priority
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {(build.gear_guide.dungeonStats?.priority || []).map((stat, idx, arr) => (
                          <span key={stat} className="contents">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                              idx === 0 ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                              idx === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                              'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}>{stat}</span>
                            {idx < arr.length - 1 && (
                              <span className="text-slate-500">&gt;</span>
                            )}
                          </span>
                        ))}
                        <span className="text-slate-500">&gt;</span>
                        <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 text-sm font-medium border border-slate-600">Others</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <p className="text-slate-300 text-sm leading-relaxed">{build.gear_guide.dungeonStats.description}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Adventure Stats */}
              {build.gear_guide.adventureStats && (
                <Card className="p-6 h-full" glow="amber">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg">
                      🗺️
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-amber-400">Adventure Gear</h3>
                      <p className="text-slate-400 text-sm">Attribute Priority</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                        <span className="text-lg">🛡️</span> Armor
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {(build.gear_guide.adventureStats?.armor?.priority || []).map((stat, idx, arr) => (
                          <span key={stat} className="contents">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                              idx === 0 ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                              'bg-slate-700/50 text-slate-300 border-slate-600'
                            }`}>{stat}</span>
                            {idx < arr.length - 1 && (
                              <span className="text-slate-500">&gt;</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs">{build.gear_guide.adventureStats?.armor?.description}</p>
                    </div>

                    <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                        <span className="text-lg">💍</span> Accessories (Necklace/Rings/Trinkets/Weapon)
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {(build.gear_guide.adventureStats?.accessories?.priority || []).map((stat, idx, arr) => (
                          <span key={stat} className="contents">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                              idx === 0 ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                              idx === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                              'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}>{stat}</span>
                            {idx < arr.length - 1 && (
                              <span className="text-slate-500">&gt;</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs">{build.gear_guide.adventureStats?.accessories?.description}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Gear Guide Section - New format with weapon, trinkets, stats */}
        {build.gear_guide && (build.gear_guide.weapon || build.gear_guide.trinkets || build.gear_guide.stats) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                ⚔️
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Gear Guide</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weapon */}
              {build.gear_guide.weapon && (
                <Card className="p-6" glow="amber">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg">
                      🗡️
                    </div>
                    <h3 className="text-lg font-bold text-amber-400">{build.gear_guide.weapon.title || 'Weapon'}</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">{build.gear_guide.weapon.recommendation}</p>
                  {build.gear_guide.weapon.note && (
                    <p className="text-slate-500 text-xs italic">{build.gear_guide.weapon.note}</p>
                  )}
                </Card>
              )}

              {/* Trinkets */}
              {build.gear_guide.trinkets && (
                <Card className="p-6" glow="purple">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-lg">
                      💍
                    </div>
                    <h3 className="text-lg font-bold text-purple-400">{build.gear_guide.trinkets.title || 'Trinkets'}</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{build.gear_guide.trinkets.recommendation}</p>
                  {build.gear_guide.trinkets.priority && (
                    <div className="flex flex-wrap items-center gap-2">
                      {build.gear_guide.trinkets.priority.map((stat: string, idx: number, arr: string[]) => (
                        <span key={stat} className="contents">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            idx === 0 ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            idx === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            'bg-slate-700/50 text-slate-300 border-slate-600'
                          }`}>{stat}</span>
                          {idx < arr.length - 1 && <span className="text-slate-500 text-xs">&gt;</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Stats */}
              {build.gear_guide.stats && (
                <Card className="p-6" glow="green">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl shadow-lg">
                      📊
                    </div>
                    <h3 className="text-lg font-bold text-green-400">{build.gear_guide.stats.title || 'Important Stats'}</h3>
                  </div>
                  {build.gear_guide.stats.expertise && (
                    <div className="mb-3">
                      <span className="text-slate-400 text-sm">Expertise: </span>
                      <span className="text-green-300 text-sm font-medium">{build.gear_guide.stats.expertise}</span>
                    </div>
                  )}
                  {build.gear_guide.stats.note && (
                    <p className="text-slate-500 text-xs italic">{build.gear_guide.stats.note}</p>
                  )}
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Refines Section */}
        {build.refines_guide && (build.refines_guide.priority?.length || build.refines_guide.details?.length || build.refines_guide.notes?.length) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                💎
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Refines Guide</h2>
            </div>

            <div className={`grid grid-cols-1 ${build.refines_guide.details?.length ? 'lg:grid-cols-3' : build.refines_guide.notes?.length ? 'lg:grid-cols-2' : ''} gap-6`}>
              {/* Priority */}
              {build.refines_guide.priority && build.refines_guide.priority.length > 0 && (
                <Card className="p-6" glow="amber">
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">⭐</span>
                    Priority Order
                  </h3>
                  <div className="space-y-2">
                    {(build.refines_guide.priority || []).map((stat, idx) => (
                      <div key={stat} className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx < 2 ? 'bg-amber-500/30 text-amber-300' :
                          idx < 4 ? 'bg-purple-500/30 text-purple-300' :
                          'bg-slate-700 text-slate-400'
                        }`}>{idx + 1}</span>
                        <span className={`text-sm ${idx < 2 ? 'text-amber-300 font-semibold' : 'text-slate-300'}`}>{stat}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Slot Details (Legacy format) */}
              {build.refines_guide.details && build.refines_guide.details.length > 0 && (
                <Card className="p-6 lg:col-span-2" glow="purple">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">🔧</span>
                    Slot-Specific Refines
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(build.refines_guide.details || []).map((detail) => (
                      <div key={detail.slot} className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                        <h4 className="font-semibold text-slate-200 text-sm mb-2">{detail.slot}</h4>
                        <div className="flex flex-wrap gap-1">
                          {(detail.stats || []).map((stat) => (
                            <span key={stat} className={`px-2 py-0.5 rounded text-xs font-medium ${
                              stat.includes('MUST') ? 'bg-red-500/30 text-red-300 border border-red-500/50' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>{stat}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Notes (New format) */}
              {build.refines_guide.notes && build.refines_guide.notes.length > 0 && (
                <Card className="p-6" glow="purple">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">📝</span>
                    Important Notes
                  </h3>
                  <div className="space-y-3">
                    {(build.refines_guide.notes || []).map((note, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                        <p className="text-slate-300 text-sm leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Refine Tips (supports both 'tips' and 'tip') */}
            {(build.refines_guide.tips || build.refines_guide.tip) && (
              <Card className="mt-6 p-5 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent" glow="green">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-bold text-cyan-400 mb-1">Pro Tip</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{build.refines_guide.tips || build.refines_guide.tip}</p>
                  </div>
                </div>
              </Card>
            )}
          </section>
        )}

        {/* Spells Guide (for healer builds) */}
        {build.spells_guide && build.spells_guide.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                📖
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Spells & Runes Guide</h2>
            </div>

            {/* Autocast Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-sm">🔄</span>
                Autocast Spells (In Order)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(build.spells_guide || []).filter(s => s.autocast).sort((a, b) => (a.priority || 99) - (b.priority || 99)).map((spell, index) => (
                  <Card key={spell.skill} className="p-4 group" glow="green">
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {spell.icon}
                        </div>
                        <span className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-100 text-sm">{spell.skill}</h4>
                        </div>
                        {spell.rune && (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${colors.text} ${colors.bg} border ${colors.border} mb-2`}>
                            Rune: {spell.rune}
                          </span>
                        )}
                        <p className="text-slate-400 text-xs leading-relaxed">{spell.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Non-Autocast Section */}
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-sm">🎯</span>
                Manual/Situational Spells
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(build.spells_guide || []).filter(s => !s.autocast).map((spell) => (
                  <Card key={spell.skill} className={`p-4 group ${spell.skill === 'Holy Blast' ? 'opacity-50' : ''}`} glow={spell.skill === 'Holy Blast' ? undefined : 'amber'}>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl ${spell.skill === 'Holy Blast' ? 'bg-slate-700' : `bg-gradient-to-br ${colors.gradient}`} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {spell.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold text-sm ${spell.skill === 'Holy Blast' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{spell.skill}</h4>
                          {spell.skill === 'Prayer of Mending' && (
                            <span className="px-2 py-0.5 rounded text-xs bg-amber-500/30 text-amber-300 font-semibold">BIG HEAL</span>
                          )}
                        </div>
                        {spell.rune && spell.skill !== 'Holy Blast' && (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${colors.text} ${colors.bg} border ${colors.border} mb-2`}>
                            Rune: {spell.rune}
                          </span>
                        )}
                        <p className={`text-xs leading-relaxed ${spell.skill === 'Holy Blast' ? 'text-slate-600' : 'text-slate-400'}`}>{spell.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Autocast Order (for healer builds) */}
        {build.autocast_order && build.autocast_order.length > 0 && (
          <section>
            <Card className="p-6 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent" glow="green">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                  🔄
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Autocast Setup Order</h3>
                  <div className="space-y-2">
                    {(build.autocast_order || []).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <span className="w-6 h-6 rounded-full bg-green-500/30 text-green-300 flex items-center justify-center text-sm font-bold flex-shrink-0">{idx + 1}</span>
                        <p className="text-slate-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Healing Tips (for healer builds) */}
        {build.healing_tips && build.healing_tips.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                ❤️
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Healing Tips</h2>
            </div>

            <Card className="p-6" glow="amber">
              <div className="space-y-4">
                {(build.healing_tips || []).map((tip, idx) => (
                  <div key={idx} className={`flex items-start gap-3 p-4 rounded-xl ${
                    idx === 0 ? 'bg-red-500/10 border border-red-500/30' : 
                    idx === 1 ? 'bg-amber-500/10 border border-amber-500/30' : 
                    `${colors.bg} border ${colors.border}`
                  }`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                      idx === 0 ? 'bg-red-500/20' : 
                      idx === 1 ? 'bg-amber-500/20' : 
                      'bg-slate-800'
                    }`}>
                      {idx === 0 ? '🚫' : idx === 1 ? '🏃' : '💡'}
                    </span>
                    <p className={`text-sm leading-relaxed ${
                      idx === 0 ? 'text-red-300 font-semibold' : 
                      idx === 1 ? 'text-amber-300' : 
                      'text-slate-300'
                    }`}>{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Talent Trees Section - Only show if images are different */}
        {!(build.images.skills === build.images.tree1 && build.images.tree1 === build.images.tree2) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                🌳
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Talent Trees</h2>
            </div>
            <div className={`grid grid-cols-1 ${build.images.tree3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
              <Card className="overflow-hidden p-6" glow={isHealer ? 'amber' : 'green'}>
                <h3 className={`text-lg font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-mono">1</span>
                  Primary Tree
                </h3>
                <div className="flex justify-center">
                  <img
                    src={storage.getUrl(build.images.tree1) || ''}
                    alt="Primary Talent Tree"
                    className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                    onClick={() => setSelectedImage(storage.getUrl(build.images.tree1))}
                  />
                </div>
              </Card>
              <Card className="overflow-hidden p-6" glow={isHealer ? 'amber' : 'green'}>
                <h3 className={`text-lg font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-mono">2</span>
                  Secondary Tree
                </h3>
                <div className="flex justify-center">
                  <img
                    src={storage.getUrl(build.images.tree2) || ''}
                    alt="Secondary Talent Tree"
                    className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                    onClick={() => setSelectedImage(storage.getUrl(build.images.tree2))}
                  />
                </div>
              </Card>
              {build.images.tree3 && (
                <Card className="overflow-hidden p-6" glow={isHealer ? 'amber' : 'green'}>
                  <h3 className={`text-lg font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-mono">3</span>
                    Tertiary Tree
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src={storage.getUrl(build.images.tree3) || ''}
                      alt="Tertiary Talent Tree"
                      className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                      onClick={() => setSelectedImage(storage.getUrl(build.images.tree3))}
                    />
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Talent Tips - Show regardless of image layout */}
        {build.talent_tips && (
          <section>
            <Card className="p-5 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent" glow="green">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <h4 className="font-bold text-cyan-400 mb-3">Talent Tips</h4>
                  <div className="space-y-3">
                    {build.talent_tips.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-slate-300 text-sm leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Runes Section - Only show if build has runes */}
        {build.runes && build.runes.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>
                ✨
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Recommended Runes Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(build.runes || []).map((rune, index) => (
                <Card key={index} className="p-5 group" glow={isHealer ? 'amber' : 'green'}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      {rune.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-100 text-lg">{rune.skill}</h3>
                        <span className="text-slate-500">–</span>
                        <span className={`${colors.text} font-semibold`}>{rune.runeName}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{rune.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}


        {/* Healer-specific final tips */}
        {isHealer && (
          <>
            {/* M+ Healing Tip */}
            <section>
              <Card className="p-6 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent" glow="purple">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                    🔑
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-2">High M+ Tip</h3>
                    <p className="text-slate-300 leading-relaxed">
                      In <span className="text-amber-400 font-semibold">+16 and higher</span> dungeons, boss enrage phases become critical. 
                      Use <span className="text-cyan-400 font-semibold">Psychic Horror</span> to CC during enrage and have your team burn the boss with 
                      <span className="text-amber-400 font-semibold"> Sanctuary</span> active for the damage buff. Keep <span className="text-green-400 font-semibold">Prayer of Mending</span> ready 
                      for emergency heals during these intense moments.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Collections Tip */}
            <section>
              <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent" glow="amber">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                    📚
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-400 mb-2">Collections Priority</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Prioritize upgrading anything with <span className="text-purple-400 font-semibold">INT%</span>, 
                      <span className="text-blue-400 font-semibold"> HP%</span>, 
                      <span className="text-green-400 font-semibold"> SP</span>, 
                      <span className="text-amber-400 font-semibold"> Haste</span>, 
                      <span className="text-purple-400 font-semibold"> Vers</span>, and 
                      <span className="text-red-400 font-semibold"> Crit</span>. 
                      INT turns into spell power and all spell power increases every ability's output.
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </>
        )}

        {/* Back to Builds */}
        <div className="text-center pt-8">
          <Link 
            to="/builds" 
            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Builds
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 md:p-8 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-amber-400 transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged Build Section" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-slate-700 animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

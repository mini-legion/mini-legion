import { useParams, Link } from 'react-router-dom';
import { PageHeader, SubcategoryCard, Badge, Card, DropItem } from '../components/UI';
import { raidsSubcategories, dummyRaids } from '../data';

const getDifficultyVariant = (difficulty: string) => {
  switch (difficulty) {
    case 'Normal': return 'success';
    case 'Hard': return 'warning';
    case 'Extreme': return 'danger';
    default: return 'default';
  }
};

export const Raids = () => {
  const { subcategory } = useParams();

  if (subcategory) {
    const currentSubcategory = raidsSubcategories.find(s => s.id === subcategory);

    return (
      <div>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link to="/raids" className="text-slate-400 hover:text-amber-400 transition-colors">Raids</Link>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400">{currentSubcategory?.name}</span>
          </nav>
        </div>

        <PageHeader 
          title={currentSubcategory?.name || 'Raids'} 
          subtitle={currentSubcategory?.description}
          icon={currentSubcategory?.icon}
          gradient="purple"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-center gap-3 px-5 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl shadow-lg shadow-amber-500/5">
            <span className="text-xl">💡</span>
            <p className="text-sm sm:text-base text-slate-300">
              <span className="text-amber-400 font-bold uppercase tracking-wide">Pro Tip:</span> Click on any <span className="text-amber-500 font-bold italic">Important Drop</span> to preview the item's stats and appearance.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {subcategory === 'mythic' ? (
            <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg shadow-purple-500/20">
                💎
              </div>
              <h3 className="text-3xl font-bold text-slate-100 mb-4">Mythic+ Coming Soon</h3>
              <p className="text-slate-400 max-w-md mx-auto text-lg">
                We're currently gathering the most accurate data for Mythic+ dungeons. Stay tuned for updates!
              </p>
              <Link 
                to="/raids" 
                className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Explore Other Raids
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyRaids
                .filter(raid => raid.subcategory === subcategory)
                .map((raid) => (
                <Card key={raid.id} className="group h-full flex flex-col" glow="purple">
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-purple-400 transition-colors">
                          {raid.name}
                        </h3>
                        <p className="text-slate-500 text-xs">Min Level: {raid.minLevel}</p>
                      </div>
                      <Badge variant={getDifficultyVariant(raid.difficulty) as 'success' | 'warning' | 'danger'}>
                        {raid.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{raid.description}</p>
                    
                    <div className="flex-grow">
                      {raid.stats && !raid.subraids && (
                        <div className="space-y-3 mb-4">
                          {raid.difficulty === 'Normal' ? (
                            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">STA</p>
                                <p className="text-slate-200 font-medium text-sm">{raid.stats.sta}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Armor</p>
                                <p className="text-slate-200 font-medium text-sm">{raid.stats.armor}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Gear Drop</p>
                                <p className="text-slate-200 font-medium text-sm">Lvl {raid.stats.gearLvlDrop}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Imp. Drop</p>
                                {raid.stats.importantDrops ? (
                                  <div className="space-y-1">
                                    {raid.stats.importantDrops.map((drop, index) => (
                                      <DropItem key={index} drop={drop} />
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-amber-400 font-medium text-xs italic">{raid.stats.importantDrop}</p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Gear Drop</p>
                                <p className="text-slate-200 font-bold text-base">Lvl {raid.stats.gearLvlDrop}</p>
                              </div>
                              
                              {raid.stats.importantDrop !== 'none' && (
                                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                                  <p className="text-[10px] uppercase tracking-wider text-amber-500/70 mb-1.5 font-bold">Important Drop</p>
                                  <div className="space-y-1.5">
                                    {raid.stats.importantDrops ? (
                                      raid.stats.importantDrops.map((drop, index) => (
                                        <DropItem key={index} drop={drop} />
                                      ))
                                    ) : (
                                      raid.stats.importantDrop.split(/,|\s-\s/).map((drop, index) => (
                                        <p key={index} className="text-amber-400 font-semibold text-sm leading-relaxed flex items-start gap-2">
                                          <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500/40 shrink-0" />
                                          {drop.trim()}
                                        </p>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {raid.subraids && (
                      <div className="mt-auto pt-4">
                        <Link 
                          to={`/raids/detail/${raid.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all"
                        >
                          <span>View Raid Details</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    )}

                    {raid.difficulty === 'Normal' && (
                      <div className="mt-auto pt-4 border-t border-slate-700/50">
                        <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Rewards</p>
                        <div className="flex flex-wrap gap-1.5">
                          {raid.rewards.map((reward, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-medium">
                              {reward}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Raids" 
        subtitle="Conquer challenging content with your team"
        gradient="purple"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {raidsSubcategories.map((sub) => (
            <SubcategoryCard key={sub.id} subcategory={sub} basePath="/raids" />
          ))}
        </div>
      </div>
    </div>
  );
};


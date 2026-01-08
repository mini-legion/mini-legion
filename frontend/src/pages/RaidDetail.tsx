import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, DropItem } from '../components/UI';
import { dummyRaids, raidsSubcategories } from '../data/raidsData';

export const RaidDetail = () => {
  const { raidId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const raid = dummyRaids.find(r => r.id === raidId);
  const [activeSubRaidId, setActiveSubRaidId] = useState<string | null>(null);

  useEffect(() => {
    if (raid?.subraids?.[0]) {
      setActiveSubRaidId(raid.subraids[0].id);
    }
  }, [raidId, raid]);
  
  const subcategory = raidsSubcategories.find(s => s.id === raid?.subcategory);

  if (!raid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Raid Not Found</h2>
          <p className="text-slate-400 mb-6">The raid you're looking for doesn't exist.</p>
          <Link 
            to="/raids" 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Back to Raids
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0">
          <img 
            src={raid.image} 
            alt={raid.name}
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link to="/raids" className="text-slate-400 hover:text-amber-400 transition-colors">Raids</Link>
            {subcategory && (
              <>
                <span className="text-slate-600">/</span>
                <Link to={`/raids/${subcategory.id}`} className="text-slate-400 hover:text-amber-400 transition-colors">{subcategory.name}</Link>
              </>
            )}
            <span className="text-slate-600">/</span>
            <span className="text-purple-400">{raid.name}</span>
          </nav>

          <div className="pb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="danger" size="md">{raid.difficulty}</Badge>
              <Badge variant="info" size="md">Min Lvl: {raid.minLevel}</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              {raid.name}
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
              {raid.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Subraid Tabs */}
        {raid.subraids && raid.subraids.length > 1 && (
          <div className="flex flex-wrap gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit">
            {raid.subraids.map((subraid) => (
              <button
                key={subraid.id}
                onClick={() => setActiveSubRaidId(subraid.id)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                  activeSubRaidId === subraid.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {subraid.name}
              </button>
            ))}
          </div>
        )}

        {raid.subraids?.filter(s => !activeSubRaidId || s.id === activeSubRaidId).map((subraid) => (
          <section key={subraid.id} className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{subraid.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-slate-400">Level: <span className="text-slate-100 font-medium">{subraid.level}</span></span>
                  <span className="text-slate-400">Recommended Gear: <span className="text-amber-400 font-medium">{subraid.recommendedGearLvl}</span></span>
                  <span className="text-slate-400">Gear Drop: <span className="text-green-400 font-medium">{subraid.gearDrop}</span></span>
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-wider text-amber-500 font-bold mb-1">Important Drop</p>
                {(() => {
                  const dropNames = subraid.importantDrop.split(/,|\s-\s/).map(s => s.trim());
                  const foundDrops = dropNames.map(name => {
                    const cleanName = name.split(' (')[0].toLowerCase();
                    return raid.stats?.importantDrops?.find(d => 
                      d.name.toLowerCase().includes(cleanName) || cleanName.includes(d.name.toLowerCase())
                    );
                  }).filter(Boolean);

                  if (foundDrops.length > 0) {
                    return (
                      <div className="flex flex-col gap-1">
                        {foundDrops.map((drop, idx) => drop && (
                          <DropItem key={idx} drop={drop} />
                        ))}
                      </div>
                    );
                  }

                  return (
                    <p className="text-amber-400 font-bold text-sm leading-none">{subraid.importantDrop}</p>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {subraid.bosses.map((boss, bossIdx) => (
                <div key={bossIdx} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      {boss.image ? (
                        <div className="relative group/boss">
                          <img 
                            src={boss.image} 
                            alt={boss.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl border-2 border-slate-700/50 shadow-xl cursor-zoom-in hover:scale-105 hover:border-purple-500/50 transition-all shrink-0"
                            onClick={() => setSelectedImage(boss.image!)}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-purple-500/10 opacity-0 group-hover/boss:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg shrink-0">
                          💀
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{boss.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                            BOSS
                          </span>
                          <span className="text-slate-500 font-medium">Level {boss.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Boss Stats */}
                    <Card className="lg:col-span-2 p-6" glow="red">
                      <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Base Attributes & Combat Stats
                      </h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatItem label="HP" value={boss.stats.hp.toLocaleString()} color="text-red-400" />
                        <StatItem label="Attack" value={boss.stats.attack} color="text-orange-400" />
                        <StatItem label="Armor" value={boss.stats.armor} />
                        <StatItem label="Armor Pen" value={boss.stats.armorPen} />
                        
                        <StatItem label="Hit" value={boss.stats.hit} />
                        <StatItem label="Dodge" value={boss.stats.dodge} />
                        <StatItem label="Critical" value={boss.stats.critical} />
                        <StatItem label="Crit Res" value={boss.stats.criticalRes} />
                        
                        <StatItem label="Expertise" value={boss.stats.expertise} />
                        <StatItem label="Parry" value={boss.stats.parry} />
                        <StatItem label="Block" value={boss.stats.block} />
                        <StatItem label="Ignore Armor" value={boss.stats.ignoreArmor} />

                        <StatItem label="Dmg Amp" value={boss.stats.dmgAmp} color="text-amber-400" />
                        <StatItem label="Dmg Red" value={boss.stats.dmgRed} color="text-blue-400" />
                        <StatItem label="Spell Pen" value={boss.stats.spellPen} />
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-800">
                        <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Resistances
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          <ResistItem label="Fire" value={boss.stats.fireRes} icon="🔥" />
                          <ResistItem label="Frost" value={boss.stats.frostRes} icon="❄️" />
                          <ResistItem label="Arcane" value={boss.stats.arcaneRes} icon="✨" />
                          <ResistItem label="Nature" value={boss.stats.natureRes} icon="🌿" />
                          <ResistItem label="Shadow" value={boss.stats.shadowRes} icon="🌑" />
                          <ResistItem label="Holy" value={boss.stats.holyRes} icon="☀️" />
                        </div>
                      </div>
                    </Card>

                    {/* Boss Skills */}
                    <div className="space-y-4">
                      <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold px-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Special Skills
                      </h4>
                      {boss.skills.map((skill, skillIdx) => (
                        <Card key={skillIdx} className="p-4 bg-slate-800/40 border-slate-700/50" glow="purple">
                          <h5 className="font-bold text-purple-400 mb-1">{skill.name}</h5>
                          <p className="text-sm text-slate-300 leading-relaxed">{skill.description}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center pt-12">
          <Link 
            to={subcategory ? `/raids/${subcategory.id}` : "/raids"} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {subcategory ? subcategory.name : 'Raids'}
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
              alt="Enlarged" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-slate-700 animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const StatItem = ({ label, value, color = "text-slate-100" }: { label: string; value: string | number; color?: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</p>
    <p className={`font-bold ${color}`}>{value}</p>
  </div>
);

const ResistItem = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
  <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800 flex items-center gap-2">
    <span className="text-lg">{icon}</span>
    <div>
      <p className="text-[10px] uppercase text-slate-500 leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-200">{value}</p>
    </div>
  </div>
);

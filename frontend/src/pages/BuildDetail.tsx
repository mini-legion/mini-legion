import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge } from '../components/UI';
import { useBuild } from '../lib/hooks';
import { storage } from '../lib/api';

interface DisplaySection {
  title: string;
  content: string;
}

const classStyles: Record<string, { gradient: string; bg: string; border: string; text: string; icon: string }> = {
  hunter: { gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '/images/classes/hunter-logo.png' },
  priest: { gradient: 'from-amber-200 to-amber-400', bg: 'bg-amber-200/10', border: 'border-amber-300/30', text: 'text-amber-200', icon: '/images/classes/priest-logo.png' },
  mage: { gradient: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: '/images/classes/mage-logo.png' },
  warrior: { gradient: 'from-amber-600 to-orange-700', bg: 'bg-amber-600/10', border: 'border-amber-600/30', text: 'text-amber-500', icon: '/images/classes/warrior-logo.png' },
  rogue: { gradient: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '/images/classes/rogue-logo.png' },
  paladin: { gradient: 'from-pink-400 to-rose-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '/images/classes/paladin-logo.png' },
  shaman: { gradient: 'from-sky-400 to-cyan-600', bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', icon: '/images/classes/shaman-logo.svg' },
  druid: { gradient: 'from-lime-400 to-green-700', bg: 'bg-lime-500/10', border: 'border-lime-500/30', text: 'text-lime-400', icon: '/images/classes/druid-logo.svg' },
};

const imageLabels: Record<string, string> = {
  skills: 'Skills / Rotation',
  skills2: 'Skills / Rotation 2',
  tree1: 'Primary Talent Tree',
  tree2: 'Secondary Talent Tree',
  tree3: 'Tertiary Talent Tree',
  dungeonGear: 'Dungeon Gear',
  adventureGear: 'Adventure Gear',
};

const titleize = (value: string) => value
  .replace(/_/g, ' ')
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((entry) => stringifyValue(entry)).filter(Boolean).join('\n');
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, entry]) => {
        const text = stringifyValue(entry);
        return text ? `${titleize(key)}: ${text}` : '';
      })
      .filter(Boolean)
      .join('\n');
  }
  return String(value);
};

const normalizeSections = (raw: unknown): DisplaySection[] => {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((section, index) => {
        if (typeof section === 'string') return { title: `Section ${index + 1}`, content: section };
        if (section && typeof section === 'object') {
          const data = section as Record<string, unknown>;
          return {
            title: String(data.title || data.heading || `Section ${index + 1}`),
            content: stringifyValue(data.content || data.text || data.description || data),
          };
        }
        return null;
      })
      .filter((section): section is DisplaySection => Boolean(section?.content?.trim()));
  }

  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>)
      .map(([key, value]) => ({ title: titleize(key), content: stringifyValue(value) }))
      .filter((section) => section.content.trim().length > 0);
  }

  return [{ title: 'Build Notes', content: stringifyValue(raw) }].filter((section) => section.content.trim().length > 0);
};

const normalizeImages = (images: Record<string, string | null | undefined> | null | undefined) => Object.entries(images || {})
  .filter(([, value]) => Boolean(value))
  .map(([key, value]) => ({ key, label: imageLabels[key] || titleize(key), url: storage.getUrl(value || '') || '' }))
  .filter((image) => Boolean(image.url));

const TextCard = ({ title, content, icon = '📝', glow = 'green' }: { title: string; content: string; icon?: string; glow?: 'amber' | 'purple' | 'blue' | 'green' | 'red' | 'none' }) => {
  if (!content?.trim()) return null;

  return (
    <Card className="p-6" glow={glow}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-slate-100 mb-3">{title}</h3>
          <div className="space-y-3">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export const BuildDetail = () => {
  const { buildId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: build, loading, error } = useBuild(buildId || '');

  const images = useMemo(() => normalizeImages((build as any)?.images), [build]);
  const sections = useMemo(() => normalizeSections((build as any)?.sections), [build]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (error || !build) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">{error ? '😕' : '🔍'}</div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">{error ? 'Error Loading Build' : 'Build Not Found'}</h2>
          <p className="text-slate-400 mb-6">{error ? 'Please try again later.' : "The build you're looking for doesn't exist."}</p>
          <Link to="/builds" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all">
            Back to Builds
          </Link>
        </div>
      </div>
    );
  }

  const heroClass = build.hero_class.toLowerCase();
  const colors = classStyles[heroClass] || classStyles.hunter;
  const hasTextContent = Boolean(
    build.intro_text ||
    build.talent_tips ||
    sections.length ||
    (build.runes || []).length ||
    Object.keys(build.gear_guide || {}).length ||
    Object.keys(build.refines_guide || {}).length ||
    (build.spells_guide || []).length ||
    (build.autocast_order || []).length ||
    (build.healing_tips || []).length
  );

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3`} />
          <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link to="/builds" className="text-slate-400 hover:text-amber-400 transition-colors">Builds</Link>
            <span className="text-slate-600">/</span>
            <Link to={`/builds/${heroClass}`} className={`text-slate-400 hover:${colors.text} transition-colors`}>{build.hero_class}</Link>
            <span className="text-slate-600">/</span>
            <span className={colors.text}>{build.spec}</span>
          </nav>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-32 h-32 lg:w-44 lg:h-44 flex items-center justify-center shrink-0 animate-float">
              <img src={colors.icon} alt={build.hero_class} className="w-full h-full object-contain filter drop-shadow-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {(build.content_type || []).map((tag, index) => <Badge key={`${tag}-${index}`} variant="default" size="md">{tag}</Badge>)}
                {build.role && <Badge variant="success" size="md">{build.role}</Badge>}
              </div>
              <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-3`}>
                {build.hero_class} {build.spec}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <p className="text-xl lg:text-2xl text-slate-300 font-medium">{build.title}</p>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">By {build.author}</span>
              </div>
              {build.description && <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">{build.description}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        {images.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>🖼️</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Build Screenshots</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {images.map((image) => (
                <Card key={image.key} className="overflow-hidden p-6" glow="green">
                  <h3 className={`text-lg font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">📌</span>
                    {image.label}
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src={image.url}
                      alt={image.label}
                      className="max-w-full h-auto rounded-xl border border-slate-700/50 shadow-2xl cursor-zoom-in hover:scale-[1.01] transition-transform"
                      onClick={() => setSelectedImage(image.url)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {build.intro_text && <TextCard title="Introduction" icon="👋" content={build.intro_text} glow="amber" />}

        {sections.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>📋</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Build Details</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sections.map((section, index) => <TextCard key={`${section.title}-${index}`} title={section.title} content={section.content} icon="📌" glow="green" />)}
            </div>
          </section>
        )}

        {(build.spells_guide || []).length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>⚡</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Skills & Runes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(build.spells_guide || []).map((spell: any, index: number) => (
                <Card key={`${spell.skill || index}`} className="p-5" glow="green">
                  <h3 className="font-black text-slate-100 mb-2">{spell.icon} {spell.skill || `Skill ${index + 1}`}</h3>
                  {spell.rune && <p className={`${colors.text} text-sm font-bold mb-2`}>Rune: {spell.rune}</p>}
                  {spell.description && <p className="text-sm text-slate-400 leading-relaxed">{spell.description}</p>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {(build.autocast_order || []).length > 0 && <TextCard title="Autocast Order" icon="🔄" content={(build.autocast_order || []).map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')} glow="green" />}
        {(build.healing_tips || []).length > 0 && <TextCard title="Tips" icon="💡" content={(build.healing_tips || []).join('\n')} glow="amber" />}
        {build.talent_tips && <TextCard title="Talent Tips" icon="🎯" content={build.talent_tips} glow="blue" />}

        {(build.runes || []).length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl`}>✨</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Recommended Runes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(build.runes || []).map((rune: any, index: number) => (
                <Card key={index} className="p-5" glow="green">
                  <h3 className="font-black text-slate-100 mb-2">{rune.icon} {rune.skill}</h3>
                  <p className={`${colors.text} text-sm font-bold mb-2`}>{rune.runeName}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{rune.description}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {Object.keys(build.gear_guide || {}).length > 0 && <TextCard title="Gear Guide" icon="⚔️" content={stringifyValue(build.gear_guide)} glow="purple" />}
        {Object.keys(build.refines_guide || {}).length > 0 && <TextCard title="Refines Guide" icon="💎" content={stringifyValue(build.refines_guide)} glow="amber" />}

        {!hasTextContent && images.length === 0 && (
          <Card className="p-8 text-center" glow="amber">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-black text-slate-100 mb-3">Build details are incomplete</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              This build exists, but no screenshots or detailed setup information were attached yet. The creator or an admin can add more details later.
            </p>
          </Card>
        )}

        <div className="flex justify-center pt-4">
          <Link to="/builds" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all">
            ← Back to All Builds
          </Link>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white text-4xl hover:text-amber-400 transition-colors">×</button>
          <img src={selectedImage} alt="Build detail" className="max-w-[95vw] max-h-[95vh] object-contain rounded-xl" />
        </div>
      )}
    </div>
  );
};

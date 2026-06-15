import { Link } from 'react-router-dom';
import { Card, PageHeader, Badge } from '../components/UI';

const plannedSections = [
  {
    title: 'Preparation Guide',
    description: 'Start here before investing resources. Covers what to save, what to test, and how to avoid early overinvestment.',
    icon: '🌿',
    status: 'Live',
    to: '/guides/detail/druid-preparation-guide',
    glow: 'green' as const,
  },
  {
    title: 'Druid Builds',
    description: 'Recommended setups will be added after the class is released and tested across progression, farming, and group content.',
    icon: '🧬',
    status: 'Coming Soon',
    to: null,
    glow: 'amber' as const,
  },
  {
    title: 'Raid & Farming Notes',
    description: 'Performance notes for raids, AFK farming, dungeon content, and team utility will be documented once reliable data exists.',
    icon: '⚔️',
    status: 'Coming Soon',
    to: null,
    glow: 'purple' as const,
  },
  {
    title: 'Progression Testing',
    description: 'Early testing results, resource priority, and practical progression advice will be collected after the update goes live.',
    icon: '📈',
    status: 'Planned',
    to: null,
    glow: 'none' as const,
  },
];

export const DruidHub = () => {
  return (
    <div>
      <PageHeader
        title="Druid Hub"
        subtitle="Preparation, builds, testing notes, and update coverage for the upcoming Druid class."
        gradient="green"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="p-6 md:p-8 mb-8 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-950" glow="green">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                🌿 Active Update Preparation
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-100 mb-3">
                Druid coverage is being prepared for the community
              </h2>
              <p className="text-slate-400 leading-relaxed">
                This hub will collect all Druid-related content in one place. Builds, progression notes, raid usage, farming value, and practical recommendations will be added after the class is released and reliable information can be tested.
              </p>
            </div>
            <Link
              to="/guides/detail/druid-preparation-guide"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black text-center hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Open Preparation Guide
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plannedSections.map((section) => {
            const content = (
              <Card className="p-6 h-full" glow={section.glow}>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-lg">
                    {section.icon}
                  </div>
                  <Badge variant={section.status === 'Live' ? 'success' : 'info'} size="sm">
                    {section.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-black text-slate-100 mb-2 group-hover:text-emerald-300 transition-colors">
                  {section.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {section.description}
                </p>
              </Card>
            );

            return section.to ? (
              <Link key={section.title} to={section.to} className="group">
                {content}
              </Link>
            ) : (
              <div key={section.title}>{content}</div>
            );
          })}
        </div>

        <Card className="p-6 mt-8 border-amber-500/20" glow="amber">
          <div className="flex items-start gap-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-black text-slate-100 mb-2">Information policy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Druid information will only be published as confirmed data or clearly marked testing notes. Early speculation will not be presented as final recommendations.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

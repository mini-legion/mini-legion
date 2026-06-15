import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card } from '../components/UI';
import { getContributorRankings, type ContributorRankingEntry } from '../lib/submissions';

export const Ranking = () => {
  const [rankings, setRankings] = useState<ContributorRankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getContributorRankings()
      .then((result) => {
        if (mounted) {
          setRankings(result);
          setError(null);
        }
      })
      .catch((rankingError) => {
        if (mounted) {
          setError(rankingError instanceof Error ? rankingError.message : 'Failed to load ranking.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Contributor Ranking"
        subtitle="Top community contributors based on approved builds, guides, and updates"
        gradient="amber"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5" glow="amber">
            <div className="text-3xl mb-2">🏗️</div>
            <h3 className="text-slate-100 font-black mb-1">Approved Build</h3>
            <p className="text-amber-400 font-black text-xl">3 points</p>
          </Card>
          <Card className="p-5" glow="green">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-slate-100 font-black mb-1">Approved Guide</h3>
            <p className="text-green-400 font-black text-xl">5 points</p>
          </Card>
          <Card className="p-5" glow="blue">
            <div className="text-3xl mb-2">🛠️</div>
            <h3 className="text-slate-100 font-black mb-1">Major Update / Fix</h3>
            <p className="text-blue-400 font-black text-xl">1 point</p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-100">Top 10 Contributors</h2>
            <p className="text-slate-500 text-sm mt-1">Only reviewed and approved content counts.</p>
          </div>
          <Link
            to="/builds/submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            📤 Submit Your Build
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        )}

        {error && !loading && (
          <Card className="p-8 text-center" glow="red">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-300 mb-2">Ranking failed to load</h3>
            <p className="text-slate-500">{error}</p>
          </Card>
        )}

        {!loading && !error && rankings.length === 0 && (
          <Card className="p-8 text-center" glow="amber">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-black text-slate-100 mb-2">No ranking data yet</h3>
            <p className="text-slate-500">Approved community contributions will appear here.</p>
          </Card>
        )}

        {!loading && !error && rankings.length > 0 && (
          <div className="space-y-3">
            {rankings.map((entry, index) => {
              const rank = index + 1;
              const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

              return (
                <Card
                  key={entry.name}
                  className={`p-4 sm:p-5 ${rank <= 3 ? 'border-amber-500/30' : ''}`}
                  glow={rank <= 3 ? 'amber' : 'none'}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950/70 border border-slate-700 flex items-center justify-center text-xl font-black text-amber-400 shrink-0">
                        {medal}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-slate-100 truncate">{entry.name}</h3>
                        <p className="text-sm text-slate-500 truncate">
                          Latest: {entry.latestUrl ? (
                            <Link to={entry.latestUrl} className="text-amber-400 hover:text-amber-300 hover:underline">
                              {entry.latestContribution}
                            </Link>
                          ) : entry.latestContribution}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div className="rounded-xl bg-slate-950/60 border border-slate-700 px-3 py-2">
                        <div className="text-xs text-slate-500">Builds</div>
                        <div className="text-slate-100 font-black">{entry.builds}</div>
                      </div>
                      <div className="rounded-xl bg-slate-950/60 border border-slate-700 px-3 py-2">
                        <div className="text-xs text-slate-500">Guides</div>
                        <div className="text-slate-100 font-black">{entry.guides}</div>
                      </div>
                      <div className="rounded-xl bg-slate-950/60 border border-slate-700 px-3 py-2">
                        <div className="text-xs text-slate-500">Updates</div>
                        <div className="text-slate-100 font-black">{entry.updates}</div>
                      </div>
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2">
                        <div className="text-xs text-amber-400/80">Points</div>
                        <div className="text-amber-400 font-black">{entry.points}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

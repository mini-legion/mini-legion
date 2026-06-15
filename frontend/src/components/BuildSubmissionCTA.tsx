import { Link } from 'react-router-dom';
import { Card } from './UI';

export const BuildSubmissionCTA = () => (
  <Card className="p-5 sm:p-6 mb-10" glow="green">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-black uppercase tracking-wide mb-3">
          Community Builds
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-2">Share your best Mini Legion build</h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          Submit your class setup, runes, rotation, gear notes, and screenshots. Approved builds count for the contributor ranking.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <Link
          to="/builds/submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 font-black hover:shadow-lg hover:shadow-green-500/25 transition-all"
        >
          📤 Submit Your Build
        </Link>
        <Link
          to="/ranking"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold border border-slate-700 hover:text-amber-400 hover:border-amber-500/40 transition-all"
        >
          🏆 Ranking
        </Link>
      </div>
    </div>
  </Card>
);

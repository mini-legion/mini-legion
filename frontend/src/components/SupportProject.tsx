const supportUrl = 'https://ko-fi.com/vegetarox';

interface SupportProjectProps {
  compact?: boolean;
}

export const SupportProject = ({ compact = false }: SupportProjectProps) => {
  if (compact) {
    return (
      <a
        href={supportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300 transition-all hover:border-amber-400/60 hover:bg-amber-500/20"
      >
        ☕ Support the project
      </a>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-950 p-6 sm:p-8 shadow-xl shadow-amber-500/5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-300 mb-3">
              Community Project
            </div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">Support Mini Legion Guide</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
              Mini Legion Guide is maintained by Vegetarox as a community project. If the site helped you, you can support future guides, builds, updates and tools here.
            </p>
          </div>
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30"
          >
            ☕ Support Vegetarox
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-600">
          Mini Legion Guide is not affiliated with the official Mini Legion game.
        </p>
      </div>
    </section>
  );
};

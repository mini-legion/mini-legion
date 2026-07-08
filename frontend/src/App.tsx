function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-500/10 text-5xl shadow-2xl shadow-amber-950/30">
          ⚔️
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
          🛠️ Maintenance Mode
        </div>

        <h1 className="mb-6 text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
          Mini Legion Guide is
          <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            currently being rebuilt
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
          We are rebuilding and improving the website behind the scenes. The guide will be back online soon.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300 shadow-xl">
          <p className="font-semibold">Thank you for your patience and continued support. ❤️</p>
          <p className="mt-2 text-sm text-slate-500">— Mini Legion Guide Team</p>
        </div>
      </div>
    </main>
  );
}

export default App;

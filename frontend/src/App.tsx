import { useEffect } from 'react';
import logo from './assets/logo-minilegion.png';

const NEW_SITE = 'https://www.minilegion.online';

function App() {
  useEffect(() => {
    document.title = 'Mini Legion Guides has moved';

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow';
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.55),rgba(2,6,23,0.95))]" />
      </div>

      <section className="relative w-full max-w-3xl rounded-3xl border border-amber-500/25 bg-slate-900/85 p-6 text-center shadow-2xl shadow-amber-500/10 backdrop-blur-xl sm:p-10 lg:p-14">
        <img
          src={logo}
          alt="Mini Legion Guides"
          className="mx-auto mb-6 h-24 w-24 rounded-2xl border border-amber-500/30 bg-slate-800 object-contain shadow-xl shadow-amber-500/20 sm:h-32 sm:w-32"
        />

        <div className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-amber-400">
          The guides website is moving
        </div>

        <h1 className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent sm:text-6xl">
          Mini Legion Guides has a new home
        </h1>

        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-blue-400/30 bg-blue-500/10 px-5 py-4 text-left sm:px-6">
          <p className="text-sm font-black uppercase tracking-widest text-blue-300">
            Important clarification
          </p>
          <p className="mt-2 text-base font-bold leading-7 text-slate-100 sm:text-lg">
            This notice concerns the independent Mini Legion Guides website only — not the Mini Legion game itself.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
            The game, its servers and its development are not moving. Only our guides, builds, member accounts and community tools have moved to a new independent website.
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          The original Mini Legion Guides website is now offline. All guide content and community features continue on the new official Mini Legion Guides platform.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">New official Mini Legion Guides domain</p>
          <p className="mt-1 break-all text-lg font-black text-amber-300">www.minilegion.online</p>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={NEW_SITE}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3 font-black text-slate-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/20"
          >
            Open Mini Legion Guides
          </a>
        </div>

        <p className="mt-7 text-sm text-slate-500">
          This temporary notice will later be replaced by a permanent redirect to the official Guides website.
        </p>
      </section>
    </main>
  );
}

export default App;

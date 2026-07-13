import { useEffect } from 'react';
import logo from './assets/logo-minilegion.png';

const NEW_SITE = 'https://www.minilegion.online';
const TEMPORARY_SITE = 'https://mini-legion-new.pages.dev';

function App() {
  useEffect(() => {
    document.title = 'Mini Legion is moving';

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
          alt="Mini Legion"
          className="mx-auto mb-6 h-24 w-24 rounded-2xl border border-amber-500/30 bg-slate-800 object-contain shadow-xl shadow-amber-500/20 sm:h-32 sm:w-32"
        />

        <div className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-amber-400">
          We are moving
        </div>

        <h1 className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent sm:text-6xl">
          Mini Legion has a new home
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          The original Mini Legion website is now offline while the project moves to its new independent platform.
          All guides, builds, accounts and community tools are being continued on the new website.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">New official domain</p>
          <p className="mt-1 break-all text-lg font-black text-amber-300">www.minilegion.online</p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={NEW_SITE}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-black text-slate-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/20"
          >
            Open new domain
          </a>
          <a
            href={TEMPORARY_SITE}
            className="rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 font-bold text-slate-200 transition hover:border-green-500/50 hover:text-green-300"
          >
            Open current new website
          </a>
        </div>

        <p className="mt-7 text-sm text-slate-500">
          This temporary page will be replaced by a permanent redirect after the new domain is fully connected and tested.
        </p>
      </section>
    </main>
  );
}

export default App;

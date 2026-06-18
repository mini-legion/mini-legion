import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../lib/auth';

export const Layout = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const buildDetailMatch = location.pathname.match(/^\/builds\/detail\/([^/]+)/);
  const guideDetailMatch = location.pathname.match(/^\/guides\/detail\/([^/]+)/);
  const editTarget = buildDetailMatch
    ? { label: 'Edit Build', tab: 'builds', id: buildDetailMatch[1] }
    : guideDetailMatch
      ? { label: 'Edit Guide', tab: 'guides', id: guideDetailMatch[1] }
      : null;

  const showAdminEditButton = isAdmin && editTarget;
  const showContributeButton =
    location.pathname.startsWith('/builds') &&
    location.pathname !== '/builds/submit' &&
    !showAdminEditButton;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      {showAdminEditButton && editTarget && (
        <Link
          to={`/account?adminTab=${editTarget.tab}&search=${encodeURIComponent(editTarget.id)}#admin-editor`}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-amber-500/25 hover:scale-105 transition-transform"
        >
          ✏️ {editTarget.label}
        </Link>
      )}
      {showContributeButton && (
        <Link
          to="/builds/submit"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-green-500/25 hover:scale-105 transition-transform"
        >
          📤 Contribute
        </Link>
      )}
      <Footer />
    </div>
  );
};
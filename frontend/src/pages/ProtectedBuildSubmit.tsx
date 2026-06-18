import { Link } from 'react-router-dom';
import { Card, PageHeader } from '../components/UI';
import { useAuth } from '../lib/auth';
import { BuildSubmit } from './BuildSubmit';

export const ProtectedBuildSubmit = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <PageHeader title="Submit Your Build" subtitle="Checking login status" gradient="green" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageHeader title="Login Required" subtitle="Create an account before submitting builds" gradient="green" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card className="p-8 text-center" glow="green">
            <div className="text-6xl mb-5">🔐</div>
            <h2 className="text-2xl font-black text-slate-100 mb-3">Account required</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Please login or register before sending a build. This keeps submissions attached to the correct creator profile.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/login?mode=register" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 font-black hover:shadow-lg hover:shadow-green-500/25 transition-all">
                Register
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold border border-slate-700 hover:border-amber-500/40 hover:text-amber-400 transition-all">
                Login
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return <BuildSubmit />;
};

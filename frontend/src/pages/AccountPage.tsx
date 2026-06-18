import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card } from '../components/UI';
import { useAuth } from '../lib/auth';

export const AccountPage = () => {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [discord, setDiscord] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name || '');
    setDiscord(profile.discord || '');
    setMarketingOptIn(Boolean(profile.marketing_opt_in));
  }, [profile]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Account" subtitle="Loading your profile" gradient="green" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageHeader title="Account Required" subtitle="Login or create an account to manage your submissions" gradient="green" />
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card className="p-8 text-center" glow="green">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-2xl font-black text-slate-100 mb-3">Please login first</h2>
            <p className="text-slate-400 mb-6">Accounts are required for build submissions and future guide editing.</p>
            <Link to="/login" className="inline-flex rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-black text-slate-950">
              Login / Register
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile({
        display_name: displayName.trim(),
        discord: discord.trim() || null,
        marketing_opt_in: marketingOptIn,
      });
      setMessage('Profile saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Account" subtitle="Manage your creator profile and email preferences" gradient="green" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        <Card className="p-6" glow="green">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-100 mb-2">Profile</h2>
            <p className="text-sm text-slate-400">This profile will be used for submissions, ownership and future creator features.</p>
          </div>

          {message && <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm font-semibold">{message}</div>}
          {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-semibold">{error}</div>}

          <form onSubmit={handleSave} className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-300">Email</span>
              <input value={user.email || ''} disabled className="mt-2 w-full rounded-xl bg-slate-900/70 border border-slate-800 px-4 py-3 text-slate-500" />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">Creator / Display Name *</span>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500" />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">Discord / Contact</span>
              <input value={discord} onChange={(event) => setDiscord(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500" placeholder="Discord name, X, YouTube, etc." />
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <input type="checkbox" checked={marketingOptIn} onChange={(event) => setMarketingOptIn(event.target.checked)} className="mt-1" />
              <span className="text-sm text-slate-400">Receive Mini Legion Guide news and creator updates.</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button type="button" onClick={() => signOut()} className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-bold text-slate-300 hover:border-red-500/40 hover:text-red-300 transition-all">
                Logout
              </button>
              <button type="submit" disabled={isSaving} className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-black text-slate-950 disabled:opacity-60">
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </Card>

        <Card className="p-6" glow="amber">
          <h3 className="text-lg font-black text-slate-100 mb-2">Next creator features</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Build ownership is now stored with your account. Editing published builds, guide section submissions and comments can be added on top of this account system.
          </p>
        </Card>
      </div>
    </div>
  );
};

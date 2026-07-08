import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader, Card } from '../components/UI';
import { useAuth } from '../lib/auth';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <div>
        <PageHeader title="Account" subtitle="You are already logged in" gradient="green" />
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card className="p-8 text-center" glow="green">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-slate-100 mb-3">Logged in</h2>
            <p className="text-slate-400 mb-6">You can manage your account. Community submissions will return soon.</p>
            <div className="flex justify-center">
              <Link to="/account" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 font-black">
                Open Account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (mode === 'register' && !displayName.trim()) {
      setError('Creator name is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        await signUp({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          marketingOptIn,
        });
        setMessage('Account created. You are now logged in.');
      } else {
        await signIn(email.trim(), password);
        navigate('/account');
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={mode === 'register' ? 'Create Account' : 'Login'}
        subtitle="Login to manage your Mini Legion creator profile"
        gradient="green"
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="p-6 sm:p-8" glow="green">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-950/60 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl px-4 py-3 text-sm font-black transition-all ${mode === 'login' ? 'bg-green-500 text-slate-950' : 'text-slate-400 hover:text-green-300'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-xl px-4 py-3 text-sm font-black transition-all ${mode === 'register' ? 'bg-green-500 text-slate-950' : 'text-slate-400 hover:text-green-300'}`}
            >
              Register
            </button>
          </div>

          {message && <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm font-semibold">{message}</div>}
          {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-semibold">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <label className="block">
                <span className="text-sm font-bold text-slate-300">Creator / Display Name *</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                  placeholder="Vegetarox"
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm font-bold text-slate-300">Email *</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">Password *</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                placeholder="At least 6 characters"
              />
            </label>

            {mode === 'register' && (
              <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-slate-400">
                  I agree to receive Mini Legion Guide updates, creator messages and occasional promotional emails. I can opt out later.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-black text-slate-950 hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Login'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

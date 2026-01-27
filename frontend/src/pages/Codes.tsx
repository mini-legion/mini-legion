import { useState } from 'react';
import { PageHeader, Card, Badge } from '../components/UI';
import { useCodes } from '../lib/hooks';

export const Codes = () => {
  const { data: codes, loading, error } = useCodes();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Redeem Codes"
          subtitle="Get free rewards with these active codes"
          gradient="green"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Redeem Codes"
          subtitle="Get free rewards with these active codes"
          gradient="green"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card className="p-8 text-center">
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Error loading codes</h3>
            <p className="text-slate-500">Please try again later</p>
          </Card>
        </div>
      </div>
    );
  }

  const allCodes = codes || [];

  const filteredCodes = allCodes
    .filter(code => {
      if (filter === 'active') return code.is_active;
      if (filter === 'expired') return !code.is_active;
      return true;
    })
    .sort((a, b) => {
      // Active codes first, then by date_added (newest first)
      if (a.is_active !== b.is_active) {
        return a.is_active ? -1 : 1;
      }
      return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
    });

  const activeCodes = allCodes.filter(c => c.is_active).length;

  return (
    <div>
      <PageHeader
        title="Redeem Codes"
        subtitle="Get free rewards with these active codes"
        gradient="green"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-5 text-center" glow="green">
            <div className="text-3xl font-bold text-green-400">{activeCodes}</div>
            <div className="text-slate-400 text-sm">Active Codes</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-slate-400">{allCodes.length - activeCodes}</div>
            <div className="text-slate-400 text-sm">Expired Codes</div>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-slate-400 text-sm">Show:</span>
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-green-500/30 hover:text-green-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Codes List */}
        <div className="space-y-4">
          {filteredCodes.map((code) => (
            <Card
              key={code.id}
              className={`p-6 ${!code.is_active ? 'opacity-60' : ''}`}
              glow={code.is_active ? 'green' : 'none'}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <code className={`px-4 py-2 rounded-lg font-mono font-bold text-lg ${
                      code.is_active
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-slate-700/50 border border-slate-600 text-slate-500 line-through'
                    }`}>
                      {code.code}
                    </code>
                    <Badge variant={code.is_active ? 'success' : 'danger'}>
                      {code.is_active ? 'Active' : 'Expired'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {code.rewards.map((reward, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm">
                        🎁 {reward}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Added: {new Date(code.date_added).toLocaleDateString()}</span>
                    {code.expires_at && (
                      <span className={code.is_active ? 'text-amber-400' : 'text-red-400'}>
                        {code.is_active ? 'Expires' : 'Expired'}: {new Date(code.expires_at).toLocaleDateString()}
                      </span>
                    )}
                    {!code.expires_at && code.is_active && (
                      <span className="text-green-400">No expiration</span>
                    )}
                  </div>
                </div>

                {code.is_active && (
                  <button
                    onClick={() => handleCopy(code.code)}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                      copiedCode === code.code
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-700 text-slate-200 hover:bg-green-500/20 hover:text-green-400 border border-slate-600 hover:border-green-500/30'
                    }`}
                  >
                    {copiedCode === code.code ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Code
                      </span>
                    )}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* How to Redeem */}
        <Card className="mt-12 p-8" hover={false}>
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <span>📋</span> How to Redeem Codes
          </h3>
          <ol className="space-y-3 text-slate-400">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
              <span>Open Mini Legion and go to Settings</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
              <span>Tap on "Redeem Code" button</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
              <span>Paste or type the code and tap "Confirm"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold flex items-center justify-center flex-shrink-0">4</span>
              <span>Check your mailbox for rewards!</span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

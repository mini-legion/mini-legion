import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from './UI';
import {
  getAccountAdminDashboard,
  updateAccountAdminBuild,
  updateAccountAdminGuide,
  updateAccountAdminSubmission,
  type AccountAdminBuild,
  type AccountAdminDashboard,
  type AccountAdminGuide,
  type AccountAdminSubmission,
} from '../lib/accountAdmin';

type AdminTab = 'guides' | 'builds' | 'submissions';
type Editable =
  | { type: 'guide'; item: AccountAdminGuide }
  | { type: 'build'; item: AccountAdminBuild }
  | { type: 'submission'; item: AccountAdminSubmission }
  | null;

const statusClass: Record<string, string> = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  reviewing: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  approved: 'border-green-500/30 bg-green-500/10 text-green-300',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const formatJson = (value: unknown) => JSON.stringify(value ?? null, null, 2);

export const AccountAdminManager = () => {
  const [tab, setTab] = useState<AdminTab>('guides');
  const [dashboard, setDashboard] = useState<AccountAdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editable, setEditable] = useState<Editable>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      setDashboard(await getAccountAdminDashboard());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => ({
    guides: dashboard?.guides.length || 0,
    builds: dashboard?.builds.length || 0,
    submissions: dashboard?.submissions.length || 0,
  }), [dashboard]);

  const saved = async () => {
    setEditable(null);
    setMessage('Saved successfully.');
    await load();
  };

  return (
    <Card className="p-6" glow="amber">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-100">Admin Content Manager</h2>
          <p className="text-sm text-slate-400 mt-1">Manage guides, builds and submitted builds directly from your account.</p>
        </div>
        <Link to="/admin" className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-black text-amber-300 hover:bg-amber-500/20 transition-all text-center">
          Legacy Admin Panel
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {([
          ['guides', 'Guides', stats.guides],
          ['builds', 'Builds', stats.builds],
          ['submissions', 'Submissions', stats.submissions],
        ] as const).map(([key, label, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-2xl border p-4 text-left transition-all ${tab === key ? 'border-amber-500/40 bg-amber-500/15' : 'border-slate-800 bg-slate-950/35 hover:border-slate-600'}`}
          >
            <div className="text-2xl font-black text-slate-100">{value}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
          </button>
        ))}
      </div>

      {message && <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-300">{message}</div>}
      {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">{error}</div>}

      {loading ? (
        <div className="py-10 text-center text-slate-500">Loading admin content...</div>
      ) : dashboard ? (
        <div className="space-y-3">
          {tab === 'guides' && dashboard.guides.map((guide) => (
            <AdminRow key={guide.id} title={guide.title} subtitle={`${guide.subcategory} • ${guide.author}`} href={`/guides/detail/${guide.id}`} onEdit={() => setEditable({ type: 'guide', item: guide })} />
          ))}

          {tab === 'builds' && dashboard.builds.map((build) => (
            <AdminRow key={build.id} title={build.title} subtitle={`${build.hero_class}${build.spec ? ` • ${build.spec}` : ''} • ${build.author}`} href={`/builds/detail/${build.id}`} onEdit={() => setEditable({ type: 'build', item: build })} />
          ))}

          {tab === 'submissions' && dashboard.submissions.map((submission) => (
            <div key={submission.id} className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusClass[submission.status]}`}>{submission.status}</span>
                    <Badge variant="info" size="sm">{submission.hero_class}</Badge>
                  </div>
                  <h3 className="font-black text-slate-100">{submission.title}</h3>
                  <p className="text-sm text-slate-500">By {submission.contributor_name} • {new Date(submission.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setEditable({ type: 'submission', item: submission })} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:border-amber-500/40 hover:text-amber-300">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <EditModal editable={editable} close={() => setEditable(null)} saved={saved} />
    </Card>
  );
};

const AdminRow = ({ title, subtitle, href, onEdit }: { title: string; subtitle: string; href: string; onEdit: () => void }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h3 className="font-black text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <Link to={href} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 hover:text-amber-300">Open</Link>
        <button onClick={onEdit} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:border-amber-500/40 hover:text-amber-300">Edit</button>
      </div>
    </div>
  </div>
);

const EditModal = ({ editable, close, saved }: { editable: Editable; close: () => void; saved: () => void }) => {
  const [item, setItem] = useState<Editable['item'] | null>(editable?.item || null);
  const [jsonText, setJsonText] = useState('');
  const [listText, setListText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItem(editable?.item || null);
    setError(null);

    if (editable?.type === 'guide') {
      setJsonText(formatJson(editable.item.sections));
      setListText((editable.item.tags || []).join(', '));
    } else if (editable?.type === 'build') {
      setJsonText(formatJson(editable.item.images));
      setListText((editable.item.content_type || []).join(', '));
    } else {
      setJsonText('');
      setListText('');
    }
  }, [editable]);

  if (!editable || !item) return null;

  const update = (key: string, value: string) => {
    setItem((current) => current ? ({ ...current, [key]: value } as Editable['item']) : current);
  };

  const save = async () => {
    setBusy(true);
    setError(null);

    try {
      if (editable.type === 'guide') {
        await updateAccountAdminGuide(item as AccountAdminGuide, jsonText, listText);
      } else if (editable.type === 'build') {
        await updateAccountAdminBuild(item as AccountAdminBuild, jsonText, listText);
      } else {
        await updateAccountAdminSubmission(item as AccountAdminSubmission);
      }

      await saved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Save failed. Check JSON fields.');
    } finally {
      setBusy(false);
    }
  };

  const isGuide = editable.type === 'guide';
  const isBuild = editable.type === 'build';
  const isSubmission = editable.type === 'submission';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-5xl overflow-y-auto p-6" glow="amber">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-100">Edit {editable.type}</h3>
          <button onClick={close} className="text-2xl text-slate-400 hover:text-red-300">×</button>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">{error}</div>}

        <div className="space-y-4">
          {isSubmission ? (
            <>
              <Readonly label="Title" value={(item as AccountAdminSubmission).title} />
              <label className="block"><span className="text-sm font-bold text-slate-300">Status</span><select value={(item as AccountAdminSubmission).status} onChange={(event) => update('status', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"><option value="pending">pending</option><option value="reviewing">reviewing</option><option value="approved">approved</option><option value="rejected">rejected</option></select></label>
              <Textarea label="Review Notes" value={(item as AccountAdminSubmission).review_notes || ''} onChange={(value) => update('review_notes', value)} />
            </>
          ) : (
            <>
              <Input label="Title" value={(item as AccountAdminGuide | AccountAdminBuild).title} onChange={(value) => update('title', value)} />
              <Textarea label="Description" value={(item as AccountAdminGuide | AccountAdminBuild).description || ''} onChange={(value) => update('description', value)} />
              <Input label="Author" value={(item as AccountAdminGuide | AccountAdminBuild).author} onChange={(value) => update('author', value)} />
              <Input label="Image URL / Path" value={(item as AccountAdminGuide | AccountAdminBuild).image || ''} onChange={(value) => update('image', value)} />

              {isGuide && (
                <>
                  <Input label="Subtitle" value={(item as AccountAdminGuide).subtitle || ''} onChange={(value) => update('subtitle', value)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Category" value={(item as AccountAdminGuide).category} onChange={(value) => update('category', value)} />
                    <Input label="Subcategory" value={(item as AccountAdminGuide).subcategory} onChange={(value) => update('subcategory', value)} />
                  </div>
                  <Input label="Read Time" value={(item as AccountAdminGuide).read_time || ''} onChange={(value) => update('read_time', value)} />
                  <Input label="Tags (comma separated)" value={listText} onChange={setListText} />
                  <Textarea label="Sections JSON" value={jsonText} onChange={setJsonText} rows={12} />
                </>
              )}

              {isBuild && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Class" value={(item as AccountAdminBuild).hero_class} onChange={(value) => update('hero_class', value)} />
                    <Input label="Spec" value={(item as AccountAdminBuild).spec || ''} onChange={(value) => update('spec', value)} />
                    <label className="block"><span className="text-sm font-bold text-slate-300">Role</span><select value={(item as AccountAdminBuild).role || ''} onChange={(event) => update('role', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"><option value="">None</option><option value="DPS">DPS</option><option value="Healer">Healer</option><option value="Tank">Tank</option></select></label>
                  </div>
                  <label className="block"><span className="text-sm font-bold text-slate-300">Tier</span><select value={(item as AccountAdminBuild).tier} onChange={(event) => update('tier', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"><option value="S">S</option><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></label>
                  <Input label="Content Types (comma separated)" value={listText} onChange={setListText} />
                  <Textarea label="Intro Text" value={(item as AccountAdminBuild).intro_text || ''} onChange={(value) => update('intro_text', value)} />
                  <Textarea label="Talent Tips" value={(item as AccountAdminBuild).talent_tips || ''} onChange={(value) => update('talent_tips', value)} />
                  <Textarea label="Images JSON" value={jsonText} onChange={setJsonText} rows={10} />
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={close} className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-bold text-slate-300">Cancel</button>
          <button onClick={save} disabled={busy} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-black text-slate-950 disabled:opacity-60">
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </Card>
    </div>
  );
};

const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" /></label>
);

const Textarea = ({ label, value, onChange, rows = 5 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-amber-500 font-mono text-sm" /></label>
);

const Readonly = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-slate-300">{value}</div></div>
);

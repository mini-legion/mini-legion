import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge } from '../components/UI';
import {
  adminLogin,
  adminLogout,
  clearAdminSession,
  getAdminDashboard,
  getStoredAdminSession,
  getSubmissionImageUrl,
  updateBuildBasic,
  updateGuideBasic,
  updateSubmissionStatus,
  type AdminBuildRow,
  type AdminBuildSubmission,
  type AdminDashboardData,
  type AdminGuideRow,
  type AdminSession,
} from '../lib/admin';

type Tab = 'submissions' | 'builds' | 'guides';
type Editable = { type: 'build'; item: AdminBuildRow } | { type: 'guide'; item: AdminGuideRow } | null;

const statusClass: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  reviewing: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  approved: 'bg-green-500/15 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const Field = ({ title, value }: { title: string; value: string | null }) => (
  <div className="rounded-xl bg-slate-950/50 border border-slate-800 p-4">
    <div className="text-xs font-black uppercase tracking-wide text-slate-500 mb-2">{title}</div>
    <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed">{value || '—'}</div>
  </div>
);

const Login = ({ onLogin }: { onLogin: (session: AdminSession) => void }) => {
  const [username, setUsername] = useState('Vegetarox');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await adminLogin(username.trim(), password);
      onLogin(session);
    } catch {
      setError('Login failed. Please check username and password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Admin Login" subtitle="Private Mini Legion Guide management area" gradient="amber" />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="p-6" glow="amber">
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-300">Username</span>
              <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" autoComplete="username" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-300">Password</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" autoComplete="current-password" />
            </label>
            {error && <p className="text-sm font-bold text-red-300">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-black text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-60">
              {busy ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

const SubmissionCard = ({ submission, token, reload }: { submission: AdminBuildSubmission; token: string; reload: () => void }) => {
  const [notes, setNotes] = useState(submission.review_notes || '');
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (status: 'reviewing' | 'approved' | 'rejected') => {
    setBusy(status);
    try {
      await updateSubmissionStatus(token, submission.id, status, notes || null);
      reload();
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card className="p-5" glow="amber">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-full border text-xs font-black uppercase ${statusClass[submission.status]}`}>{submission.status}</span>
            <Badge variant="info" size="sm">{submission.hero_class}</Badge>
            {submission.spec && <Badge variant="info" size="sm">{submission.spec}</Badge>}
            {submission.role && <Badge variant="success" size="sm">{submission.role}</Badge>}
          </div>
          <h3 className="text-xl font-black text-slate-100">{submission.title}</h3>
          <p className="text-sm text-amber-400 mt-1">By {submission.contributor_name}</p>
          {submission.contact && <p className="text-xs text-slate-500 mt-1">Contact: {submission.contact}</p>}
        </div>
        <div className="text-xs text-slate-500">{new Date(submission.created_at).toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field title="Description" value={submission.description} />
        <Field title="Runes" value={submission.runes} />
        <Field title="Rotation / Autocast" value={submission.rotation} />
        <Field title="Gear / Refines" value={submission.gear} />
        <Field title="Talents" value={submission.talents} />
        <Field title="Notes" value={submission.notes} />
      </div>

      {submission.image_paths?.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-black text-slate-300 mb-3">Screenshots</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {submission.image_paths.map((path) => (
              <a key={path} href={getSubmissionImageUrl(path)} target="_blank" rel="noopener noreferrer" className="group rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video">
                <img src={getSubmissionImageUrl(path)} alt="Build submission" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}

      <label className="block mt-5">
        <span className="text-sm font-bold text-slate-300">Review Notes</span>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" placeholder="Internal review notes" />
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        {(['reviewing', 'approved', 'rejected'] as const).map((status) => (
          <button key={status} onClick={() => setStatus(status)} disabled={!!busy} className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 hover:border-amber-500/40 hover:text-amber-400 transition-all disabled:opacity-60">
            {busy === status ? 'Saving...' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </Card>
  );
};

const EditModal = ({ editable, token, close, saved }: { editable: Editable; token: string; close: () => void; saved: () => void }) => {
  const [item, setItem] = useState<AdminBuildRow | AdminGuideRow | undefined>(editable?.item);
  const [busy, setBusy] = useState(false);

  useEffect(() => setItem(editable?.item), [editable]);
  if (!editable || !item) return null;

  const isBuild = editable.type === 'build';
  const update = (key: string, value: string) => setItem((current) => current ? ({ ...current, [key]: value } as AdminBuildRow | AdminGuideRow) : current);

  const save = async () => {
    setBusy(true);
    try {
      if (isBuild) await updateBuildBasic(token, item as AdminBuildRow);
      else await updateGuideBasic(token, item as AdminGuideRow);
      saved();
      close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" glow="amber">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-100">Edit {isBuild ? 'Build' : 'Guide'}</h3>
          <button onClick={close} className="text-slate-400 hover:text-red-400 text-xl">✕</button>
        </div>
        <div className="space-y-4">
          <AdminInput label="Title" value={item.title} onChange={(value) => update('title', value)} />
          {!isBuild && <AdminInput label="Subtitle" value={(item as AdminGuideRow).subtitle || ''} onChange={(value) => update('subtitle', value)} />}
          <AdminTextarea label="Description" value={item.description || ''} onChange={(value) => update('description', value)} />
          <AdminInput label="Author" value={item.author} onChange={(value) => update('author', value)} />
          {isBuild ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminSelect label="Tier" value={(item as AdminBuildRow).tier} onChange={(value) => update('tier', value)} options={['S', 'A', 'B', 'C']} />
              <AdminSelect label="Role" value={(item as AdminBuildRow).role || ''} onChange={(value) => update('role', value)} options={['', 'DPS', 'Healer', 'Tank']} />
            </div>
          ) : (
            <AdminInput label="Read Time" value={(item as AdminGuideRow).read_time || ''} onChange={(value) => update('read_time', value)} />
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={close} className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 font-bold text-slate-300 hover:border-slate-500 transition-all">Cancel</button>
          <button onClick={save} disabled={busy} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-black text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-60">{busy ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </Card>
    </div>
  );
};

const AdminInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" /></label>
);

const AdminTextarea = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" /></label>
);

const AdminSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500">{options.map((option) => <option key={option} value={option}>{option || 'None'}</option>)}</select></label>
);

const Stat = ({ label, value }: { label: string; value: number }) => (
  <Card className="px-4 py-3 text-center" glow="amber"><div className="text-2xl font-black text-amber-400">{value}</div><div className="text-xs text-slate-500 uppercase font-bold">{label}</div></Card>
);

const Table = <T extends { id: string }>({ rows, columns, render, edit, url }: { rows: T[]; columns: string[]; render: (row: T) => string[]; edit: (row: T) => void; url: (row: T) => string }) => (
  <Card className="overflow-hidden" glow="amber">
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-950/70 text-slate-400"><tr>{columns.map((column) => <th key={column} className="px-4 py-3 text-left font-black uppercase tracking-wide text-xs">{column}</th>)}<th className="px-4 py-3 text-right font-black uppercase tracking-wide text-xs">Actions</th></tr></thead><tbody className="divide-y divide-slate-800">{rows.map((row) => <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">{render(row).map((value, index) => <td key={index} className="px-4 py-3 text-slate-300 max-w-xs truncate">{value}</td>)}<td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><Link to={url(row)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all">View</Link><button onClick={() => edit(row)} className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all">Edit</button></div></td></tr>)}</tbody></table></div>
  </Card>
);

export const AdminPanel = () => {
  const [session, setSession] = useState<AdminSession | null>(() => getStoredAdminSession());
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [tab, setTab] = useState<Tab>('submissions');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState<Editable>(null);

  const load = async (current = session) => {
    if (!current) return;
    setLoading(true);
    setError(null);
    try {
      setData(await getAdminDashboard(current.token));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Admin session failed.');
      clearAdminSession();
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session) load(session); }, [session]);

  const filteredBuilds = useMemo(() => (data?.builds || []).filter((build) => [build.title, build.author, build.hero_class, build.spec || ''].join(' ').toLowerCase().includes(query.toLowerCase())), [data, query]);
  const filteredGuides = useMemo(() => (data?.guides || []).filter((guide) => [guide.title, guide.author, guide.category, guide.subcategory].join(' ').toLowerCase().includes(query.toLowerCase())), [data, query]);

  const logout = async () => {
    if (session) await adminLogout(session.token);
    setSession(null);
    setData(null);
  };

  if (!session) return <Login onLogin={setSession} />;

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Review submissions and edit published content" gradient="amber" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="grid grid-cols-3 gap-3"><Stat label="Open" value={data?.submissions.length || 0} /><Stat label="Builds" value={data?.builds.length || 0} /><Stat label="Guides" value={data?.guides.length || 0} /></div>
          <div className="flex flex-wrap gap-3"><button onClick={() => load()} className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 font-bold text-slate-200 hover:border-amber-500/40 hover:text-amber-400 transition-all">Refresh</button><button onClick={logout} className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 font-bold text-red-300 hover:bg-red-500/20 transition-all">Logout</button></div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">{(['submissions', 'builds', 'guides'] as Tab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-4 py-2 font-black capitalize transition-all ${tab === item ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400'}`}>{item}</button>)}</div>
          {tab !== 'submissions' && <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." className="w-full md:w-80 rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" />}
        </div>

        {loading && <div className="py-16 text-center text-slate-400">Loading admin data...</div>}
        {error && <Card className="p-6 text-red-300" glow="red">{error}</Card>}

        {!loading && !error && tab === 'submissions' && <div className="space-y-4">{(data?.submissions || []).length > 0 ? data!.submissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} token={session.token} reload={() => load()} />) : <Card className="p-10 text-center" glow="green"><div className="text-5xl mb-4">✅</div><h3 className="text-xl font-black text-slate-100">No open submissions</h3><p className="text-slate-500 mt-2">New community builds will appear here.</p></Card>}</div>}
        {!loading && !error && tab === 'builds' && <Table rows={filteredBuilds} columns={['Class', 'Spec', 'Title', 'Author', 'Tier', 'Role']} render={(build) => [build.hero_class, build.spec || '—', build.title, build.author, build.tier, build.role || '—']} edit={(build) => setEditable({ type: 'build', item: build })} url={(build) => `/builds/detail/${build.id}`} />}
        {!loading && !error && tab === 'guides' && <Table rows={filteredGuides} columns={['Category', 'Subcategory', 'Title', 'Author', 'Read Time']} render={(guide) => [guide.category, guide.subcategory, guide.title, guide.author, guide.read_time || '—']} edit={(guide) => setEditable({ type: 'guide', item: guide })} url={(guide) => `/guides/detail/${guide.id}`} />}
      </div>
      <EditModal editable={editable} token={session.token} close={() => setEditable(null)} saved={() => load()} />
    </div>
  );
};

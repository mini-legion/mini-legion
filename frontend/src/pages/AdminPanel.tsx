import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge } from '../components/UI';
import { adminLogin, adminLogout, clearAdminSession, getAdminDashboard, getStoredAdminSession, updateBuildBasic, updateBuildEditRequestStatus, updateGuideBasic, updateSubmissionStatus, type AdminBuildEditRequest, type AdminBuildRow, type AdminBuildSubmission, type AdminDashboardData, type AdminGuideRow, type AdminSession } from '../lib/admin';

type Tab = 'submissions' | 'editRequests' | 'builds' | 'guides';
type EditItem = { type: 'build'; item: AdminBuildRow } | { type: 'guide'; item: AdminGuideRow } | null;

const statusClass: Record<string, string> = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  reviewing: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  approved: 'border-green-500/30 bg-green-500/10 text-green-300',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const Login = ({ onLogin }: { onLogin: (session: AdminSession) => void }) => {
  const [username, setUsername] = useState('Vegetarox');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try { onLogin(await adminLogin(username.trim(), password)); } catch { setError('Login failed.'); } finally { setBusy(false); }
  };

  return <div><PageHeader title="Admin Login" subtitle="Private Mini Legion Guide management area" gradient="amber" /><div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-16"><Card className="p-6" glow="amber"><form onSubmit={submit} className="space-y-4"><label className="block"><span className="text-sm font-bold text-slate-300">Username</span><input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" /></label><label className="block"><span className="text-sm font-bold text-slate-300">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" /></label>{error && <p className="text-sm font-bold text-red-300">{error}</p>}<button disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-black text-slate-950 disabled:opacity-60">{busy ? 'Logging in...' : 'Login'}</button></form></Card></div></div>;
};

const Stat = ({ label, value }: { label: string; value: number }) => <Card className="px-4 py-3 text-center" glow="amber"><div className="text-2xl font-black text-amber-400">{value}</div><div className="text-xs text-slate-500 uppercase font-bold">{label}</div></Card>;

const ActionButtons = ({ busy, action }: { busy: string | null; action: (status: 'reviewing' | 'approved' | 'rejected') => void }) => <div className="mt-4 flex flex-wrap gap-2">{(['reviewing', 'approved', 'rejected'] as const).map((status) => <button key={status} disabled={!!busy} onClick={() => action(status)} className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-60">{busy === status ? 'Saving...' : status}</button>)}</div>;

const SubmissionItem = ({ item, token, reload }: { item: AdminBuildSubmission; token: string; reload: () => void }) => {
  const [notes, setNotes] = useState(item.review_notes || '');
  const [busy, setBusy] = useState<string | null>(null);
  const action = async (status: 'reviewing' | 'approved' | 'rejected') => { setBusy(status); try { await updateSubmissionStatus(token, item.id, status, notes || null); reload(); } finally { setBusy(null); } };
  return <Card className="p-5" glow="amber"><div className="flex flex-wrap gap-2 mb-2"><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusClass[item.status]}`}>{item.status}</span><Badge variant="info" size="sm">{item.hero_class}</Badge>{item.spec && <Badge variant="info" size="sm">{item.spec}</Badge>}</div><h3 className="text-xl font-black text-slate-100">{item.title}</h3><p className="text-sm text-amber-400 mt-1">By {item.contributor_name}</p><p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{item.description || '—'}</p><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-4 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100" placeholder="Review notes" /><ActionButtons busy={busy} action={action} /></Card>;
};

const EditRequestItem = ({ item, token, reload }: { item: AdminBuildEditRequest; token: string; reload: () => void }) => {
  const [notes, setNotes] = useState(item.review_notes || '');
  const [busy, setBusy] = useState<string | null>(null);
  const action = async (status: 'reviewing' | 'approved' | 'rejected') => { setBusy(status); try { await updateBuildEditRequestStatus(token, item.id, status, notes || null); reload(); } finally { setBusy(null); } };
  return <Card className="p-5" glow="blue"><div className="flex flex-wrap gap-2 mb-2"><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusClass[item.status]}`}>{item.status}</span><Badge variant="info" size="sm">{item.hero_class}</Badge>{item.current_spec && <Badge variant="info" size="sm">{item.current_spec}</Badge>}</div><h3 className="text-xl font-black text-slate-100">{item.current_title}</h3><p className="text-sm text-amber-400 mt-1">Requested by {item.author}</p><Link to={`/builds/detail/${item.build_id}`} className="mt-2 inline-block text-sm font-bold text-green-300">Open build →</Link><div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-950/50 border border-slate-800 p-3"><b>New title:</b><br />{item.proposed_title || '—'}</div><div className="rounded-xl bg-slate-950/50 border border-slate-800 p-3"><b>New spec:</b><br />{item.proposed_spec || '—'}</div><div className="rounded-xl bg-slate-950/50 border border-slate-800 p-3 lg:col-span-2 whitespace-pre-wrap"><b>Description:</b><br />{item.proposed_description || '—'}</div><div className="rounded-xl bg-slate-950/50 border border-slate-800 p-3 lg:col-span-2 whitespace-pre-wrap"><b>Creator note:</b><br />{item.request_notes || '—'}</div></div><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-4 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100" placeholder="Visible review notes" /><ActionButtons busy={busy} action={action} /></Card>;
};

const EditModal = ({ editable, token, close, saved }: { editable: EditItem; token: string; close: () => void; saved: () => void }) => {
  const [item, setItem] = useState<AdminBuildRow | AdminGuideRow | undefined>(editable?.item);
  const [busy, setBusy] = useState(false);
  useEffect(() => setItem(editable?.item), [editable]);
  if (!editable || !item) return null;
  const isBuild = editable.type === 'build';
  const update = (key: string, value: string) => setItem((current) => current ? ({ ...current, [key]: value } as AdminBuildRow | AdminGuideRow) : current);
  const save = async () => { setBusy(true); try { if (isBuild) await updateBuildBasic(token, item as AdminBuildRow); else await updateGuideBasic(token, item as AdminGuideRow); saved(); close(); } finally { setBusy(false); } };
  return <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"><Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" glow="amber"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-black text-slate-100">Edit {isBuild ? 'Build' : 'Guide'}</h3><button onClick={close} className="text-slate-400 hover:text-red-400 text-xl">✕</button></div><div className="space-y-4"><input value={item.title} onChange={(e) => update('title', e.target.value)} className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100" /><textarea value={item.description || ''} onChange={(e) => update('description', e.target.value)} rows={5} className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100" /><input value={item.author} onChange={(e) => update('author', e.target.value)} className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100" /></div><div className="mt-6 flex justify-end gap-3"><button onClick={close} className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 font-bold text-slate-300">Cancel</button><button onClick={save} disabled={busy} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-black text-slate-950 disabled:opacity-60">{busy ? 'Saving...' : 'Save Changes'}</button></div></Card></div>;
};

export const AdminPanel = () => {
  const [session, setSession] = useState<AdminSession | null>(() => getStoredAdminSession());
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [tab, setTab] = useState<Tab>('submissions');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState<EditItem>(null);

  const load = async (current = session) => { if (!current) return; setLoading(true); setError(null); try { setData(await getAdminDashboard(current.token)); } catch (err) { setError(err instanceof Error ? err.message : 'Admin session failed.'); clearAdminSession(); setSession(null); } finally { setLoading(false); } };
  useEffect(() => { if (session) load(session); }, [session]);
  const filteredBuilds = useMemo(() => (data?.builds || []).filter((b) => [b.title, b.author, b.hero_class, b.spec || ''].join(' ').toLowerCase().includes(query.toLowerCase())), [data, query]);
  const filteredGuides = useMemo(() => (data?.guides || []).filter((g) => [g.title, g.author, g.category, g.subcategory].join(' ').toLowerCase().includes(query.toLowerCase())), [data, query]);
  const logout = async () => { if (session) await adminLogout(session.token); setSession(null); setData(null); };
  if (!session) return <Login onLogin={setSession} />;

  return <div><PageHeader title="Admin Dashboard" subtitle="Review submissions and edit published content" gradient="amber" /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"><div className="grid grid-cols-2 lg:grid-cols-4 gap-3"><Stat label="Open" value={data?.submissions.length || 0} /><Stat label="Edits" value={data?.editRequests.length || 0} /><Stat label="Builds" value={data?.builds.length || 0} /><Stat label="Guides" value={data?.guides.length || 0} /></div><div className="flex flex-wrap gap-3"><button onClick={() => load()} className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 font-bold text-slate-200">Refresh</button><button onClick={logout} className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 font-bold text-red-300">Logout</button></div></div><div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div className="flex flex-wrap gap-2">{(['submissions', 'editRequests', 'builds', 'guides'] as Tab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-4 py-2 font-black capitalize ${tab === item ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>{item === 'editRequests' ? 'Edit Requests' : item}</button>)}</div>{(tab === 'builds' || tab === 'guides') && <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full md:w-80 rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100" />}</div>{loading && <div className="py-16 text-center text-slate-400">Loading admin data...</div>}{error && <Card className="p-6 text-red-300" glow="red">{error}</Card>}{!loading && !error && tab === 'submissions' && <div className="space-y-4">{(data?.submissions || []).length > 0 ? data!.submissions.map((item) => <SubmissionItem key={item.id} item={item} token={session.token} reload={() => load()} />) : <Card className="p-10 text-center" glow="green">No open submissions</Card>}</div>}{!loading && !error && tab === 'editRequests' && <div className="space-y-4">{(data?.editRequests || []).length > 0 ? data!.editRequests.map((item) => <EditRequestItem key={item.id} item={item} token={session.token} reload={() => load()} />) : <Card className="p-10 text-center" glow="green">No open edit requests</Card>}</div>}{!loading && !error && tab === 'builds' && <SimpleTable rows={filteredBuilds} render={(b) => [b.hero_class, b.spec || '—', b.title, b.author]} edit={(b) => setEditable({ type: 'build', item: b })} url={(b) => `/builds/detail/${b.id}`} />}{!loading && !error && tab === 'guides' && <SimpleTable rows={filteredGuides} render={(g) => [g.category, g.subcategory, g.title, g.author]} edit={(g) => setEditable({ type: 'guide', item: g })} url={(g) => `/guides/detail/${g.id}`} />}</div><EditModal editable={editable} token={session.token} close={() => setEditable(null)} saved={() => load()} /></div>;
};

const SimpleTable = <T extends { id: string }>({ rows, render, edit, url }: { rows: T[]; render: (row: T) => string[]; edit: (row: T) => void; url: (row: T) => string }) => <Card className="overflow-hidden" glow="amber"><div className="overflow-x-auto"><table className="w-full text-sm"><tbody className="divide-y divide-slate-800">{rows.map((row) => <tr key={row.id} className="hover:bg-slate-800/30">{render(row).map((value, index) => <td key={index} className="px-4 py-3 text-slate-300 max-w-xs truncate">{value}</td>)}<td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><Link to={url(row)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300">View</Link><button onClick={() => edit(row)} className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300">Edit</button></div></td></tr>)}</tbody></table></div></Card>;

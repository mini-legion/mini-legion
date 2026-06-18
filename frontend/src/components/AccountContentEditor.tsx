import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from './UI';
import { AdminBuildImageEditor } from './AdminBuildImageEditor';
import { getSubmissionImageUrl, type AdminBuildImages, type AdminBuildRow, type AdminBuildSubmission, type AdminGuideRow } from '../lib/admin';
import { getSiteEditorDashboard, saveSiteEditorBuild, saveSiteEditorGuide, setSiteEditorSubmissionStatus } from '../lib/siteEditor';

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

const AdminInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" /></label>
);

const AdminTextarea = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" /></label>
);

const AdminSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) => (
  <label className="block"><span className="text-sm font-bold text-slate-300">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500">{options.map((option) => <option key={option} value={option}>{option || 'None'}</option>)}</select></label>
);

const EditModal = ({ editable, close, saved }: { editable: Editable; close: () => void; saved: () => void }) => {
  const [item, setItem] = useState<AdminBuildRow | AdminGuideRow | undefined>(editable?.item);
  const [busy, setBusy] = useState(false);

  useEffect(() => setItem(editable?.item), [editable]);
  if (!editable || !item) return null;

  const isBuild = editable.type === 'build';
  const update = (key: string, value: string) => setItem((current) => current ? ({ ...current, [key]: value } as AdminBuildRow | AdminGuideRow) : current);
  const updateImages = (images: AdminBuildImages, image: string | null) => {
    setItem((current) => current ? ({ ...(current as AdminBuildRow), images, image } as AdminBuildRow) : current);
  };

  const save = async () => {
    setBusy(true);
    try {
      if (isBuild) {
        await saveSiteEditorBuild(item as AdminBuildRow);
      } else {
        await saveSiteEditorGuide(item as AdminGuideRow);
      }
      saved();
      close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6" glow="amber">
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminSelect label="Tier" value={(item as AdminBuildRow).tier} onChange={(value) => update('tier', value)} options={['S', 'A', 'B', 'C']} />
                <AdminSelect label="Role" value={(item as AdminBuildRow).role || ''} onChange={(value) => update('role', value)} options={['', 'DPS', 'Healer', 'Tank']} />
              </div>
              <AdminBuildImageEditor build={item as AdminBuildRow} onChange={updateImages} />
            </>
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

const SubmissionCard = ({ submission, reload }: { submission: AdminBuildSubmission; reload: () => void }) => {
  const [notes, setNotes] = useState(submission.review_notes || '');
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (status: 'reviewing' | 'approved' | 'rejected') => {
    setBusy(status);
    try {
      await setSiteEditorSubmissionStatus(submission.id, status, notes || null);
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
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" placeholder="Review notes" />
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

export const AccountContentEditor = () => {
  const [tab, setTab] = useState<Tab>('submissions');
  const [data, setData] = useState<{ builds: AdminBuildRow[]; guides: AdminGuideRow[]; submissions: AdminBuildSubmission[] }>({ builds: [], guides: [], submissions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState<Editable>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getSiteEditorDashboard());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load editor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredBuilds = useMemo(() => data.builds.filter((item) => `${item.title} ${item.author} ${item.hero_class}`.toLowerCase().includes(query.toLowerCase())), [data.builds, query]);
  const filteredGuides = useMemo(() => data.guides.filter((item) => `${item.title} ${item.author} ${item.subcategory}`.toLowerCase().includes(query.toLowerCase())), [data.guides, query]);

  return (
    <Card className="p-6" glow="amber">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-100">Admin Content Editor</h2>
          <p className="text-sm text-slate-400 mt-1">Visible account-based editor for builds, guides and submissions.</p>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." className="w-full lg:w-72 rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {([
          ['submissions', `Submissions (${data.submissions.length})`],
          ['builds', `Builds (${data.builds.length})`],
          ['guides', `Guides (${data.guides.length})`],
        ] as [Tab, string][]).map(([nextTab, label]) => (
          <button key={nextTab} onClick={() => setTab(nextTab)} className={`rounded-xl px-4 py-2 text-sm font-black border transition-all ${tab === nextTab ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-amber-300 hover:border-amber-500/40'}`}>
            {label}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-semibold">{error}</div>}
      {loading ? (
        <div className="py-10 text-center text-slate-500">Loading editor...</div>
      ) : (
        <div className="space-y-4">
          {tab === 'submissions' && data.submissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} reload={load} />)}

          {tab === 'builds' && filteredBuilds.map((build) => (
            <div key={build.id} className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 mb-2"><Badge variant="info" size="sm">{build.hero_class}</Badge>{build.role && <Badge variant="success" size="sm">{build.role}</Badge>}<Badge variant="default" size="sm">Tier {build.tier}</Badge></div>
                <h3 className="font-black text-slate-100">{build.title}</h3>
                <p className="text-sm text-slate-500">By {build.author}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/builds/detail/${build.id}`} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:text-green-300">Open</Link>
                <button onClick={() => setEditable({ type: 'build', item: build })} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:text-amber-300">Edit</button>
              </div>
            </div>
          ))}

          {tab === 'guides' && filteredGuides.map((guide) => (
            <div key={guide.id} className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 mb-2"><Badge variant="info" size="sm">{guide.subcategory}</Badge><span className="text-xs text-slate-500">{guide.read_time}</span></div>
                <h3 className="font-black text-slate-100">{guide.title}</h3>
                <p className="text-sm text-slate-500">By {guide.author}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/guides/detail/${guide.id}`} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:text-green-300">Open</Link>
                <button onClick={() => setEditable({ type: 'guide', item: guide })} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:text-amber-300">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditModal editable={editable} close={() => setEditable(null)} saved={load} />
    </Card>
  );
};

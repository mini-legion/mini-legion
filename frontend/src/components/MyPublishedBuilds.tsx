import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from './UI';
import { getMyBuildEditRequests, getMyPublishedBuilds, submitBuildEditRequest, type CreatorBuild, type CreatorBuildEditRequest } from '../lib/buildEdits';

const styles: Record<string, string> = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  reviewing: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  approved: 'border-green-500/30 bg-green-500/10 text-green-300',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const sectionText = (build: CreatorBuild) => {
  const sections = (build as CreatorBuild & { sections?: Array<{ title?: string; content?: string }> }).sections || [];
  return sections.map((section) => `${section.title || 'Section'}\n${section.content || ''}`).join('\n\n');
};

export const MyPublishedBuilds = () => {
  const [builds, setBuilds] = useState<CreatorBuild[]>([]);
  const [requests, setRequests] = useState<CreatorBuildEditRequest[]>([]);
  const [editing, setEditing] = useState<CreatorBuild | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spec, setSpec] = useState('');
  const [contentTypes, setContentTypes] = useState('');
  const [introText, setIntroText] = useState('');
  const [talentTips, setTalentTips] = useState('');
  const [accessories, setAccessories] = useState('');
  const [gear, setGear] = useState('');
  const [runeSetup, setRuneSetup] = useState('');
  const [rotation, setRotation] = useState('');
  const [refines, setRefines] = useState('');
  const [extra, setExtra] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextBuilds, nextRequests] = await Promise.all([getMyPublishedBuilds(), getMyBuildEditRequests()]);
      setBuilds(nextBuilds);
      setRequests(nextRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load published builds.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const latestRequest = (buildId: string) => requests.find((request) => request.build_id === buildId);

  const openEdit = (build: CreatorBuild) => {
    setEditing(build);
    setTitle(build.title || '');
    setDescription(build.description || '');
    setSpec(build.spec || '');
    setContentTypes((build.content_type || []).join(', '));
    setIntroText(build.intro_text || '');
    setTalentTips(build.talent_tips || '');
    setAccessories('');
    setGear('');
    setRuneSetup('');
    setRotation('');
    setRefines('');
    setExtra(sectionText(build));
    setNotes('');
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);

    const details = [
      accessories.trim() ? `Accessories\n${accessories.trim()}` : '',
      gear.trim() ? `Gear\n${gear.trim()}` : '',
      runeSetup.trim() ? `Runes\n${runeSetup.trim()}` : '',
      rotation.trim() ? `Rotation / Skills\n${rotation.trim()}` : '',
      refines.trim() ? `Refines / Stats\n${refines.trim()}` : '',
      extra.trim() ? `Extra Notes\n${extra.trim()}` : '',
    ].filter(Boolean).join('\n\n');

    const adminNote = [notes.trim(), details ? `Requested build detail changes:\n${details}` : ''].filter(Boolean).join('\n\n');
    const liveTips = [talentTips.trim(), details].filter(Boolean).join('\n\n');

    try {
      await submitBuildEditRequest({
        build_id: editing.id,
        request_notes: adminNote || null,
        proposed_title: title.trim(),
        proposed_description: description.trim() || null,
        proposed_spec: spec.trim() || null,
        proposed_role: editing.role || null,
        proposed_content_type: contentTypes.split(',').map((item) => item.trim()).filter(Boolean),
        proposed_intro_text: introText.trim() || null,
        proposed_talent_tips: liveTips || null,
        proposed_image: editing.image || null,
        proposed_images: editing.images || {},
        proposed_details: details || null,
      } as any);
      setEditing(null);
      setMessage('Edit request sent. Admin approval is required before it goes live.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send edit request.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6" glow="green">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5"><div><h2 className="text-xl font-black text-slate-100">My Published Builds</h2><p className="text-sm text-slate-400 mt-1">Edit your approved builds. Admin approval is required before changes go live.</p></div><Link to="/builds/submit" className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 text-center">Submit Build</Link></div>
      {message && <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm font-semibold">{message}</div>}
      {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-semibold">{error}</div>}
      {loading ? <div className="py-10 text-center text-slate-500">Loading published builds...</div> : builds.length === 0 ? <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center"><div className="text-4xl mb-3">⚔️</div><p className="text-slate-400">No published builds linked to your account yet.</p></div> : <div className="space-y-4">{builds.map((build) => { const request = latestRequest(build.id); const open = request && ['pending', 'reviewing'].includes(request.status); return <div key={build.id} className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4"><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3"><div><div className="flex flex-wrap gap-2 mb-2"><Badge variant="info" size="sm">{build.hero_class}</Badge>{build.spec && <Badge variant="info" size="sm">{build.spec}</Badge>}{request && <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${styles[request.status]}`}>edit {request.status}</span>}</div><h3 className="text-lg font-black text-slate-100">{build.title}</h3><p className="text-sm text-slate-400 mt-1 line-clamp-2">{build.description || 'No description'}</p>{request?.review_notes && <p className="mt-2 text-sm text-amber-300">Admin note: {request.review_notes}</p>}</div><div className="flex flex-col sm:flex-row gap-2 shrink-0"><Link to={`/builds/detail/${build.id}`} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:text-green-300 text-center">Open</Link><button type="button" disabled={open} onClick={() => openEdit(build)} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:text-amber-300 disabled:opacity-50">{open ? 'Review Pending' : 'Edit Build'}</button></div></div></div>; })}</div>}
      {editing && <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3"><h3 className="text-lg font-black text-slate-100">Editing: {editing.title}</h3><input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Title" /><input value={spec} onChange={(event) => setSpec(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Spec" /><input value={contentTypes} onChange={(event) => setContentTypes(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Content types, comma separated" /><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Short description" /><textarea value={introText} onChange={(event) => setIntroText(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Intro text" /><textarea value={accessories} onChange={(event) => setAccessories(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Accessories / necklace / trinkets" /><textarea value={gear} onChange={(event) => setGear(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Gear" /><textarea value={runeSetup} onChange={(event) => setRuneSetup(event.target.value)} rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Runes" /><textarea value={rotation} onChange={(event) => setRotation(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Rotation / skills" /><textarea value={refines} onChange={(event) => setRefines(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Refines / stats" /><textarea value={talentTips} onChange={(event) => setTalentTips(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Talent tips" /><textarea value={extra} onChange={(event) => setExtra(event.target.value)} rows={5} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Extra notes / full build notes" /><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Note for admin" /><div className="flex justify-end gap-2"><button onClick={() => setEditing(null)} className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-bold text-slate-300">Cancel</button><button onClick={save} disabled={saving} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-black text-slate-950 disabled:opacity-60">{saving ? 'Sending...' : 'Send for Review'}</button></div></div>}
    </Card>
  );
};

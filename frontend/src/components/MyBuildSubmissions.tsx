import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './UI';
import {
  getMyBuildSubmissions,
  updateMyBuildSubmission,
  type EditableBuildSubmissionFields,
  type MyBuildSubmission,
} from '../lib/submissions';

const statusStyles: Record<MyBuildSubmission['status'], string> = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  reviewing: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  approved: 'border-green-500/30 bg-green-500/10 text-green-300',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const editableStatuses = ['pending', 'reviewing'];

const toEditableFields = (submission: MyBuildSubmission): EditableBuildSubmissionFields => ({
  contributor_name: submission.contributor_name || '',
  contact: submission.contact || '',
  spec: submission.spec || '',
  role: submission.role || null,
  content_type: submission.content_type || ['PvE'],
  title: submission.title || '',
  description: submission.description || '',
  runes: submission.runes || '',
  rotation: submission.rotation || '',
  gear: submission.gear || '',
  talents: submission.talents || '',
  notes: submission.notes || '',
});

export const MyBuildSubmissions = () => {
  const [submissions, setSubmissions] = useState<MyBuildSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableBuildSubmissionFields | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      setSubmissions(await getMyBuildSubmissions());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const startEdit = (submission: MyBuildSubmission) => {
    setActiveId(submission.id);
    setDraft(toEditableFields(submission));
    setMessage(null);
    setError(null);
  };

  const updateDraft = (field: keyof EditableBuildSubmissionFields, value: string | string[] | null) => {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  };

  const saveDraft = async () => {
    if (!activeId || !draft) return;
    if (!draft.title.trim() || !String(draft.description || '').trim()) {
      setError('Title and description are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await updateMyBuildSubmission(activeId, {
        ...draft,
        contributor_name: draft.contributor_name.trim(),
        contact: draft.contact?.trim() || null,
        spec: draft.spec?.trim() || null,
        description: draft.description?.trim() || null,
        runes: draft.runes?.trim() || null,
        rotation: draft.rotation?.trim() || null,
        gear: draft.gear?.trim() || null,
        talents: draft.talents?.trim() || null,
        notes: draft.notes?.trim() || null,
        title: draft.title.trim(),
      });

      setSubmissions((current) => current.map((item) => item.id === updated.id ? updated : item));
      setActiveId(null);
      setDraft(null);
      setMessage('Submission updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update submission.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6" glow="blue">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-black text-slate-100">My Build Submissions</h2>
          <p className="text-sm text-slate-400 mt-1">Edit pending or reviewing submissions before they are published.</p>
        </div>
        <Link to="/builds/submit" className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 text-center">
          Submit Build
        </Link>
      </div>

      {message && <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm font-semibold">{message}</div>}
      {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-semibold">{error}</div>}

      {loading ? (
        <div className="py-10 text-center text-slate-500">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center">
          <div className="text-4xl mb-3">📤</div>
          <p className="text-slate-400">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const isEditing = activeId === submission.id && draft;
            const canEdit = editableStatuses.includes(submission.status);

            return (
              <div key={submission.id} className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusStyles[submission.status]}`}>
                        {submission.status}
                      </span>
                      <span className="text-xs text-slate-500">{new Date(submission.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-100">{submission.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{submission.hero_class} {submission.spec ? `• ${submission.spec}` : ''} {submission.role ? `• ${submission.role}` : ''}</p>
                    {submission.review_notes && <p className="mt-2 text-sm text-amber-300">Review: {submission.review_notes}</p>}
                    {submission.approved_build_id && (
                      <Link to={`/builds/detail/${submission.approved_build_id}`} className="mt-2 inline-block text-sm font-bold text-green-300 hover:text-green-200">
                        Open published build →
                      </Link>
                    )}
                  </div>
                  {canEdit && !isEditing && (
                    <button type="button" onClick={() => startEdit(submission)} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:border-blue-500/40 hover:text-blue-300">
                      Edit
                    </button>
                  )}
                </div>

                {isEditing && draft && (
                  <div className="mt-5 grid grid-cols-1 gap-4">
                    <input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Build title" />
                    <textarea value={draft.description || ''} onChange={(event) => updateDraft('description', event.target.value)} rows={3} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Description" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={draft.spec || ''} onChange={(event) => updateDraft('spec', event.target.value)} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Spec" />
                      <select value={draft.role || ''} onChange={(event) => updateDraft('role', event.target.value || null)} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500">
                        <option value="">Role</option>
                        <option value="DPS">DPS</option>
                        <option value="Healer">Healer</option>
                        <option value="Tank">Tank</option>
                      </select>
                    </div>
                    <textarea value={draft.runes || ''} onChange={(event) => updateDraft('runes', event.target.value)} rows={3} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Runes" />
                    <textarea value={draft.rotation || ''} onChange={(event) => updateDraft('rotation', event.target.value)} rows={3} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Rotation / Autocast" />
                    <textarea value={draft.gear || ''} onChange={(event) => updateDraft('gear', event.target.value)} rows={3} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Gear / Refines" />
                    <textarea value={draft.talents || ''} onChange={(event) => updateDraft('talents', event.target.value)} rows={3} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Talents" />
                    <textarea value={draft.notes || ''} onChange={(event) => updateDraft('notes', event.target.value)} rows={3} className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-blue-500" placeholder="Notes" />
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <button type="button" onClick={() => { setActiveId(null); setDraft(null); }} className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-bold text-slate-300">Cancel</button>
                      <button type="button" disabled={saving} onClick={saveDraft} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 font-black text-slate-950 disabled:opacity-60">
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

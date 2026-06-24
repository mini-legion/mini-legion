import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from './UI';
import { updateBuildEditRequestStatus, type AdminBuildEditRequest } from '../lib/admin';

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

const EditRequestCard = ({ request, token, reload }: { request: AdminBuildEditRequest; token: string; reload: () => void }) => {
  const [notes, setNotes] = useState(request.review_notes || '');
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (status: 'reviewing' | 'approved' | 'rejected') => {
    setBusy(status);
    try {
      await updateBuildEditRequestStatus(token, request.id, status, notes || null);
      reload();
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card className="p-5" glow="blue">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-full border text-xs font-black uppercase ${statusClass[request.status]}`}>{request.status}</span>
            <Badge variant="info" size="sm">{request.hero_class}</Badge>
            {request.current_spec && <Badge variant="info" size="sm">{request.current_spec}</Badge>}
          </div>
          <h3 className="text-xl font-black text-slate-100">{request.current_title}</h3>
          <p className="text-sm text-amber-400 mt-1">Requested by {request.author}</p>
          <Link to={`/builds/detail/${request.build_id}`} className="mt-2 inline-block text-sm font-bold text-green-300 hover:text-green-200">Open build →</Link>
        </div>
        <div className="text-xs text-slate-500">{new Date(request.created_at).toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field title="New Title" value={request.proposed_title} />
        <Field title="New Spec" value={request.proposed_spec} />
        <Field title="New Description" value={request.proposed_description} />
        <Field title="New Talent Tips" value={request.proposed_talent_tips} />
        <Field title="Creator Note" value={request.request_notes} />
        <Field title="Content Types" value={(request.proposed_content_type || []).join(', ') || null} />
      </div>

      <label className="block mt-5">
        <span className="text-sm font-bold text-slate-300">Admin Review Notes</span>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-amber-500" placeholder="Visible to creator" />
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

export const AdminBuildEditRequests = ({ requests, token, reload }: { requests: AdminBuildEditRequest[]; token: string; reload: () => void }) => {
  if (requests.length === 0) {
    return <Card className="p-10 text-center" glow="green"><div className="text-5xl mb-4">✅</div><h3 className="text-xl font-black text-slate-100">No open edit requests</h3><p className="text-slate-500 mt-2">Creator edit requests will appear here.</p></Card>;
  }

  return <div className="space-y-4">{requests.map((request) => <EditRequestCard key={request.id} request={request} token={token} reload={reload} />)}</div>;
};

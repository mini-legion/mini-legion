import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card } from '../components/UI';
import { submitBuild, uploadBuildSubmissionImages } from '../lib/submissions';

const buildClassOptions = [
  { id: 'hunter', name: 'Hunter', icon: '🏹' },
  { id: 'priest', name: 'Priest', icon: '✨' },
  { id: 'mage', name: 'Mage', icon: '🔮' },
  { id: 'warrior', name: 'Warrior', icon: '🛡️' },
  { id: 'rogue', name: 'Rogue', icon: '🗡️' },
  { id: 'paladin', name: 'Paladin', icon: '⚜️' },
  { id: 'shaman', name: 'Shaman', icon: '🌩️' },
  { id: 'druid', name: 'Druid', icon: '🌿' },
];

const contentTypes = ['PvE', 'Raid', 'AFK', 'PvP', 'Beginner', 'Endgame'];
const roles = ['DPS', 'Healer', 'Tank'] as const;
const screenshotGroups = [
  { key: 'skills', label: 'Skills / Rotation', hint: 'Skill bar, autocast order, rotation screenshots.' },
  { key: 'runes', label: 'Runes', hint: 'Rune setup screenshots.' },
  { key: 'talents', label: 'Talent Tree', hint: 'Talent tree or path screenshots.' },
  { key: 'gear', label: 'Gear / Refines', hint: 'Gear, refine stats or equipment screenshots.' },
  { key: 'other', label: 'Other Proof / Notes', hint: 'Extra screenshots that do not fit above.' },
] as const;

type ScreenshotGroupKey = typeof screenshotGroups[number]['key'];
type ScreenshotFiles = Record<ScreenshotGroupKey, File[]>;

interface FormState {
  contributorName: string;
  contact: string;
  heroClass: string;
  spec: string;
  role: '' | 'DPS' | 'Healer' | 'Tank';
  contentType: string[];
  title: string;
  description: string;
  runes: string;
  rotation: string;
  gear: string;
  talents: string;
  notes: string;
}

const initialForm: FormState = {
  contributorName: '',
  contact: '',
  heroClass: 'hunter',
  spec: '',
  role: '',
  contentType: ['PvE'],
  title: '',
  description: '',
  runes: '',
  rotation: '',
  gear: '',
  talents: '',
  notes: '',
};

const emptyScreenshotFiles: ScreenshotFiles = {
  skills: [],
  runes: [],
  talents: [],
  gear: [],
  other: [],
};

export const BuildSubmit = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<ScreenshotFiles>(emptyScreenshotFiles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedClass = useMemo(
    () => buildClassOptions.find((item) => item.id === form.heroClass),
    [form.heroClass]
  );

  const totalFiles = useMemo(
    () => screenshotGroups.reduce((sum, group) => sum + files[group.key].length, 0),
    [files]
  );

  const updateField = (field: keyof FormState, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleContentType = (type: string) => {
    setForm((current) => {
      const exists = current.contentType.includes(type);
      return {
        ...current,
        contentType: exists
          ? current.contentType.filter((item) => item !== type)
          : [...current.contentType, type],
      };
    });
  };

  const handleFiles = (groupKey: ScreenshotGroupKey, selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const acceptedFiles = [...selectedFiles]
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 3);

    setFiles((current) => ({ ...current, [groupKey]: acceptedFiles }));
  };

  const uploadGroupedImages = async (submissionId: string) => {
    const imageGroups: Record<string, string[]> = {};
    const allPaths: string[] = [];

    for (const group of screenshotGroups) {
      const groupFiles = files[group.key];
      if (groupFiles.length === 0) continue;

      const paths = await uploadBuildSubmissionImages(submissionId, groupFiles, group.key);
      imageGroups[group.key] = paths;
      allPaths.push(...paths);
    }

    return { allPaths, imageGroups };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.contributorName.trim() || !form.title.trim() || !form.description.trim()) {
      setError('Please add your name, build title, and a short description.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionId = crypto.randomUUID();
      const { allPaths, imageGroups } = totalFiles > 0
        ? await uploadGroupedImages(submissionId)
        : { allPaths: [], imageGroups: {} };

      await submitBuild({
        id: submissionId,
        contributor_name: form.contributorName.trim(),
        contact: form.contact.trim() || null,
        hero_class: form.heroClass,
        spec: form.spec.trim() || null,
        role: form.role || null,
        content_type: form.contentType.length > 0 ? form.contentType : ['PvE'],
        title: form.title.trim(),
        description: form.description.trim(),
        runes: form.runes.trim() || null,
        rotation: form.rotation.trim() || null,
        gear: form.gear.trim() || null,
        talents: form.talents.trim() || null,
        notes: form.notes.trim() || null,
        image_paths: allPaths,
        image_groups: imageGroups,
      });

      setSuccess(true);
      setForm(initialForm);
      setFiles(emptyScreenshotFiles);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div>
        <PageHeader title="Build Submitted" subtitle="Your build is now waiting for review" gradient="green" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Card className="p-8 text-center" glow="green">
            <div className="text-6xl mb-5">✅</div>
            <h2 className="text-2xl font-black text-slate-100 mb-3">Submission received</h2>
            <p className="text-slate-400 mb-6">
              Thanks for helping the Mini Legion community. Your build will be reviewed before it appears on the site.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 font-black hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                Submit another build
              </button>
              <Link
                to="/ranking"
                className="px-6 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold border border-slate-700 hover:border-amber-500/40 hover:text-amber-400 transition-all"
              >
                View Ranking
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Submit Your Build"
        subtitle="Send your build, rotation, runes, talents, gear and screenshots for review"
        gradient="green"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="p-5 sm:p-8 mb-8" glow="amber">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-100 mb-2">Community build review</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Submitted builds are stored as pending entries first. After review, approved builds can be published and counted for the contributor ranking.
              </p>
            </div>
            <Link
              to="/ranking"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold hover:text-amber-400 hover:border-amber-500/40 transition-all"
            >
              🏆 Ranking
            </Link>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-semibold">
              {error}
            </div>
          )}

          <Card className="p-5 sm:p-6" glow="green">
            <h3 className="text-lg font-black text-slate-100 mb-5">Creator info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-300">Name / Creator Name *</span>
                <input
                  value={form.contributorName}
                  onChange={(event) => updateField('contributorName', event.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                  placeholder="Vegetarox"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-300">Discord / Contact</span>
                <input
                  value={form.contact}
                  onChange={(event) => updateField('contact', event.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                  placeholder="Discord, X, YouTube, etc."
                />
              </label>
            </div>
          </Card>

          <Card className="p-5 sm:p-6" glow="green">
            <h3 className="text-lg font-black text-slate-100 mb-5">Build basics</h3>

            <div className="mb-5">
              <span className="text-sm font-bold text-slate-300">Class *</span>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {buildClassOptions.map((item) => {
                  const active = form.heroClass === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateField('heroClass', item.id)}
                      className={`rounded-xl border px-3 py-3 text-left font-black transition-all ${
                        active
                          ? 'border-green-400 bg-green-500 text-slate-950 shadow-lg shadow-green-500/20'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-green-500/50 hover:text-green-300'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-300">Spec</span>
                <input
                  value={form.spec}
                  onChange={(event) => updateField('spec', event.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                  placeholder="e.g. Survival, Balance, Holy"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-300">Role</span>
                <select
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block mb-4">
              <span className="text-sm font-bold text-slate-300">Build Title *</span>
              <input
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                placeholder={`${selectedClass?.name || 'Class'} build title`}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">Short Explanation *</span>
              <textarea
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500"
                placeholder="Explain what this build is used for and why it works."
              />
            </label>

            <div className="mt-5">
              <span className="text-sm font-bold text-slate-300">Content Type</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {contentTypes.map((type) => {
                  const active = form.contentType.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleContentType(type)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        active
                          ? 'bg-green-500 text-slate-950 border-green-400'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-green-400 hover:border-green-500/50'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6" glow="green">
            <h3 className="text-lg font-black text-slate-100 mb-5">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block"><span className="text-sm font-bold text-slate-300">Runes</span><textarea value={form.runes} onChange={(event) => updateField('runes', event.target.value)} rows={5} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500" placeholder="List runes and why you use them." /></label>
              <label className="block"><span className="text-sm font-bold text-slate-300">Rotation / Autocast Order</span><textarea value={form.rotation} onChange={(event) => updateField('rotation', event.target.value)} rows={5} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500" placeholder="Skill order, rotation, autocast notes." /></label>
              <label className="block"><span className="text-sm font-bold text-slate-300">Gear / Refines</span><textarea value={form.gear} onChange={(event) => updateField('gear', event.target.value)} rows={5} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500" placeholder="Gear stats, refine priorities, recommended items." /></label>
              <label className="block"><span className="text-sm font-bold text-slate-300">Talents / Extra Notes</span><textarea value={form.talents} onChange={(event) => updateField('talents', event.target.value)} rows={5} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500" placeholder="Talent path, branch notes, alternatives." /></label>
            </div>
            <label className="block mt-4"><span className="text-sm font-bold text-slate-300">Additional Notes</span><textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={4} className="mt-2 w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-green-500" placeholder="Anything else reviewers should know." /></label>
          </Card>

          <Card className="p-5 sm:p-6" glow="blue">
            <h3 className="text-lg font-black text-slate-100 mb-3">Screenshots</h3>
            <p className="text-sm text-slate-400 mb-4">Upload screenshots in the matching box. This prevents skills, talent tree, runes and gear from being mixed up during review.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {screenshotGroups.map((group) => (
                <div key={group.key} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div><h4 className="text-sm font-black text-slate-200">{group.label}</h4><p className="text-xs text-slate-500 mt-1">{group.hint}</p></div>
                    <span className="shrink-0 rounded-full bg-slate-800 px-2 py-1 text-xs font-bold text-slate-400">{files[group.key].length}/3</span>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={(event) => handleFiles(group.key, event.target.files)} className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-green-500 file:px-3 file:py-2 file:font-black file:text-slate-950 hover:file:bg-green-400" />
                  {files[group.key].length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files[group.key].map((file) => (
                        <div key={`${group.key}-${file.name}-${file.size}`} className="rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2 text-xs text-slate-400 truncate">🖼️ {file.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Link to="/builds" className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold border border-slate-700 hover:border-slate-500 transition-all text-center">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 font-black hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Submit Build'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { supabase } from './supabase';

export interface BuildSubmissionPayload {
  id: string;
  user_id: string;
  contributor_name: string;
  contact?: string | null;
  hero_class: string;
  spec?: string | null;
  role?: 'DPS' | 'Healer' | 'Tank' | null;
  content_type: string[];
  title: string;
  description?: string | null;
  runes?: string | null;
  rotation?: string | null;
  gear?: string | null;
  talents?: string | null;
  notes?: string | null;
  image_paths: string[];
  image_groups?: Record<string, string[]>;
}

export interface ContributionRow {
  contributor_name: string;
  contribution_type: 'build' | 'guide' | 'update';
  title: string;
  points: number;
  published_url: string | null;
  created_at: string;
}

export interface ContributorRankingEntry {
  name: string;
  builds: number;
  guides: number;
  updates: number;
  points: number;
  latestContribution: string;
  latestUrl: string | null;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function sanitizeGroupName(groupName: string) {
  return groupName
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'general';
}

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('You must be logged in to submit builds.');
  return data.user.id;
}

export async function uploadBuildSubmissionImages(
  submissionId: string,
  files: File[],
  groupName = 'general'
) {
  const userId = await getCurrentUserId();
  const uploadedPaths: string[] = [];
  const safeGroup = sanitizeGroupName(groupName);

  for (const [index, file] of files.entries()) {
    const safeName = sanitizeFileName(file.name || `image-${index}.png`);
    const path = `${userId}/${submissionId}/${safeGroup}-${Date.now()}-${index}-${safeName}`;

    const { error } = await supabase.storage
      .from('build-submissions')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (error) throw error;
    uploadedPaths.push(path);
  }

  return uploadedPaths;
}

export async function submitBuild(payload: BuildSubmissionPayload) {
  const userId = await getCurrentUserId();

  if (payload.user_id !== userId) {
    throw new Error('Submission account mismatch. Please refresh and try again.');
  }

  const { error } = await (supabase as any)
    .from('build_submissions')
    .insert({
      ...payload,
      status: 'pending',
    });

  if (error) throw error;
}

export async function getContributorRankings(): Promise<ContributorRankingEntry[]> {
  const { data, error } = await (supabase as any)
    .from('content_contributions')
    .select('contributor_name, contribution_type, title, points, published_url, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = (data || []) as ContributionRow[];
  const grouped = new Map<string, ContributorRankingEntry>();

  rows.forEach((row) => {
    const name = row.contributor_name || 'Unknown';
    const current = grouped.get(name) || {
      name,
      builds: 0,
      guides: 0,
      updates: 0,
      points: 0,
      latestContribution: row.title,
      latestUrl: row.published_url,
    };

    if (row.contribution_type === 'build') current.builds += 1;
    if (row.contribution_type === 'guide') current.guides += 1;
    if (row.contribution_type === 'update') current.updates += 1;

    current.points += row.points || 0;

    grouped.set(name, current);
  });

  return [...grouped.values()]
    .sort((a, b) => b.points - a.points || b.builds + b.guides - (a.builds + a.guides))
    .slice(0, 10);
}

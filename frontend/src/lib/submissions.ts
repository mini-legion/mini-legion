export interface BuildSubmissionPayload {
  id?: string;
  user_id?: string;
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

export interface MyBuildSubmission extends Omit<BuildSubmissionPayload, 'id'> {
  id: string;
  user_id: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  review_notes?: string | null;
  approved_build_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type EditableBuildSubmissionFields = Pick<
  BuildSubmissionPayload,
  'contributor_name' | 'contact' | 'spec' | 'role' | 'content_type' | 'title' | 'description' | 'runes' | 'rotation' | 'gear' | 'talents' | 'notes'
>;

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

const COMMUNITY_ENDPOINT = '/api/community';

async function communityRequest<T>(action: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${COMMUNITY_ENDPOINT}?action=${encodeURIComponent(action)}`, {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({ error: 'Community service returned an invalid response.' })) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || 'Community request failed.');
  return data;
}

export async function uploadBuildSubmissionImages(
  _submissionId: string,
  files: File[],
  _groupName = 'general'
) {
  if (files.length > 0) {
    throw new Error('Screenshot uploads are being moved to Cloudflare storage. Please submit the text build without screenshots for now.');
  }
  return [] as string[];
}

export async function submitBuild(payload: BuildSubmissionPayload) {
  await communityRequest<{ submission: MyBuildSubmission }>('submit-build', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMyBuildSubmissions(): Promise<MyBuildSubmission[]> {
  const data = await communityRequest<{ submissions: MyBuildSubmission[] }>('my-submissions');
  return data.submissions || [];
}

export async function updateMyBuildSubmission(
  submissionId: string,
  updates: EditableBuildSubmissionFields
): Promise<MyBuildSubmission> {
  const data = await communityRequest<{ submission: MyBuildSubmission }>('update-submission', {
    method: 'POST',
    body: JSON.stringify({ id: submissionId, ...updates }),
  });
  return data.submission;
}

export async function getContributorRankings(): Promise<ContributorRankingEntry[]> {
  const data = await communityRequest<{ rankings: ContributorRankingEntry[] }>('rankings');
  return data.rankings || [];
}

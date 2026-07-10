import { getBuilds } from './api';

export type BuildRole = 'DPS' | 'Healer' | 'Tank' | null;
export type EditRequestStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface CreatorBuild {
  id: string;
  title: string;
  description: string | null;
  hero_class: string;
  spec: string | null;
  role: BuildRole;
  content_type: string[];
  author: string;
  image: string | null;
  images: Record<string, string> | null;
  intro_text: string | null;
  talent_tips: string | null;
  updated_at: string;
  user_id?: string | null;
  sections?: Array<{ title?: string; content?: string }>;
}

export interface CreatorBuildEditRequest {
  id: string;
  build_id: string;
  user_id: string;
  status: EditRequestStatus;
  request_notes: string | null;
  review_notes: string | null;
  proposed_title: string | null;
  proposed_description: string | null;
  proposed_spec: string | null;
  proposed_role: BuildRole;
  proposed_content_type: string[];
  proposed_intro_text: string | null;
  proposed_talent_tips: string | null;
  proposed_image: string | null;
  proposed_images: Record<string, string>;
  proposed_accessories?: string | null;
  proposed_gear_text?: string | null;
  proposed_rune_text?: string | null;
  proposed_skill_text?: string | null;
  proposed_refine_text?: string | null;
  proposed_misc_text?: string | null;
  proposed_details?: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface CreatorBuildEditPayload {
  build_id: string;
  request_notes: string | null;
  proposed_title: string;
  proposed_description: string | null;
  proposed_spec: string | null;
  proposed_role: BuildRole;
  proposed_content_type: string[];
  proposed_intro_text: string | null;
  proposed_talent_tips: string | null;
  proposed_image: string | null;
  proposed_images: Record<string, string>;
  proposed_accessories?: string | null;
  proposed_gear_text?: string | null;
  proposed_rune_text?: string | null;
  proposed_skill_text?: string | null;
  proposed_refine_text?: string | null;
  proposed_misc_text?: string | null;
  proposed_details?: string | null;
}

const COMMUNITY_ENDPOINT = '/api/community';

async function request<T>(action: string, options?: RequestInit): Promise<T> {
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

async function getCurrentUserId() {
  const response = await fetch('/api/auth?action=me', { credentials: 'same-origin', cache: 'no-store' });
  const data = await response.json().catch(() => ({ user: null })) as { user?: { id?: string } | null };
  if (!response.ok || !data.user?.id) throw new Error('Please login first.');
  return data.user.id;
}

export async function getMyPublishedBuilds(): Promise<CreatorBuild[]> {
  const userId = await getCurrentUserId();
  const builds = await getBuilds();

  return builds
    .filter((build) => String(build.user_id || '') === userId)
    .map((build) => ({
      id: build.id,
      title: build.title,
      description: build.description || null,
      hero_class: build.hero_class,
      spec: build.spec || null,
      role: build.role || null,
      content_type: build.content_type || [],
      author: build.author,
      image: build.image || null,
      images: (build.images || null) as unknown as Record<string, string> | null,
      intro_text: build.intro_text || null,
      talent_tips: build.talent_tips || null,
      updated_at: build.updated_at || build.created_at || new Date(0).toISOString(),
      user_id: build.user_id || null,
      sections: build.sections as Array<{ title?: string; content?: string }> | undefined,
    }))
    .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
}

export async function getMyBuildEditRequests(): Promise<CreatorBuildEditRequest[]> {
  const data = await request<{ requests: CreatorBuildEditRequest[] }>('my-edit-requests');
  return data.requests || [];
}

export async function submitBuildEditRequest(payload: CreatorBuildEditPayload) {
  await request<{ ok: boolean; id: string }>('submit-edit-request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

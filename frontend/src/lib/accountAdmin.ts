import { getBuilds, getGuides } from './api';

export interface AccountAdminGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string;
  subcategory: string;
  image: string | null;
  author: string;
  read_time: string | null;
  tags: string[];
  sections: unknown;
  updated_at: string;
  user_id?: string | null;
}

export interface AccountAdminBuild {
  id: string;
  title: string;
  description: string | null;
  hero_class: string;
  spec: string | null;
  role: 'DPS' | 'Healer' | 'Tank' | null;
  tier: 'S' | 'A' | 'B' | 'C';
  author: string;
  image: string | null;
  images: unknown;
  content_type: string[];
  intro_text?: string | null;
  talent_tips: string | null;
  updated_at: string;
  user_id?: string | null;
}

export interface AccountAdminSubmission {
  id: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  contributor_name: string;
  contact: string | null;
  hero_class: string;
  spec: string | null;
  role: 'DPS' | 'Healer' | 'Tank' | null;
  title: string;
  description: string | null;
  review_notes: string | null;
  approved_build_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccountAdminDashboard {
  guides: AccountAdminGuide[];
  builds: AccountAdminBuild[];
  submissions: AccountAdminSubmission[];
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
  const data = await response.json().catch(() => ({ error: 'Admin service returned an invalid response.' })) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || 'Admin request failed.');
  return data;
}

export async function getAccountAdminDashboard(): Promise<AccountAdminDashboard> {
  const [guides, builds, adminData] = await Promise.all([
    getGuides(),
    getBuilds(),
    request<{ submissions: AccountAdminSubmission[] }>('admin-dashboard'),
  ]);

  return {
    guides: [...guides].sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()) as AccountAdminGuide[],
    builds: [...builds].sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()) as AccountAdminBuild[],
    submissions: adminData.submissions || [],
  };
}

function parseJsonField(value: string, fallback: unknown) {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return JSON.parse(trimmed);
}

function parseList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function updateAccountAdminGuide(guide: AccountAdminGuide, sectionsText: string, tagsText: string) {
  const data = {
    ...guide,
    title: guide.title.trim(),
    subtitle: guide.subtitle?.trim() || null,
    description: guide.description?.trim() || null,
    category: guide.category.trim(),
    subcategory: guide.subcategory.trim(),
    image: guide.image?.trim() || null,
    author: guide.author.trim(),
    read_time: guide.read_time?.trim() || null,
    tags: parseList(tagsText),
    sections: parseJsonField(sectionsText, guide.sections),
    updated_at: new Date().toISOString(),
  };

  await request<{ ok: boolean }>('admin-save-content', {
    method: 'POST',
    body: JSON.stringify({
      content_type: 'guide',
      content_id: guide.id,
      owner_user_id: guide.user_id || null,
      data,
    }),
  });
}

export async function updateAccountAdminBuild(build: AccountAdminBuild, imagesText: string, contentTypesText: string) {
  const data = {
    ...build,
    title: build.title.trim(),
    description: build.description?.trim() || null,
    hero_class: build.hero_class.trim().toLowerCase(),
    spec: build.spec?.trim() || null,
    role: build.role || null,
    tier: build.tier,
    author: build.author.trim(),
    image: build.image?.trim() || null,
    images: parseJsonField(imagesText, build.images),
    content_type: parseList(contentTypesText),
    talent_tips: build.talent_tips?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  await request<{ ok: boolean }>('admin-save-content', {
    method: 'POST',
    body: JSON.stringify({
      content_type: 'build',
      content_id: build.id,
      owner_user_id: build.user_id || null,
      data,
    }),
  });
}

export async function updateAccountAdminSubmission(submission: AccountAdminSubmission) {
  await request<{ ok: boolean; approved_build_id?: string | null }>('admin-review-submission', {
    method: 'POST',
    body: JSON.stringify({
      id: submission.id,
      status: submission.status,
      review_notes: submission.review_notes || null,
    }),
  });
}

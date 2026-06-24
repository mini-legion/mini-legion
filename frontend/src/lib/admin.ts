import { supabase } from './supabase';

export interface AdminSession {
  token: string;
  expires_at: string;
  username: string;
  display_name: string;
}

export interface AdminBuildSubmission {
  id: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  contributor_name: string;
  contact: string | null;
  hero_class: string;
  spec: string | null;
  role: 'DPS' | 'Healer' | 'Tank' | null;
  content_type: string[];
  title: string;
  description: string | null;
  runes: string | null;
  rotation: string | null;
  gear: string | null;
  talents: string | null;
  notes: string | null;
  image_paths: string[];
  image_groups?: Record<string, string[]> | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminBuildEditRequest {
  id: string;
  build_id: string;
  user_id: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  request_notes: string | null;
  review_notes: string | null;
  proposed_title: string | null;
  proposed_description: string | null;
  proposed_spec: string | null;
  proposed_role: 'DPS' | 'Healer' | 'Tank' | null;
  proposed_content_type: string[];
  proposed_intro_text: string | null;
  proposed_talent_tips: string | null;
  proposed_image: string | null;
  proposed_images: Record<string, string>;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  current_title: string;
  hero_class: string;
  current_spec: string | null;
  author: string;
}

export interface AdminBuildImages {
  skills?: string;
  tree1?: string;
  tree2?: string;
  tree3?: string;
  dungeonGear?: string;
  adventureGear?: string;
  [key: string]: string | undefined;
}

export interface AdminBuildRow {
  id: string;
  hero_class: string;
  spec: string | null;
  title: string;
  description: string | null;
  author: string;
  tier: 'S' | 'A' | 'B' | 'C';
  role: 'DPS' | 'Healer' | 'Tank' | null;
  content_type: string[];
  likes: number;
  image: string | null;
  images: AdminBuildImages | null;
  updated_at: string;
  created_at: string;
}

export interface AdminGuideRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string;
  subcategory: string;
  author: string;
  date: string | null;
  read_time: string | null;
  tags: string[];
  updated_at: string;
  created_at: string;
}

export interface AdminDashboardData {
  submissions: AdminBuildSubmission[];
  editRequests: AdminBuildEditRequest[];
  builds: AdminBuildRow[];
  guides: AdminGuideRow[];
}

const sessionKey = 'mini-legion-admin-session';

export function getStoredAdminSession(): AdminSession | null {
  const raw = localStorage.getItem(sessionKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.token || new Date(parsed.expires_at).getTime() <= Date.now()) {
      localStorage.removeItem(sessionKey);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(sessionKey);
    return null;
  }
}

export function storeAdminSession(session: AdminSession) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(sessionKey);
}

export async function adminLogin(username: string, password: string) {
  const { data, error } = await (supabase as any).rpc('admin_login', {
    p_username: username,
    p_password: password,
  });

  if (error) throw error;

  const session = data as AdminSession;
  storeAdminSession(session);
  return session;
}

export async function adminLogout(token: string) {
  await (supabase as any).rpc('admin_logout', { p_token: token });
  clearAdminSession();
}

export async function getAdminDashboard(token: string): Promise<AdminDashboardData> {
  const { data, error } = await (supabase as any).rpc('admin_get_dashboard', {
    p_token: token,
  });

  if (error) throw error;
  return data as AdminDashboardData;
}

export async function updateSubmissionStatus(
  token: string,
  id: string,
  status: 'pending' | 'reviewing' | 'approved' | 'rejected',
  reviewNotes: string | null = null
) {
  const { error } = await (supabase as any).rpc('admin_update_submission_status', {
    p_token: token,
    p_id: id,
    p_status: status,
    p_review_notes: reviewNotes,
  });

  if (error) throw error;
}

export async function updateBuildEditRequestStatus(
  token: string,
  id: string,
  status: 'reviewing' | 'approved' | 'rejected',
  reviewNotes: string | null = null
) {
  const { error } = await (supabase as any).rpc('admin_review_build_edit_request', {
    p_token: token,
    p_request_id: id,
    p_status: status,
    p_review_notes: reviewNotes,
  });

  if (error) throw error;
}

export async function updateBuildBasic(token: string, build: AdminBuildRow) {
  const { error } = await (supabase as any).rpc('admin_update_build_basic', {
    p_token: token,
    p_id: build.id,
    p_title: build.title,
    p_description: build.description,
    p_author: build.author,
    p_tier: build.tier,
    p_role: build.role || '',
  });

  if (error) throw error;
}

export async function updateBuildImages(token: string, build: AdminBuildRow) {
  const { error } = await (supabase as any).rpc('admin_update_build_images', {
    p_token: token,
    p_id: build.id,
    p_images: build.images || {},
    p_image: build.image || '',
  });

  if (error) throw error;
}

export async function updateGuideBasic(token: string, guide: AdminGuideRow) {
  const { error } = await (supabase as any).rpc('admin_update_guide_basic', {
    p_token: token,
    p_id: guide.id,
    p_title: guide.title,
    p_subtitle: guide.subtitle,
    p_description: guide.description,
    p_author: guide.author,
    p_read_time: guide.read_time,
  });

  if (error) throw error;
}

export function getSubmissionImageUrl(path: string) {
  const { data } = supabase.storage.from('build-submissions').getPublicUrl(path);
  return data.publicUrl;
}

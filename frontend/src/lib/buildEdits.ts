import { supabase } from './supabase';

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
}

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Please login first.');
  return data.user.id;
}

export async function getMyPublishedBuilds(): Promise<CreatorBuild[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await (supabase as any)
    .from('builds')
    .select('id, title, description, hero_class, spec, role, content_type, author, image, images, intro_text, talent_tips, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []) as CreatorBuild[];
}

export async function getMyBuildEditRequests(): Promise<CreatorBuildEditRequest[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await (supabase as any)
    .from('build_edit_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as CreatorBuildEditRequest[];
}

export async function submitBuildEditRequest(payload: CreatorBuildEditPayload) {
  const userId = await getCurrentUserId();

  const { error } = await (supabase as any)
    .from('build_edit_requests')
    .insert({
      ...payload,
      user_id: userId,
      status: 'pending',
    });

  if (error) throw error;
}

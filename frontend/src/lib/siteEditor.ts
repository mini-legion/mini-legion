import { supabase } from './supabase';
import type { AdminBuildRow, AdminGuideRow, AdminBuildSubmission } from './admin';

export interface SiteEditorDashboard {
  builds: AdminBuildRow[];
  guides: AdminGuideRow[];
  submissions: AdminBuildSubmission[];
}

export async function getSiteEditorDashboard(): Promise<SiteEditorDashboard> {
  const buildQuery = (supabase as any)
    .from('builds')
    .select('id, hero_class, spec, title, description, author, tier, role, content_type, likes, image, images, updated_at, created_at')
    .order('updated_at', { ascending: false });

  const guideQuery = (supabase as any)
    .from('guides')
    .select('id, slug, title, subtitle, description, category, subcategory, author, date, read_time, tags, updated_at, created_at')
    .order('updated_at', { ascending: false });

  const submissionQuery = (supabase as any)
    .from('build_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  const [buildResult, guideResult, submissionResult] = await Promise.all([buildQuery, guideQuery, submissionQuery]);

  if (buildResult.error) throw buildResult.error;
  if (guideResult.error) throw guideResult.error;
  if (submissionResult.error) throw submissionResult.error;

  return {
    builds: (buildResult.data || []) as AdminBuildRow[],
    guides: (guideResult.data || []) as AdminGuideRow[],
    submissions: (submissionResult.data || []) as AdminBuildSubmission[],
  };
}

export async function saveSiteEditorBuild(build: AdminBuildRow) {
  const { error } = await (supabase as any)
    .from('builds')
    .update({
      title: build.title,
      description: build.description || null,
      author: build.author,
      tier: build.tier || 'A',
      role: build.role || null,
      image: build.image || null,
      images: build.images || {},
      updated_at: new Date().toISOString(),
    })
    .eq('id', build.id);

  if (error) throw error;
}

export async function saveSiteEditorGuide(guide: AdminGuideRow) {
  const { error } = await (supabase as any)
    .from('guides')
    .update({
      title: guide.title,
      subtitle: guide.subtitle || null,
      description: guide.description || null,
      author: guide.author,
      read_time: guide.read_time || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', guide.id);

  if (error) throw error;
}

export async function setSiteEditorSubmissionStatus(
  id: string,
  status: 'pending' | 'reviewing' | 'approved' | 'rejected',
  reviewNotes: string | null = null
) {
  const { error } = await (supabase as any).rpc('auth_admin_update_submission_status', {
    p_id: id,
    p_status: status,
    p_review_notes: reviewNotes,
  });

  if (error) throw error;
}

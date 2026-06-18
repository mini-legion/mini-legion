import { supabase } from './supabase';

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
  sections?: unknown;
  intro_text?: string | null;
  talent_tips?: string | null;
  updated_at: string;
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

export async function getAccountAdminDashboard(): Promise<AccountAdminDashboard> {
  const [{ data: guides, error: guidesError }, { data: builds, error: buildsError }, { data: submissions, error: submissionsError }] = await Promise.all([
    (supabase as any)
      .from('guides')
      .select('id, slug, title, subtitle, description, category, subcategory, image, author, read_time, tags, sections, updated_at')
      .order('updated_at', { ascending: false }),
    (supabase as any)
      .from('builds')
      .select('id, title, description, hero_class, spec, role, tier, author, image, images, content_type, sections, intro_text, talent_tips, updated_at')
      .order('updated_at', { ascending: false }),
    (supabase as any)
      .from('build_submissions')
      .select('id, status, contributor_name, contact, hero_class, spec, role, title, description, review_notes, approved_build_id, created_at, updated_at')
      .order('created_at', { ascending: false }),
  ]);

  if (guidesError) throw guidesError;
  if (buildsError) throw buildsError;
  if (submissionsError) throw submissionsError;

  return {
    guides: (guides || []) as AccountAdminGuide[],
    builds: (builds || []) as AccountAdminBuild[],
    submissions: (submissions || []) as AccountAdminSubmission[],
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
  const { error } = await (supabase as any)
    .from('guides')
    .update({
      title: guide.title,
      subtitle: guide.subtitle || null,
      description: guide.description || null,
      category: guide.category,
      subcategory: guide.subcategory,
      image: guide.image || null,
      author: guide.author,
      read_time: guide.read_time || null,
      tags: parseList(tagsText),
      sections: parseJsonField(sectionsText, guide.sections),
      updated_at: new Date().toISOString(),
    })
    .eq('id', guide.id);

  if (error) throw error;
}

export async function updateAccountAdminBuild(build: AccountAdminBuild, imagesText: string, contentTypesText: string) {
  const { error } = await (supabase as any)
    .from('builds')
    .update({
      title: build.title,
      description: build.description || null,
      hero_class: build.hero_class,
      spec: build.spec || null,
      role: build.role || null,
      tier: build.tier,
      author: build.author,
      image: build.image || null,
      images: parseJsonField(imagesText, build.images),
      content_type: parseList(contentTypesText),
      intro_text: build.intro_text || null,
      talent_tips: build.talent_tips || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', build.id);

  if (error) throw error;
}

export async function updateAccountAdminSubmission(submission: AccountAdminSubmission) {
  const { error } = await (supabase as any)
    .from('build_submissions')
    .update({
      status: submission.status,
      review_notes: submission.review_notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', submission.id);

  if (error) throw error;
}

interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
}

type Role = 'user' | 'creator' | 'moderator' | 'admin';
type SubmissionStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';
type ReviewStatus = SubmissionStatus;

type UserRow = {
  id: string;
  email: string;
  display_name: string;
  discord: string | null;
  role: Role;
  banned_until: string | null;
  deleted: number;
};

type SubmissionRow = {
  id: string;
  user_id: string;
  contributor_name: string;
  contact: string | null;
  hero_class: string;
  spec: string | null;
  role: 'DPS' | 'Healer' | 'Tank' | null;
  title: string;
  description: string | null;
  runes: string | null;
  rotation: string | null;
  gear: string | null;
  talents: string | null;
  notes: string | null;
  review_notes: string | null;
  approved_build_id: string | null;
  status: SubmissionStatus;
  content_type_json: string;
  image_paths_json: string;
  image_groups_json: string;
  created_at: string;
  updated_at: string;
};

type EditRequestRow = {
  id: string;
  build_id: string;
  user_id: string;
  status: ReviewStatus;
  request_notes: string | null;
  review_notes: string | null;
  proposed_title: string | null;
  proposed_description: string | null;
  proposed_spec: string | null;
  proposed_role: 'DPS' | 'Healer' | 'Tank' | null;
  proposed_intro_text: string | null;
  proposed_talent_tips: string | null;
  proposed_image: string | null;
  proposed_content_type_json: string;
  proposed_images_json: string;
  proposed_accessories: string | null;
  proposed_gear_text: string | null;
  proposed_rune_text: string | null;
  proposed_skill_text: string | null;
  proposed_refine_text: string | null;
  proposed_misc_text: string | null;
  proposed_details: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
};

const SESSION_COOKIE = 'ml_session';
const encoder = new TextEncoder();
const VALID_ROLES = new Set(['DPS', 'Healer', 'Tank']);
const VALID_CONTENT_TYPES = new Set(['PvE', 'Raid', 'AFK', 'PvP', 'Beginner', 'Endgame']);
const VALID_STATUSES = new Set<SubmissionStatus>(['pending', 'reviewing', 'approved', 'rejected']);

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizeString(value: unknown, max = 10000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function nullableString(value: unknown, max = 10000) {
  const normalized = normalizeString(value, max);
  return normalized || null;
}

function normalizeList(value: unknown, allowed?: Set<string>) {
  if (!Array.isArray(value)) return [];
  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(allowed ? normalized.filter((item) => allowed.has(item)) : normalized)].slice(0, 20);
}

function parseCookies(request: Request) {
  const result = new Map<string, string>();
  for (const part of (request.headers.get('cookie') || '').split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    result.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim());
  }
  return result;
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signingKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

async function readSessionUserId(request: Request, secret: string) {
  const token = parseCookies(request).get(SESSION_COOKIE);
  if (!token) return null;
  const [encodedPayload, encodedSignature] = token.split('.');
  if (!encodedPayload || !encodedSignature) return null;

  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await signingKey(secret),
      base64UrlDecode(encodedSignature),
      encoder.encode(encodedPayload),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as { sub?: string; exp?: number };
    if (!payload.sub || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

async function currentUser(request: Request, env: Env) {
  if (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32) return null;
  const userId = await readSessionUserId(request, env.AUTH_SECRET);
  if (!userId) return null;

  const user = await env.DB.prepare(`
    SELECT id, email, display_name, discord, role, banned_until, deleted
    FROM users WHERE id = ? LIMIT 1
  `).bind(userId).first<UserRow>();

  if (!user || user.deleted) return null;
  if (user.banned_until && new Date(user.banned_until).getTime() > Date.now()) return null;
  return user;
}

function requireAdmin(user: UserRow | null) {
  return Boolean(user && user.role === 'admin');
}

function submissionJson(row: SubmissionRow) {
  return {
    ...row,
    content_type: parseJson<string[]>(row.content_type_json, []),
    image_paths: parseJson<string[]>(row.image_paths_json, []),
    image_groups: parseJson<Record<string, string[]>>(row.image_groups_json, {}),
    content_type_json: undefined,
    image_paths_json: undefined,
    image_groups_json: undefined,
  };
}

function editRequestJson(row: EditRequestRow) {
  return {
    ...row,
    proposed_content_type: parseJson<string[]>(row.proposed_content_type_json, []),
    proposed_images: parseJson<Record<string, string>>(row.proposed_images_json, {}),
    proposed_content_type_json: undefined,
    proposed_images_json: undefined,
  };
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 56) || 'build';
}

async function listRankings(env: Env) {
  const result = await env.DB.prepare(`
    SELECT contributor_name, contribution_type, title, points, published_url, created_at
    FROM content_contributions
    WHERE status = 'approved'
    ORDER BY created_at DESC
  `).all<{
    contributor_name: string;
    contribution_type: 'build' | 'guide' | 'update';
    title: string;
    points: number;
    published_url: string | null;
    created_at: string;
  }>();

  const grouped = new Map<string, {
    name: string;
    builds: number;
    guides: number;
    updates: number;
    points: number;
    latestContribution: string;
    latestUrl: string | null;
  }>();

  for (const row of result.results || []) {
    const name = row.contributor_name || 'Unknown';
    const key = name.toLocaleLowerCase();
    const current = grouped.get(key) || {
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
    grouped.set(key, current);
  }

  return [...grouped.values()]
    .sort((a, b) => b.points - a.points || (b.builds + b.guides + b.updates) - (a.builds + a.guides + a.updates))
    .slice(0, 10);
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const action = new URL(request.url).searchParams.get('action') || '';

  try {
    if (action === 'rankings' && request.method === 'GET') {
      return json({ rankings: await listRankings(env) });
    }

    const user = await currentUser(request, env);
    if (!user) return json({ error: 'You must be logged in.' }, 401);

    if (action === 'my-submissions' && request.method === 'GET') {
      const result = await env.DB.prepare(`
        SELECT * FROM build_submissions WHERE user_id = ? ORDER BY created_at DESC
      `).bind(user.id).all<SubmissionRow>();
      return json({ submissions: (result.results || []).map(submissionJson) });
    }

    if (action === 'submit-build' && request.method === 'POST') {
      const body = await request.json() as Record<string, unknown>;
      const title = normalizeString(body.title, 180);
      const description = normalizeString(body.description, 5000);
      const heroClass = normalizeString(body.hero_class, 40).toLowerCase();
      const now = new Date().toISOString();
      const id = crypto.randomUUID();

      if (!title || !description || !heroClass) return json({ error: 'Class, title and description are required.' }, 400);

      const role = VALID_ROLES.has(String(body.role)) ? String(body.role) : null;
      const contentType = normalizeList(body.content_type, VALID_CONTENT_TYPES);

      await env.DB.prepare(`
        INSERT INTO build_submissions (
          id, user_id, contributor_name, contact, hero_class, spec, role, title,
          description, runes, rotation, gear, talents, notes, review_notes,
          approved_build_id, status, content_type_json, image_paths_json,
          image_groups_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, 'pending', ?, '[]', '{}', ?, ?)
      `).bind(
        id,
        user.id,
        user.display_name,
        nullableString(body.contact, 250) || user.discord,
        heroClass,
        nullableString(body.spec, 80),
        role,
        title,
        description,
        nullableString(body.runes),
        nullableString(body.rotation),
        nullableString(body.gear),
        nullableString(body.talents),
        nullableString(body.notes),
        JSON.stringify(contentType.length ? contentType : ['PvE']),
        now,
        now,
      ).run();

      const row = await env.DB.prepare('SELECT * FROM build_submissions WHERE id = ?').bind(id).first<SubmissionRow>();
      return json({ submission: row ? submissionJson(row) : null }, 201);
    }

    if (action === 'update-submission' && request.method === 'POST') {
      const body = await request.json() as Record<string, unknown>;
      const id = normalizeString(body.id, 80);
      const existing = id
        ? await env.DB.prepare('SELECT * FROM build_submissions WHERE id = ? AND user_id = ?').bind(id, user.id).first<SubmissionRow>()
        : null;

      if (!existing) return json({ error: 'Submission not found.' }, 404);
      if (!['pending', 'reviewing'].includes(existing.status)) return json({ error: 'Published or rejected submissions can no longer be edited.' }, 409);

      const title = normalizeString(body.title, 180);
      const description = normalizeString(body.description, 5000);
      if (!title || !description) return json({ error: 'Title and description are required.' }, 400);

      const role = VALID_ROLES.has(String(body.role)) ? String(body.role) : null;
      const contentType = normalizeList(body.content_type, VALID_CONTENT_TYPES);
      const now = new Date().toISOString();

      await env.DB.prepare(`
        UPDATE build_submissions SET
          contributor_name = ?, contact = ?, spec = ?, role = ?, content_type_json = ?,
          title = ?, description = ?, runes = ?, rotation = ?, gear = ?, talents = ?, notes = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
      `).bind(
        user.display_name,
        nullableString(body.contact, 250) || user.discord,
        nullableString(body.spec, 80),
        role,
        JSON.stringify(contentType.length ? contentType : ['PvE']),
        title,
        description,
        nullableString(body.runes),
        nullableString(body.rotation),
        nullableString(body.gear),
        nullableString(body.talents),
        nullableString(body.notes),
        now,
        id,
        user.id,
      ).run();

      const row = await env.DB.prepare('SELECT * FROM build_submissions WHERE id = ?').bind(id).first<SubmissionRow>();
      return json({ submission: row ? submissionJson(row) : null });
    }

    if (action === 'my-edit-requests' && request.method === 'GET') {
      const result = await env.DB.prepare(`
        SELECT * FROM build_edit_requests WHERE user_id = ? ORDER BY created_at DESC
      `).bind(user.id).all<EditRequestRow>();
      return json({ requests: (result.results || []).map(editRequestJson) });
    }

    if (action === 'submit-edit-request' && request.method === 'POST') {
      const body = await request.json() as Record<string, unknown>;
      const buildId = normalizeString(body.build_id, 180);
      if (!buildId) return json({ error: 'Build ID is required.' }, 400);

      const duplicate = await env.DB.prepare(`
        SELECT id FROM build_edit_requests
        WHERE build_id = ? AND user_id = ? AND status IN ('pending', 'reviewing')
        LIMIT 1
      `).bind(buildId, user.id).first<{ id: string }>();
      if (duplicate) return json({ error: 'This build already has an edit request waiting for review.' }, 409);

      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const role = VALID_ROLES.has(String(body.proposed_role)) ? String(body.proposed_role) : null;

      await env.DB.prepare(`
        INSERT INTO build_edit_requests (
          id, build_id, user_id, status, request_notes, review_notes, proposed_title,
          proposed_description, proposed_spec, proposed_role, proposed_intro_text,
          proposed_talent_tips, proposed_image, proposed_content_type_json,
          proposed_images_json, proposed_accessories, proposed_gear_text,
          proposed_rune_text, proposed_skill_text, proposed_refine_text,
          proposed_misc_text, proposed_details, reviewed_at, reviewed_by, created_at, updated_at
        ) VALUES (?, ?, ?, 'pending', ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)
      `).bind(
        id,
        buildId,
        user.id,
        nullableString(body.request_notes),
        nullableString(body.proposed_title, 180),
        nullableString(body.proposed_description, 5000),
        nullableString(body.proposed_spec, 80),
        role,
        nullableString(body.proposed_intro_text),
        nullableString(body.proposed_talent_tips),
        nullableString(body.proposed_image, 1000),
        JSON.stringify(normalizeList(body.proposed_content_type, VALID_CONTENT_TYPES)),
        JSON.stringify(typeof body.proposed_images === 'object' && body.proposed_images ? body.proposed_images : {}),
        nullableString(body.proposed_accessories),
        nullableString(body.proposed_gear_text),
        nullableString(body.proposed_rune_text),
        nullableString(body.proposed_skill_text),
        nullableString(body.proposed_refine_text),
        nullableString(body.proposed_misc_text),
        nullableString(body.proposed_details),
        now,
        now,
      ).run();

      return json({ ok: true, id }, 201);
    }

    if (action === 'admin-dashboard' && request.method === 'GET') {
      if (!requireAdmin(user)) return json({ error: 'Admin access required.' }, 403);
      const [submissions, requests, overrides] = await Promise.all([
        env.DB.prepare('SELECT * FROM build_submissions ORDER BY created_at DESC').all<SubmissionRow>(),
        env.DB.prepare('SELECT * FROM build_edit_requests ORDER BY created_at DESC').all<EditRequestRow>(),
        env.DB.prepare('SELECT * FROM content_overrides ORDER BY updated_at DESC').all<{
          content_type: 'guide' | 'build';
          content_id: string;
          data_json: string;
          owner_user_id: string | null;
          updated_by: string;
          created_at: string;
          updated_at: string;
          published_at: string;
        }>(),
      ]);

      return json({
        submissions: (submissions.results || []).map(submissionJson),
        editRequests: (requests.results || []).map(editRequestJson),
        overrides: (overrides.results || []).map((row) => ({ ...row, data: parseJson(row.data_json, {}), data_json: undefined })),
      });
    }

    if (action === 'admin-review-submission' && request.method === 'POST') {
      if (!requireAdmin(user)) return json({ error: 'Admin access required.' }, 403);
      const body = await request.json() as Record<string, unknown>;
      const id = normalizeString(body.id, 80);
      const status = String(body.status) as SubmissionStatus;
      if (!id || !VALID_STATUSES.has(status)) return json({ error: 'Invalid review request.' }, 400);

      const submission = await env.DB.prepare('SELECT * FROM build_submissions WHERE id = ?').bind(id).first<SubmissionRow>();
      if (!submission) return json({ error: 'Submission not found.' }, 404);

      const now = new Date().toISOString();
      let approvedBuildId = submission.approved_build_id;
      const statements: D1PreparedStatement[] = [];

      if (status === 'approved') {
        approvedBuildId ||= `${makeSlug(`${submission.hero_class}-${submission.spec || ''}-${submission.title}`)}-${submission.id.slice(0, 8)}`;
        const build = {
          id: approvedBuildId,
          hero_class: submission.hero_class,
          spec: submission.spec,
          title: submission.title,
          description: submission.description,
          author: submission.contributor_name,
          role: submission.role,
          image: null,
          tier: 'B',
          content_type: parseJson<string[]>(submission.content_type_json, ['PvE']),
          likes: 0,
          images: {},
          runes: [],
          gear_guide: {},
          refines_guide: {},
          spells_guide: [],
          healing_tips: [],
          autocast_order: [],
          sections: [
            submission.runes ? { title: 'Runes', content: submission.runes } : null,
            submission.rotation ? { title: 'Rotation / Autocast', content: submission.rotation } : null,
            submission.gear ? { title: 'Gear / Refines', content: submission.gear } : null,
            submission.talents ? { title: 'Talents', content: submission.talents } : null,
            submission.notes ? { title: 'Notes', content: submission.notes } : null,
          ].filter(Boolean),
          intro_text: submission.description,
          talent_tips: submission.talents,
          view_count: 0,
          user_id: submission.user_id,
          created_at: submission.created_at,
          updated_at: now,
        };

        statements.push(
          env.DB.prepare(`
            INSERT INTO content_overrides (
              content_type, content_id, data_json, owner_user_id, updated_by, created_at, updated_at, published_at
            ) VALUES ('build', ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(content_type, content_id) DO UPDATE SET
              data_json = excluded.data_json,
              owner_user_id = excluded.owner_user_id,
              updated_by = excluded.updated_by,
              updated_at = excluded.updated_at,
              published_at = excluded.published_at
          `).bind(approvedBuildId, JSON.stringify(build), submission.user_id, user.display_name, now, now, now),
        );

        const contributionExists = await env.DB.prepare(`
          SELECT id FROM content_contributions WHERE source_table = 'builds' AND source_id = ? LIMIT 1
        `).bind(approvedBuildId).first<{ id: string }>();

        if (!contributionExists) {
          statements.push(
            env.DB.prepare(`
              INSERT INTO content_contributions (
                id, user_id, contributor_name, contribution_type, source_table, source_id,
                title, published_url, points, status, created_at
              ) VALUES (?, ?, ?, 'build', 'builds', ?, ?, ?, 10, 'approved', ?)
            `).bind(
              crypto.randomUUID(),
              submission.user_id,
              submission.contributor_name,
              approvedBuildId,
              submission.title,
              `/builds/detail/${approvedBuildId}`,
              now,
            ),
          );
        }
      }

      statements.push(
        env.DB.prepare(`
          UPDATE build_submissions
          SET status = ?, review_notes = ?, approved_build_id = ?, updated_at = ?
          WHERE id = ?
        `).bind(status, nullableString(body.review_notes), approvedBuildId, now, id),
      );

      await env.DB.batch(statements);
      return json({ ok: true, approved_build_id: approvedBuildId });
    }

    if (action === 'admin-save-content' && request.method === 'POST') {
      if (!requireAdmin(user)) return json({ error: 'Admin access required.' }, 403);
      const body = await request.json() as Record<string, unknown>;
      const contentType = body.content_type === 'guide' || body.content_type === 'build' ? body.content_type : null;
      const contentId = normalizeString(body.content_id, 180);
      const data = body.data;
      if (!contentType || !contentId || !data || typeof data !== 'object') return json({ error: 'Invalid content override.' }, 400);

      const now = new Date().toISOString();
      const ownerUserId = nullableString(body.owner_user_id, 80);
      await env.DB.prepare(`
        INSERT INTO content_overrides (
          content_type, content_id, data_json, owner_user_id, updated_by, created_at, updated_at, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(content_type, content_id) DO UPDATE SET
          data_json = excluded.data_json,
          owner_user_id = COALESCE(excluded.owner_user_id, content_overrides.owner_user_id),
          updated_by = excluded.updated_by,
          updated_at = excluded.updated_at,
          published_at = excluded.published_at
      `).bind(contentType, contentId, JSON.stringify(data), ownerUserId, user.display_name, now, now, now).run();
      return json({ ok: true });
    }

    if (action === 'admin-review-edit' && request.method === 'POST') {
      if (!requireAdmin(user)) return json({ error: 'Admin access required.' }, 403);
      const body = await request.json() as Record<string, unknown>;
      const id = normalizeString(body.id, 80);
      const status = String(body.status) as ReviewStatus;
      if (!id || !VALID_STATUSES.has(status)) return json({ error: 'Invalid edit review.' }, 400);

      const edit = await env.DB.prepare('SELECT * FROM build_edit_requests WHERE id = ?').bind(id).first<EditRequestRow>();
      if (!edit) return json({ error: 'Edit request not found.' }, 404);
      const now = new Date().toISOString();
      const statements: D1PreparedStatement[] = [];

      if (status === 'approved') {
        if (!body.data || typeof body.data !== 'object') return json({ error: 'Approved edits require the merged build data.' }, 400);
        statements.push(
          env.DB.prepare(`
            INSERT INTO content_overrides (
              content_type, content_id, data_json, owner_user_id, updated_by, created_at, updated_at, published_at
            ) VALUES ('build', ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(content_type, content_id) DO UPDATE SET
              data_json = excluded.data_json,
              owner_user_id = COALESCE(excluded.owner_user_id, content_overrides.owner_user_id),
              updated_by = excluded.updated_by,
              updated_at = excluded.updated_at,
              published_at = excluded.published_at
          `).bind(edit.build_id, JSON.stringify(body.data), edit.user_id, user.display_name, now, now, now),
        );
        statements.push(
          env.DB.prepare(`
            INSERT INTO content_contributions (
              id, user_id, contributor_name, contribution_type, source_table, source_id,
              title, published_url, points, status, created_at
            ) SELECT ?, ?, display_name, 'update', 'builds', ?, ?, ?, 2, 'approved', ?
            FROM users WHERE id = ?
          `).bind(
            crypto.randomUUID(),
            edit.user_id,
            edit.build_id,
            normalizeString((body.data as Record<string, unknown>).title, 180) || edit.build_id,
            `/builds/detail/${edit.build_id}`,
            now,
            edit.user_id,
          ),
        );
      }

      statements.push(
        env.DB.prepare(`
          UPDATE build_edit_requests
          SET status = ?, review_notes = ?, reviewed_at = ?, reviewed_by = ?, updated_at = ?
          WHERE id = ?
        `).bind(status, nullableString(body.review_notes), now, user.display_name, now, id),
      );

      await env.DB.batch(statements);
      return json({ ok: true });
    }

    return json({ error: 'Not found.' }, 404);
  } catch (error) {
    console.error('Mini Legion community API failed', error);
    return json({ error: 'Community service failed.' }, 500);
  }
};

interface Env {
  DB: D1Database;
  MIGRATION_TOKEN: string;
}

type ImportPayload = {
  build_submissions?: Record<string, unknown>[];
  build_edit_requests?: Record<string, unknown>[];
  content_contributions?: Record<string, unknown>[];
};

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

function text(value: unknown) {
  return typeof value === 'string' ? value : null;
}

function requiredText(value: unknown, field: string) {
  const normalized = text(value)?.trim();
  if (!normalized) throw new Error(`Missing ${field}`);
  return normalized;
}

function jsonText(value: unknown, fallback: unknown) {
  return JSON.stringify(value ?? fallback);
}

function integer(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.MIGRATION_TOKEN || request.headers.get('authorization') !== `Bearer ${env.MIGRATION_TOKEN}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await request.json() as ImportPayload;
    const submissions = Array.isArray(body.build_submissions) ? body.build_submissions : [];
    const editRequests = Array.isArray(body.build_edit_requests) ? body.build_edit_requests : [];
    const contributions = Array.isArray(body.content_contributions) ? body.content_contributions : [];

    if (submissions.length + editRequests.length + contributions.length < 1) {
      return json({ error: 'No migration rows provided.' }, 400);
    }
    if (submissions.length > 100 || editRequests.length > 100 || contributions.length > 200) {
      return json({ error: 'Migration batch is too large.' }, 400);
    }

    const statements: D1PreparedStatement[] = [];

    for (const row of submissions) {
      statements.push(
        env.DB.prepare(`
          INSERT INTO build_submissions (
            id, user_id, contributor_name, contact, hero_class, spec, role, title,
            description, runes, rotation, gear, talents, notes, review_notes,
            approved_build_id, status, content_type_json, image_paths_json,
            image_groups_json, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            user_id = excluded.user_id,
            contributor_name = excluded.contributor_name,
            contact = excluded.contact,
            hero_class = excluded.hero_class,
            spec = excluded.spec,
            role = excluded.role,
            title = excluded.title,
            description = excluded.description,
            runes = excluded.runes,
            rotation = excluded.rotation,
            gear = excluded.gear,
            talents = excluded.talents,
            notes = excluded.notes,
            review_notes = excluded.review_notes,
            approved_build_id = excluded.approved_build_id,
            status = excluded.status,
            content_type_json = excluded.content_type_json,
            image_paths_json = excluded.image_paths_json,
            image_groups_json = excluded.image_groups_json,
            updated_at = excluded.updated_at
        `).bind(
          requiredText(row.id, 'build_submissions.id'),
          requiredText(row.user_id, 'build_submissions.user_id'),
          requiredText(row.contributor_name, 'build_submissions.contributor_name'),
          text(row.contact),
          requiredText(row.hero_class, 'build_submissions.hero_class'),
          text(row.spec),
          text(row.role),
          requiredText(row.title, 'build_submissions.title'),
          text(row.description),
          text(row.runes),
          text(row.rotation),
          text(row.gear),
          text(row.talents),
          text(row.notes),
          text(row.review_notes),
          text(row.approved_build_id),
          requiredText(row.status, 'build_submissions.status'),
          jsonText(row.content_type, []),
          jsonText(row.image_paths, []),
          jsonText(row.image_groups, {}),
          requiredText(row.created_at, 'build_submissions.created_at'),
          requiredText(row.updated_at, 'build_submissions.updated_at'),
        ),
      );
    }

    for (const row of editRequests) {
      statements.push(
        env.DB.prepare(`
          INSERT INTO build_edit_requests (
            id, build_id, user_id, status, request_notes, review_notes, proposed_title,
            proposed_description, proposed_spec, proposed_role, proposed_intro_text,
            proposed_talent_tips, proposed_image, proposed_content_type_json,
            proposed_images_json, proposed_accessories, proposed_gear_text,
            proposed_rune_text, proposed_skill_text, proposed_refine_text,
            proposed_misc_text, proposed_details, reviewed_at, reviewed_by, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            build_id = excluded.build_id,
            user_id = excluded.user_id,
            status = excluded.status,
            request_notes = excluded.request_notes,
            review_notes = excluded.review_notes,
            proposed_title = excluded.proposed_title,
            proposed_description = excluded.proposed_description,
            proposed_spec = excluded.proposed_spec,
            proposed_role = excluded.proposed_role,
            proposed_intro_text = excluded.proposed_intro_text,
            proposed_talent_tips = excluded.proposed_talent_tips,
            proposed_image = excluded.proposed_image,
            proposed_content_type_json = excluded.proposed_content_type_json,
            proposed_images_json = excluded.proposed_images_json,
            proposed_accessories = excluded.proposed_accessories,
            proposed_gear_text = excluded.proposed_gear_text,
            proposed_rune_text = excluded.proposed_rune_text,
            proposed_skill_text = excluded.proposed_skill_text,
            proposed_refine_text = excluded.proposed_refine_text,
            proposed_misc_text = excluded.proposed_misc_text,
            proposed_details = excluded.proposed_details,
            reviewed_at = excluded.reviewed_at,
            reviewed_by = excluded.reviewed_by,
            updated_at = excluded.updated_at
        `).bind(
          requiredText(row.id, 'build_edit_requests.id'),
          requiredText(row.build_id, 'build_edit_requests.build_id'),
          requiredText(row.user_id, 'build_edit_requests.user_id'),
          requiredText(row.status, 'build_edit_requests.status'),
          text(row.request_notes),
          text(row.review_notes),
          text(row.proposed_title),
          text(row.proposed_description),
          text(row.proposed_spec),
          text(row.proposed_role),
          text(row.proposed_intro_text),
          text(row.proposed_talent_tips),
          text(row.proposed_image),
          jsonText(row.proposed_content_type, []),
          jsonText(row.proposed_images, {}),
          text(row.proposed_accessories),
          text(row.proposed_gear_text),
          text(row.proposed_rune_text),
          text(row.proposed_skill_text),
          text(row.proposed_refine_text),
          text(row.proposed_misc_text),
          text(row.proposed_details),
          text(row.reviewed_at),
          text(row.reviewed_by),
          requiredText(row.created_at, 'build_edit_requests.created_at'),
          requiredText(row.updated_at, 'build_edit_requests.updated_at'),
        ),
      );
    }

    for (const row of contributions) {
      statements.push(
        env.DB.prepare(`
          INSERT INTO content_contributions (
            id, user_id, contributor_name, contribution_type, source_table, source_id,
            title, published_url, points, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            user_id = COALESCE(excluded.user_id, content_contributions.user_id),
            contributor_name = excluded.contributor_name,
            contribution_type = excluded.contribution_type,
            source_table = excluded.source_table,
            source_id = excluded.source_id,
            title = excluded.title,
            published_url = excluded.published_url,
            points = excluded.points,
            status = excluded.status
        `).bind(
          requiredText(row.id, 'content_contributions.id'),
          text(row.user_id),
          requiredText(row.contributor_name, 'content_contributions.contributor_name'),
          requiredText(row.contribution_type, 'content_contributions.contribution_type'),
          text(row.source_table),
          text(row.source_id),
          requiredText(row.title, 'content_contributions.title'),
          text(row.published_url),
          integer(row.points),
          requiredText(row.status, 'content_contributions.status'),
          requiredText(row.created_at, 'content_contributions.created_at'),
        ),
      );
    }

    const results = statements.length ? await env.DB.batch(statements) : [];
    return json({
      ok: true,
      build_submissions: submissions.length,
      build_edit_requests: editRequests.length,
      content_contributions: contributions.length,
      written: results.filter((result) => result.success).length,
    });
  } catch (error) {
    console.error('Community migration import failed', error);
    return json({ error: error instanceof Error ? error.message : 'Community migration import failed.' }, 500);
  }
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  return onRequestPost(context);
};

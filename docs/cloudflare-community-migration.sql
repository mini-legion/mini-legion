create extension if not exists pg_net with schema extensions;

with payload as (
  select jsonb_build_object(
    'build_submissions', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', id,
            'user_id', user_id,
            'contributor_name', contributor_name,
            'contact', contact,
            'hero_class', hero_class,
            'spec', spec,
            'role', role,
            'title', title,
            'description', description,
            'runes', runes,
            'rotation', rotation,
            'gear', gear,
            'talents', talents,
            'notes', notes,
            'review_notes', review_notes,
            'approved_build_id', approved_build_id,
            'status', status,
            'content_type', content_type,
            'image_paths', image_paths,
            'image_groups', image_groups,
            'created_at', created_at,
            'updated_at', updated_at
          )
          order by created_at
        ),
        '[]'::jsonb
      )
      from public.build_submissions
    ),
    'build_edit_requests', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', id,
            'build_id', build_id,
            'user_id', user_id,
            'status', status,
            'request_notes', request_notes,
            'review_notes', review_notes,
            'proposed_title', proposed_title,
            'proposed_description', proposed_description,
            'proposed_spec', proposed_spec,
            'proposed_role', proposed_role,
            'proposed_intro_text', proposed_intro_text,
            'proposed_talent_tips', proposed_talent_tips,
            'proposed_image', proposed_image,
            'proposed_content_type', proposed_content_type,
            'proposed_images', proposed_images,
            'proposed_accessories', proposed_accessories,
            'proposed_gear_text', proposed_gear_text,
            'proposed_rune_text', proposed_rune_text,
            'proposed_skill_text', proposed_skill_text,
            'proposed_refine_text', proposed_refine_text,
            'proposed_misc_text', proposed_misc_text,
            'proposed_details', proposed_details,
            'reviewed_at', reviewed_at,
            'reviewed_by', reviewed_by,
            'created_at', created_at,
            'updated_at', updated_at
          )
          order by created_at
        ),
        '[]'::jsonb
      )
      from public.build_edit_requests
    ),
    'content_contributions', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', id,
            'user_id', null,
            'contributor_name', contributor_name,
            'contribution_type', contribution_type,
            'source_table', source_table,
            'source_id', source_id,
            'title', title,
            'published_url', published_url,
            'points', points,
            'status', status,
            'created_at', created_at
          )
          order by created_at
        ),
        '[]'::jsonb
      )
      from public.content_contributions
    )
  ) as body
)
select net.http_post(
  url := 'https://mini-legion-new.pages.dev/api/community-migration-import',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer REPLACE_WITH_MIGRATION_TOKEN'
  ),
  body := body,
  timeout_milliseconds := 30000
) as request_id
from payload;

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const result = await env.DB.prepare(`
      SELECT content_type, content_id, data_json, updated_at
      FROM content_overrides
      ORDER BY updated_at ASC
    `).all<{
      content_type: 'guide' | 'build';
      content_id: string;
      data_json: string;
      updated_at: string;
    }>();

    const guides: Record<string, unknown> = {};
    const builds: Record<string, unknown> = {};

    for (const row of result.results || []) {
      try {
        const data = JSON.parse(row.data_json) as unknown;
        if (row.content_type === 'guide') guides[row.content_id] = data;
        if (row.content_type === 'build') builds[row.content_id] = data;
      } catch {
        console.error(`Invalid content override JSON: ${row.content_type}/${row.content_id}`);
      }
    }

    return Response.json(
      { guides, builds },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (error) {
    console.error('Could not load public content overrides', error);
    return Response.json(
      { guides: {}, builds: {} },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Mini-Legion-Override-Status': 'unavailable',
        },
      },
    );
  }
};

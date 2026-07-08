import { getStore } from '@netlify/blobs';

const ALLOWED_TABLES = new Set([
  'guides',
  'builds',
  'raids',
  'codes',
  'collections',
  'content_creators',
  'roadmap_items',
]);

export default async (request: Request) => {
  const expectedToken = process.env.MIGRATION_TOKEN;
  const authorization = request.headers.get('authorization');

  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method === 'GET') {
    const store = getStore('mini-legion-migration');
    const { blobs } = await store.list({ prefix: 'public/' });
    return Response.json({ keys: blobs.map((blob) => blob.key) });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json() as { table?: string; data?: unknown };
    const table = body.table;

    if (!table || !ALLOWED_TABLES.has(table) || !Array.isArray(body.data)) {
      return Response.json({ error: 'Invalid migration payload' }, { status: 400 });
    }

    const store = getStore('mini-legion-migration');
    await store.setJSON(`public/${table}`, body.data, {
      metadata: {
        source: 'supabase',
        importedAt: new Date().toISOString(),
        rowCount: body.data.length,
      },
    });

    return Response.json({ ok: true, table, rows: body.data.length });
  } catch (error) {
    console.error('Migration import failed', error);
    return Response.json({ error: 'Migration import failed' }, { status: 500 });
  }
};

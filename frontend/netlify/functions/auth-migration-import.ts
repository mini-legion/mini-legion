import { getStore } from '@netlify/blobs';

const STORE_NAME = 'mini-legion-auth';
const encoder = new TextEncoder();

type MigrationProfile = {
  id: string;
  email: string | null;
  display_name: string;
  discord: string | null;
  marketing_opt_in: boolean;
  role: 'user' | 'creator' | 'moderator' | 'admin';
  created_at?: string;
  updated_at?: string;
};

type MigrationUser = {
  id: string;
  email: string;
  encrypted_password: string;
  email_confirmed_at: string | null;
  banned_until: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  profile: MigrationProfile | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function emailKey(email: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(normalizeEmail(email)));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function validRole(value: unknown): value is MigrationProfile['role'] {
  return value === 'user' || value === 'creator' || value === 'moderator' || value === 'admin';
}

export default async (request: Request) => {
  const token = process.env.MIGRATION_TOKEN;
  const authorization = request.headers.get('authorization');

  if (!token || authorization !== `Bearer ${token}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json() as { users?: MigrationUser[] };
    if (!Array.isArray(body.users) || body.users.length === 0 || body.users.length > 100) {
      return Response.json({ error: 'Invalid migration payload' }, { status: 400 });
    }

    const prepared = body.users.map((source) => {
      const email = normalizeEmail(source.email || '');
      if (!source.id || !email || !source.encrypted_password || !/^\$2[aby]\$/.test(source.encrypted_password)) {
        throw new Error(`Invalid migrated user ${source.id || 'unknown'}`);
      }

      const createdAt = source.created_at || new Date().toISOString();
      const profile = source.profile;
      const role = validRole(profile?.role) ? profile.role : 'user';

      return {
        id: source.id,
        email,
        passwordHash: source.encrypted_password,
        emailConfirmed: Boolean(source.email_confirmed_at),
        bannedUntil: source.banned_until,
        deleted: Boolean(source.deleted_at),
        profile: {
          id: source.id,
          email,
          display_name: profile?.display_name?.trim() || email.split('@')[0] || 'User',
          discord: profile?.discord || null,
          marketing_opt_in: Boolean(profile?.marketing_opt_in),
          role,
          created_at: profile?.created_at || createdAt,
          updated_at: profile?.updated_at || source.updated_at || createdAt,
        },
        createdAt,
        updatedAt: source.updated_at || createdAt,
      };
    });

    const store = getStore(STORE_NAME);
    for (let start = 0; start < prepared.length; start += 10) {
      const batch = prepared.slice(start, start + 10);
      await Promise.all(batch.flatMap((user) => [
        store.setJSON(`users/${user.id}`, user),
        emailKey(user.email).then((key) => store.setJSON(`emails/${key}`, { userId: user.id })),
      ]));
    }

    return Response.json({ ok: true, users: prepared.length });
  } catch (error) {
    console.error('Account migration failed', error);
    return Response.json({ error: 'Account migration failed' }, { status: 500 });
  }
};

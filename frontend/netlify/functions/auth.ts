import { getStore } from '@netlify/blobs';
import bcrypt from 'bcryptjs';

const STORE_NAME = 'mini-legion-auth';
const SESSION_COOKIE = 'ml_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

type UserRole = 'user' | 'creator' | 'moderator' | 'admin';

type UserProfile = {
  id: string;
  email: string | null;
  display_name: string;
  discord: string | null;
  marketing_opt_in: boolean;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  emailConfirmed: boolean;
  bannedUntil: string | null;
  deleted: boolean;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
};

type SessionPayload = {
  uid: string;
  exp: number;
};

const encoder = new TextEncoder();

function json(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmac(value: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET is not configured.');
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

async function createSessionToken(userId: string) {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };
  const encoded = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  return `${encoded}.${await hmac(encoded)}`;
}

async function verifySessionToken(token: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;

  const expected = await hmac(encoded);
  if (signature.length !== expected.length) return null;

  let mismatch = 0;
  for (let index = 0; index < signature.length; index += 1) {
    mismatch |= signature.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  if (mismatch !== 0) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encoded))) as SessionPayload;
    if (!payload.uid || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return null;
}

function sessionCookie(token: string) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

async function emailKey(email: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(normalizeEmail(email)));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function getUserById(id: string): Promise<StoredUser | null> {
  const store = getStore(STORE_NAME);
  return await store.get(`users/${id}`, { type: 'json' }) as StoredUser | null;
}

async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const store = getStore(STORE_NAME);
  const index = await store.get(`emails/${await emailKey(email)}`, { type: 'json' }) as { userId?: string } | null;
  if (!index?.userId) return null;
  return getUserById(index.userId);
}

async function saveUser(user: StoredUser) {
  const store = getStore(STORE_NAME);
  await store.setJSON(`users/${user.id}`, user);
  await store.setJSON(`emails/${await emailKey(user.email)}`, { userId: user.id });
}

function publicUser(user: StoredUser) {
  return { id: user.id, email: user.email };
}

function isUnavailable(user: StoredUser) {
  if (user.deleted) return true;
  if (!user.bannedUntil) return false;
  return new Date(user.bannedUntil).getTime() > Date.now();
}

async function currentUser(request: Request) {
  const session = await verifySessionToken(readCookie(request, SESSION_COOKIE));
  if (!session) return null;
  const user = await getUserById(session.uid);
  if (!user || isUnavailable(user)) return null;
  return user;
}

export default async (request: Request) => {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  try {
    if (request.method === 'GET' && action === 'me') {
      const user = await currentUser(request);
      if (!user) return json({ user: null, profile: null });
      return json({ user: publicUser(user), profile: user.profile });
    }

    if (request.method === 'POST' && action === 'signin') {
      const body = await request.json() as { email?: string; password?: string };
      const email = normalizeEmail(body.email || '');
      const password = body.password || '';
      if (!email || !password) return json({ error: 'Email and password are required.' }, 400);

      const user = await getUserByEmail(email);
      const valid = Boolean(user?.passwordHash) && await bcrypt.compare(password, user!.passwordHash);
      if (!user || !valid || isUnavailable(user)) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return json({ error: 'Invalid email or password.' }, 401);
      }

      const token = await createSessionToken(user.id);
      return json(
        { user: publicUser(user), profile: user.profile },
        200,
        { 'Set-Cookie': sessionCookie(token) },
      );
    }

    if (request.method === 'POST' && action === 'signup') {
      const body = await request.json() as {
        email?: string;
        password?: string;
        displayName?: string;
        marketingOptIn?: boolean;
      };
      const email = normalizeEmail(body.email || '');
      const password = body.password || '';
      const displayName = (body.displayName || '').trim();

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'A valid email is required.' }, 400);
      if (password.length < 6) return json({ error: 'Password must be at least 6 characters.' }, 400);
      if (!displayName) return json({ error: 'Creator name is required.' }, 400);
      if (await getUserByEmail(email)) return json({ error: 'An account with this email already exists.' }, 409);

      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const user: StoredUser = {
        id,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        emailConfirmed: true,
        bannedUntil: null,
        deleted: false,
        profile: {
          id,
          email,
          display_name: displayName,
          discord: null,
          marketing_opt_in: Boolean(body.marketingOptIn),
          role: 'user',
          created_at: now,
          updated_at: now,
        },
        createdAt: now,
        updatedAt: now,
      };

      await saveUser(user);
      const token = await createSessionToken(user.id);
      return json(
        { user: publicUser(user), profile: user.profile },
        201,
        { 'Set-Cookie': sessionCookie(token) },
      );
    }

    if (request.method === 'POST' && action === 'update-profile') {
      const user = await currentUser(request);
      if (!user) return json({ error: 'You must be logged in.' }, 401);

      const body = await request.json() as {
        display_name?: string;
        discord?: string | null;
        marketing_opt_in?: boolean;
      };
      const displayName = (body.display_name || '').trim();
      if (!displayName) return json({ error: 'Display name is required.' }, 400);

      user.profile = {
        ...user.profile,
        display_name: displayName,
        discord: body.discord?.trim() || null,
        marketing_opt_in: Boolean(body.marketing_opt_in),
        updated_at: new Date().toISOString(),
      };
      user.updatedAt = new Date().toISOString();
      await saveUser(user);
      return json({ user: publicUser(user), profile: user.profile });
    }

    if (request.method === 'POST' && action === 'signout') {
      return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
    }

    return json({ error: 'Invalid request.' }, 400);
  } catch (error) {
    console.error('Auth function failed', error);
    return json({ error: 'Authentication service is temporarily unavailable.' }, 500);
  }
};

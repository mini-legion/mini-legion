import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string | null;
  user_metadata?: {
    display_name?: string;
    marketing_opt_in?: boolean;
  };
}

export interface AuthSession {
  user: AuthUser;
}

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string;
  discord: string | null;
  marketing_opt_in: boolean;
  role: 'user' | 'creator' | 'moderator' | 'admin';
  created_at?: string;
  updated_at?: string;
}

interface AuthResponse {
  user: AuthUser | null;
  profile: UserProfile | null;
  error?: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (params: { email: string; password: string; displayName: string; marketingOptIn: boolean }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'display_name' | 'discord' | 'marketing_opt_in'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_ENDPOINT = '/.netlify/functions/auth';

async function authRequest(action: string, options?: RequestInit): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_ENDPOINT}?action=${encodeURIComponent(action)}`, {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({ error: 'Authentication service returned an invalid response.' })) as AuthResponse;
  if (!response.ok) throw new Error(data.error || 'Authentication failed.');
  return data;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const session = user ? { user } : null;

  const applyAuth = (data: AuthResponse) => {
    setUser(data.user || null);
    setProfile(data.profile || null);
  };

  const refreshProfile = async () => {
    const data = await authRequest('me');
    applyAuth(data);
  };

  useEffect(() => {
    let mounted = true;

    authRequest('me')
      .then((data) => {
        if (mounted) applyAuth(data);
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    loading,
    signUp: async ({ email, password, displayName, marketingOptIn }) => {
      const data = await authRequest('signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName, marketingOptIn }),
      });
      applyAuth(data);
    },
    signIn: async (email, password) => {
      const data = await authRequest('signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      applyAuth(data);
    },
    signOut: async () => {
      await authRequest('signout', { method: 'POST', body: '{}' });
      setUser(null);
      setProfile(null);
    },
    refreshProfile,
    updateProfile: async (updates) => {
      if (!user) throw new Error('You must be logged in.');
      const data = await authRequest('update-profile', {
        method: 'POST',
        body: JSON.stringify(updates),
      });
      applyAuth(data);
    },
  }), [session, user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

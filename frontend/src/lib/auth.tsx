import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

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

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (params: { email: string; password: string; displayName: string; marketingOptIn: boolean }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'display_name' | 'discord' | 'marketing_opt_in'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('id, email, display_name, discord, marketing_opt_in, role, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfile | null;
}

async function ensureProfile(user: User): Promise<UserProfile | null> {
  const existing = await getProfile(user.id);
  if (existing) return existing;

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
  const marketingOptIn = Boolean(user.user_metadata?.marketing_opt_in);

  const { data, error } = await (supabase as any)
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email,
      display_name: displayName,
      marketing_opt_in: marketingOptIn,
    })
    .select('id, email, display_name, discord, marketing_opt_in, role, created_at, updated_at')
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user ?? null;

  const loadProfile = async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    const nextProfile = await ensureProfile(nextUser);
    setProfile(nextProfile);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);

      try {
        await loadProfile(data.session?.user ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      loadProfile(nextSession?.user ?? null).catch(() => setProfile(null));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    loading,
    signUp: async ({ email, password, displayName, marketingOptIn }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
          data: {
            display_name: displayName,
            marketing_opt_in: marketingOptIn,
          },
        },
      });

      if (error) throw error;
    },
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
    },
    refreshProfile: async () => {
      if (!user) return;
      await loadProfile(user);
    },
    updateProfile: async (updates) => {
      if (!user) throw new Error('You must be logged in.');

      const { data, error } = await (supabase as any)
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('id, email, display_name, discord, marketing_opt_in, role, created_at, updated_at')
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
    },
  }), [session, user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

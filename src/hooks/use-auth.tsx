'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type UserProfile = {
  username: string;
  name?: string;
  email: string;
  phone?: string;
  profilePic?: string;
  photoURL?: string;
  status?: string;
  driveAccessToken?: string;
};

type AuthContextType = {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicPaths = ['/landing', '/login', '/signup', '/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUserProfile = async (id: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
        setUserProfile(null);
      } else {
        setUserProfile(data as UserProfile);
      }
    };

    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        getUserProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await getUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        if (!publicPaths.includes(pathname)) router.push('/landing');
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);
    if (error) console.error('Error updating profile:', error);
    else setUserProfile((prev) => ({ ...prev!, ...profile }));
  };

  const value = { user, userProfile, loading, updateUserProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

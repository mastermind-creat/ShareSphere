'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

type UserProfile = {
  username: string;
  photoURL: string;
  status: string;
  driveAccessToken?: string;
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setSessionCookie = async (user: User) => {
    const idToken = await user.getIdToken();
    try {
        await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
    } catch (error) {
        console.error('Failed to set session cookie:', error);
    }
};

const clearSessionCookie = async () => {
    try {
        await fetch('/api/auth/session', { method: 'DELETE' });
    } catch (error) {
        console.error('Failed to clear session cookie:', error);
    }
}

const publicPaths = ['/landing', '/login', '/signup', '/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await setSessionCookie(user);
        const userRef = doc(db, 'users', user.uid);
        
        const unsubProfile = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setUserProfile(doc.data() as UserProfile);
            } else {
                 const defaultProfile: UserProfile = {
                    username: user.displayName || user.email?.split('@')[0] || 'New User',
                    photoURL: user.photoURL || `https://picsum.photos/seed/${user.uid}/100`,
                    status: 'Hey there! I am using ShareSphere.',
                  };
                  setDoc(userRef, defaultProfile).then(() => setUserProfile(defaultProfile));
            }
        });

        setLoading(false);
        return () => unsubProfile();
      } else {
        await clearSessionCookie();
        setUserProfile(null);
        setLoading(false);
        if (!publicPaths.includes(pathname)) {
          router.push('/landing');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname) && pathname !== '/') {
      router.push('/landing');
    }
  }, [user, loading, pathname, router]);

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, profile, { merge: true });
    }
  };
  
  const value = { user, userProfile, loading, updateUserProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

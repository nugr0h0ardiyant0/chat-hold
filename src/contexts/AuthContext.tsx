import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'operator';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, role, created_at, updated_at')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setUserProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // Find user by username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, password_hash')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        return { error: new Error('Username atau password salah') };
      }

      // Simple password verification (in production, use proper hashing)
      if (userData.password_hash !== password) {
        return { error: new Error('Username atau password salah') };
      }

      // Create a custom session using Supabase auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@internal.local`,
        password: userData.id // Use user ID as password for internal auth
      });

      if (signInError) {
        // If user doesn't exist in auth, create them
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${username}@internal.local`,
          password: userData.id,
          options: {
            data: {
              username: username,
              role: 'admin' // Will be overridden by database role
            }
          }
        });

        if (signUpError) {
          return { error: signUpError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
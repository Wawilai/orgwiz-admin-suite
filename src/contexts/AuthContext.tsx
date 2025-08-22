import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  userProfile: any;
  userRoles: string[];
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    // Handle authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Fetch user profile and roles when signed in
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setUserRoles([]);
        }

        // Handle different auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUserProfile(null);
          setUserRoles([]);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    // Get initial session and handle URL hash
    const initializeAuth = async () => {
      try {
        // Check for auth tokens in URL hash (from email verification or social login)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          console.log('Found auth tokens in URL hash, setting session...');
          
          // Set the session from URL hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('Error setting session from hash:', error);
          } else {
            console.log('Session set successfully from hash');
            // Clear the hash from URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // Get current session normally
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session:', error);
          }
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try to fetch profile with proper error handling
      const profileResult = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle to avoid errors when no profile exists

      if (profileResult.data) {
        setUserProfile(profileResult.data);
      } else {
        // Profile doesn't exist yet, create a default one
        setUserProfile(null);
      }

      // Try to fetch user roles with error handling
      try {
        const rolesResult = await supabase
          .from('user_roles')
          .select(`
            roles (name, role_type)
          `)
          .eq('user_id', userId)
          .eq('is_active', true);

        if (rolesResult.data) {
          const roles = rolesResult.data.map(ur => ur.roles?.name).filter(Boolean);
          setUserRoles(roles);
        } else {
          setUserRoles([]);
        }
      } catch (roleError) {
        console.warn('Unable to fetch user roles:', roleError);
        setUserRoles([]);
      }
    } catch (error) {
      console.warn('Unable to fetch user profile:', error);
      setUserProfile(null);
      setUserRoles([]);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    userProfile,
    userRoles,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
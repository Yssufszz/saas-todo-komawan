import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { logLogin, getUserProfile } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('Fetching session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(session?.user || null);

        if (session?.user) {
          console.log('Fetching user profile for user:', session.user.id);
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Unexpected error in getSession:', error.message);
        setUser(null);
        setProfile(null);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          setProfile(null);
          window.location.href = '/login';
          return;
        }

        setUser(session?.user || null);

        if (session?.user) {
          if (event === 'SIGNED_IN') {
            try {
              console.log('Logging login for user:', session.user.id);
              await logLogin(session.user.id);
            } catch (error) {
              console.error('Error logging login:', error.message);
            }
          }
          try {
            console.log('Fetching user profile after auth change');
            const userProfile = await getUserProfile(session.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching user profile:', error.message);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      console.log('Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Starting logout process...');

      setUser(null);
      setProfile(null);

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error.message);
      }

      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-' + supabase.supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
      sessionStorage.clear();

      console.log('Redirecting to login...');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error.message);
      setUser(null);
      setProfile(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'admin'
  };
};
// src/hooks/useAuth.js (Jika tidak menggunakan React Router)
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { logLogin, getUserProfile } from '../utils/auth'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
        
        if (session?.user) {
          const userProfile = await getUserProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        
        if (event === 'SIGNED_OUT') {
          // Clear state immediately when signed out
          setUser(null)
          setProfile(null)
          // Redirect to login page using window.location
          window.location.href = '/login'
          return
        }
        
        setUser(session?.user || null)
        
        if (session?.user) {
          if (event === 'SIGNED_IN') {
            try {
              await logLogin(session.user.id)
            } catch (error) {
              console.error('Error logging login:', error)
            }
          }
          try {
            const userProfile = await getUserProfile(session.user.id)
            setProfile(userProfile)
          } catch (error) {
            console.error('Error getting user profile:', error)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('Starting logout process...')
      
      // Clear state first
      setUser(null)
      setProfile(null)
      
      // Try to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Supabase signOut error:', error)
      }
      
      // Force clear any remaining auth data
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-' + supabase.supabaseUrl.split('//')[1].split('.')[0] + '-auth-token')
      sessionStorage.clear()
      
      console.log('Redirecting to login...')
      
      // Force redirect to login page
      window.location.href = '/login'
      
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if there's an error
      setUser(null)
      setProfile(null)
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/login'
    }
  }

  return {
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'admin'
  }
}
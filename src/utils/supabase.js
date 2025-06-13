// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Debug: Log configuration (remove in production)
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Ensure proper auth configuration
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Add flowType for better logout handling
    flowType: 'pkce'
  }
})
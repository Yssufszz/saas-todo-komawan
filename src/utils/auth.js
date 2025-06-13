// src/utils/auth.js
import { supabase } from './supabase'

export const getClientInfo = () => {
  return {
    userAgent: navigator.userAgent,
    ipAddress: null
  }
}

export const logLogin = async (userId) => {
  const clientInfo = getClientInfo()
  
  try {
    const { error } = await supabase
      .from('login_logs')
      .insert([
        {
          user_id: userId,
          user_agent: clientInfo.userAgent,
          ip_address: clientInfo.ipAddress
        }
      ])
    
    if (error) {
      console.error('Error logging login:', error)
    }
  } catch (error) {
    console.error('Error logging login:', error)
  }
}

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}
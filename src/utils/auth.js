// src/utils/auth.js
import { supabase } from './supabase'

// Fungsi untuk mendapatkan IP address dari service eksternal
export const getClientIP = async () => {
  try {
    // Menggunakan ipify (gratis dan reliable)
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Error getting IP address:', error)
    
    // Fallback ke service lain jika ipify gagal
    try {
      const response2 = await fetch('https://httpbin.org/ip')
      const data2 = await response2.json()
      return data2.origin
    } catch (error2) {
      console.error('Error getting IP from fallback:', error2)
      return 'unknown'
    }
  }
}

export const getClientInfo = async () => {
  const ipAddress = await getClientIP()
  
  return {
    userAgent: navigator.userAgent,
    ipAddress: ipAddress
  }
}

export const logLogin = async (userId) => {
  try {
    const clientInfo = await getClientInfo() // Tambahkan await di sini!
    
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
    } else {
      console.log('Login logged successfully with IP:', clientInfo.ipAddress)
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
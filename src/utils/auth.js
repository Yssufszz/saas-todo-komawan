import { supabase } from './supabase';

// Utility function to wrap fetch with a timeout
const fetchWithTimeout = async (url, ms = 5000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

export const getClientIP = async () => {
  try {
    const response = await fetchWithTimeout('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address from ipify:', error.message);
    return 'unknown';
  }
};

export const getClientInfo = async () => {
  const ipAddress = await getClientIP();
  
  return {
    userAgent: navigator.userAgent,
    ipAddress: ipAddress
  };
};

export const logLogin = async (userId) => {
  try {
    const clientInfo = await getClientInfo();
    
    const { error } = await supabase
      .from('login_logs')
      .insert([
        {
          user_id: userId,
          user_agent: clientInfo.userAgent,
          ip_address: clientInfo.ipAddress
        }
      ]);
    
    if (error) {
      console.error('Error logging login:', error.message);
    } else {
      console.log('Login logged successfully with IP:', clientInfo.ipAddress);
    }
  } catch (error) {
    console.error('Error logging login:', error.message);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
};
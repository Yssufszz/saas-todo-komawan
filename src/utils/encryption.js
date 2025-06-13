// src/utils/encryption.js
import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY

export const encrypt = (text) => {
  if (!text) return text
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

export const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedText
  }
}
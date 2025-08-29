import bcrypt from 'bcryptjs'
import CryptoJS from 'crypto-js'

export const hashPassword = async (password) => {
  // First hash with SHA-256
  const sha256Hash = CryptoJS.SHA256(password).toString()
  // Then hash with bcrypt for additional security
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(sha256Hash, salt)
}

export const verifyPassword = async (password, hashedPassword) => {
  // First hash with SHA-256
  const sha256Hash = CryptoJS.SHA256(password).toString()
  // Then compare with bcrypt
  return await bcrypt.compare(sha256Hash, hashedPassword)
}
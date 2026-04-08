import crypto from 'crypto'

import { env } from '../config/env.js'

const algorithm = 'aes-256-gcm'
const ivLength = 12

const key = crypto
  .createHash('sha256')
  .update(env.messageEncryptionSecret)
  .digest()

export const encryptMessageContent = (plainText) => {
  if (!plainText) return ''

  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(plainText, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  const authTag = cipher.getAuthTag().toString('base64')
  const encodedIv = iv.toString('base64')

  return `${encodedIv}:${authTag}:${encrypted}`
}

export const decryptMessageContent = (payload) => {
  if (!payload) return ''

  const [encodedIv, encodedTag, encrypted] = String(payload).split(':')
  if (!encodedIv || !encodedTag || !encrypted) {
    return payload
  }

  try {
    const iv = Buffer.from(encodedIv, 'base64')
    const authTag = Buffer.from(encodedTag, 'base64')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (_error) {
    return ''
  }
}

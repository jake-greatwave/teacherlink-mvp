import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
  userType: string
  [key: string]: string
}

const getSecretKey = () => {
  return new TextEncoder().encode(JWT_SECRET)
}

export const jwtUtils = {
  async generateToken(payload: JWTPayload): Promise<string> {
    const secretKey = getSecretKey()
    const token = await new SignJWT(payload as Record<string, string>)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey)
    
    return token
  },

  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const secretKey = getSecretKey()
      const { payload } = await jwtVerify(token, secretKey)
      const typedPayload = payload as Record<string, string>
      return {
        userId: typedPayload.userId || '',
        email: typedPayload.email || '',
        userType: typedPayload.userType || '',
      }
    } catch (error) {
      return null
    }
  },

  getTokenFromStorage(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  },

  setTokenToStorage(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  },

  removeTokenFromStorage(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
  },
}

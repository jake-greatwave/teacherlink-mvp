import { createClient } from '@/lib/supabase/client'
import type { Database, UserType } from '@/types/database.types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

const supabase = createClient()

export const userProfiles = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as UserProfile
  },

  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('사용자를 찾을 수 없습니다.')
      }
      throw error
    }
    return data as UserProfile
  },

  async create(profile: UserProfileInsert) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) throw error
    return data as UserProfile
  },

  async update(id: string, updates: UserProfileUpdate) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as UserProfile
  },

  async updateLastLogin(id: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as UserProfile
  },

  async getCurrentUser() {
    const { jwtUtils } = await import('@/lib/jwt')
    const token = jwtUtils.getTokenFromStorage()
    if (!token) return null

    const payload = await jwtUtils.verifyToken(token)
    if (!payload) {
      jwtUtils.removeTokenFromStorage()
      return null
    }

    try {
      const user = await this.getById(payload.userId)
      if (!user.is_active) {
        jwtUtils.removeTokenFromStorage()
        return null
      }
      return user
    } catch (error) {
      jwtUtils.removeTokenFromStorage()
      return null
    }
  },
}

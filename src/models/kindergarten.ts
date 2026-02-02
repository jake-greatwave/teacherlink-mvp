import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Kindergarten = Database['public']['Tables']['kindergartens']['Row']
type KindergartenInsert = Database['public']['Tables']['kindergartens']['Insert']
type KindergartenUpdate = Database['public']['Tables']['kindergartens']['Update']

const supabase = createClient()

export const kindergartens = {
  async getAll() {
    const { data, error } = await supabase
      .from('kindergartens')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Kindergarten[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('kindergartens')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Kindergarten
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('kindergartens')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data as Kindergarten
  },

  async getByRegion(sido?: string, sigungu?: string) {
    let query = supabase
      .from('kindergartens')
      .select('*')
    
    if (sido) {
      query = query.eq('address_sido', sido)
    }
    if (sigungu) {
      query = query.eq('address_sigungu', sigungu)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Kindergarten[]
  },

  async create(kindergarten: KindergartenInsert) {
    const { data, error } = await supabase
      .from('kindergartens')
      .insert(kindergarten)
      .select()
      .single()
    
    if (error) throw error
    return data as Kindergarten
  },

  async update(id: string, updates: KindergartenUpdate) {
    const { data, error } = await supabase
      .from('kindergartens')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Kindergarten
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('kindergartens')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

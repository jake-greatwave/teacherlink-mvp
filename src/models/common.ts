import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type JobCategory = Database['public']['Tables']['job_categories']['Row']
type Region = Database['public']['Tables']['regions']['Row']

const supabase = createClient()

export const jobCategories = {
  async getAll() {
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as JobCategory[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as JobCategory
  },

  async getByCode(code: string) {
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .eq('code', code)
      .single()
    
    if (error) throw error
    return data as JobCategory
  },
}

export const regions = {
  async getAll(level?: number) {
    let query = supabase
      .from('regions')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (level !== undefined) {
      query = query.eq('level', level)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data as Region[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Region
  },

  async getByCode(code: string) {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('code', code)
      .single()
    
    if (error) throw error
    return data as Region
  },

  async getChildren(parentId: string) {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Region[]
  },

  async getByParentCode(parentCode: string) {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('level', 2)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    
    const parentRegion = await this.getByCode(parentCode)
    if (!parentRegion) return []
    
    return data.filter((r: any) => r.parent_id === parentRegion.id) as Region[]
  },
}

import { createClient } from '@/lib/supabase/client'
import type { Database, PostingStatus } from '@/types/database.types'

type JobPosting = Database['public']['Tables']['job_postings']['Row']
type JobPostingInsert = Database['public']['Tables']['job_postings']['Insert']
type JobPostingUpdate = Database['public']['Tables']['job_postings']['Update']

const supabase = createClient()

export const jobPostings = {
  async getAll(filters?: {
    status?: PostingStatus
    regionId?: string
    jobCategoryId?: string
    sido?: string
    sigungu?: string
    isRecommended?: boolean
    isFeatured?: boolean
  }) {
    let query = supabase
      .from('job_postings')
      .select('*')
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.regionId) {
      query = query.eq('region_id', filters.regionId)
    }
    if (filters?.jobCategoryId) {
      query = query.eq('job_category_id', filters.jobCategoryId)
    }
    if (filters?.sido) {
      query = query.eq('address_sido', filters.sido)
    }
    if (filters?.sigungu) {
      query = query.eq('address_sigungu', filters.sigungu)
    }
    if (filters?.isRecommended !== undefined) {
      query = query.eq('is_recommended', filters.isRecommended)
    }
    if (filters?.isFeatured !== undefined) {
      query = query.eq('is_featured', filters.isFeatured)
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as JobPosting[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as JobPosting
  },

  async getByKindergartenId(kindergartenId: string) {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('kindergarten_id', kindergartenId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as JobPosting[]
  },

  async getActive() {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as JobPosting[]
  },

  async getRecommended() {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('status', 'active')
      .eq('is_recommended', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as JobPosting[]
  },

  async create(posting: JobPostingInsert) {
    const { data, error } = await supabase
      .from('job_postings')
      .insert(posting as any)
      .select()
      .single()
    
    if (error) throw error
    return data as JobPosting
  },

  async update(id: string, updates: JobPostingUpdate) {
    const { data, error } = await supabase
      .from('job_postings')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as JobPosting
  },

  async incrementViewCount(id: string) {
    const { data, error } = await supabase
      .rpc('increment_view_count', { posting_id: id } as any)
    
    if (error) {
      const { data: posting, error: fetchError } = await supabase
        .from('job_postings')
        .select('view_count')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      
      const { data: updated, error: updateError } = await supabase
        .from('job_postings')
        .update({ view_count: ((posting as any).view_count || 0) + 1 } as any)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) throw updateError
      return updated as JobPosting
    }
    
    return data as JobPosting
  },

  async incrementApplicationCount(id: string) {
    const { data: posting, error: fetchError } = await supabase
      .from('job_postings')
      .select('application_count')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    const { data, error } = await supabase
      .from('job_postings')
      .update({ application_count: ((posting as any).application_count || 0) + 1 } as any)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as JobPosting
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

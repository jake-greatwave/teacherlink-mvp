import { createClient } from '@/lib/supabase/client'
import type { Database, ApplicationStatus } from '@/types/database.types'

type Application = Database['public']['Tables']['applications']['Row']
type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
type ApplicationUpdate = Database['public']['Tables']['applications']['Update']

const supabase = createClient()

export const applications = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Application
  },

  async getByJobPostingId(jobPostingId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_posting_id', jobPostingId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Application[]
  },

  async getByJobSeekerId(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_seeker_id', jobSeekerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Application[]
  },

  async getByKindergartenId(kindergartenId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('kindergarten_id', kindergartenId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Application[]
  },

  async getByStatus(status: ApplicationStatus) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Application[]
  },

  async create(application: ApplicationInsert) {
    const { data, error } = await supabase
      .from('applications')
      .insert(application as any)
      .select()
      .single()
    
    if (error) throw error
    
    await (supabase as any)
      .from('job_postings')
      .update({ application_count: (supabase as any).rpc('increment', {}) })
      .eq('id', application.job_posting_id)
    
    return data as Application
  },

  async update(id: string, updates: ApplicationUpdate) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Application
  },

  async updateStatus(id: string, status: ApplicationStatus, reviewNote?: string) {
    const updates: ApplicationUpdate = {
      status,
      reviewed_at: new Date().toISOString(),
    }
    
    if (reviewNote) {
      updates.review_note = reviewNote
    }
    
    const { data, error } = await supabase
      .from('applications')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Application
  },

  async cancel(id: string, reason?: string) {
    const { data, error } = await supabase
      .from('applications')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancel_reason: reason || null,
      } as any)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Application
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

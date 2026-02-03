import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Resume = Database['public']['Tables']['resumes']['Row']
type ResumeInsert = Database['public']['Tables']['resumes']['Insert']
type ResumeUpdate = Database['public']['Tables']['resumes']['Update']

const supabase = createClient()

export const resumes = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Resume
  },

  async getByJobSeekerId(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('job_seeker_id', jobSeekerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Resume[]
  },

  async getPrimary(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('job_seeker_id', jobSeekerId)
      .eq('is_primary', true)
      .single()
    
    if (error) throw error
    return data as Resume
  },

  async create(resume: ResumeInsert) {
    if (resume.is_primary) {
      await this.unsetPrimary(resume.job_seeker_id)
    }
    
    // @ts-expect-error - Supabase type inference issue
    const { data, error } = await supabase
      .from('resumes')
      .insert(resume)
      .select()
      .single()
    
    if (error) throw error
    return data as Resume
  },

  async update(id: string, updates: ResumeUpdate) {
    if (updates.is_primary) {
      const { data: resume } = await this.getById(id)
      if (resume) {
        await this.unsetPrimary(resume.job_seeker_id)
      }
    }
    
    // @ts-expect-error - Supabase type inference issue
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Resume
  },

  async setPrimary(id: string) {
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('job_seeker_id')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    if (!resume) throw new Error('Resume not found')
    
    await this.unsetPrimary((resume as any).job_seeker_id)
    
    // @ts-expect-error - Supabase type inference issue
    const { data, error } = await supabase
      .from('resumes')
      .update({ is_primary: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Resume
  },

  async unsetPrimary(jobSeekerId: string) {
    // @ts-expect-error - Supabase type inference issue
    const { error } = await supabase
      .from('resumes')
      .update({ is_primary: false })
      .eq('job_seeker_id', jobSeekerId)
      .eq('is_primary', true)
    
    if (error) throw error
  },

  async incrementViewCount(id: string) {
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('view_count')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    // @ts-expect-error - Supabase type inference issue
    const { data, error } = await supabase
      .from('resumes')
      .update({ view_count: ((resume as any).view_count || 0) + 1 })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Resume
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

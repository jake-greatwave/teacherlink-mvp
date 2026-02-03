// @ts-nocheck
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type JobSeeker = Database['public']['Tables']['job_seekers']['Row']
type JobSeekerInsert = Database['public']['Tables']['job_seekers']['Insert']
type JobSeekerUpdate = Database['public']['Tables']['job_seekers']['Update']
type Education = Database['public']['Tables']['educations']['Row']
type Career = Database['public']['Tables']['careers']['Row']
type Certificate = Database['public']['Tables']['certificates']['Row']

const supabase = createClient()

export const jobSeekers = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('job_seekers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as JobSeeker
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('job_seekers')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data as JobSeeker
  },

  async create(jobSeeker: JobSeekerInsert) {
    const { data, error } = await supabase
      .from('job_seekers')
      .insert(jobSeeker)
      .select()
      .single()
    
    if (error) throw error
    return data as JobSeeker
  },

  async update(id: string, updates: JobSeekerUpdate) {
    const { data, error } = await supabase
      .from('job_seekers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as JobSeeker
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('job_seekers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

export const educations = {
  async getByJobSeekerId(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('educations')
      .select('*')
      .eq('job_seeker_id', jobSeekerId)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Education[]
  },

  async create(education: Database['public']['Tables']['educations']['Insert']) {
    const { data, error } = await supabase
      .from('educations')
      .insert(education)
      .select()
      .single()
    
    if (error) throw error
    return data as Education
  },

  async update(id: string, updates: Database['public']['Tables']['educations']['Update']) {
    const { data, error } = await supabase
      .from('educations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Education
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('educations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

export const careers = {
  async getByJobSeekerId(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .eq('job_seeker_id', jobSeekerId)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Career[]
  },

  async create(career: Database['public']['Tables']['careers']['Insert']) {
    const { data, error } = await supabase
      .from('careers')
      .insert(career)
      .select()
      .single()
    
    if (error) throw error
    return data as Career
  },

  async update(id: string, updates: Database['public']['Tables']['careers']['Update']) {
    const { data, error } = await supabase
      .from('careers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Career
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('careers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

export const certificates = {
  async getByJobSeekerId(jobSeekerId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('job_seeker_id', jobSeekerId)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Certificate[]
  },

  async create(certificate: Database['public']['Tables']['certificates']['Insert']) {
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single()
    
    if (error) throw error
    return data as Certificate
  },

  async update(id: string, updates: Database['public']['Tables']['certificates']['Update']) {
    const { data, error } = await supabase
      .from('certificates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Certificate
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

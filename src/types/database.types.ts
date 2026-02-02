export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserType = 'kindergarten' | 'job_seeker' | 'admin'
export type PostingStatus = 'active' | 'closed' | 'hidden'
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'cancelled'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary'
export type CareerLevel = 'newcomer' | 'experienced' | 'irrelevant'

export interface Database {
  public: {
    Tables: {
      job_categories: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      regions: {
        Row: {
          id: string
          parent_id: string | null
          code: string
          name: string
          level: number
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          code: string
          name: string
          level: number
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          code?: string
          name?: string
          level?: number
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_type: UserType
          email: string
          password_hash: string
          nickname: string
          phone: string | null
          signup_source: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_type: UserType
          email: string
          password_hash: string
          nickname: string
          phone?: string | null
          signup_source?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_type?: UserType
          email?: string
          password_hash?: string
          nickname?: string
          phone?: string | null
          signup_source?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kindergartens: {
        Row: {
          id: string
          user_id: string
          facility_name: string
          homepage_url: string | null
          business_email: string | null
          address_full: string
          address_sido: string
          address_sigungu: string
          address_detail: string | null
          region_id: string | null
          phone: string
          profile_image_url: string | null
          introduction: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          facility_name: string
          homepage_url?: string | null
          business_email?: string | null
          address_full: string
          address_sido: string
          address_sigungu: string
          address_detail?: string | null
          region_id?: string | null
          phone: string
          profile_image_url?: string | null
          introduction?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          facility_name?: string
          homepage_url?: string | null
          business_email?: string | null
          address_full?: string
          address_sido?: string
          address_sigungu?: string
          address_detail?: string | null
          region_id?: string | null
          phone?: string
          profile_image_url?: string | null
          introduction?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_seekers: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          email: string | null
          address_full: string | null
          address_sido: string | null
          address_sigungu: string | null
          address_detail: string | null
          region_id: string | null
          profile_image_url: string | null
          final_education: string | null
          introduction: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          email?: string | null
          address_full?: string | null
          address_sido?: string | null
          address_sigungu?: string | null
          address_detail?: string | null
          region_id?: string | null
          profile_image_url?: string | null
          final_education?: string | null
          introduction?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string
          email?: string | null
          address_full?: string | null
          address_sido?: string | null
          address_sigungu?: string | null
          address_detail?: string | null
          region_id?: string | null
          profile_image_url?: string | null
          final_education?: string | null
          introduction?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      educations: {
        Row: {
          id: string
          job_seeker_id: string
          school_name: string
          major: string | null
          degree_level: string | null
          admission_date: string | null
          graduation_date: string | null
          is_graduated: boolean
          description: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_seeker_id: string
          school_name: string
          major?: string | null
          degree_level?: string | null
          admission_date?: string | null
          graduation_date?: string | null
          is_graduated?: boolean
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_seeker_id?: string
          school_name?: string
          major?: string | null
          degree_level?: string | null
          admission_date?: string | null
          graduation_date?: string | null
          is_graduated?: boolean
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      careers: {
        Row: {
          id: string
          job_seeker_id: string
          company_name: string
          position: string | null
          job_category_id: string | null
          start_date: string
          end_date: string | null
          is_current: boolean
          description: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_seeker_id: string
          company_name: string
          position?: string | null
          job_category_id?: string | null
          start_date: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_seeker_id?: string
          company_name?: string
          position?: string | null
          job_category_id?: string | null
          start_date?: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          job_seeker_id: string
          certificate_name: string
          issuer: string | null
          issue_date: string | null
          certificate_number: string | null
          description: string | null
          attachment_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_seeker_id: string
          certificate_name: string
          issuer?: string | null
          issue_date?: string | null
          certificate_number?: string | null
          description?: string | null
          attachment_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_seeker_id?: string
          certificate_name?: string
          issuer?: string | null
          issue_date?: string | null
          certificate_number?: string | null
          description?: string | null
          attachment_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      job_postings: {
        Row: {
          id: string
          kindergarten_id: string
          title: string
          status: PostingStatus
          facility_name: string
          contact_email: string | null
          contact_phone: string | null
          address_full: string
          address_sido: string | null
          address_sigungu: string | null
          region_id: string | null
          job_category_id: string | null
          employment_type: EmploymentType | null
          salary_type: string | null
          salary_min: number | null
          salary_max: number | null
          salary_negotiable: boolean
          career_level: CareerLevel | null
          deadline_date: string | null
          commute_regions: Json | null
          content_html: string | null
          view_count: number
          application_count: number
          is_recommended: boolean
          is_featured: boolean
          hidden_reason: string | null
          hidden_at: string | null
          hidden_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kindergarten_id: string
          title: string
          status?: PostingStatus
          facility_name: string
          contact_email?: string | null
          contact_phone?: string | null
          address_full: string
          address_sido?: string | null
          address_sigungu?: string | null
          region_id?: string | null
          job_category_id?: string | null
          employment_type?: EmploymentType | null
          salary_type?: string | null
          salary_min?: number | null
          salary_max?: number | null
          salary_negotiable?: boolean
          career_level?: CareerLevel | null
          deadline_date?: string | null
          commute_regions?: Json | null
          content_html?: string | null
          view_count?: number
          application_count?: number
          is_recommended?: boolean
          is_featured?: boolean
          hidden_reason?: string | null
          hidden_at?: string | null
          hidden_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kindergarten_id?: string
          title?: string
          status?: PostingStatus
          facility_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          address_full?: string
          address_sido?: string | null
          address_sigungu?: string | null
          region_id?: string | null
          job_category_id?: string | null
          employment_type?: EmploymentType | null
          salary_type?: string | null
          salary_min?: number | null
          salary_max?: number | null
          salary_negotiable?: boolean
          career_level?: CareerLevel | null
          deadline_date?: string | null
          commute_regions?: Json | null
          content_html?: string | null
          view_count?: number
          application_count?: number
          is_recommended?: boolean
          is_featured?: boolean
          hidden_reason?: string | null
          hidden_at?: string | null
          hidden_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          job_seeker_id: string
          title: string
          is_primary: boolean
          full_name: string
          phone: string | null
          email: string | null
          address_full: string | null
          profile_image_url: string | null
          desired_facility_type: string | null
          desired_job_category_id: string | null
          desired_salary_min: number | null
          desired_salary_max: number | null
          desired_salary_negotiable: boolean
          desired_regions: Json | null
          content_html: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_seeker_id: string
          title: string
          is_primary?: boolean
          full_name: string
          phone?: string | null
          email?: string | null
          address_full?: string | null
          profile_image_url?: string | null
          desired_facility_type?: string | null
          desired_job_category_id?: string | null
          desired_salary_min?: number | null
          desired_salary_max?: number | null
          desired_salary_negotiable?: boolean
          desired_regions?: Json | null
          content_html?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_seeker_id?: string
          title?: string
          is_primary?: boolean
          full_name?: string
          phone?: string | null
          email?: string | null
          address_full?: string | null
          profile_image_url?: string | null
          desired_facility_type?: string | null
          desired_job_category_id?: string | null
          desired_salary_min?: number | null
          desired_salary_max?: number | null
          desired_salary_negotiable?: boolean
          desired_regions?: Json | null
          content_html?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_posting_id: string
          resume_id: string
          job_seeker_id: string
          kindergarten_id: string
          status: ApplicationStatus
          cover_letter: string | null
          snapshot_posting: Json | null
          snapshot_resume: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          review_note: string | null
          cancelled_at: string | null
          cancel_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_posting_id: string
          resume_id: string
          job_seeker_id: string
          kindergarten_id: string
          status?: ApplicationStatus
          cover_letter?: string | null
          snapshot_posting?: Json | null
          snapshot_resume?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          review_note?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_posting_id?: string
          resume_id?: string
          job_seeker_id?: string
          kindergarten_id?: string
          status?: ApplicationStatus
          cover_letter?: string | null
          snapshot_posting?: Json | null
          snapshot_resume?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          review_note?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          user_id: string
          entity_type: string
          entity_id: string
          file_name: string
          file_url: string
          file_size: number | null
          file_type: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entity_type: string
          entity_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          file_type?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entity_type?: string
          entity_id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          file_type?: string | null
          display_order?: number
          created_at?: string
        }
      }
      withdrawal_reasons: {
        Row: {
          id: string
          user_id: string
          user_type: UserType
          email: string
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_type: UserType
          email: string
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_type?: UserType
          email?: string
          reason?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: UserType
      posting_status: PostingStatus
      application_status: ApplicationStatus
      employment_type: EmploymentType
      career_level: CareerLevel
    }
  }
}

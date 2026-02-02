import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface UploadOptions {
  bucket: 'profiles' | 'attachments' | 'resumes'
  path: string
  file: File
  userId?: string
}

export const storageApi = {
  async uploadFile({ bucket, path, file }: UploadOptions): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 9)
    const fileName = `${path}/${timestamp}-${randomStr}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new Error(`파일 업로드 실패: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  },

  async deleteFile(bucket: 'profiles' | 'attachments' | 'resumes', path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw new Error(`파일 삭제 실패: ${error.message}`)
    }
  },

  getPublicUrl(bucket: 'profiles' | 'attachments' | 'resumes', path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },
}

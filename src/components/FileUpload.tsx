import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { storageApi } from '@/lib/storage'

interface FileUploadProps {
  bucket: 'profiles' | 'attachments' | 'resumes'
  path: string
  value?: string
  onChange: (url: string | null) => void
  accept?: string
  maxSizeMB?: number
  label?: string
  disabled?: boolean
}

const DEFAULT_MAX_SIZE_MB = 10

export const FileUpload = ({
  bucket,
  path,
  value,
  onChange,
  accept = 'image/*',
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  label,
  disabled = false,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`)
      return
    }

    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('지원하지 않는 파일 형식입니다.')
      return
    }

    setUploading(true)

    try {
      const url = await storageApi.uploadFile({
        bucket,
        path,
        file,
      })

      setPreview(url)
      onChange(url)
    } catch (err: any) {
      setError(err.message || '파일 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        {preview ? (
          <div className="relative group">
            <div className="w-full h-48 rounded-3xl overflow-hidden bg-gray-50 border-2 border-gray-100">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={`
              w-full h-48 rounded-3xl border-2 border-dashed 
              flex flex-col items-center justify-center gap-4
              transition-all cursor-pointer
              ${disabled || uploading
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                : 'border-gray-300 bg-gray-50 hover:border-yellow-400 hover:bg-yellow-50/30'
              }
            `}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                <p className="text-sm font-bold text-gray-500">업로드 중...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-700 mb-1">
                    클릭하여 파일 선택
                  </p>
                  <p className="text-xs font-bold text-gray-400">
                    {accept.includes('image') ? '이미지 파일' : '파일'} (최대 {maxSizeMB}MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 px-1">{error}</p>
      )}
    </div>
  )
}

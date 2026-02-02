import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { authApi } from '@/lib/api/auth'

interface SignInProps {
  onSuccess: () => void
  onSignUp: () => void
}

export const SignIn = ({ onSuccess, onSignUp }: SignInProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await authApi.signIn(email, password)
      onSuccess()
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-yellow-50/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-gray-100 rounded-[48px] p-10 md:p-14 shadow-2xl shadow-yellow-200/20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            다시 만나서 반가워요!
          </h2>
          <p className="text-gray-400 mt-2 font-bold tracking-tight">우리의 미래, 아이들을 위한 최고의 선택</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
              이메일 계정
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
              비밀번호
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center px-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-200 text-yellow-400 focus:ring-yellow-400"
              />
              <label htmlFor="remember" className="text-sm font-bold text-gray-500 cursor-pointer">
                아이디 저장
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-yellow-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-gray-400">
            아직 티처링크 회원이 아니신가요?
            <button
              onClick={onSignUp}
              className="ml-2 text-yellow-600 font-black hover:underline underline-offset-4"
            >
              회원가입하기
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

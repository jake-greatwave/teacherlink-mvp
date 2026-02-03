import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Lock, User, School, UserCircle, ArrowRight, AlertCircle, MapPin, Phone, Globe, FileText, GraduationCap, Award, ChevronRight } from 'lucide-react'
import { authApi, type KindergartenSignUpData, type JobSeekerSignUpData } from '@/lib/api/auth'
import { regions } from '@/models/common'
import { userProfiles } from '@/models/user'
import { FileUpload } from '@/components/FileUpload'
import { TermsModal } from '@/components/TermsModal'
import type { UserType } from '@/types/database.types'

interface SignUpProps {
  onSuccess: () => void
  onSignIn: () => void
}

export const SignUp = ({ onSuccess, onSignIn }: SignUpProps) => {
  const [step, setStep] = useState<'terms' | 'common' | 'kindergarten' | 'job_seeker'>('terms')
  const [userType, setUserType] = useState<UserType | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null)

  const [commonData, setCommonData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    signupSource: '',
  })

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  })

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.'
    }
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    }
    return ''
  }

  const validateNickname = (nickname: string) => {
    if (nickname.length < 2) {
      return '닉네임은 2자 이상이어야 합니다.'
    }
    if (nickname.length > 20) {
      return '닉네임은 20자 이하여야 합니다.'
    }
    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
      return '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.'
    }
    return ''
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    
    if (numbers.length === 0) {
      return ''
    }
    
    if (numbers.startsWith('02')) {
      if (numbers.length <= 2) {
        return numbers
      } else if (numbers.length <= 5) {
        return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
      } else if (numbers.length <= 9) {
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`
      } else {
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5, 9)}`
      }
    } else if (numbers.startsWith('010') || numbers.startsWith('011') || numbers.startsWith('016') || numbers.startsWith('017') || numbers.startsWith('018') || numbers.startsWith('019')) {
      if (numbers.length <= 3) {
        return numbers
      } else if (numbers.length <= 7) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      } else if (numbers.length <= 11) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
      } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
      }
    } else {
      if (numbers.length <= 3) {
        return numbers
      } else if (numbers.length <= 6) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      } else if (numbers.length <= 10) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`
      } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
      }
    }
  }

  const [kindergartenData, setKindergartenData] = useState({
    facilityName: '',
    homepageUrl: '',
    businessEmail: '',
    addressFull: '',
    addressSido: '',
    addressSigungu: '',
    addressDetail: '',
    phone: '',
    profileImageUrl: '',
    introduction: '',
  })

  const [jobSeekerData, setJobSeekerData] = useState({
    fullName: '',
    phone: '',
    contactEmail: '',
    addressFull: '',
    addressSido: '',
    addressSigungu: '',
    profileImageUrl: '',
    finalEducation: '',
    introduction: '',
  })

  const [sidoList, setSidoList] = useState<Array<{ code: string; name: string }>>([])
  const [sigunguList, setSigunguList] = useState<Array<{ code: string; name: string }>>([])

  React.useEffect(() => {
    const loadRegions = async () => {
      try {
        const sidos = await regions.getAll(1)
        setSidoList(sidos.map(r => ({ code: r.code, name: r.name })))
      } catch (err) {
        console.error('Failed to load regions:', err)
      }
    }
    loadRegions()
  }, [])

  const handleSidoChange = async (sidoCode: string) => {
    const selectedSido = sidoList.find(s => s.code === sidoCode)
    if (selectedSido) {
      if (userType === 'kindergarten') {
        setKindergartenData(prev => ({ ...prev, addressSido: selectedSido.name, addressSigungu: '', addressFull: '' }))
      } else {
        setJobSeekerData(prev => ({ ...prev, addressSido: selectedSido.name, addressSigungu: '', addressFull: '' }))
      }

      try {
        const parentRegion = await regions.getByCode(sidoCode)
        if (!parentRegion) {
          console.error('Parent region not found:', sidoCode)
          setSigunguList([])
          return
        }

        let sigungus = await regions.getChildren(parentRegion.id)
        
        if (!sigungus || sigungus.length === 0) {
          sigungus = await regions.getByParentCode(sidoCode)
        }

        if (sigungus && sigungus.length > 0) {
          setSigunguList(sigungus.map(r => ({ code: r.code, name: r.name })))
        } else {
          console.warn('No sigungu data found for:', sidoCode, parentRegion.id)
          setSigunguList([])
        }
      } catch (err: any) {
        console.error('Failed to load sigungu:', err)
        console.error('Error details:', err.message, err)
        setSigunguList([])
      }
    } else {
      setSigunguList([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (commonData.password !== commonData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    try {
      if (userType === 'kindergarten') {
        const data: KindergartenSignUpData = {
          ...commonData,
          userType: 'kindergarten',
          facilityName: kindergartenData.facilityName,
          homepageUrl: kindergartenData.homepageUrl || undefined,
          businessEmail: kindergartenData.businessEmail || undefined,
          addressFull: kindergartenData.addressFull,
          addressSido: kindergartenData.addressSido,
          addressSigungu: kindergartenData.addressSigungu,
          addressDetail: kindergartenData.addressDetail || undefined,
          phone: kindergartenData.phone,
          profileImageUrl: kindergartenData.profileImageUrl || undefined,
          introduction: kindergartenData.introduction || undefined,
        }
        await authApi.signUp(data)
      } else if (userType === 'job_seeker') {
        const data: JobSeekerSignUpData = {
          ...commonData,
          userType: 'job_seeker',
          fullName: jobSeekerData.fullName,
          phone: jobSeekerData.phone,
          contactEmail: jobSeekerData.contactEmail || undefined,
          addressFull: jobSeekerData.addressFull || undefined,
          addressSido: jobSeekerData.addressSido || undefined,
          addressSigungu: jobSeekerData.addressSigungu || undefined,
          profileImageUrl: jobSeekerData.profileImageUrl || undefined,
          finalEducation: jobSeekerData.finalEducation || undefined,
          introduction: jobSeekerData.introduction || undefined,
        }
        await authApi.signUp(data)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'terms') {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-yellow-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-gray-100 rounded-[48px] p-10 md:p-14 shadow-2xl shadow-yellow-200/20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              이용약관 동의
            </h2>
          </div>

          <div className="bg-gray-50 p-5 rounded-[28px] space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="terms-all"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-200 text-yellow-400 focus:ring-yellow-400"
              />
              <label htmlFor="terms-all" className="text-sm font-black text-gray-900 cursor-pointer">
                모든 약관에 동의합니다.
              </label>
            </div>
            <div className="pl-8 space-y-2">
              <button
                onClick={() => setModalType('terms')}
                className="text-xs font-bold text-gray-400 flex items-center justify-between w-full hover:text-gray-600 transition-colors"
              >
                이용약관 동의 (필수)
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setModalType('privacy')}
                className="text-xs font-bold text-gray-400 flex items-center justify-between w-full hover:text-gray-600 transition-colors"
              >
                개인정보 수집 및 이용 동의 (필수)
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            onClick={() => termsAgreed && setStep('common')}
            disabled={!termsAgreed}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-yellow-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 단계
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-gray-400">
              이미 계정이 있으신가요?
              <button
                onClick={onSignIn}
                className="ml-2 text-yellow-600 font-black hover:underline underline-offset-4"
              >
                로그인하기
              </button>
            </p>
          </div>

          <TermsModal 
            type={modalType || 'terms'} 
            isOpen={modalType !== null} 
            onClose={() => setModalType(null)} 
          />
        </motion.div>
      </div>
    )
  }

  if (step === 'common') {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-yellow-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-gray-100 rounded-[48px] p-10 md:p-14 shadow-2xl shadow-yellow-200/20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              티처링크 멤버십 가입
            </h2>
            <p className="text-gray-400 mt-2 font-bold tracking-tight">우리의 미래, 아이들을 위한 최고의 선택</p>
          </div>

          <div className="flex p-1.5 bg-gray-50 rounded-[28px] mb-10 border border-gray-100">
            <button
              onClick={() => setUserType('job_seeker')}
              className={`flex-1 py-4 rounded-[22px] text-sm font-black transition-all flex items-center justify-center gap-2 ${
                userType === 'job_seeker' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UserCircle className="w-4 h-4" /> 개인회원
            </button>
            <button
              onClick={() => setUserType('kindergarten')}
              className={`flex-1 py-4 rounded-[22px] text-sm font-black transition-all flex items-center justify-center gap-2 ${
                userType === 'kindergarten' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <School className="w-4 h-4" /> 기업회원
            </button>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault()
            if (!userType) return

            const passwordError = validatePassword(commonData.password)
            const nicknameError = validateNickname(commonData.nickname)
            const passwordConfirmError = commonData.password !== commonData.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ''

            let emailError = ''
            if (commonData.email) {
              try {
                await userProfiles.getByEmail(commonData.email)
                emailError = '이미 사용 중인 이메일입니다.'
              } catch (error: any) {
                if (error.message === '사용자를 찾을 수 없습니다.') {
                  emailError = ''
                } else {
                  emailError = '이메일 확인 중 오류가 발생했습니다.'
                }
              }
            }

            setValidationErrors({
              email: emailError,
              password: passwordError,
              passwordConfirm: passwordConfirmError,
              nickname: nicknameError,
            })

            if (!emailError && !passwordError && !passwordConfirmError && !nicknameError && userType && (userType === 'kindergarten' || userType === 'job_seeker')) {
              setStep(userType)
            }
          }} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                이메일 계정
              </label>
              <div className="relative group">
                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  validationErrors.email ? 'text-red-500' : userType ? 'text-gray-400 group-focus-within:text-yellow-500' : 'text-gray-300'
                }`} />
                <input
                  type="email"
                  value={commonData.email}
                  onChange={(e) => {
                    setCommonData(prev => ({ ...prev, email: e.target.value }))
                    setValidationErrors(prev => ({
                      ...prev,
                      email: '',
                    }))
                  }}
                  placeholder="example@email.com"
                  required
                  disabled={!userType}
                  className={`w-full pl-14 pr-6 py-5 rounded-3xl border-none transition-all font-bold placeholder:text-gray-300 ${
                    !userType
                      ? 'bg-gray-100 cursor-not-allowed opacity-60'
                      : validationErrors.email
                      ? 'bg-red-50 focus:ring-2 focus:ring-red-400'
                      : 'bg-gray-50 focus:ring-2 focus:ring-yellow-400'
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs font-bold text-red-500 px-1">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                비밀번호
              </label>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  validationErrors.password ? 'text-red-500' : userType ? 'text-gray-400 group-focus-within:text-yellow-500' : 'text-gray-300'
                }`} />
                <input
                  type="password"
                  value={commonData.password}
                  onChange={(e) => {
                    const value = e.target.value
                    setCommonData(prev => ({ ...prev, password: value }))
                    setValidationErrors(prev => ({
                      ...prev,
                      password: value ? validatePassword(value) : '',
                      passwordConfirm: commonData.passwordConfirm && value !== commonData.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ''
                    }))
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setValidationErrors(prev => ({
                        ...prev,
                        password: validatePassword(e.target.value)
                      }))
                    }
                  }}
                  placeholder="8자 이상, 영문과 숫자 포함"
                  required
                  disabled={!userType}
                  className={`w-full pl-14 pr-6 py-5 rounded-3xl border-none transition-all font-bold placeholder:text-gray-300 ${
                    !userType
                      ? 'bg-gray-100 cursor-not-allowed opacity-60'
                      : validationErrors.password
                      ? 'bg-red-50 focus:ring-2 focus:ring-red-400'
                      : 'bg-gray-50 focus:ring-2 focus:ring-yellow-400'
                  }`}
                />
              </div>
              {validationErrors.password && (
                <p className="text-xs font-bold text-red-500 px-1">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                비밀번호 확인
              </label>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  validationErrors.passwordConfirm ? 'text-red-500' : userType ? 'text-gray-400 group-focus-within:text-yellow-500' : 'text-gray-300'
                }`} />
                <input
                  type="password"
                  value={commonData.passwordConfirm}
                  onChange={(e) => {
                    const value = e.target.value
                    setCommonData(prev => ({ ...prev, passwordConfirm: value }))
                    setValidationErrors(prev => ({
                      ...prev,
                      passwordConfirm: value && value !== commonData.password ? '비밀번호가 일치하지 않습니다.' : ''
                    }))
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setValidationErrors(prev => ({
                        ...prev,
                        passwordConfirm: e.target.value !== commonData.password ? '비밀번호가 일치하지 않습니다.' : ''
                      }))
                    }
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  disabled={!userType}
                  className={`w-full pl-14 pr-6 py-5 rounded-3xl border-none transition-all font-bold placeholder:text-gray-300 ${
                    !userType
                      ? 'bg-gray-100 cursor-not-allowed opacity-60'
                      : validationErrors.passwordConfirm
                      ? 'bg-red-50 focus:ring-2 focus:ring-red-400'
                      : 'bg-gray-50 focus:ring-2 focus:ring-yellow-400'
                  }`}
                />
              </div>
              {validationErrors.passwordConfirm && (
                <p className="text-xs font-bold text-red-500 px-1">{validationErrors.passwordConfirm}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                닉네임
              </label>
              <div className="relative group">
                <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  validationErrors.nickname ? 'text-red-500' : userType ? 'text-gray-400 group-focus-within:text-yellow-500' : 'text-gray-300'
                }`} />
                <input
                  type="text"
                  value={commonData.nickname}
                  onChange={(e) => {
                    const value = e.target.value
                    setCommonData(prev => ({ ...prev, nickname: value }))
                    setValidationErrors(prev => ({
                      ...prev,
                      nickname: value ? validateNickname(value) : ''
                    }))
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setValidationErrors(prev => ({
                        ...prev,
                        nickname: validateNickname(e.target.value)
                      }))
                    }
                  }}
                  placeholder="2-20자, 한글/영문/숫자만 가능"
                  required
                  maxLength={20}
                  disabled={!userType}
                  className={`w-full pl-14 pr-6 py-5 rounded-3xl border-none transition-all font-bold placeholder:text-gray-300 ${
                    !userType
                      ? 'bg-gray-100 cursor-not-allowed opacity-60'
                      : validationErrors.nickname
                      ? 'bg-red-50 focus:ring-2 focus:ring-red-400'
                      : 'bg-gray-50 focus:ring-2 focus:ring-yellow-400'
                  }`}
                />
              </div>
              {validationErrors.nickname && (
                <p className="text-xs font-bold text-red-500 px-1">{validationErrors.nickname}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                가입경로 (선택)
              </label>
              <select
                value={commonData.signupSource}
                onChange={(e) => setCommonData(prev => ({ ...prev, signupSource: e.target.value }))}
                disabled={!userType}
                className={`w-full pl-6 pr-6 py-5 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold ${
                  !userType
                    ? 'bg-gray-100 cursor-not-allowed opacity-60'
                    : 'bg-gray-50'
                }`}
              >
                <option value="">선택해주세요</option>
                <option value="search">검색엔진</option>
                <option value="sns">SNS</option>
                <option value="friend">지인추천</option>
                <option value="ad">광고</option>
                <option value="other">기타</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!userType}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-yellow-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음 단계
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (step === 'kindergarten') {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-yellow-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border border-gray-100 rounded-[48px] p-10 md:p-14 shadow-2xl shadow-yellow-200/20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              유치원 정보 입력
            </h2>
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
                시설명 <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <School className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  value={kindergartenData.facilityName}
                  onChange={(e) => setKindergartenData(prev => ({ ...prev, facilityName: e.target.value }))}
                  placeholder="시설명을 입력해 주세요"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                  홈페이지
                </label>
                <div className="relative group">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="url"
                    value={kindergartenData.homepageUrl}
                    onChange={(e) => setKindergartenData(prev => ({ ...prev, homepageUrl: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                  이메일
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="email"
                    value={kindergartenData.businessEmail}
                    onChange={(e) => setKindergartenData(prev => ({ ...prev, businessEmail: e.target.value }))}
                    placeholder="business@example.com"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="tel"
                  value={kindergartenData.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setKindergartenData(prev => ({ ...prev, phone: formatted }))
                  }}
                  placeholder="02-1234-5678 또는 010-1234-5678"
                  required
                  maxLength={13}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                  시/도 <span className="text-red-500">*</span>
                </label>
                <select
                  value={sidoList.find(s => s.name === kindergartenData.addressSido)?.code || ''}
                  onChange={(e) => handleSidoChange(e.target.value)}
                  required
                  className="w-full pl-6 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold"
                >
                  <option value="">시/도를 선택하세요</option>
                  {sidoList.map(sido => (
                    <option key={sido.code} value={sido.code}>{sido.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                  시/군/구 <span className="text-red-500">*</span>
                </label>
                <select
                  value={sigunguList.find(s => s.name === kindergartenData.addressSigungu)?.code || ''}
                  onChange={(e) => {
                    const selected = sigunguList.find(s => s.code === e.target.value)
                    if (selected) {
                      setKindergartenData(prev => ({ ...prev, addressSigungu: selected.name }))
                    }
                  }}
                  required
                  disabled={!kindergartenData.addressSido}
                  className="w-full pl-6 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold disabled:opacity-50"
                >
                  <option value="">시/군/구를 선택하세요</option>
                  {sigunguList.map(sigungu => (
                    <option key={sigungu.code} value={sigungu.code}>{sigungu.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                상세주소 <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  value={kindergartenData.addressFull}
                  onChange={(e) => setKindergartenData(prev => ({ ...prev, addressFull: e.target.value }))}
                  placeholder="상세주소를 입력해 주세요"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <FileUpload
              bucket="profiles"
              path={`kindergartens/${commonData.email}`}
              value={kindergartenData.profileImageUrl}
              onChange={(url) => setKindergartenData(prev => ({ ...prev, profileImageUrl: url || '' }))}
              accept="image/*"
              maxSizeMB={10}
              label="프로필 사진 (선택)"
              disabled={loading}
            />

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                소개
              </label>
              <textarea
                value={kindergartenData.introduction}
                onChange={(e) => setKindergartenData(prev => ({ ...prev, introduction: e.target.value }))}
                placeholder="시설 소개를 입력해 주세요"
                rows={4}
                className="w-full pl-6 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-yellow-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '가입 중...' : '회원가입 완료'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (step === 'job_seeker') {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-yellow-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border border-gray-100 rounded-[48px] p-10 md:p-14 shadow-2xl shadow-yellow-200/20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              구직자 정보 입력
            </h2>
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
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  value={jobSeekerData.fullName}
                  onChange={(e) => setJobSeekerData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="이름을 입력해 주세요"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="tel"
                  value={jobSeekerData.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setJobSeekerData(prev => ({ ...prev, phone: formatted }))
                  }}
                  placeholder="010-1234-5678 또는 02-1234-5678"
                  required
                  maxLength={13}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                이메일
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="email"
                  value={jobSeekerData.contactEmail}
                  onChange={(e) => setJobSeekerData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="example@email.com"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                  시/도
                </label>
                <select
                  value={sidoList.find(s => s.name === jobSeekerData.addressSido)?.code || ''}
                  onChange={(e) => handleSidoChange(e.target.value)}
                  className="w-full pl-6 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold"
                >
                  <option value="">시/도를 선택하세요</option>
                  {sidoList.map(sido => (
                    <option key={sido.code} value={sido.code}>{sido.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                  시/군/구
                </label>
                <select
                  value={sigunguList.find(s => s.name === jobSeekerData.addressSigungu)?.code || ''}
                  onChange={(e) => {
                    const selected = sigunguList.find(s => s.code === e.target.value)
                    if (selected) {
                      setJobSeekerData(prev => ({ ...prev, addressSigungu: selected.name }))
                    }
                  }}
                  disabled={!jobSeekerData.addressSido}
                  className="w-full pl-6 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold disabled:opacity-50"
                >
                  <option value="">시/군/구를 선택하세요</option>
                  {sigunguList.map(sigungu => (
                    <option key={sigungu.code} value={sigungu.code}>{sigungu.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                상세주소
              </label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  value={jobSeekerData.addressFull}
                  onChange={(e) => setJobSeekerData(prev => ({ ...prev, addressFull: e.target.value }))}
                  placeholder="상세주소를 입력해 주세요"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <FileUpload
              bucket="profiles"
              path={`job-seekers/${commonData.email}`}
              value={jobSeekerData.profileImageUrl}
              onChange={(url) => setJobSeekerData(prev => ({ ...prev, profileImageUrl: url || '' }))}
              accept="image/*"
              maxSizeMB={10}
              label="프로필 사진 (선택)"
              disabled={loading}
            />

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                최종졸업학교
              </label>
              <div className="relative group">
                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  value={jobSeekerData.finalEducation}
                  onChange={(e) => setJobSeekerData(prev => ({ ...prev, finalEducation: e.target.value }))}
                  placeholder="최종졸업학교를 입력해 주세요"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                소개
              </label>
              <textarea
                value={jobSeekerData.introduction}
                onChange={(e) => setJobSeekerData(prev => ({ ...prev, introduction: e.target.value }))}
                placeholder="자기소개를 입력해 주세요"
                rows={4}
                className="w-full pl-6 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-yellow-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '가입 중...' : '회원가입 완료'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return null
}

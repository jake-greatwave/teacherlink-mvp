import bcrypt from 'bcryptjs'
import { userProfiles } from '@/models/user'
import { kindergartens } from '@/models/kindergarten'
import { jobSeekers } from '@/models/job-seeker'
import { jwtUtils } from '@/lib/jwt'
import type { UserType } from '@/types/database.types'

export interface SignUpData {
  email: string
  password: string
  nickname: string
  userType: UserType
  signupSource?: string
}

export interface KindergartenSignUpData extends SignUpData {
  facilityName: string
  homepageUrl?: string
  businessEmail?: string
  addressFull: string
  addressSido: string
  addressSigungu: string
  addressDetail?: string
  phone: string
  profileImageUrl?: string
  introduction?: string
}

export interface JobSeekerSignUpData extends SignUpData {
  fullName: string
  phone: string
  contactEmail?: string
  addressFull?: string
  addressSido?: string
  addressSigungu?: string
  profileImageUrl?: string
  finalEducation?: string
  introduction?: string
}

export const authApi = {
  async signIn(email: string, password: string) {
    try {
      const user = await userProfiles.getByEmail(email)

      if (!user) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
      }

      if (!user.is_active) {
        throw new Error('비활성화된 계정입니다.')
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash)

      if (!isPasswordValid) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
      }

      await userProfiles.updateLastLogin(user.id)

      const token = await jwtUtils.generateToken({
        userId: user.id,
        email: user.email,
        userType: user.user_type,
      })

      jwtUtils.setTokenToStorage(token)

      return {
        user: {
          id: user.id,
          email: user.email,
          user_type: user.user_type,
          nickname: user.nickname,
        },
        token,
      }
    } catch (error: any) {
      if (error.message) {
        throw error
      }
      throw new Error('로그인에 실패했습니다.')
    }
  },

  async signUp(data: KindergartenSignUpData | JobSeekerSignUpData) {
    const { email, password, nickname, userType, signupSource } = data

    if (!email || !password || !nickname) {
      throw new Error('필수 정보가 누락되었습니다.')
    }

    try {
      const existingUser = await userProfiles.getByEmail(email).catch(() => null)
      if (existingUser) {
        throw new Error('이미 사용 중인 이메일입니다.')
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const userProfile = await userProfiles.create({
        email,
        password_hash: passwordHash,
        nickname,
        user_type: userType,
        signup_source: signupSource || null,
      })

      if (userType === 'kindergarten') {
        const kgData = data as KindergartenSignUpData
        await kindergartens.create({
          user_id: userProfile.id,
          facility_name: kgData.facilityName,
          homepage_url: kgData.homepageUrl || null,
          business_email: kgData.businessEmail || null,
          address_full: kgData.addressFull,
          address_sido: kgData.addressSido,
          address_sigungu: kgData.addressSigungu,
          address_detail: kgData.addressDetail || null,
          phone: kgData.phone,
          profile_image_url: kgData.profileImageUrl || null,
          introduction: kgData.introduction || null,
        })
      } else if (userType === 'job_seeker') {
        const jsData = data as JobSeekerSignUpData
        await jobSeekers.create({
          user_id: userProfile.id,
          full_name: jsData.fullName,
          phone: jsData.phone,
          email: jsData.contactEmail || null,
          address_full: jsData.addressFull || null,
          address_sido: jsData.addressSido || null,
          address_sigungu: jsData.addressSigungu || null,
          profile_image_url: jsData.profileImageUrl || null,
          final_education: jsData.finalEducation || null,
          introduction: jsData.introduction || null,
        })
      }

      const token = await jwtUtils.generateToken({
        userId: userProfile.id,
        email: userProfile.email,
        userType: userProfile.user_type,
      })

      jwtUtils.setTokenToStorage(token)

      return {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          user_type: userProfile.user_type,
          nickname: userProfile.nickname,
        },
        token,
      }
    } catch (error: any) {
      if (error.message) {
        throw error
      }
      throw new Error('회원가입에 실패했습니다.')
    }
  },

  async signOut() {
    jwtUtils.removeTokenFromStorage()
  },

  async getCurrentUser() {
    const token = jwtUtils.getTokenFromStorage()
    if (!token) return null

    const payload = await jwtUtils.verifyToken(token)
    if (!payload) {
      jwtUtils.removeTokenFromStorage()
      return null
    }

    try {
      const user = await userProfiles.getById(payload.userId)
      if (!user.is_active) {
        jwtUtils.removeTokenFromStorage()
        return null
      }
      return user
    } catch (error) {
      jwtUtils.removeTokenFromStorage()
      return null
    }
  },
}

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { JobDetail } from './pages/JobDetail';
import { Dashboard } from './pages/Dashboard';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  School, 
  UserCircle,
  ChevronRight
} from 'lucide-react';

// --- Types ---
type UserRole = 'kindergarten' | 'job_seeker' | 'admin';

// --- Mock Data ---
const MOCK_POSTINGS = [
  {
    id: 1,
    title: '[꿈나래 유치원] 2026학년도 신입 담임교사 및 부담임교사 채용 공고',
    facility_name: '꿈나래 유치원',
    location: '서울 서초구',
    job_type: '담임교사',
    salary: '월 250만원 이상',
    deadline: '2026.03.31',
    is_recommended: true,
    image: 'https://images.unsplash.com/flagged/photo-1572818640942-05bbb70c9089?w=800&q=80'
  },
  {
    id: 2,
    title: '사랑가득 어린이집 조리사 선생님을 모십니다 (경력우대)',
    facility_name: '사랑가득 어린이집',
    location: '경기 수원시',
    job_type: '조리사',
    salary: '연봉 3,000만원 ~',
    deadline: '채용시까지',
    is_recommended: false,
    image: 'https://images.unsplash.com/photo-1720139290958-d8676702c3ed?w=800&q=80'
  },
  {
    id: 3,
    title: '2026 방과후 특수교사(파트타임) 채용 안내 - 해바라기 유치원',
    facility_name: '해바라기 유치원',
    location: '인천 연수구',
    job_type: '특수교사',
    salary: '시급 1.5만원 ~',
    deadline: '2026.02.15',
    is_recommended: true,
    image: 'https://images.unsplash.com/photo-1761208663763-c4d30657c910?w=800&q=80'
  }
];

// --- Auth Component ---
const AuthPage = ({ type, setPage, setRole }: { type: 'login' | 'signup', setPage: (p: string) => void, setRole: (r: UserRole) => void }) => {
  const [activeTab, setActiveTab] = useState<'job_seeker' | 'kindergarten'>('job_seeker');

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-yellow-50/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-gray-100 rounded-[48px] p-10 md:p-14 shadow-2xl shadow-yellow-200/20"
      >
        <div className="text-center mb-12">
          <div className="inline-flex w-16 h-16 items-center justify-center mb-6">
            <img src="/images/teacher_logo.svg" alt="티처링크" className="h-16 w-auto" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {type === 'login' ? '다시 만나서 반가워요!' : '티처링크 멤버십 가입'}
          </h2>
          <p className="text-gray-400 mt-2 font-bold tracking-tight">우리의 미래, 아이들을 위한 최고의 선택</p>
        </div>

        {type === 'signup' && (
          <div className="flex p-1.5 bg-gray-50 rounded-[28px] mb-10 border border-gray-100">
            <button 
              onClick={() => setActiveTab('job_seeker')}
              className={`flex-1 py-4 rounded-[22px] text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'job_seeker' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <UserCircle className="w-4 h-4" /> 개인회원
            </button>
            <button 
              onClick={() => setActiveTab('kindergarten')}
              className={`flex-1 py-4 rounded-[22px] text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'kindergarten' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <School className="w-4 h-4" /> 기업회원
            </button>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">이메일 계정</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
              <input type="email" placeholder="example@email.com" className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">비밀번호</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
              <input type="password" placeholder="••••••••" className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300" />
            </div>
          </div>
          
          {type === 'signup' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">활동 이름</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input type="text" placeholder="실명을 입력해 주세요" className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-yellow-400 transition-all font-bold placeholder:text-gray-300" />
              </div>
            </div>
          )}

          {type === 'login' && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-gray-200 text-yellow-400 focus:ring-yellow-400" />
                <label htmlFor="remember" className="text-sm font-bold text-gray-500 cursor-pointer">아이디 저장</label>
              </div>
              <button className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">비밀번호를 잊으셨나요?</button>
            </div>
          )}

          {type === 'signup' && (
            <div className="bg-gray-50 p-5 rounded-[28px] space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="terms-all" className="w-5 h-5 rounded-lg border-gray-200 text-yellow-400 focus:ring-yellow-400" />
                <label htmlFor="terms-all" className="text-sm font-black text-gray-900 cursor-pointer">모든 약관에 동의합니다.</label>
              </div>
              <div className="pl-8 space-y-2">
                <p className="text-xs font-bold text-gray-400 flex items-center justify-between">이용약관 동의 (필수) <ChevronRight className="w-3 h-3" /></p>
                <p className="text-xs font-bold text-gray-400 flex items-center justify-between">개인정보 수집 및 이용 동의 (필수) <ChevronRight className="w-3 h-3" /></p>
              </div>
            </div>
          )}

          <button 
            onClick={() => {
              setRole(activeTab);
              setPage('home');
            }}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-yellow-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 text-lg"
          >
            {type === 'login' ? '로그인' : '회원가입 완료'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-gray-400">
            {type === 'login' ? '아직 티처링크 회원이 아니신가요?' : '이미 계정이 있으신가요?'}
            <button 
              onClick={() => setPage(type === 'login' ? 'signup' : 'login')}
              className="ml-2 text-yellow-600 font-black hover:underline underline-offset-4"
            >
              {type === 'login' ? '회원가입하기' : '로그인하기'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [page, setPage] = useState('home');
  const [role, setRole] = useState<UserRole | null>(null);

  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-yellow-200 selection:text-yellow-900">
      <Header role={role} setPage={setPage} />
      
      <main>
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Home postings={MOCK_POSTINGS} setPage={setPage} />
            </motion.div>
          )}
          
          {page === 'job_detail' && (
            <motion.div key="job_detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <JobDetail onBack={() => setPage('home')} />
            </motion.div>
          )}

          {page === 'login' && (
            <AuthPage key="login" type="login" setPage={setPage} setRole={setRole} />
          )}

          {page === 'signup' && (
            <AuthPage key="signup" type="signup" setPage={setPage} setRole={setRole} />
          )}

          {page === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Dashboard postings={MOCK_POSTINGS} setPage={setPage} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

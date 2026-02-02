import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Header, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { JobDetail } from './pages/JobDetail';
import { Dashboard } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { authApi } from './lib/api/auth';
import type { UserType } from './types/database.types';

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


function AppContent() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const handleSignInSuccess = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      navigate('/');
    } catch (error) {
      console.error('Failed to get user:', error);
      setUser(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleSignUpSuccess = () => {
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-yellow-200 selection:text-yellow-900">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Home postings={MOCK_POSTINGS} />
                </motion.div>
              } 
            />
            <Route 
              path="/jobs/:id" 
              element={
                <motion.div key="job-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <JobDetail />
                </motion.div>
              } 
            />
            <Route 
              path="/sign-in" 
              element={
                <SignIn
                  key="sign-in"
                  onSuccess={handleSignInSuccess}
                  onSignUp={() => navigate('/sign-up')}
                />
              } 
            />
            <Route 
              path="/sign-up" 
              element={
                <SignUp
                  key="sign-up"
                  onSuccess={handleSignUpSuccess}
                  onSignIn={() => navigate('/sign-in')}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <Dashboard postings={MOCK_POSTINGS} />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

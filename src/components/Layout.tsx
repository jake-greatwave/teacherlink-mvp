import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Bell, User, Menu } from 'lucide-react';
import { TermsModal } from './TermsModal';

interface HeaderProps {
  user: any;
  onSignOut?: () => void;
}

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/images/teacher_logo.svg" alt="티처링크" className="h-10 w-auto" />
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-yellow-600 font-bold text-sm transition-colors">채용정보</button>
          <button className="text-gray-600 hover:text-yellow-600 font-bold text-sm transition-colors">교사지원</button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-2.5 bg-gray-50 hover:bg-yellow-50 pl-2 pr-4 py-1.5 rounded-full cursor-pointer transition-all border border-transparent hover:border-yellow-100" 
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user.user_type === 'kindergarten' ? 'K' : 'J'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[11px] font-bold text-gray-400 leading-none mb-1 uppercase tracking-wider">
                      {user.user_type === 'kindergarten' ? '유치원회원' : '교직원회원'}
                    </p>
                    <p className="text-sm font-bold text-gray-800 leading-none">{user.nickname} 님</p>
                  </div>
                </div>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    로그아웃
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={() => navigate('/sign-in')} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-yellow-600 transition-colors">로그인</button>
              <button onClick={() => navigate('/sign-up')} className="px-6 py-2.5 text-sm font-black bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 shadow-sm hover:shadow-md transition-all">회원가입</button>
            </div>
          )}
          <button className="lg:hidden p-2 text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null)

  return (
    <>
      <footer className="bg-white border-t border-gray-100 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <img src="/images/teacher_logo.svg" alt="티처링크" className="h-9 w-auto" />
              <span className="text-xl font-black tracking-tighter">티처링크</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              유치원 및 어린이집 전문 구인구직 플랫폼 티처링크입니다.<br />
              우리의 정성은 아이들의 밝은 미래가 됩니다.<br />
              선생님과 유치원 모두가 행복한 채용 문화를 만들어갑니다.
            </p>
          </div>
          
          <div>
            <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Menu</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li className="hover:text-yellow-600 cursor-pointer">채용정보 전체보기</li>
              <li className="hover:text-yellow-600 cursor-pointer">지역별 공고 검색</li>
              <li className="hover:text-yellow-600 cursor-pointer">인재 정보 서비스</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-gray-50 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <p>© 2026 티처링크 Inc. Proudly Built for Teachers.</p>
          <div className="flex gap-8">
            <span 
              onClick={() => setModalType('terms')}
              className="hover:text-gray-900 cursor-pointer"
            >
              이용약관
            </span>
            <span 
              onClick={() => setModalType('privacy')}
              className="text-yellow-600 hover:text-yellow-700 cursor-pointer"
            >
              개인정보처리방침
            </span>
            <span className="hover:text-gray-900 cursor-pointer">이메일무단수집거부</span>
          </div>
        </div>
      </footer>

      <TermsModal 
        type={modalType || 'terms'} 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)} 
      />
    </>
  )
};

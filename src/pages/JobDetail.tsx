import React from 'react';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  ChevronRight, 
  Heart, 
  FileText, 
  Share2, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  Home
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface JobDetailProps {
  onBack: () => void;
}

export const JobDetail = ({ onBack }: JobDetailProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-yellow-600 transition-colors">
          <Home className="w-4 h-4" />
        </button>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-xs font-bold text-gray-400">채용정보</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-xs font-bold text-gray-400">서울</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-xs font-black text-gray-900">담임교사 채용</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Main Content */}
        <div className="flex-1 space-y-12">
          {/* Header Area */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">추천공고</span>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">신입/경력</span>
              <span className="text-gray-400 text-xs font-bold ml-auto flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> 등록일: 2026.02.01 (오늘)
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              [꿈나래 유치원] 2026학년도 신입 및 경력 담임교사 정기 채용
            </h1>

            <div className="flex flex-wrap items-center gap-8 py-8 px-10 bg-gray-50 rounded-[32px] border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <MapPin className="text-yellow-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">근무지</p>
                  <p className="font-black text-gray-900 text-lg">서울 서초구</p>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Calendar className="text-yellow-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">급여</p>
                  <p className="font-black text-gray-900 text-lg">월 250만원 ~</p>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Briefcase className="text-yellow-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">모집인원</p>
                  <p className="font-black text-gray-900 text-lg">0명</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content (Naver Shopping Style Layout) */}
          <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-50">
              {['상세모집요강', '기관정보', '근무환경', '리뷰/평점'].map((tab, i) => (
                <button key={tab} className={`flex-1 py-6 text-sm font-black transition-all ${i === 0 ? 'text-yellow-600 border-b-4 border-yellow-400' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-12 space-y-16">
              {/* Banner */}
              <div className="relative rounded-[32px] overflow-hidden group">
                <ImageWithFallback src="https://images.unsplash.com/flagged/photo-1572818640942-05bbb70c9089?w=1200&q=80" alt="Kindergarten" className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                  <div className="text-white">
                    <h3 className="text-2xl font-black mb-2">우리 아이들의 꿈이 자라는 곳</h3>
                    <p className="font-medium opacity-90">꿈나래 유치원과 함께 성장할 역량있는 선생님을 찾습니다.</p>
                  </div>
                </div>
              </div>

              {/* Grid Layout for sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
                    <h3 className="text-xl font-black text-gray-900">모집 부문 및 인원</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1">담임교사 (0명)</p>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">유치원 정교사 자격증 소지자, 관련 학과 졸업 예정자 가능</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 mb-1">부담임교사 (0명)</p>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">교육에 대한 열정이 가득한 분, 신입 가능</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                    <h3 className="text-xl font-black text-gray-900">근무 조건 및 복지</h3>
                  </div>
                  <div className="space-y-4 font-bold text-gray-600">
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span>근무시간</span>
                      <span className="text-gray-900">08:30 ~ 17:30</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span>고용형태</span>
                      <span className="text-gray-900">정규직 (수습 3개월)</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span>보험/연금</span>
                      <span className="text-gray-900">4대보험, 퇴직연금</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span>기타복지</span>
                      <span className="text-gray-900">식사제공, 방학휴가</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruitment Step */}
              <div className="space-y-8 bg-yellow-50/50 p-10 rounded-[32px] border border-yellow-100">
                <h3 className="text-xl font-black text-gray-900 text-center">채용 절차</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
                  {[
                    { step: '01', title: '서류전형', icon: <FileText className="w-6 h-6" /> },
                    { step: '02', title: '면접심사', icon: <Briefcase className="w-6 h-6" /> },
                    { step: '03', title: '최종합격', icon: <CheckCircle2 className="w-6 h-6" /> },
                  ].map((item, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-yellow-500 border border-yellow-100">
                          {item.icon}
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-yellow-600 mb-1">STEP {item.step}</p>
                          <p className="font-black text-gray-900">{item.title}</p>
                        </div>
                      </div>
                      {i < 2 && <ChevronRight className="w-8 h-8 text-yellow-200 hidden md:block" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Sidebar */}
        <div className="w-full lg:w-96 space-y-8 lg:sticky lg:top-28">
          <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-xl shadow-yellow-200/10">
            <div className="mb-10 pb-8 border-b border-gray-50">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">기관 및 담당자 정보</h3>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 bg-gray-100 rounded-[24px] overflow-hidden border border-gray-50 shadow-sm">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" alt="Principal" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-1">꿈나래 유치원</h4>
                  <p className="text-sm font-bold text-gray-500 mb-2">박미영 원장</p>
                  <div className="flex gap-2">
                    <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-green-100">인증됨</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">전화번호</p>
                    <p className="text-sm font-bold text-gray-800">02-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">이메일</p>
                    <p className="text-sm font-bold text-gray-800">hr@dreamnarae.edu</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-red-500 flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-4 h-4" /> D-14일 남음
                </span>
                <span className="text-xs font-bold text-gray-400">지원자 12명</span>
              </div>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-black py-5 rounded-[24px] shadow-lg shadow-yellow-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg">
                <FileText className="w-6 h-6" /> 즉시 지원하기
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-4 border-2 border-gray-100 text-gray-600 font-black rounded-[24px] transition-all hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                  <Heart className="w-4 h-4" /> 찜하기
                </button>
                <button className="py-4 border-2 border-gray-100 text-gray-600 font-black rounded-[24px] transition-all hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                  <Share2 className="w-4 h-4" /> 공유
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
              <p className="text-[10px] text-gray-500 leading-normal font-medium">
                허위 구인 공고이거나 제안 받은 내용이 공고와 다를 경우 티처링크로 신고해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

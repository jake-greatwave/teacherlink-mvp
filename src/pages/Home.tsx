import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronRight, Award, Filter, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { JobCard } from '../components/JobCard';

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종'];
const JOB_CATEGORIES = ['담임교사', '부담임교사', '특수교사', '조리사/영양사', '행정/사무', '차량/안전'];

interface HomeProps {
  postings: any[];
}

export const Home = ({ postings }: HomeProps) => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('전체');

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative bg-yellow-50 overflow-hidden pt-20 pb-28 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-yellow-100 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-black text-yellow-600 uppercase tracking-widest">대한민국 No.1 유치원 구인구직</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight"
          >
            아이들의 밝은 미래를 함께할<br />
            <span className="text-yellow-500">최고의 선생님</span>을 연결합니다.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl font-medium leading-relaxed"
          >
            티처링크는 신뢰할 수 있는 기관과 열정 넘치는 교직원을 위한<br className="hidden md:block" />
            프리미엄 채용 플랫폼입니다.
          </motion.p>
          
          {/* Main Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-4xl bg-white p-3 rounded-3xl shadow-[0_20px_50px_rgba(234,179,8,0.1)] flex flex-col md:flex-row gap-2 border border-yellow-100"
          >
            <div className="flex-1 flex items-center px-6 py-4 border-r border-gray-100">
              <MapPin className="text-yellow-500 w-5 h-5 mr-4" />
              <div className="flex-1 text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">희망 지역</p>
                <select className="bg-transparent border-none focus:ring-0 text-gray-800 w-full font-bold p-0 text-base">
                  <option>지역을 선택하세요</option>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex-1 flex items-center px-6 py-4">
              <Briefcase className="text-yellow-500 w-5 h-5 mr-4" />
              <div className="flex-1 text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">채용 직종</p>
                <select className="bg-transparent border-none focus:ring-0 text-gray-800 w-full font-bold p-0 text-base">
                  <option>직종을 선택하세요</option>
                  {JOB_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-yellow-200/50 active:scale-95">
              <Search className="w-6 h-6" />
              공고찾기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 mt-28">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-yellow-500 w-6 h-6" />
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">티처링크 추천 공고</h2>
            </div>
            <p className="text-gray-400 font-bold">인증된 우수 교육 기관들의 프리미엄 채용 공고입니다.</p>
          </div>
          <button className="text-gray-400 hover:text-yellow-600 font-black text-sm flex items-center gap-2 group transition-all bg-white px-4 py-2 rounded-xl border border-gray-100 hover:border-yellow-100 shadow-sm">
            전체보기 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {postings.filter(p => p.is_recommended).map(job => (
            <JobCard key={job.id} job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
          ))}
        </div>
      </section>

      {/* Real-time Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32">
        <div className="bg-white border border-gray-100 rounded-[40px] p-10 md:p-16 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 relative z-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">실시간 지역별 채용</h2>
              <p className="text-gray-400 font-bold mb-8">내 주변 유치원의 최신 채용 정보를 한눈에 확인하세요.</p>
              
              <div className="flex flex-wrap gap-2">
                {['전체', '서울', '경기', '인천', '세종', '충청'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setSelectedRegion(tab)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${selectedRegion === tab ? 'bg-yellow-400 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-black shadow-lg hover:bg-gray-800 transition-all">
                <Filter className="w-4 h-4" /> 필터설정
              </button>
              <select className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 focus:ring-yellow-400">
                <option>최신순</option>
                <option>급여순</option>
                <option>마감임박순</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[...postings, ...postings].slice(0, 8).map((job, idx) => (
              <JobCard key={`${job.id}-${idx}`} job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
            ))}
          </div>
          
          <div className="mt-20 flex justify-center">
            <button className="group px-12 py-5 bg-white border-2 border-gray-100 text-gray-500 font-black rounded-2xl hover:border-yellow-200 hover:text-yellow-600 hover:bg-yellow-50/30 transition-all flex items-center gap-3">
              더 많은 공고 보기 
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: '누적 채용 성공', value: '12,450', unit: '건', color: 'text-blue-500' },
          { label: '활동 교직원', value: '45,000', unit: '명', color: 'text-yellow-500' },
          { label: '제휴 교육기관', value: '8,200', unit: '곳', color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 text-center shadow-xs">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color} tracking-tight`}>
              {stat.value}<span className="text-gray-400 text-xl ml-1 font-bold">{stat.unit}</span>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

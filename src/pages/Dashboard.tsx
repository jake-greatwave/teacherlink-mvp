import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Settings, 
  LogOut, 
  PlusCircle, 
  CheckCircle2, 
  X, 
  ChevronRight,
  BarChart3,
  Users,
  Eye,
  MessageSquare,
  Clock,
  MoreVertical,
  Heart
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface DashboardProps {
  postings: any[];
}

const Sidebar = () => {
  const navigate = useNavigate();
  
  return (
  <div className="w-full md:w-80 space-y-4">
    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 bg-yellow-100 rounded-[32px] flex items-center justify-center text-yellow-600 font-black text-3xl mb-4 shadow-sm border border-yellow-50 relative overflow-hidden">
          <ImageWithFallback src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-black text-gray-900">꿈나래 유치원</h2>
        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Premium Member</p>
      </div>

      <nav className="space-y-1">
        {[
          { icon: <BarChart3 className="w-5 h-5" />, label: '대시보드', active: true },
          { icon: <Briefcase className="w-5 h-5" />, label: '공고 관리', active: false },
          { icon: <Users className="w-5 h-5" />, label: '지원자 현황', active: false, badge: '4' },
          { icon: <MessageSquare className="w-5 h-5" />, label: '메시지 함', active: false },
          { icon: <Settings className="w-5 h-5" />, label: '내 정보 변경', active: false },
        ].map((item, i) => (
          <button 
            key={i}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${item.active ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200/50' : 'text-gray-500 hover:bg-gray-50 font-bold'}`}
          >
            <div className="flex items-center gap-3">
              <span className={item.active ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              <span className="text-sm font-black tracking-tight">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.active ? 'bg-white text-yellow-600' : 'bg-red-500 text-white'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-10 pt-8 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-50 rounded-2xl font-black text-sm transition-all group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          로그아웃
        </button>
      </div>
    </div>

    {/* Promotion Card */}
    <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4">Pro Plan</p>
      <h3 className="text-xl font-black mb-4 leading-tight">상위 노출로<br />더 빠르게 채용하세요.</h3>
      <button className="w-full py-3 bg-white text-gray-900 rounded-xl text-sm font-black hover:bg-yellow-400 transition-all">
        유료 서비스 안내
      </button>
    </div>
  </div>
  );
};

export const Dashboard = ({ postings }: DashboardProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
      <Sidebar />
      
      <div className="flex-1 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-600 font-black text-xs uppercase tracking-widest mb-2">
              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
              Management System
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">공고 관리</h1>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-yellow-200/50 transition-all active:scale-95">
            <PlusCircle className="w-6 h-6" /> 새 공고 작성하기
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: '진행 중 공고', value: '03', icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
            { label: '미열람 지원자', value: '04', icon: <Users className="w-5 h-5" />, color: 'bg-red-50 text-red-600' },
            { label: '누적 조회수', value: '1.2k', icon: <Eye className="w-5 h-5" />, color: 'bg-yellow-50 text-yellow-600' },
            { label: '스크랩 수', value: '45', icon: <Heart className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs flex flex-col justify-between h-40">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} shadow-sm`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Post List Table */}
        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-tight">최근 등록 공고</h3>
            <div className="flex items-center gap-4">
              <div className="flex p-1 bg-gray-50 rounded-xl">
                {['전체', '진행중', '마감'].map((t, i) => (
                  <button key={i} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${i === 1 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">공고 정보</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">상태</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">지원자</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">조회</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {postings.map((job) => (
                  <tr key={job.id} className="group hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="max-w-xs">
                        <p className="font-black text-gray-900 line-clamp-1 mb-1 group-hover:text-yellow-600 transition-colors cursor-pointer">{job.title}</p>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                          <span>{job.job_type}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 마감: {job.deadline}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                        진행중
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-blue-500 underline underline-offset-4 decoration-2 cursor-pointer">4명</span>
                        <span className="text-[9px] font-black text-red-500 mt-1">NEW</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-bold text-gray-600">342</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all">
                          <Settings className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-center">
            <button className="text-xs font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5">
              관리 공고 전체보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

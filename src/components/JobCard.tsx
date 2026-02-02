import React from 'react';
import { MapPin, Heart, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    facility_name: string;
    location: string;
    job_type: string;
    salary: string;
    deadline: string;
    is_recommended?: boolean;
    image: string;
  };
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export const JobCard = ({ job, onClick, variant = 'default' }: JobCardProps) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={onClick}
    className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group ${variant === 'compact' ? 'flex gap-4 p-3' : 'flex flex-col'}`}
  >
    <div className={`relative overflow-hidden shrink-0 ${variant === 'compact' ? 'w-24 h-24 rounded-xl' : 'h-48'}`}>
      <ImageWithFallback 
        src={job.image} 
        alt={job.facility_name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      {variant !== 'compact' && (
        <>
          <div className="absolute top-3 left-3 flex gap-2">
            {job.is_recommended && (
              <span className="bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">추천</span>
            )}
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md">{job.job_type}</span>
          </div>
          <button className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
    
    <div className={`${variant === 'compact' ? 'flex-1 py-1' : 'p-5 flex-1 flex flex-col'}`}>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5 font-medium uppercase tracking-tight">
        <MapPin className="w-3 h-3" />
        {job.location}
        <span className="mx-0.5">•</span>
        {job.facility_name}
      </div>
      <h3 className={`${variant === 'compact' ? 'text-sm' : 'text-base'} font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-yellow-600 transition-colors`}>
        {job.title}
      </h3>
      <div className={`flex items-center justify-between mt-auto ${variant === 'compact' ? '' : 'pt-4 border-t border-gray-50'}`}>
        <span className="text-yellow-600 font-bold text-sm">{job.salary}</span>
        {variant !== 'compact' && (
          <span className="text-gray-400 text-[11px] font-bold bg-gray-50 px-2 py-0.5 rounded text-uppercase">D-14</span>
        )}
      </div>
    </div>
  </motion.div>
);

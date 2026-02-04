
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Activity, User, ShieldCheck, MapPin, Layers, Target, Terminal as TerminalIcon } from 'lucide-react';
import { TimelineProgress } from '../hooks/useTimelineProgress';

const MotionDiv = motion.div as any;

/**
 * Large background text transition that reacts to search/archive state.
 * Refined for mobile to prevent overlapping functional UI.
 */
export const BackgroundLabel: React.FC<{ text: string; isLight: boolean; isGrid?: boolean }> = ({ text, isLight, isGrid }) => (
  <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
    <AnimatePresence mode="wait">
      <MotionDiv
        key={text}
        initial={{ opacity: 0, scale: 0.8, y: 30, filter: 'blur(10px)' }}
        animate={{ 
          opacity: isLight ? (isGrid ? 0.01 : 0.02) : (isGrid ? 0.02 : 0.04), 
          scale: isGrid ? 0.9 : 1, 
          y: isGrid ? '15vh' : '5vh', 
          filter: 'blur(0px)' 
        }}
        exit={{ opacity: 0, scale: 1.1, y: -30, filter: 'blur(10px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`text-[25vw] sm:text-[20vw] font-black uppercase tracking-tighter select-none whitespace-nowrap leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}
      >
        {text}
      </MotionDiv>
    </AnimatePresence>
  </div>
);

/**
 * Progress indicator for the timeline/grid.
 * Support for "slim" mode on mobile horizontal.
 */
export const TimelineProgressIndicator: React.FC<{ 
  stats: TimelineProgress; 
  isLight: boolean; 
  isGrid?: boolean;
}> = ({ stats, isLight, isGrid }) => {
  const color = isLight ? 'text-slate-900' : 'text-white';
  const subColor = isLight ? 'text-slate-500' : 'text-white/40';
  const format = (n: number) => n === 0 ? '--' : n.toString().padStart(2, '0');

  return (
    <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3 md:gap-6 font-mono text-[9px] uppercase font-bold landscape:flex-row landscape:justify-between landscape:gap-4 landscape:py-1">
      <div className="flex items-center gap-4 sm:gap-6 landscape:gap-4">
        <div className="flex flex-col gap-0.5 landscape:flex-row landscape:items-center landscape:gap-2">
          <span className={subColor}>UNITS</span>
          <div className="flex items-center gap-1.5">
            <Layers size={10} className="text-emerald-500" />
            <span className={color}>{format(stats.total)}</span>
          </div>
        </div>

        <div className="h-4 md:h-6 w-px bg-current opacity-10" />

        <div className="flex flex-col gap-0.5 landscape:flex-row landscape:items-center landscape:gap-2">
          <span className={subColor}>{isGrid ? 'WINDOW' : 'SCAN'}</span>
          <span className={color}>
            {format(stats.visibleRange[0])} <span className="opacity-20 mx-1">/</span> {format(stats.visibleRange[1])}
          </span>
        </div>

        <div className="h-4 md:h-6 w-px bg-current opacity-10" />

        <div className="flex flex-col gap-0.5 landscape:flex-row landscape:items-center landscape:gap-2">
          <span className={subColor}>FOCUS</span>
          <div className="flex items-center gap-1.5 text-emerald-500">
            <Target size={10} />
            <span>{format(stats.centeredIndex)}</span>
          </div>
        </div>
      </div>

      <div className="hidden md:block h-6 w-px bg-current opacity-10" />

      <div className="flex flex-col gap-1 w-full md:w-32 landscape:w-24 landscape:gap-0.5">
        <div className="flex justify-between w-full landscape:hidden">
          <span className={subColor}>SYNC</span>
          <span className={color}>{Math.round(stats.progress)}%</span>
        </div>
        <div className={`w-full h-[2px] ${isLight ? 'bg-slate-200' : 'bg-white/10'} rounded-full overflow-hidden landscape:h-[3px]`}>
          <motion.div 
            initial={false}
            animate={{ width: `${stats.progress}%` }}
            className="h-full bg-emerald-500"
          />
        </div>
        <div className="hidden landscape:flex justify-end w-full">
           <span className={`${color} text-[7px]`}>{Math.round(stats.progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export const ThemeToggle: React.FC<{ isLight: boolean; onToggle: () => void }> = ({ isLight, onToggle }) => (
  <button 
    onClick={onToggle}
    aria-label="Toggle Theme"
    className={`p-2 sm:p-3 rounded-xl transition-all duration-300 flex items-center gap-2 border shadow-sm ${isLight ? 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
  >
    {isLight ? <Moon size={16} /> : <Sun size={16} />}
    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
      {isLight ? 'NIGHT' : 'DAY'}
    </span>
  </button>
);

export const SystemReadout: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const [heartRate, setHeartRate] = useState(72);
  useEffect(() => {
    const interval = setInterval(() => setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1)), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`hidden sm:flex items-center gap-6 font-mono text-[8px] font-bold ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
      <div className="flex flex-col items-start gap-0.5">
        <span className="opacity-60 uppercase">BIOMETRIC</span>
        <div className="flex items-center gap-1.5 text-emerald-500">
          <Activity size={8} className="animate-pulse" />
          <span>READY_{heartRate}</span>
        </div>
      </div>
      <div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
      <div className="flex flex-col items-start gap-0.5">
        <span className="opacity-60 uppercase">UPLINK</span>
        <span className={isLight ? 'text-slate-900' : 'text-white'}>SECURE_V4.2</span>
      </div>
    </div>
  );
};

export const ProfileModule: React.FC<{ isLight: boolean; onClick: () => void }> = ({ isLight, onClick }) => {
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-500' : 'text-white/40';
  const borderCol = isLight ? 'border-slate-200' : 'border-white/10';
  const avatarSources = [
    '/profile/min-thant-htoo.png',
    '/profile/min-thant-htoo.jpg',
    '/profile/min-thant-htoo.jpeg',
    '/profile/min-thant-htoo.webp'
  ];
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const handleAvatarError = () => {
    if (avatarIndex < avatarSources.length - 1) {
      setAvatarIndex((prev) => prev + 1);
      return;
    }
    setAvatarFailed(true);
  };

  return (
    <div onClick={onClick} className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl border ${borderCol} p-1 bg-gradient-to-br from-emerald-500/10 to-transparent transition-all group-hover:scale-105 group-hover:border-emerald-500/30`}>
        <div className={`w-full h-full rounded-xl ${isLight ? 'bg-slate-100' : 'bg-black'} flex items-center justify-center relative overflow-hidden`}>
          {!avatarFailed ? (
            <img
              src={avatarSources[avatarIndex]}
              alt="Min Thant Htoo"
              className="w-full h-full object-cover object-center bg-[#7c828c]"
              onError={handleAvatarError}
            />
          ) : (
            <>
              <User size={20} className={`${isLight ? 'text-slate-300' : 'text-white/20'} group-hover:text-emerald-500 transition-colors duration-500 sm:w-6 sm:h-6`} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-full w-full animate-scan pointer-events-none" />
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <h2 className={`text-sm sm:text-lg font-black uppercase tracking-tight ${textColor} group-hover:text-emerald-500 transition-colors`}>MIN THANT HTOO</h2>
          <ShieldCheck size={10} className="text-emerald-500 sm:w-3 sm:h-3" />
        </div>
        <span className={`text-[7px] sm:text-[8px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>FULLSTACK_ENGINEER_X_MARKETING</span>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Activity, User, ShieldCheck, MapPin, Layers, Target, Terminal as TerminalIcon } from 'lucide-react';
import { TimelineProgress } from '../hooks/useTimelineProgress';

const MotionDiv = motion.div as any;

/**
 * Large background text transition that reacts to search/archive state.
 */
export const BackgroundLabel: React.FC<{ text: string; isLight: boolean }> = ({ text, isLight }) => (
  <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
    <AnimatePresence mode="wait">
      <MotionDiv
        key={text}
        initial={{ opacity: 0, scale: 0.85, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: isLight ? 0.03 : 0.05, scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.05, y: -30, filter: 'blur(10px)' }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className={`text-[20vw] font-black uppercase tracking-tighter select-none whitespace-nowrap leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}
      >
        {text}
      </MotionDiv>
    </AnimatePresence>
  </div>
);

/**
 * Progress indicator for the timeline.
 */
export const TimelineProgressIndicator: React.FC<{ stats: TimelineProgress; isLight: boolean }> = ({ stats, isLight }) => {
  const color = isLight ? 'text-slate-900' : 'text-white';
  const subColor = isLight ? 'text-slate-500' : 'text-white/40';
  const format = (n: number) => n === 0 ? '--' : n.toString().padStart(2, '0');

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 font-mono text-[9px] uppercase font-bold">
      <div className="flex flex-col gap-0.5">
        <span className={subColor}>UNITS</span>
        <div className="flex items-center gap-1.5">
          <Layers size={10} className="text-emerald-500" />
          <span className={color}>{format(stats.total)}</span>
        </div>
      </div>

      <div className="hidden md:block h-6 w-px bg-current opacity-10" />

      <div className="flex flex-col gap-0.5">
        <span className={subColor}>SCAN</span>
        <span className={color}>
          {format(stats.visibleRange[0])} <span className="opacity-20 mx-1">/</span> {format(stats.visibleRange[1])}
        </span>
      </div>

      <div className="hidden md:block h-6 w-px bg-current opacity-10" />

      <div className="flex flex-col gap-0.5">
        <span className={subColor}>FOCUS</span>
        <div className="flex items-center gap-1.5 text-emerald-500">
          <Target size={10} />
          <span>{format(stats.centeredIndex)}</span>
        </div>
      </div>

      <div className="hidden md:block h-6 w-px bg-current opacity-10" />

      <div className="flex flex-col gap-1 w-32">
        <div className="flex justify-between w-full">
          <span className={subColor}>SYNC</span>
          <span className={color}>{Math.round(stats.progress)}%</span>
        </div>
        <div className={`w-full h-[2px] ${isLight ? 'bg-slate-200' : 'bg-white/10'} rounded-full overflow-hidden`}>
          <motion.div 
            initial={false}
            animate={{ width: `${stats.progress}%` }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

export const ThemeToggle: React.FC<{ isLight: boolean; onToggle: () => void }> = ({ isLight, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 border shadow-sm ${isLight ? 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
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
    <div className={`hidden lg:flex items-center gap-6 font-mono text-[8px] font-bold ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
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

  return (
    <div onClick={onClick} className="flex items-center gap-4 cursor-pointer group">
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border ${borderCol} p-1 bg-gradient-to-br from-emerald-500/10 to-transparent transition-all group-hover:scale-105 group-hover:border-emerald-500/30`}>
        <div className={`w-full h-full rounded-lg ${isLight ? 'bg-slate-100' : 'bg-black'} flex items-center justify-center relative overflow-hidden`}>
          <User size={24} className={`${isLight ? 'text-slate-300' : 'text-white/20'} group-hover:text-emerald-500 transition-colors duration-500`} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-full w-full animate-scan pointer-events-none" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <h2 className={`text-base md:text-lg font-black uppercase tracking-tight ${textColor} group-hover:text-emerald-500 transition-colors`}>ALEX_NEXUS</h2>
          <ShieldCheck size={12} className="text-emerald-500" />
        </div>
        <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>PRINCIPAL_ARCHITECT</span>
      </div>
    </div>
  );
};

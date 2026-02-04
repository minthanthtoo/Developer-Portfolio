
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Microscope, Cpu as Processor, Zap, Database, Github, Terminal } from 'lucide-react';
import { Project } from '../types';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

const SNAPPY_SPRING = { type: "spring", damping: 30, stiffness: 400, mass: 0.6 };
const DOCK_SPRING = { type: "spring", stiffness: 300, damping: 20, mass: 0.1 };

export const ProjectHUD: React.FC<{ project: Project; isLight: boolean }> = ({ project, isLight }) => {
  const cardBg = isLight ? 'bg-white/98' : 'bg-black/90';
  const borderCol = isLight ? 'border-slate-300' : 'border-white/20';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-600' : 'text-white/60';

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      className={`z-[100] p-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[240px] pointer-events-none ${cardBg} ${borderCol}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-black uppercase tracking-widest ${subTextColor}`}>Matrix_Status</span>
          <span className="text-emerald-500 text-[8px] font-mono font-bold">ID_{project.id}</span>
        </div>
        
        <div className="space-y-1">
          <h4 className={`text-xs font-black uppercase tracking-tight ${textColor}`}>{project.title}</h4>
          <p className={`text-[10px] italic font-light line-clamp-2 ${subTextColor}`}>{project.tagline}</p>
        </div>

        <div className={`h-px w-full ${isLight ? 'bg-slate-100' : 'bg-white/10'}`} />

        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map(s => (
            <span key={s} className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${isLight ? 'border-slate-300 text-slate-600 bg-slate-50' : 'border-white/20 text-white/50 bg-white/10'}`}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </MotionDiv>
  );
};

export const AppIcon: React.FC<{ 
  project: Project; 
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  showLabel?: boolean;
  mousePos?: any; 
  isDocked?: boolean;
  isLight?: boolean;
  axis?: 'x' | 'y';
}> = ({ project, size = 'md', isActive, onClick, onMouseEnter, onMouseLeave, showLabel = true, mousePos, isDocked, isLight, axis = 'y' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const internalMousePos = useMotionValue(Infinity);
  const effectiveMousePos = mousePos || internalMousePos;
  
  const distance = useTransform(effectiveMousePos, (val: number) => {
    if (!ref.current) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    const center = axis === 'y' ? (bounds.y + bounds.height / 2) : (bounds.x + bounds.width / 2);
    return val - center;
  });

  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.3, 1]);
  const magnificationScale = useSpring(scaleSync, DOCK_SPRING);
  
  const iconSizes = {
    sm: 'w-12 h-12 rounded-2xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl'
  };

  const getCategoryIcon = (cat: string, title: string) => {
    const t = title.toLowerCase();
    if (t.includes('bio') || t.includes('neural')) return <Microscope size={size === 'sm' ? 20 : 28} strokeWidth={1.2} />;
    if (cat === 'CORE') return <Processor size={size === 'sm' ? 20 : 28} strokeWidth={1.2} />;
    if (cat === 'AI') return <Zap size={size === 'sm' ? 20 : 28} strokeWidth={1.2} />;
    if (cat === 'SaaS') return <Database size={size === 'sm' ? 20 : 28} strokeWidth={1.2} />;
    if (cat === 'OPEN') return <Github size={size === 'sm' ? 20 : 28} strokeWidth={1.2} />;
    return <Terminal size={size === 'sm' ? 20 : 28} strokeWidth={1.2} />;
  };

  return (
    <MotionDiv 
      ref={ref}
      layout
      layoutId={`app-icon-wrapper-${project.id}`}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ scale: magnificationScale }}
      className={`relative flex flex-col items-center gap-3 cursor-pointer group shrink-0 z-20 will-change-transform transform-gpu`}
      transition={SNAPPY_SPRING}
    >
      <MotionDiv 
        layoutId={`app-icon-shape-${project.id}`}
        className={`${iconSizes[size]} flex items-center justify-center relative overflow-hidden transition-all duration-300 border ${isLight ? 'border-slate-300' : 'border-white/20'} ${isActive ? 'ring-2 ring-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'group-hover:border-white/50'}`}
        style={{ 
          background: `linear-gradient(135deg, ${project.iconColor}EE, ${project.iconColor}99)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/30" />
        <MotionDiv 
          layoutId={`app-icon-graphic-${project.id}`}
          className="text-white drop-shadow-lg z-10 pointer-events-none"
        >
          {getCategoryIcon(project.category, project.title)}
        </MotionDiv>
      </MotionDiv>
      
      <AnimatePresence>
        {showLabel && (
          <MotionSpan 
            layoutId={`app-icon-label-${project.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`text-[9px] font-bold tracking-[0.2em] transition-colors text-center px-1 truncate max-w-[100px] ${isLight ? 'text-slate-500 group-hover:text-slate-900' : 'text-white/50 group-hover:text-white'}`}
          >
            {project.title.toUpperCase()}
          </MotionSpan>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
};

export const ProjectNavDock: React.FC<{ 
  projects: Project[]; 
  activeId: string | null; 
  onSelect: (id: string) => void; 
  isLight: boolean;
}> = ({ projects, activeId, onSelect, isLight }) => {
  const mousePos = useMotionValue(Infinity);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <MotionDiv 
      key="sidebar-dock"
      initial={{ x: isMobile ? 0 : -120, y: isMobile ? 120 : 0, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ x: isMobile ? 0 : -120, y: isMobile ? 120 : 0, opacity: 0 }}
      transition={SNAPPY_SPRING}
      onMouseMove={(e: any) => mousePos.set(isMobile ? e.pageX : e.pageY)}
      onMouseLeave={() => mousePos.set(Infinity)}
      className={`fixed z-[400] flex items-center transition-colors shadow-2xl backdrop-blur-3xl
        md:left-0 md:top-0 md:bottom-0 md:w-28 md:flex-col md:py-12 md:px-0 md:border-r md:h-full md:justify-center md:gap-8
        bottom-0 left-0 right-0 h-24 flex-row px-8 border-t justify-start gap-6 overflow-x-auto no-scrollbar
        ${isLight ? 'bg-white/95 border-slate-300' : 'bg-black/90 border-white/20'}`}
    >
      {[...projects].reverse().map((p) => (
        <AppIcon 
          key={p.id} 
          project={p} 
          size="sm" 
          isActive={activeId === p.id}
          showLabel={false}
          mousePos={mousePos}
          isDocked={true}
          isLight={isLight}
          onClick={() => onSelect(p.id)} 
          axis={isMobile ? 'x' : 'y'}
        />
      ))}
    </MotionDiv>
  );
};

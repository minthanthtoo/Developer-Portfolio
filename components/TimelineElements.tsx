
import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Project } from '../types';
import { AppIcon, ProjectHUD } from './Projects';

const YEAR_WIDTH = 600; 
const MONTH_STEP = YEAR_WIDTH / 12;
const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const MotionDiv = motion.div as any;

export const YearBlock: React.FC<{ 
  year: string; 
  projects: Project[]; 
  isLight: boolean;
  onSelectProject: (id: string) => void;
  mouseX: any;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  spineY: number;
}> = ({ year, projects, isLight, onSelectProject, mouseX, nodeRefs, spineY }) => {
  const monthGroups = useMemo(() => {
    const groups: Record<number, Project[]> = {};
    projects.forEach(p => {
      if (!groups[p.month]) groups[p.month] = [];
      groups[p.month].push(p);
    });
    return groups;
  }, [projects]);

  return (
    <div className="relative h-full shrink-0" style={{ width: `${YEAR_WIDTH}px` }}>
      {/* Subtle Background Year Indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <span className={`text-[12vw] font-black tracking-tighter opacity-[0.02] ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {year}
        </span>
      </div>
      
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none border-l border-dashed border-current opacity-5" />

      {(Object.entries(monthGroups) as [string, Project[]][]).map(([month, monthProjects]) => (
        <div 
          key={month} 
          className="absolute h-full flex items-start" 
          style={{ left: `${(parseInt(month) - 1) * MONTH_STEP}px` }}
        >
          <div className="flex items-start gap-10">
            {monthProjects.map(p => (
              <TimelineNode 
                key={p.id} 
                project={p} 
                isLight={isLight} 
                mouseX={mouseX} 
                onSelect={() => onSelectProject(p.id)} 
                nodeRef={(el) => {
                  if (el) nodeRefs.current.set(p.id, el);
                  else nodeRefs.current.delete(p.id);
                }}
                spineY={spineY}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const TimelineNode: React.FC<{ 
  project: Project; 
  isLight: boolean; 
  onSelect: () => void;
  mouseX: any;
  nodeRef?: (el: HTMLDivElement | null) => void;
  spineY: number;
}> = ({ project, isLight, onSelect, mouseX, nodeRef, spineY }) => {
  const [isHovered, setIsHovered] = useState(false);
  const textColor = isLight ? 'text-slate-900' : 'text-white';

  return (
    <div ref={nodeRef} className="relative flex flex-col items-center shrink-0 w-[100px] h-full">
      {/* App Icon above the line */}
      <div className="absolute top-0 flex flex-col items-center w-full pt-6">
        <AppIcon 
          project={project} 
          size="lg" 
          showLabel={false} 
          isLight={isLight} 
          onClick={onSelect} 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          mousePos={mouseX}
          axis="x"
        />
        {/* Short Connector */}
        <div 
          style={{ height: `${spineY - 120}px` }}
          className={`w-[1px] border-l ${isLight ? 'border-slate-300' : 'border-white/10'} mt-2 transition-all duration-500 ${isHovered ? 'border-emerald-500/50' : ''}`} 
        />
      </div>

      {/* Spine Dot */}
      <div 
        style={{ top: `${spineY}px` }} 
        className="absolute -translate-y-1/2 flex flex-col items-center z-30 pointer-events-none"
      >
        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 border-2 ${isLight ? 'border-slate-50' : 'border-[#060606]'} ${isHovered ? 'scale-150 bg-emerald-500 shadow-[0_0_10px_#10B981]' : isLight ? 'bg-slate-400' : 'bg-white/40'}`} />
      </div>

      {/* Date Label (Above Dot) */}
      <div 
        style={{ top: `${spineY - 24}px` }}
        className="absolute flex flex-col items-center pointer-events-none z-40"
      >
        <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
          {MONTH_NAMES[project.month - 1]} '{project.year.slice(2)}
        </span>
      </div>

      {/* Project Title (Below Dot) */}
      <div 
        style={{ top: `${spineY + 16}px` }}
        className="absolute flex flex-col items-center pointer-events-none text-center w-max max-w-[140px] z-40"
      >
        <h3 className={`text-[13px] font-serif italic tracking-tight transition-all leading-none ${isHovered ? 'opacity-100' : 'opacity-40'} ${textColor}`}>
          {project.title}
        </h3>
      </div>

      <AnimatePresence>
        {isHovered && (
          <MotionDiv 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            style={{ top: `${spineY + 45}px` }} 
            className="absolute w-full flex justify-center z-[100]"
          >
             <ProjectHUD project={project} isLight={isLight} />
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

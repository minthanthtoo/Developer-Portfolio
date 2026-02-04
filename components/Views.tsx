
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Mail, Github, Linkedin, Award, Binary, 
  ChevronLeft, ChevronRight, Boxes, ArrowUpRight,
  ExternalLink, Calendar, Code, Sparkles
} from 'lucide-react';
import { Project } from '../types';

const MotionDiv = motion.div as any;
const MotionImg = motion.img as any;

// Fast transition for detail views
const FAST_TRANSITION = { type: "spring", damping: 30, stiffness: 500, mass: 0.5 };
const IMAGE_TRANSITION = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };
const FEATURED_PROJECT_IDS = new Set(['myango', 'myangrow', 'tb-calendar']);

export const GridView: React.FC<{ projects: Project[]; isLight: boolean; onSelect: (id: string) => void; nodeRefs?: React.MutableRefObject<Map<string, HTMLDivElement>> }> = ({ projects, isLight, onSelect, nodeRefs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
      {projects.map((project, idx) => (
        <ProjectGridCard 
          key={project.id} 
          project={project} 
          isLight={isLight} 
          onSelect={onSelect}
          delay={idx * 0.05}
          nodeRef={(el) => {
            if (nodeRefs && el) nodeRefs.current.set(project.id, el);
            else if (nodeRefs) nodeRefs.current.delete(project.id);
          }}
        />
      ))}
    </div>
  );
};

const ProjectGridCard: React.FC<{ project: Project; isLight: boolean; onSelect: (id: string) => void; delay: number; nodeRef?: (el: HTMLDivElement | null) => void }> = ({ project, isLight, onSelect, delay, nodeRef }) => {
  const isFlagship = project.tier === 'flagship';
  const isFeatured = FEATURED_PROJECT_IDS.has(project.id);
  const borderColor = isLight ? 'border-slate-200 hover:border-emerald-500/50' : 'border-white/10 hover:border-emerald-500/50';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-500' : 'text-white/40';

  return (
    <MotionDiv
      ref={nodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(project.id)}
      className={`group relative flex flex-col rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''} ${isLight ? 'bg-white shadow-sm hover:shadow-2xl' : 'bg-white/5 hover:bg-white/10 shadow-2xl'} ${borderColor}` }
    >
      <div className={`overflow-hidden relative ${isFeatured ? 'aspect-[21/10]' : 'aspect-[16/10]'}`}>
        <MotionImg 
          src={project.images[0]} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
        
        {/* Tier Badge */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {isFeatured && (
            <span className="px-3 py-1 bg-cyan-400 text-black text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg shadow-cyan-400/20">
              <Sparkles size={10} />
              Spotlight
            </span>
          )}
          {isFlagship && (
            <span className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
              <Award size={10} />
              Flagship
            </span>
          )}
          {project.origin === 'Vibe-Coded' && (
            <span className="px-3 py-1 bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg shadow-pink-500/20">
              <Sparkles size={10} />
              Vibe
            </span>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8 flex flex-col gap-4 sm:gap-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>{project.category}</span>
            <span className={`text-[10px] font-mono font-black ${subTextColor}`}>{project.year}</span>
          </div>
          <h3 className={`${isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-serif italic tracking-tight ${textColor}`}>{project.title}</h3>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${isFeatured ? 'line-clamp-3' : 'line-clamp-2'} ${subTextColor}`}>{project.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-md border text-[8px] font-mono font-black uppercase ${isLight ? 'border-slate-200 text-slate-600 bg-slate-50' : 'border-white/15 text-white/65 bg-white/5'}`}>
            {project.deployTarget}
          </span>
          <span className={`px-2 py-1 rounded-md border text-[8px] font-mono font-black uppercase ${project.liveDemoUrl ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10' : isLight ? 'border-slate-200 text-slate-400 bg-slate-50' : 'border-white/10 text-white/40 bg-white/5'}`}>
            {project.liveDemoUrl ? 'LIVE_DEMO_READY' : 'LIVE_DEMO_PENDING'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 sm:pt-2">
          {project.stack.slice(0, 3).map(s => (
            <span key={s} className={`px-2 py-1 rounded-md border ${isLight ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-white/10 text-white/40 bg-white/5'} text-[8px] font-mono font-bold uppercase`}>
              {s}
            </span>
          ))}
          {project.stack.length > 3 && (
            <span className={`px-2 py-1 rounded-md text-[8px] font-mono font-bold uppercase ${subTextColor}`}>
              +{project.stack.length - 3}
            </span>
          )}
        </div>

        <div className={`mt-1 sm:mt-2 flex items-center gap-2 text-[10px] font-mono font-black uppercase transition-colors group-hover:text-emerald-500 ${subTextColor}`}>
          View Details
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </MotionDiv>
  );
};

export const ProfileContent: React.FC<{ onClose: () => void; isLight: boolean }> = ({ onClose, isLight }) => {
  const avatarSources = [
    '/profile/min-thant-htoo.png',
    '/profile/min-thant-htoo.jpg',
    '/profile/min-thant-htoo.jpeg',
    '/profile/min-thant-htoo.webp'
  ];
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-500' : 'text-white/40';
  const borderCol = isLight ? 'border-slate-300' : 'border-white/10';

  const handleAvatarError = () => {
    if (avatarIndex < avatarSources.length - 1) {
      setAvatarIndex((prev) => prev + 1);
      return;
    }
    setAvatarFailed(true);
  };

  return (
    <MotionDiv 
      layoutId="profile-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
      transition={FAST_TRANSITION}
      className={`relative w-full max-w-4xl mx-auto md:rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${isLight ? 'bg-white' : 'bg-[#0A0A0A]'}`}
    >
      <div className={`flex items-center justify-between px-8 py-5 border-b ${isLight ? 'bg-slate-50/80' : 'bg-black/40'} backdrop-blur-md`}>
        <button onClick={onClose} className="flex items-center gap-3 text-[10px] font-mono font-black uppercase text-emerald-500 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          SYSTEM_EXIT
        </button>
        <div className={`text-[9px] font-mono font-black uppercase ${subTextColor}`}>ID_VERIFIED_77412</div>
      </div>

      <div className="p-10 md:p-16 flex flex-col gap-16">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className={`w-32 h-32 md:w-44 md:h-44 rounded-3xl border ${borderCol} p-2 bg-gradient-to-br from-emerald-500/10 to-transparent shrink-0`}>
            <div className={`w-full h-full rounded-2xl ${isLight ? 'bg-slate-100' : 'bg-black'} flex items-center justify-center relative overflow-hidden`}>
              {!avatarFailed ? (
                <img
                  src={avatarSources[avatarIndex]}
                  alt="Min Thant Htoo"
                  className="w-full h-full object-contain object-center bg-[#7c828c]"
                  onError={handleAvatarError}
                />
              ) : (
                <>
                  <Binary size={48} className="text-emerald-500/20" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-full w-full animate-scan" />
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-8 flex-1 text-center md:text-left">
            <div className="space-y-3">
              <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tight ${textColor}`}>Min Thant Htoo</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 text-emerald-500 font-mono text-[10px] font-bold tracking-widest">
                <span>FULLSTACK_ENGINEER</span>
                <span className="opacity-20">/</span>
                <span>MULTI_INDUSTRY + MARKETING</span>
              </div>
            </div>
            
            <p className={`text-base md:text-xl font-serif italic leading-relaxed opacity-80 ${textColor}`}>
              "Building cross-industry products across medicine, agriculture, fintech, and education, then scaling them with AI systems and practical GTM thinking from past marketing experience."
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-mono font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-colors">ESTABLISH_UPLINK</button>
              <button className={`px-6 py-3 rounded-xl border ${borderCol} ${textColor} font-mono font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors`}>SOURCE_VAULT</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award size={18} className="text-emerald-500" />
              <span className={`text-[11px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>CORE_LOGIC</span>
            </div>
            <ul className={`space-y-4 text-sm font-medium ${textColor}`}>
              <li className="flex items-start gap-3 opacity-70"><span className="text-emerald-500 font-mono font-black text-[10px]">01</span> Cross-industry delivery: Medicine (TB Team Calendar), Agriculture (myangrow), and Fintech/Education workflows (myango)</li>
              <li className="flex items-start gap-3 opacity-70"><span className="text-emerald-500 font-mono font-black text-[10px]">02</span> Fullstack systems thinking: secure workflows, team collaboration, sync, and AI automation</li>
              <li className="flex items-start gap-3 opacity-70"><span className="text-emerald-500 font-mono font-black text-[10px]">03</span> Past marketing background: positioning, campaign strategy, funnel optimization, and adoption</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Boxes size={18} className="text-emerald-500" />
              <span className={`text-[11px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>TECHNOLOGY_STACK</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Medicine / TB Ops', 'Agri Intelligence', 'Fintech UX', 'Education Workflows', 'Growth Marketing', 'Python / Flask', 'React / TypeScript', 'AI Automation'].map(skill => (
                <span key={skill} className={`px-3 py-1.5 rounded-lg border ${borderCol} text-[9px] font-mono font-bold uppercase ${textColor} opacity-60`}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export const ProjectContent: React.FC<{ project: Project; onClose: () => void; isLight: boolean }> = ({ project, onClose, isLight }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-500' : 'text-white/40';

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % project.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <MotionDiv 
      layoutId="project-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
      transition={FAST_TRANSITION}
      className={`relative w-full max-w-6xl mx-auto md:rounded-3xl border shadow-2xl flex flex-col md:flex-row overflow-hidden md:h-[80vh] ${isLight ? 'bg-white' : 'bg-[#0A0A0A]'}`}
    >
      {/* Visual Side */}
      <div className="md:w-3/5 relative bg-black flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/10 group">
        <AnimatePresence mode="wait">
          <MotionImg 
            key={currentImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={IMAGE_TRANSITION}
            src={project.images[currentImg]} 
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        {project.images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={prevImg}
              className="p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-emerald-500 hover:text-black transition-all pointer-events-auto backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImg}
              className="p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-emerald-500 hover:text-black transition-all pointer-events-auto backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
        
        <div className="absolute bottom-8 left-10 right-10 flex flex-col gap-6 z-20">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-emerald-500 text-black text-[8px] font-mono font-black rounded">{project.year}</span>
              <span className="text-white/50 text-[9px] font-mono font-bold uppercase tracking-widest">{project.tagline}</span>
              {project.origin === 'Vibe-Coded' && (
                <span className="px-2 py-0.5 bg-pink-500 text-white text-[8px] font-mono font-black rounded">VIBE-CODED</span>
              )}
            </div>
            <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-none tracking-tighter">{project.title}</h2>
          </div>
          
          <div className="flex gap-2">
            {project.images.map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                className={`h-1 rounded-full transition-all duration-500 ${currentImg === i ? 'w-8 bg-emerald-500' : 'w-3 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        <button onClick={onClose} className="absolute top-8 left-8 p-3 rounded-xl bg-black/40 border border-white/10 text-white hover:bg-emerald-500 hover:text-black transition-all z-20">
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Info Side */}
      <div className="md:w-2/5 p-10 md:p-12 flex flex-col gap-8 overflow-y-auto no-scrollbar">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-[1.5px] bg-emerald-500" />
              <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>SYSTEM_DOSSIER</span>
            </div>
            {project.githubLink && (
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={14} />
                <span className="text-[9px] font-mono font-black uppercase tracking-widest">SOURCE_VAULT</span>
              </a>
            )}
          </div>
          <p className={`text-base font-serif italic leading-relaxed ${textColor} opacity-80`}>{project.description}</p>
        </section>

        <div className={`grid grid-cols-2 gap-6 py-6 border-y ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex flex-col gap-1">
            <span className={`text-[8px] font-mono font-black uppercase opacity-40 ${textColor}`}>STATUS</span>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-[10px] font-mono font-bold ${textColor}`}>{project.status}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`text-[8px] font-mono font-black uppercase opacity-40 ${textColor}`}>ORIGIN</span>
            <span className={`text-[10px] font-mono font-bold ${project.origin === 'Vibe-Coded' ? 'text-pink-500' : 'text-emerald-500'}`}>{project.origin}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`text-[8px] font-mono font-black uppercase opacity-40 ${textColor}`}>DEPLOY_TARGET</span>
            <span className={`text-[10px] font-mono font-bold ${textColor}`}>{project.deployTarget}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`text-[8px] font-mono font-black uppercase opacity-40 ${textColor}`}>SECURITY</span>
            <span className={`text-[10px] font-mono font-bold ${project.securityProfile === 'Server secrets' ? 'text-emerald-500' : project.securityProfile === 'Public + RLS' ? 'text-cyan-500' : textColor}`}>{project.securityProfile}</span>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Boxes size={14} className="text-emerald-500" />
            <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>DEPENDENCIES</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map(s => (
              <span key={s} className={`px-3 py-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/50'} text-[9px] font-mono font-bold uppercase`}>{s}</span>
            ))}
          </div>
        </section>

        <div className="mt-auto pt-8 flex flex-col gap-3">
          {project.liveDemoUrl ? (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl border border-emerald-500/30 text-emerald-500 font-mono font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-all active:scale-95"
            >
              <ExternalLink size={14} />
              OPEN_LIVE_DEMO
            </a>
          ) : (
            <div className={`w-full py-4 rounded-xl border ${isLight ? 'border-slate-200 text-slate-400 bg-slate-50' : 'border-white/10 text-white/40 bg-white/5'} font-mono font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2`}>
              LIVE_DEMO_PENDING
            </div>
          )}

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-xl border ${isLight ? 'border-slate-300 text-slate-900' : 'border-white/10 text-white'} font-mono font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-all active:scale-95`}
            >
              <Github size={14} />
              OPEN_GITHUB_REPOSITORY
            </a>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

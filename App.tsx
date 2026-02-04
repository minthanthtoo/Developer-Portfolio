
import React, { useState, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { PROJECTS } from './constants';
import { Project } from './types';
import { Search, Terminal, Clock, Filter } from 'lucide-react';

import { BackgroundLabel, ThemeToggle, SystemReadout, ProfileModule, TimelineProgressIndicator } from './components/UI';
import { ProjectNavDock } from './components/Projects';
import { ProfileContent, ProjectContent } from './components/Views';
import { YearBlock } from './components/TimelineElements';
import { useTimelineProgress } from './hooks/useTimelineProgress';

const SPINE_Y = 180; 
const TIMELINE_HEIGHT = 380; 

const MotionDiv = motion.div as any;

const App: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const mouseXTimeline = useMotionValue(Infinity);
  const timelineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const activeProject = useMemo(() => PROJECTS.find(p => p.id === selectedProjectId) || null, [selectedProjectId]);

  const backgroundText = useMemo(() => {
    if (selectedProjectId && activeProject) return activeProject.category;
    if (isProfileOpen) return "PROFILE";
    return searchQuery ? "SEARCH" : "ARCHIVE";
  }, [isProfileOpen, activeProject, selectedProjectId, searchQuery]);

  const allTags = useMemo(() => {
    const tagsMap: Record<string, number> = {};
    PROJECTS.forEach(p => { p.stack.forEach(s => { tagsMap[s] = (tagsMap[s] || 0) + 1; }); });
    return Object.entries(tagsMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const categorizedTags = useMemo(() => {
    const categories = {
      Languages: ['Rust', 'TypeScript', 'Python', 'Go', 'C++', 'C', 'Zig'],
      Frameworks: ['React', 'Node.js', 'Next.js', 'PyTorch', 'TensorFlow', 'gRPC', 'D3.js'],
      Infrastructure: ['K8s', 'Docker', 'AWS', 'IPFS', 'Vector_DB', 'PostgreSQL', 'Redis', 'Kafka'],
      Domain: ['NLP', 'CV', 'Genomics', 'Bio-UI', 'High_Performance_Computing']
    };
    return Object.entries(categories).map(([name, items]) => ({
      name,
      items: allTags.filter(([tag]) => items.includes(tag))
    })).filter(cat => cat.items.length > 0);
  }, [allTags]);

  const filteredProjectsByYear = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = PROJECTS.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(q) || 
                            p.stack.some(s => s.toLowerCase().includes(q)) ||
                            p.category.toLowerCase().includes(q);
      const matchesTags = selectedTags.length === 0 || selectedTags.some(t => p.stack.includes(t));
      const matchesYears = selectedYears.length === 0 || selectedYears.includes(p.year);
      return matchesSearch && matchesTags && matchesYears;
    });

    const yearsMap: Record<string, Project[]> = {};
    filtered.forEach(p => {
      if (!yearsMap[p.year]) yearsMap[p.year] = [];
      yearsMap[p.year].push(p);
    });
    
    return Object.entries(yearsMap).sort((a, b) => a[0].localeCompare(b[0]));
  }, [searchQuery, selectedTags, selectedYears]);

  const filteredProjectsFlat = useMemo(() => 
    filteredProjectsByYear.flatMap(([, projects]) => projects), 
    [filteredProjectsByYear]
  );

  const filteredProjectIds = useMemo(() => filteredProjectsFlat.map(p => p.id), [filteredProjectsFlat]);
  const timelineStats = useTimelineProgress(timelineRef, nodeRefs, filteredProjectIds);

  const latestProject = useMemo(() => {
    if (filteredProjectsByYear.length === 0) return null;
    const lastYearGroup = filteredProjectsByYear[filteredProjectsByYear.length - 1][1];
    return [...lastYearGroup].sort((a, b) => b.month - a.month)[0];
  }, [filteredProjectsByYear]);

  useLayoutEffect(() => {
    if (!timelineRef.current || !latestProject) return;
    const container = timelineRef.current;
    const node = nodeRefs.current.get(latestProject.id);
    if (node) {
      let offset = 0;
      let curr: HTMLElement | null = node;
      while (curr && curr !== container) {
        offset += curr.offsetLeft;
        curr = curr.offsetParent as HTMLElement;
      }
      const scrollLeft = (offset + node.offsetWidth / 2) - (container.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: hasInitialized ? 'smooth' : 'auto' });
      if (!hasInitialized) setHasInitialized(true);
    }
  }, [latestProject, hasInitialized]);

  useEffect(() => {
    document.body.style.overflow = (selectedProjectId || isProfileOpen) ? 'hidden' : '';
    document.body.className = `${isLightMode ? 'light-mode bg-slate-50' : 'dark-mode bg-[#060606]'} matrix-grid`;
  }, [selectedProjectId, isProfileOpen, isLightMode]);

  const handleSelectProject = (id: string) => { setSelectedProjectId(id); setIsProfileOpen(false); };
  const handleOpenProfile = () => { setIsProfileOpen(true); setSelectedProjectId(null); };

  return (
    <div className={`relative min-h-screen flex flex-col items-center transition-colors duration-1000 ease-in-out`}>
      <BackgroundLabel text={backgroundText} isLight={isLightMode} />

      <div className="w-full max-w-screen-2xl relative z-10 flex flex-col min-h-screen">
        <header className="px-8 md:px-16 pt-8 pb-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <ProfileModule isLight={isLightMode} onClick={handleOpenProfile} />
            <div className="flex items-center gap-6">
              <SystemReadout isLight={isLightMode} />
              <ThemeToggle isLight={isLightMode} onToggle={() => setIsLightMode(!isLightMode)} />
            </div>
          </div>

          <MotionDiv 
            style={{ 
              opacity: (selectedProjectId || isProfileOpen) ? 0 : 1,
              transform: (selectedProjectId || isProfileOpen) ? 'translateY(-10px)' : 'translateY(0px)'
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-700"
          >
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-emerald-500" />
                  <span className={`text-[9px] font-mono font-black tracking-widest uppercase ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>QUERY_INITIATOR</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl px-5 py-3 border shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 group ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <Search size={16} className={`${isLightMode ? 'text-slate-500' : 'text-white/40'} group-focus-within:text-emerald-500`} />
                  <input 
                    type="text" 
                    placeholder="SCAN_ARCHIVE..." 
                    className={`bg-transparent border-none outline-none flex-1 text-xs font-mono font-bold uppercase placeholder:opacity-30 ${isLightMode ? 'text-slate-900' : 'text-white'}`} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </div>

              <div className={`p-5 rounded-xl border ${isLightMode ? 'bg-slate-100/50 border-slate-200' : 'bg-white/5 border-white/10'} flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-emerald-500" />
                  <span className={`text-[9px] font-mono font-black tracking-widest uppercase ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>SYSTEM_LOGS</span>
                </div>
                <div className={`text-[10px] font-mono leading-relaxed font-medium ${isLightMode ? 'text-slate-700' : 'text-white/70'}`}>
                  Archive entries: <span className="text-emerald-500">{filteredProjectIds.length} modules</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className={`flex items-center justify-between border-b pb-3 ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="flex items-center gap-2">
                  <Filter size={12} className="text-emerald-500" />
                  <h3 className={`text-[9px] font-mono font-black tracking-widest uppercase ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>FILTER_STACKS</h3>
                </div>
                {(selectedTags.length > 0 || searchQuery !== '') && (
                  <button onClick={() => {setSelectedTags([]); setSearchQuery('');}} className="text-[9px] font-mono font-black uppercase text-emerald-500 hover:text-emerald-400 transition-colors">CLEAR</button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {categorizedTags.map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${isLightMode ? 'text-slate-500' : 'text-white/40'}`}>{cat.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(([tag, count]) => (
                        <button 
                          key={tag}
                          onClick={() => setSelectedTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                          className={`px-2.5 py-1 rounded border text-[9px] font-mono font-bold uppercase tracking-wider transition-all active:scale-95 ${selectedTags.includes(tag) ? 'bg-emerald-500 border-emerald-500 text-black' : `${isLightMode ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-400' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'}`}`}
                        >
                          {tag} <span className="opacity-40 text-[7px] ml-1">{count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        </header>

        <main 
          className="relative w-full flex-1 flex flex-col justify-center py-2 transition-all duration-700"
          style={{ 
            opacity: (selectedProjectId || isProfileOpen) ? 0 : 1,
            transform: (selectedProjectId || isProfileOpen) ? 'scale(0.99)' : 'scale(1)'
          }}
        >
          <div 
            ref={timelineRef} 
            className="w-full flex items-start overflow-x-auto no-scrollbar px-[48vw] pb-16"
            onMouseMove={(e) => mouseXTimeline.set(e.pageX)}
            onMouseLeave={() => mouseXTimeline.set(Infinity)}
          >
            <div className="relative flex items-start min-w-max h-full" style={{ minHeight: `${TIMELINE_HEIGHT}px` }}>
              <div style={{ top: `${SPINE_Y}px` }} className={`absolute left-0 right-0 h-[1px] ${isLightMode ? 'bg-slate-300' : 'bg-white/20'} z-0`} />
              <AnimatePresence mode="popLayout">
                {filteredProjectsByYear.map(([year, projects]) => (
                  <YearBlock 
                    key={year} 
                    year={year} 
                    projects={projects} 
                    isLight={isLightMode} 
                    onSelectProject={handleSelectProject}
                    mouseX={mouseXTimeline}
                    nodeRefs={nodeRefs}
                    spineY={SPINE_Y}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-inherit pointer-events-none z-10" style={{ background: `linear-gradient(to right, ${isLightMode ? '#f8fafc' : '#060606'} 5%, transparent)` }} />
          <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-inherit pointer-events-none z-10" style={{ background: `linear-gradient(to left, ${isLightMode ? '#f8fafc' : '#060606'} 5%, transparent)` }} />
        </main>

        <footer className="px-12 md:px-16 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <TimelineProgressIndicator stats={timelineStats} isLight={isLightMode} />
          <div className={`flex items-center gap-4 text-[8px] font-mono tracking-[0.3em] font-black uppercase opacity-40 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
            <span>EST_2016</span>
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span>NEXUS_CORE</span>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {(selectedProjectId || isProfileOpen) && (
          <>
            <ProjectNavDock projects={filteredProjectsFlat} activeId={selectedProjectId} onSelect={handleSelectProject} isLight={isLightMode} />
            <MotionDiv 
              key="overlay-backdrop"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              onClick={() => {setSelectedProjectId(null); setIsProfileOpen(false);}}
              className="fixed inset-0 z-[350] bg-black/90 backdrop-blur-2xl"
            />
            <div className="fixed inset-0 z-[360] md:pl-32 pb-24 md:pb-0 overflow-y-auto no-scrollbar">
              <div className="min-h-full py-12 md:py-20 px-8 md:px-16 flex flex-col items-center justify-start">
                {selectedProjectId ? (
                  <ProjectContent project={activeProject!} onClose={() => setSelectedProjectId(null)} isLight={isLightMode} />
                ) : (
                  <ProfileContent onClose={() => setIsProfileOpen(false)} isLight={isLightMode} />
                )}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .animate-scan { animation: scan 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;

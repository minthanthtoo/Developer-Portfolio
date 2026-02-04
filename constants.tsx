
import { Project, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'CORE', label: 'Systems & Architecture', backgroundLabel: 'ARCHITECT' },
  { id: 'AI', label: 'Machine Intelligence', backgroundLabel: 'SYNAPSE' },
  { id: 'SaaS', label: 'SaaS Platforms', backgroundLabel: 'NUCLEUS' },
  { id: 'OPEN', label: 'Open Source', backgroundLabel: 'SOURCE' },
  { id: 'LABS', label: 'Experimental', backgroundLabel: 'LABS' },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neural_Hyperion',
    category: 'CORE',
    description: 'A distributed graph database engine optimized for real-time genomic mapping and sub-millisecond data traversals. Engineered for high-throughput biological computation.',
    images: [
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2024',
    month: 11,
    tagline: 'Bio-consensus at scale.',
    stack: ['Rust', 'gRPC', 'Genomics', 'K8s', 'Distributed_Systems'],
    status: 'Production',
    origin: 'Hand-Coded',
    platform: 'System',
    role: 'Backend',
    iconColor: '#2DD4BF',
    githubLink: 'https://github.com/nexus/hyperion'
  },
  {
    id: '2',
    title: 'Nexus_Diagnostic',
    category: 'CORE',
    description: 'A performance-first headless component library built for clinical telemetry dashboards and surgical environments. Zero latency, maximum precision.',
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2023',
    month: 3,
    tagline: 'Visual precision, accelerated.',
    stack: ['TypeScript', 'Bio-UI', 'React', 'Canvas', 'WebGL'],
    status: 'V1.0',
    origin: 'Hand-Coded',
    platform: 'Web',
    role: 'Frontend',
    iconColor: '#007AFF',
    githubLink: 'https://github.com/nexus/diagnostic-ui'
  },
  {
    id: '3',
    title: 'Aura_Microscope',
    category: 'AI',
    description: 'Edge-computing computer vision platform for automated pathological slide analysis and cell tracking in real-time environments.',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e024?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2024',
    month: 6,
    tagline: 'Pathology, synthesized.',
    stack: ['Python', 'PyTorch', 'C++', 'CV', 'CUDA'],
    status: 'Beta',
    origin: 'Hand-Coded',
    platform: 'System',
    role: 'Fullstack',
    iconColor: '#A855F7',
    githubLink: 'https://github.com/nexus/aura-cv'
  },
  {
    id: '4',
    title: 'Clinical_Scribe',
    category: 'AI',
    description: 'Context-aware LLM orchestration for automated medical documentation from patient dialogue analysis and clinical recordings.',
    images: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1504868584819-f8e90ece2cd1?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2024',
    month: 2,
    tagline: 'Self-documenting healthcare.',
    stack: ['NLP', 'Vector_DB', 'Next.js', 'Whisper_API', 'LangChain'],
    status: 'Lab',
    origin: 'Vibe-Coded',
    platform: 'Web',
    role: 'Frontend',
    iconColor: '#EC4899'
  },
  {
    id: '5',
    title: 'Flow_EMR',
    category: 'SaaS',
    description: 'Intuitive patient pipeline management with integrated automated triage and patient sentiment analysis for high-volume clinics.',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1551288049-bbda08a28a9e?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2023',
    month: 1,
    tagline: 'Patient velocity, unlocked.',
    stack: ['Node.js', 'PostgreSQL', 'Redis', 'React', 'Zustand'],
    status: 'Production',
    origin: 'Hand-Coded',
    platform: 'Web',
    role: 'Fullstack',
    iconColor: '#34C759',
    githubLink: 'https://github.com/nexus/flow-emr'
  },
  {
    id: '6',
    title: 'Git_Pathogen',
    category: 'OPEN',
    description: 'Visualize code-contributor velocity and vulnerability hotspots across mission-critical monorepos. Advanced analytics for repo health.',
    images: [
      'https://images.unsplash.com/photo-1618401471353-b98aade122f1?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2022',
    month: 10,
    tagline: 'Engineering epidemiology.',
    stack: ['Go', 'D3.js', 'GitHub_API', 'Redis', 'Canvas'],
    status: 'V1.0',
    origin: 'Hand-Coded',
    platform: 'Web',
    role: 'Backend',
    iconColor: '#F59E0B',
    githubLink: 'https://github.com/nexus/git-pathogen'
  },
  {
    id: '7',
    title: 'Quant_Engine',
    category: 'CORE',
    description: 'Low-latency execution core for high-frequency algorithmic trading of synthetic biological assets. Performance is everything.',
    images: [
      'https://images.unsplash.com/photo-1611974764058-947395603b5e?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1642172672064-24927513225b?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2025',
    month: 1,
    tagline: 'Market liquidity, redefined.',
    stack: ['Zig', 'C++', 'QUIC', 'FPGA', 'High_Performance_Computing'],
    status: 'Production',
    origin: 'Hand-Coded',
    platform: 'System',
    role: 'Backend',
    iconColor: '#F43F5E',
    githubLink: 'https://github.com/nexus/quant-core'
  },
  {
    id: '8',
    title: 'Cortex_Pulse',
    category: 'AI',
    description: 'Real-time EEG signal processing suite for neuro-feedback loops and brain-computer interfacing across consumer and medical hardware.',
    images: [
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1600'
    ],
    year: '2024',
    month: 9,
    tagline: 'Syncing mind and machine.',
    stack: ['Python', 'TensorFlow', 'WebSockets', 'Go', 'DSP'],
    status: 'Beta',
    origin: 'Hand-Coded',
    platform: 'Desktop',
    role: 'Fullstack',
    iconColor: '#8B5CF6'
  }
];
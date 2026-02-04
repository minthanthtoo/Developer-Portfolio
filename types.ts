
export interface Project {
  id: string;
  title: string;
  category: CategoryID;
  description: string;
  images: string[];
  year: string;
  month: number; // 1-12
  tagline: string;
  stack: string[];
  status: 'Production' | 'Beta' | 'Lab' | 'V1.0';
  origin: 'Vibe-Coded' | 'Hand-Coded';
  platform: 'Web' | 'Mobile' | 'CLI' | 'System' | 'Desktop';
  role: 'Frontend' | 'Backend' | 'Fullstack';
  iconColor: string;
  link?: string;
  githubLink?: string;
}

export type CategoryID = 'CORE' | 'AI' | 'SaaS' | 'OPEN' | 'LABS';

export interface Category {
  id: CategoryID;
  label: string;
  backgroundLabel: string;
}
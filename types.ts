export type DeploymentTarget =
  | 'Static Site'
  | 'Static + API'
  | 'Web Service'
  | 'Web Service + DB'
  | 'Library/CLI'
  | 'Research Artifact';

export type SecurityProfile = 'Public-only' | 'Public + RLS' | 'Server secrets' | 'N/A';

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
  tier: 'flagship' | 'secondary';
  deployTarget: DeploymentTarget;
  securityProfile: SecurityProfile;
  liveDemoUrl?: string;
  link?: string;
  githubLink?: string;
}

export type CategoryID = 'CORE' | 'AI' | 'SaaS' | 'OPEN' | 'LABS';

export interface Category {
  id: CategoryID;
  label: string;
  backgroundLabel: string;
}

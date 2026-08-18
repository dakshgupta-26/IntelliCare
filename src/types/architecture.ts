export interface TechItem {
  name: string;
  category: 'Frontend' | 'Motion' | 'Backend' | 'Communication' | 'Data & Storage' | 'AI & ML' | 'Optimization' | 'Infrastructure';
  role: string;
  description: string;
  badge: string;
  status: 'production' | 'active' | 'integrated';
}

export interface PipelineStep {
  id: string;
  number: string;
  label: 'OBSERVE' | 'PREDICT' | 'OPTIMIZE' | 'EXPLAIN' | 'SIMULATE' | 'DECIDE';
  headline: string;
  subhead: string;
  description: string;
  inputs: string[];
  algorithms: string[];
  outputs: string[];
  accentColor: string;
  badge: string;
}

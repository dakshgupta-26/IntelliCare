import { create } from 'zustand';

export type AppRoute =
  // Public Marketing & Deep Dive Routes
  | '/'
  | '/platform'
  | '/intelligence'
  | '/optimization'
  | '/scenarios'
  | '/architecture'
  | '/technology'
  // Auth Routes
  | '/login'
  | '/signup'
  // Authenticated Enterprise Application Routes
  | '/app'
  | '/app/dashboard'
  | '/app/resources'
  | '/app/resources/:id'
  | '/app/models'
  | '/app/clinical-ai'
  | '/app/forecasting'
  | '/app/optimization'
  | '/app/scenarios'
  | '/app/knowledge'
  | '/app/knowledge/assistant'
  | '/app/recommendations'
  | '/app/analytics'
  | '/app/alerts'
  | '/app/activity'
  | '/app/settings'
  | '/app/profile'
  | '/admin';

interface RouterStore {
  currentPath: string;
  routeParams: Record<string, string>;
  navigate: (path: string) => void;
  initRouter: () => () => void;
}

const normalizePath = (path: string): string => {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
  return cleanPath;
};

export const useRouterStore = create<RouterStore>((set) => ({
  currentPath: typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/',
  routeParams: {},

  navigate: (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    set({ currentPath: normalizePath(path) });
  },

  initRouter: () => {
    if (typeof window === 'undefined') return () => {};

    const handlePopState = () => {
      set({ currentPath: normalizePath(window.location.pathname) });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  },
}));

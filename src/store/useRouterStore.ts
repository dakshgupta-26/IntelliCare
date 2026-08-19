import { create } from 'zustand';

export type AppRoute = 
  | '/' 
  | '/platform' 
  | '/intelligence' 
  | '/optimization' 
  | '/scenarios' 
  | '/architecture' 
  | '/technology';

interface RouterStore {
  currentPath: AppRoute;
  navigate: (path: AppRoute) => void;
  initRouter: () => () => void;
}

const normalizePath = (path: string): AppRoute => {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
  const validRoutes: AppRoute[] = [
    '/',
    '/platform',
    '/intelligence',
    '/optimization',
    '/scenarios',
    '/architecture',
    '/technology',
  ];
  return (validRoutes.includes(cleanPath as AppRoute) ? cleanPath : '/') as AppRoute;
};

export const useRouterStore = create<RouterStore>((set) => ({
  currentPath: typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/',

  navigate: (path: AppRoute) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    set({ currentPath: path });
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

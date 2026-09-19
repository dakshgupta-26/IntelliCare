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
  | '/register'
  | '/verify-email'
  | '/forgot-password'
  | '/reset-password'
  // Authenticated Enterprise Application Routes
  | '/app'
  | '/app/dashboard'
  | '/app/resources'
  | '/app/resources/:id'
  | '/app/models'
  | '/app/clinical-ai'
  | '/app/forecasting'
  | '/app/appointments'
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

export interface ParsedUrl {
  pathname: string;
  search: string;
  hash: string;
}

export const parseUrl = (rawPath: string): ParsedUrl => {
  let target = rawPath || '/';
  if (target.startsWith('http://') || target.startsWith('https://')) {
    try {
      const parsed = new URL(target);
      target = parsed.pathname + parsed.search + parsed.hash;
    } catch {}
  }
  const [pathAndQuery, hash = ''] = target.split('#');
  const [pathname = '/', search = ''] = pathAndQuery.split('?');
  const cleanPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  return {
    pathname: cleanPath,
    search: search ? `?${search}` : '',
    hash: hash ? `#${hash}` : ''
  };
};

interface RouterStore {
  currentPath: string;
  search: string;
  routeParams: Record<string, string>;
  getSearchParam: (key: string) => string | null;
  navigate: (path: string) => void;
  initRouter: () => () => void;
}

const getInitialUrl = (): ParsedUrl => {
  if (typeof window !== 'undefined') {
    return parseUrl(window.location.pathname + window.location.search + window.location.hash);
  }
  return { pathname: '/', search: '', hash: '' };
};

const initial = getInitialUrl();

export const useRouterStore = create<RouterStore>((set, get) => ({
  currentPath: initial.pathname,
  search: initial.search,
  routeParams: {},

  getSearchParam: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(get().search || window.location.search);
      return sp.get(key);
    }
    const sp = new URLSearchParams(get().search);
    return sp.get(key);
  },

  navigate: (path: string) => {
    const { pathname, search, hash } = parseUrl(path);
    if (typeof window !== 'undefined') {
      const fullUrl = pathname + search + hash;
      const currentFull = window.location.pathname + window.location.search + window.location.hash;
      if (currentFull !== fullUrl) {
        window.history.pushState({}, '', fullUrl);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    set({ currentPath: pathname, search });
  },

  initRouter: () => {
    if (typeof window === 'undefined') return () => {};

    const handlePopState = () => {
      const { pathname, search } = parseUrl(
        window.location.pathname + window.location.search + window.location.hash
      );
      set({ currentPath: pathname, search });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  },
}));

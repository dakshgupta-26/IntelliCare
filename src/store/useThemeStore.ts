import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDOM = (resolved: 'dark' | 'light') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark', // Healthcare dark cockpit default
  resolvedTheme: 'dark',

  setTheme: (theme: ThemeMode) => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    applyThemeToDOM(resolved);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('intellicare-theme', theme);
    }
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  initTheme: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('intellicare-theme') as ThemeMode | null;
    const initialTheme: ThemeMode = stored || 'dark';
    const resolved = initialTheme === 'system' ? getSystemTheme() : initialTheme;
    applyThemeToDOM(resolved);
    set({ theme: initialTheme, resolvedTheme: resolved });

    // Listen for OS system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (get().theme === 'system') {
        const newResolved = getSystemTheme();
        applyThemeToDOM(newResolved);
        set({ resolvedTheme: newResolved });
      }
    };
    mediaQuery.addEventListener('change', handleChange);
  }
}));

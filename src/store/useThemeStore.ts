import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const applyThemeToDOM = () => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.add('dark');
  root.classList.remove('light');
  root.style.colorScheme = 'dark';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark', // IntelliCare unified dark world
  resolvedTheme: 'dark',

  setTheme: (_theme: ThemeMode) => {
    // Landing page & application operate in dedicated dark system
    applyThemeToDOM();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('intellicare-theme', 'dark');
    }
    set({ theme: 'dark', resolvedTheme: 'dark' });
  },

  toggleTheme: () => {
    applyThemeToDOM();
    set({ theme: 'dark', resolvedTheme: 'dark' });
  },

  initTheme: () => {
    if (typeof window === 'undefined') return;
    applyThemeToDOM();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('intellicare-theme', 'dark');
    }
    set({ theme: 'dark', resolvedTheme: 'dark' });
  }
}));

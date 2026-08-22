import { create } from 'zustand';

interface CommandPaletteState {
  isOpen: boolean;
  searchQuery: string;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  setSearchQuery: (query: string) => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  searchQuery: '',
  setIsOpen: (open: boolean) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setSearchQuery: (query: string) => set({ searchQuery: query })
}));

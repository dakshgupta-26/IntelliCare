import { create } from 'zustand';
import { ResourceMetric, ResourceCategory, ResourceStatus } from '../types/resources';
import { RESOURCES_DATA } from '../data/mockDatabase';

interface ResourceFilterState {
  searchQuery: string;
  categoryFilter: ResourceCategory | 'ALL';
  statusFilter: ResourceStatus | 'ALL';
  departmentFilter: string; // 'all' or department ID
  sortBy: keyof ResourceMetric;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

interface ResourceStore {
  resources: ResourceMetric[];
  filters: ResourceFilterState;
  selectedResourceId: string | null;
  isDetailDrawerOpen: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: ResourceCategory | 'ALL') => void;
  setStatusFilter: (status: ResourceStatus | 'ALL') => void;
  setDepartmentFilter: (deptId: string) => void;
  setSorting: (field: keyof ResourceMetric) => void;
  setPage: (page: number) => void;
  setSelectedResourceId: (id: string | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
  updateResource: (id: string, updates: Partial<ResourceMetric>) => void;
  getFilteredResources: () => ResourceMetric[];
  getResourceById: (id: string) => ResourceMetric | undefined;
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: RESOURCES_DATA,
  filters: {
    searchQuery: '',
    categoryFilter: 'ALL',
    statusFilter: 'ALL',
    departmentFilter: 'all',
    sortBy: 'utilizationRate',
    sortOrder: 'desc',
    page: 1,
    pageSize: 8
  },
  selectedResourceId: null,
  isDetailDrawerOpen: false,

  setSearchQuery: (query: string) => {
    set((state) => ({
      filters: { ...state.filters, searchQuery: query, page: 1 }
    }));
  },

  setCategoryFilter: (category) => {
    set((state) => ({
      filters: { ...state.filters, categoryFilter: category, page: 1 }
    }));
  },

  setStatusFilter: (status) => {
    set((state) => ({
      filters: { ...state.filters, statusFilter: status, page: 1 }
    }));
  },

  setDepartmentFilter: (deptId) => {
    set((state) => ({
      filters: { ...state.filters, departmentFilter: deptId, page: 1 }
    }));
  },

  setSorting: (field) => {
    set((state) => {
      const isSameField = state.filters.sortBy === field;
      const nextOrder = isSameField && state.filters.sortOrder === 'asc' ? 'desc' : 'asc';
      return {
        filters: { ...state.filters, sortBy: field, sortOrder: nextOrder }
      };
    });
  },

  setPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page }
    }));
  },

  setSelectedResourceId: (id) => {
    set({
      selectedResourceId: id,
      isDetailDrawerOpen: id !== null
    });
  },

  setDetailDrawerOpen: (open) => {
    set({ isDetailDrawerOpen: open });
  },

  updateResource: (id, updates) => {
    set((state) => ({
      resources: state.resources.map((r) => (r.id === id ? { ...r, ...updates } : r))
    }));
  },

  getFilteredResources: () => {
    const { resources, filters } = get();
    return resources.filter((res) => {
      const matchesSearch =
        filters.searchQuery === '' ||
        res.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        res.code.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        res.departmentName.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesCategory =
        filters.categoryFilter === 'ALL' || res.category === filters.categoryFilter;

      const matchesStatus =
        filters.statusFilter === 'ALL' || res.status === filters.statusFilter;

      const matchesDept =
        filters.departmentFilter === 'all' || res.departmentId === filters.departmentFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesDept;
    }).sort((a, b) => {
      const valA = a[filters.sortBy];
      const valB = b[filters.sortBy];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return filters.sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  },

  getResourceById: (id: string) => {
    return get().resources.find((r) => r.id === id);
  }
}));

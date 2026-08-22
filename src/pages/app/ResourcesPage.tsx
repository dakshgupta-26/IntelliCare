import React from 'react';
import {
  Boxes,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Bed,
  Users,
  Cpu,
  Activity
} from 'lucide-react';
import { useResourceStore } from '../../store/useResourceStore';
import { useHospitalStore } from '../../store/useHospitalStore';
import { useRouterStore } from '../../store/useRouterStore';
import { ResourceCategory, ResourceStatus } from '../../types/resources';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { ResourceDetailPage } from './ResourceDetailPage';

export const ResourcesPage: React.FC = () => {
  const resources = useResourceStore((state) => state.resources);
  const filters = useResourceStore((state) => state.filters);
  const setSearchQuery = useResourceStore((state) => state.setSearchQuery);
  const setCategoryFilter = useResourceStore((state) => state.setCategoryFilter);
  const setStatusFilter = useResourceStore((state) => state.setStatusFilter);
  const setDepartmentFilter = useResourceStore((state) => state.setDepartmentFilter);
  const setSorting = useResourceStore((state) => state.setSorting);
  const setPage = useResourceStore((state) => state.setPage);
  const selectedResourceId = useResourceStore((state) => state.selectedResourceId);
  const setSelectedResourceId = useResourceStore((state) => state.setSelectedResourceId);
  const isDetailDrawerOpen = useResourceStore((state) => state.isDetailDrawerOpen);
  const setDetailDrawerOpen = useResourceStore((state) => state.setDetailDrawerOpen);
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const getResourceById = useResourceStore((state) => state.getResourceById);
  const departments = useHospitalStore((state) => state.departments);
  const navigate = useRouterStore((state) => state.navigate);

  const filtered = getFilteredResources();
  const totalPages = Math.ceil(filtered.length / filters.pageSize) || 1;
  const paginated = filtered.slice((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize);

  const selectedResource = selectedResourceId ? getResourceById(selectedResourceId) : undefined;

  const getStatusBadge = (status: ResourceStatus) => {
    switch (status) {
      case 'CRITICAL':
        return <Badge variant="rose" size="sm" dot>CRITICAL LOAD</Badge>;
      case 'HIGH_UTILIZATION':
        return <Badge variant="amber" size="sm" dot>HIGH UTILIZATION</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="indigo" size="sm">MAINTENANCE</Badge>;
      case 'OFFLINE':
        return <Badge variant="slate" size="sm">OFFLINE</Badge>;
      case 'OPTIMAL':
      default:
        return <Badge variant="emerald" size="sm" dot>OPTIMAL</Badge>;
    }
  };

  const getCategoryIcon = (cat: ResourceCategory) => {
    switch (cat) {
      case 'ICU_BED':
      case 'BED':
        return <Bed className="w-4 h-4 text-cyan-400" />;
      case 'NURSE':
      case 'PHYSICIAN':
        return <Users className="w-4 h-4 text-indigo-400" />;
      case 'EQUIPMENT':
        return <Cpu className="w-4 h-4 text-teal-400" />;
      case 'OPERATING_THEATRE':
        return <Activity className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Capacity & Assets
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              {resources.length} Total Registered Operational Units
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Hospital Resource Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time telemetry, bed allocation states, equipment readiness, and staffing ratio bounds across departments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => useResourceStore.getState().setSearchQuery('')}
          >
            Reset Filters
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            onClick={() => navigate('/app/optimization')}
          >
            Run Allocation Solver
          </Button>
        </div>
      </div>

      {/* 2. Department Quick Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {departments.map((d) => (
          <div
            key={d.id}
            onClick={() => setDepartmentFilter(filters.departmentFilter === d.id ? 'all' : d.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              filters.departmentFilter === d.id
                ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md'
                : 'bg-surface-100 dark:bg-[#0a1628] border-slate-700/80 dark:border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span className="truncate">{d.name}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  d.status === 'CRITICAL' ? 'bg-rose-500' : d.status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">{d.utilizationRate}%</span>
              <span className="text-[10px] font-mono text-slate-400">
                {d.occupiedBeds}/{d.totalBeds} beds
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Controls Header */}
      <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by resource name, code, or department..."
            className="w-full bg-surface-200/60 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Category */}
          <select
            value={filters.categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-surface-200/60 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 appearance-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="ICU_BED">ICU Beds</option>
            <option value="BED">General Beds</option>
            <option value="NURSE">Nursing Staff</option>
            <option value="PHYSICIAN">Physicians</option>
            <option value="EQUIPMENT">Equipment & Devices</option>
            <option value="OPERATING_THEATRE">Operating Theatres</option>
          </select>

          {/* Status */}
          <select
            value={filters.statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-surface-200/60 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="CRITICAL">Critical Load</option>
            <option value="HIGH_UTILIZATION">High Utilization</option>
            <option value="OPTIMAL">Optimal</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          {/* Department Filter */}
          <select
            value={filters.departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-surface-200/60 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 appearance-none cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Powerful Modern Resource Table */}
      <div className="rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-surface-200/40 dark:bg-[#07111f]/80 text-[11px] font-mono uppercase text-slate-400">
                <th
                  onClick={() => setSorting('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Resource</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => setSorting('departmentName')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => setSorting('totalCapacity')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Capacity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => setSorting('available')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Available</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => setSorting('utilizationRate')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Utilization Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-300">No resources found</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((res) => (
                  <tr
                    key={res.id}
                    onClick={() => setSelectedResourceId(res.id)}
                    className="hover:bg-surface-200/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Resource Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-surface-200 border border-slate-700/50 shrink-0">
                          {getCategoryIcon(res.category)}
                        </div>
                        <div>
                          <div className="font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {res.name}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {res.code} • {res.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {res.departmentName}
                    </td>

                    {/* Capacity */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                      {res.totalCapacity} <span className="text-[10px] text-slate-500 font-normal">{res.unit}</span>
                    </td>

                    {/* Available */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={res.available <= 1 ? 'text-rose-400' : 'text-emerald-400'}>
                        {res.available}
                      </span>
                    </td>

                    {/* Utilization Progress */}
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-surface-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              res.utilizationRate >= 90
                                ? 'bg-rose-500'
                                : res.utilizationRate >= 75
                                ? 'bg-amber-400'
                                : 'bg-cyan-400'
                            }`}
                            style={{ width: `${Math.min(100, res.utilizationRate)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-200 w-10 text-right">
                          {res.utilizationRate}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(res.status)}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {res.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResourceId(res.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200 transition-colors"
                        title="View Resource Detail"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-surface-200/30 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Showing {(filters.page - 1) * filters.pageSize + 1} to{' '}
            {Math.min(filters.page * filters.pageSize, filtered.length)} of {filtered.length} resources
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={filters.page <= 1}
              onClick={() => setPage(filters.page - 1)}
              className="px-3 py-1 rounded-lg border border-slate-700 bg-surface-200 hover:bg-surface-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200"
            >
              Previous
            </button>
            <span className="px-2 font-bold text-white">
              {filters.page} / {totalPages}
            </span>
            <button
              disabled={filters.page >= totalPages}
              onClick={() => setPage(filters.page + 1)}
              className="px-3 py-1 rounded-lg border border-slate-700 bg-surface-200 hover:bg-surface-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 5. Sliding Resource Detail Drawer (/resources/:id) */}
      <Drawer
        isOpen={isDetailDrawerOpen && selectedResource !== undefined}
        onClose={() => setDetailDrawerOpen(false)}
        title={selectedResource ? selectedResource.name : 'Resource Details'}
        subtitle={selectedResource ? `${selectedResource.code} • ${selectedResource.departmentName}` : ''}
        width="xl"
      >
        {selectedResource && (
          <ResourceDetailPage resource={selectedResource} />
        )}
      </Drawer>
    </div>
  );
};

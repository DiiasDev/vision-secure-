import type { FilterBarProps } from './types';

export function FilterBar({ filter, onFilterChange, totalAll, totalExpiring }: FilterBarProps) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium mr-2" style={{ color: 'var(--text-secondary)' }}>
        Filtrar:
      </span>
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          filter === 'all'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-transparent hover:bg-gray-100'
        }`}
        style={filter !== 'all' ? { color: 'var(--text-secondary)' } : {}}
      >
        Todos ({totalAll})
      </button>
      <button
        onClick={() => onFilterChange('expiring')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          filter === 'expiring'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-transparent hover:bg-gray-100'
        }`}
        style={filter !== 'expiring' ? { color: 'var(--text-secondary)' } : {}}
      >
        Apenas Vencendo ({totalExpiring})
      </button>
    </div>
  );
}

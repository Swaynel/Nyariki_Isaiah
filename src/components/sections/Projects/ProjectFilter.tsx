import { ProjectFilter as FilterType } from '@/src/types';

interface ProjectFilterProps {
  filters: string[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function ProjectFilterComponent({ filters, activeFilter, onFilterChange }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter as FilterType)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === filter
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {filter === 'all' ? 'All' : filter}
        </button>
      ))}
    </div>
  );
}
import { FilterOptions } from "@/app/types";
import { format } from "date-fns";
import { Filter } from "lucide-react";

const Filters: React.FC<{
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  resources: string[];
}> = ({ filters, onFiltersChange, resources }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex items-center gap-2 text-gray-700">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>

      <div className="flex flex-wrap gap-3 flex-1">
        {/* Resource Filter */}
        <div className="min-w-[200px]">
          <select
            value={filters.resource}
            onChange={(e) =>
              onFiltersChange({ ...filters, resource: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Resources</option>
            {resources.map((resource) => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="min-w-[200px]">
          <input
            type="date"
            value={filters.date ? format(filters.date, "yyyy-MM-dd") : ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                date: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-[160px]">
          <select
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: e.target.value as FilterOptions["status"],
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default Filters;

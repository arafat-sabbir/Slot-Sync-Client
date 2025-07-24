import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

/**
 * Dashboard header component
 */
const DashboardHeader: React.FC<{ onRefresh: () => void }> = ({
  onRefresh,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Booking Dashboard</h1>
      <p className="mt-1 text-gray-500">
        Manage and track all your resource bookings
      </p>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>

      <Link href="/bookings/new">
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      </Link>
    </div>
  </div>
);

export default DashboardHeader;

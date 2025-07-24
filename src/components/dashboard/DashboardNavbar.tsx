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
      <h1 className="text-3xl font-bold text-c-heading">Booking Dashboard</h1>
      <p className="mt-1 text-c-body2">
        Manage and track all your resource bookings
      </p>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>

      <Link href={"/booking/new"}>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-c-action-brand cursor-pointer rounded-lg hover:bg-c-action-brand transition-colors">
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      </Link>
    </div>
  </div>
);

export default DashboardHeader;

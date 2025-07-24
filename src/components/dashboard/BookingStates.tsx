import { Booking, ErrorStateProps, FilterOptions } from "@/app/types";
import { AlertCircle, Clock } from "lucide-react";

/**
 * Error state component
 */
const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
    <div className="flex items-center gap-3 text-red-700 mb-4">
      <AlertCircle className="h-5 w-5" />
      <h3 className="font-medium">Error loading bookings</h3>
    </div>
    <p className="text-red-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Try Again
    </button>
  </div>
);

/**
 * Empty state component when no bookings are found
 */
const EmptyState: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No bookings found
    </h3>
    <p className="text-gray-500">
      Try adjusting your filters or create a new booking.
    </p>
  </div>
);

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500">Loading bookings...</p>
    </div>
  </div>
);

/**
 * Groups bookings by resource
 */
const groupBookingsByResource = (
  bookings: Booking[]
): Record<string, Booking[]> => {
  // Group bookings by resource
  return bookings?.reduce((acc, booking) => {
    if (!acc[booking.resource]) {
      acc[booking.resource] = [];
    }
    acc[booking.resource].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);
};

export { LoadingState, EmptyState, ErrorState, groupBookingsByResource };

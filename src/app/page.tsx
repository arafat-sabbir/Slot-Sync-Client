"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  format,
  isBefore,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";
import { FilterOptions } from "./types";
import { getBookingStatus } from "@/lib/utils";
import Filters from "@/components/dashboard/filters";
import Container from "@/components/layout/Container";

// Custom Hooks
const useBookings = (filters: FilterOptions) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.resource !== "all") {
        params.append("resource", filters.resource);
      }
      if (filters.date) {
        params.append("date", startOfDay(filters.date).toISOString());
      }

      const response = await fetch(`/api/bookings?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      const sortedBookings = data.sort(
        (a: Booking, b: Booking) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      setBookings(sortedBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to cancel booking",
      };
    }
  }, []);

  return { bookings, isLoading, error, refetch: fetchBookings, cancelBooking };
};

const BookingsGrid: React.FC<{
  bookings: Booking[];
  onCancel: (id: string) => Promise<{ success: boolean; error?: string }>;
}> = ({ bookings, onCancel }) => {
  const groupedBookings = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      acc[booking.resource] = acc[booking.resource] || [];
      acc[booking.resource].push(booking);
      return acc;
    }, {} as Record<string, Booking[]>);
  }, [bookings]);

  if (Object.keys(groupedBookings).length === 0) {
    return (
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
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedBookings).map(([resource, resourceBookings]) => (
        <div
          key={resource}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{resource}</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {resourceBookings.length} booking
              {resourceBookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourceBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancel}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
    <div className="flex items-center gap-3 text-red-700 mb-4">
      <AlertCircle className="h-5 w-5" />
      <h3 className="font-medium">Error loading bookings</h3>
    </div>
    <p className="text-red-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500">Loading bookings...</p>
    </div>
  </div>
);

// Main Component
const BookingDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    resource: "all",
    date: new Date(),
    status: "all",
  });

  const { bookings, isLoading, error, refetch, cancelBooking } =
    useBookings(filters);

  const resources = useMemo(() => {
    return Array.from(new Set(bookings.map((b) => b.resource)));
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (filters.resource !== "all") {
      filtered = filtered.filter((b) => b.resource === filters.resource);
    }

    if (filters.date) {
      filtered = filtered.filter((b) => {
        const bookingDate = new Date(b.startTime);
        return (
          bookingDate >= startOfDay(filters.date!) &&
          bookingDate <= endOfDay(filters.date!)
        );
      });
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        return getBookingStatus(start, end) === filters.status;
      });
    }

    return filtered;
  }, [bookings, filters]);

  return (
    <Container className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Dashboard
            </h1>
            <p className="mt-1 text-gray-500">
              Manage and track all your resource bookings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              New Booking
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            resources={resources}
          />
        </div>

        {/* Content */}
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <BookingsGrid bookings={filteredBookings} onCancel={cancelBooking} />
        )}
      </div>
    </Container>
  );
};

export default BookingDashboard;

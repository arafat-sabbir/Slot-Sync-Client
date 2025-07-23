"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";
import { Plus, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { Booking, BookingQueryParams, FilterOptions } from "./types";
import { getBookingStatus } from "@/lib/utils";
import Filters from "@/components/dashboard/filters";
import Container from "@/components/layout/Container";
import BookingCard from "@/components/dashboard/booking-card";
import { getBookings } from "@/actions/booking/get-bookings";
import Link from "next/link";

// Custom Hooks
const useBookings = (filters: FilterOptions) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams: BookingQueryParams = {};
      if (filters.resource !== "all") {
        queryParams.resource = filters.resource;
      }
      if (filters.date) {
        queryParams.date = startOfDay(filters.date).toISOString();
      }

      const response = await getBookings(queryParams);
      const data = response?.data;
      const sortedBookings = data?.sort(
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
    return bookings?.reduce((acc, booking) => {
      acc[booking.resource] = acc[booking.resource] || [];
      acc[booking.resource].push(booking);
      return acc;
    }, {} as Record<string, Booking[]>);
  }, [bookings]);

  if (groupedBookings && Object.keys(groupedBookings).length === 0) {
    return (
      <div className="bg-white rounded-xl custom-shadow-sm border border-gray-100 p-12 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-c-heading mb-2">
          No bookings found
        </h3>
        <p className="text-c-body2">
          Try adjusting your filters or create a new booking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedBookings &&
        Object.entries(groupedBookings).map(([resource, resourceBookings]) => (
          <div
            key={resource}
            className="bg-white rounded-xl custom-shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-c-heading">
                {resource}
              </h2>
              <span className="text-sm text-c-body2 bg-gray-100 px-2 py-1 rounded-full">
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
  <div className="bg-white rounded-xl custom-shadow-sm border border-red-200 p-6">
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
  <div className="bg-white rounded-xl custom-shadow-sm border border-gray-100 p-12">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-c-body2">Loading bookings...</p>
    </div>
  </div>
);

// Main Component
const BookingDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    resource: "all",
    date: undefined,
    status: "all" as const,
  });

  const { bookings, isLoading, error, refetch, cancelBooking } =
    useBookings(filters);

  const resources = [
    "Conference Room A",
    "Conference Room B",
    "Meeting Room 1",
    "Meeting Room 2",
  ];

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (filters.resource !== "all") {
      filtered = filtered?.filter((b) => b.resource === filters.resource);
    }

    if (filters.date) {
      filtered = filtered?.filter((b) => {
        const bookingDate = new Date(b.startTime);
        return (
          bookingDate >= startOfDay(filters.date!) &&
          bookingDate <= endOfDay(filters.date!)
        );
      });
    }

    if (filters.status !== "all") {
      filtered = filtered?.filter((b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        return getBookingStatus(start, end) === filters.status;
      });
    }

    return filtered;
  }, [bookings, filters]);

  return (
    <Container className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-c-heading">
              Booking Dashboard
            </h1>
            <p className="mt-1 text-c-body2">
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

            <Link href={"/booking/new"}>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-c-action-brand cursor-pointer rounded-lg hover:bg-c-action-brand transition-colors">
                <Plus className="h-4 w-4" />
                New Booking
              </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Filters
            filters={filters}
            setFilters={setFilters}
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

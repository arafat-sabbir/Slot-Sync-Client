import { getBookings } from "@/actions/booking/get-bookings";
import { Booking, FilterOptions, UseBookingsReturn } from "@/app/types";
import { createBookingParams } from "@/components/dashboard/BookingStates";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for managing bookings data and operations
 */
const useBookings = (filters: FilterOptions): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches bookings from the API
   */
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create clean params without default values
      const bookingParams = createBookingParams(filters);

      console.log("Fetching bookings with params:", bookingParams);

      const response = await getBookings(bookingParams);

      // Validate response
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      const data = response.data;

      // Validate that data is an array
      if (!Array.isArray(data)) {
        throw new Error("Expected bookings data to be an array");
      }

      setBookings(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load bookings";
      console.error("Error fetching bookings:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Cancels a booking by ID
   */

  // Fetch bookings when filters change
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    isLoading,
    error,
    refetch: fetchBookings,
  };
};

export default useBookings;

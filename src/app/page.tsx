"use client";
import React, { useState, useEffect } from "react";
import Filters from "@/components/dashboard/filters";
import Container from "@/components/layout/Container";
import DashboardHeader from "@/components/dashboard/DashboardNavbar";
import { ErrorState, LoadingState } from "@/components/dashboard/BookingStates";
import BookingsGrid from "@/components/dashboard/BookingGrid";
import { getBookings } from "@/actions/booking/get-bookings";
import { FilterOptions } from "./types";
import { cancelBookingAction } from "@/actions/booking/cancel-booking";

const BookingDashboard: React.FC = () => {
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    resource: "all",
    date: undefined,
    status: "all",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const getBookingData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const bookings = await getBookings(filters);
        if (bookings.error) {
          setError(bookings.error);
        } else {
          setBookings(bookings.data || []);
        }
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setIsLoading(false);
      }
    };
    getBookingData();
  }, [filters, refetch]);

  const cancelBooking = async (bookingId: number) => {
    try {
      const response = await cancelBookingAction(bookingId);
      if (!response.error) {
        setRefetch(prev => !prev); // Trigger refetch after successful cancellation
      }
    } catch (err) {
      console.error("Failed to cancel booking", err);
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const onRefetch = () => {
    setRefetch(prev => !prev);
  };

  const resources = [
    "Meeting Room",
    "Conference Room",
    "Training Room",
    "Collaboration Space",
    "Event Space",
  ];

  return (
    <Container className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <DashboardHeader onRefresh={onRefetch} />

        {/* Filters Section */}
        <div className="mb-8">
          <Filters
            filters={filters}
            setFilters={handleFiltersChange}
            resources={resources}
          />
        </div>

        {/* Content Section */}
        <div className="min-h-[400px]">
          {error ? (
            <ErrorState error={error} onRetry={onRefetch} />
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <BookingsGrid bookings={bookings} onCancel={cancelBooking} />
          )}
        </div>
      </div>
    </Container>
  );
};

export default BookingDashboard;
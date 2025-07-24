import { bookingSchema } from "@/validation";
import z from "zod";

export type Booking = {
  id: string;
  resource: string;
  requestedBy: string;
  startTime: string;
  endTime: string;
  status?: "confirmed" | "pending" | "cancelled";
  description?: string;
};

export type BookingStatus = "upcoming" | "ongoing" | "past";

export type FilterOptions = {
  resource: string;
  date: Date | undefined;
  status: BookingStatus | "all";
};

export type BookingQueryParams = {
  resource?: string;
  date?: string; // ISO string format (e.g. "2025-07-23T00:00:00.000Z")
};

// Types

export interface BookingsGridProps {
  bookings: Booking[];
  onCancel: any;
}

export interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

// ==========================================
// TYPES AND INTERFACES
// ==========================================

export interface UseBookingsReturn {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export type BookingFormValues = z.infer<typeof bookingSchema>;

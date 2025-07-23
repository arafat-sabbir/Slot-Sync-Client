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

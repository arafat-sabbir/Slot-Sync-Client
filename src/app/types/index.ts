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

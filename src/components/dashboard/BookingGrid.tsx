import { useMemo } from "react";
import BookingCard from "./booking-card";
import { EmptyState, groupBookingsByResource } from "./BookingStates";
import { BookingsGridProps } from "@/app/types";

/**
 * Grid component for displaying bookings grouped by resource
 */
const BookingsGrid: React.FC<BookingsGridProps> = ({ bookings, onCancel }) => {
  const groupedBookings = useMemo(() => {
    console.log({bookings,state:"aldjfklajdkfljakdsjfkalsdf"})
    return groupBookingsByResource(bookings||[]);
  }, [bookings]);

  // Show empty state if no bookings
  if (Object.keys(groupedBookings).length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedBookings).map(([resource, resourceBookings]) => (
        <div
          key={resource}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          {/* Resource header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{resource}</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {resourceBookings.length} booking
              {resourceBookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Bookings grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourceBookings?.map((booking) => (
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

export default BookingsGrid;

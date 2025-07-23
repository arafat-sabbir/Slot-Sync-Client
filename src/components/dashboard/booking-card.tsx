import { Booking } from "@/app/types";
import { getBookingStatus, getStatusColor } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useState } from "react";

const BookingCard: React.FC<{
  booking: Booking;
  onCancel: (id: string) => Promise<{ success: boolean; error?: string }>;
}> = ({ booking, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const status = getBookingStatus(start, end);

  const handleCancel = async () => {
    setIsLoading(true);
    const result = await onCancel(booking.id);
    setIsLoading(false);

    if (!result.success && result.error) {
      alert(result.error); // In real app, use proper toast notification
    }
  };

  return (
    <div className="bg-white rounded-lg border border-c-stroke-gray p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{booking.resource}</h3>
          <p className="text-sm text-gray-600">by {booking.requestedBy}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
            status
          )}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {format(start, "PPp")} - {format(end, "p")}
          </span>
        </div>
      </div>

      {status !== "past" && (
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </div>
  );
};

export default BookingCard;

import { BookingStatus } from "@/app/types";
import { clsx, type ClassValue } from "clsx";
import { isBefore, isWithinInterval } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBookingStatus = (start: Date, end: Date): BookingStatus => {
  const now = new Date();
  if (isBefore(now, start)) return "upcoming";
  if (isWithinInterval(now, { start, end })) return "ongoing";
  return "past";
};

export const getStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case "upcoming":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "ongoing":
      return "bg-green-50 text-green-700 border-green-200";
    case "past":
      return "bg-gray-50 text-gray-600 border-c-stroke-gray";
    default:
      return "bg-gray-50 text-gray-600 border-c-stroke-gray";
  }
};

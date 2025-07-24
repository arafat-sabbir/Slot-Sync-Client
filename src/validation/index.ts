import { resources } from "@/data";
import { differenceInMinutes } from "date-fns";
import z from "zod";

// 🧠 Zod Schema
export const bookingSchema = z
  .object({
    requestedBy: z.string().min(1, "Name is required"),
    resource: z.enum(resources, { message: "Resource is required" }),
    startTime: z.date({ message: "Start time is required" }),
    endTime: z.date({ message: "End time is required" }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((data) => differenceInMinutes(data.endTime, data.startTime) >= 15, {
    message: "Booking must be at least 15 minutes",
    path: ["endTime"],
  })
  .refine((data) => differenceInMinutes(data.endTime, data.startTime) <= 120, {
    message: "Booking cannot exceed 2 hours",
    path: ["endTime"],
  });

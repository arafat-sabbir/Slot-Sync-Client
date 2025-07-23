"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, differenceInMinutes, setHours, setMinutes } from "date-fns";
import { useState } from "react";
import { CalendarIcon, Home } from "lucide-react";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import {
  getInputClassNames,
  getLabelClassNames,
  getSelectTriggerClassName,
} from "@/styles";
import Container from "@/components/layout/Container";
import Link from "next/link";
import DateTimePickerForm from "@/components/time-picker/date-time-picker-form";

// 🧠 Zod Schema
const bookingSchema = z
  .object({
    requestedBy: z.string().min(1, "Name is required"),
    resource: z.enum(["Room A", "Room B", "Room C", "Device X"]),
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

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function CreateBookingPage() {
  const [roundDateTime, setRoundDateTime] = useState<Date | undefined>(
    undefined
  );

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      requestedBy: "",
      resource: undefined,
      startTime: undefined,
      endTime: undefined,
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          startTime: values.startTime.toISOString(),
          endTime: values.endTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create booking");
      }

      toast.success("Booking created successfully!");
      form.reset();
      setRoundDateTime(undefined);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Container className="h-screen relative flex items-center justify-center">
      <Link
        href={"/"}
        className="absolute sm:top-30 sm:left-20 flex gap-1 font-medium tracking-wide text-c-body3 items-center top-4 left-4"
      >
        <Home className="text-c-icon-disabled cursor-pointer" /> Home
      </Link>
      <div className="bg-white custom-shadow-md w-[600px] rounded-lg sm:p-12 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-c-heading sm:leading-[30px]">
          Book New Slot
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              name="requestedBy"
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Requested By"
              className={getInputClassNames()}
              labelClassname={getLabelClassNames()}
              placeholder="Enter your name"
            />

            <CustomFormField
              name="resource"
              control={form.control}
              fieldType={FormFieldType.SELECT}
              label="Resource"
              selectTriggerClassName={getSelectTriggerClassName()}
              labelClassname={getLabelClassNames()}
              placeholder="Select a resource"
            >
              <SelectItem value="Room A">Room A</SelectItem>
              <SelectItem value="Room B">Room B</SelectItem>
              <SelectItem value="Room C">Room C</SelectItem>
              <SelectItem value="Device X">Device X</SelectItem>
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              name="startTime"
              control={form.control}
              label="Start Time"
              className={getInputClassNames()}
              labelClassname={getLabelClassNames()}
            />
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              name="endTime"
              control={form.control}
              label="End Time"
              className={getInputClassNames()}
              labelClassname={getLabelClassNames()}
            />
            <Button
              type="submit"
              className="w-full h-11 bg-c-action-brand mt-6 rounded-lg"
            >
              Submit Booking
            </Button>
          </form>
        </Form>
      </div>
    </Container>
  );
}

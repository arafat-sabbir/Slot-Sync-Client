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

// 🕓 DateTimePicker component
interface DateTimePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value);
  const [hour, setHour] = useState<string>(value ? format(value, "HH") : "00");
  const [minute, setMinute] = useState<string>(
    value ? format(value, "mm") : "00"
  );

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      onChange(undefined);
      return;
    }

    let newDate = selectedDate;
    newDate = setHours(newDate, parseInt(hour));
    newDate = setMinutes(newDate, parseInt(minute));
    setDate(newDate);
    onChange(newDate);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = e.target.value.padStart(2, "0");
    if (parseInt(newHour) >= 0 && parseInt(newHour) <= 23) {
      setHour(newHour);
      if (date) {
        const newDate = setHours(date, parseInt(newHour));
        setDate(newDate);
        onChange(newDate);
      }
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = e.target.value.padStart(2, "0");
    if (parseInt(newMinute) >= 0 && parseInt(newMinute) <= 59) {
      setMinute(newMinute);
      if (date) {
        const newDate = setMinutes(date, parseInt(newMinute));
        setDate(newDate);
        onChange(newDate);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${className} ${
            !date ? "text-muted-foreground" : ""
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="p-3 border-t border-border flex gap-2">
          <Input
            type="number"
            min="0"
            max="23"
            value={hour}
            onChange={handleHourChange}
            placeholder="HH"
            className="w-16 text-center"
          />
          <span className="self-center">:</span>
          <Input
            type="number"
            min="0"
            max="59"
            value={minute}
            onChange={handleMinuteChange}
            placeholder="MM"
            className="w-16 text-center"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 🧠 Zod Schema
const bookingSchema = z
  .object({
    requestedBy: z.string().min(1, "Name is required"),
    resource: z.enum(["Room A", "Room B", "Room C", "Device X"]),
    startTime: z.date({ required_error: "Start time is required" }),
    endTime: z.date({ required_error: "End time is required" }),
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
              fieldType={FormFieldType.CALENDAR}
              name="startTime"
              control={form.control}
              label="Start Time"
              className={getInputClassNames()}
              labelClassname={getLabelClassNames()}
            />

            <CustomFormField
              fieldType={FormFieldType.CALENDAR}
              name="endTime"
              control={form.control}
              label="End Time"
              className={getInputClassNames()}
              labelClassname={getLabelClassNames()}
            />

            {/* 🌟 Custom DateTime Picker Demo Field */}
            <div>
              <label className={getLabelClassNames()}>Round Date Time</label>
              <DateTimePicker
                value={roundDateTime}
                onChange={(date) => setRoundDateTime(date)}
                placeholder="Pick a time for round"
                className="mt-1"
              />
              {roundDateTime && (
                <p className="text-sm mt-2 text-gray-600">
                  Selected: {format(roundDateTime, "PPP HH:mm")}
                </p>
              )}
            </div>

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

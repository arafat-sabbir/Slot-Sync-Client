"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addMinutes, differenceInMinutes } from "date-fns";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";

const bookingSchema = z
  .object({
    requestedBy: z.string().min(1, "Name is required"),
    resource: z.enum(["Room A", "Room B", "Room C", "Device X"]),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start time",
    }),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end time",
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const duration = differenceInMinutes(end, start);
      return duration >= 15;
    },
    {
      message: "Booking duration must be at least 15 minutes",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const duration = differenceInMinutes(end, start);
      return duration <= 120;
    },
    {
      message: "Booking duration cannot exceed 2 hours",
      path: ["endTime"],
    }
  );

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function CreateBookingPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      requestedBy: "",
      resource: undefined,
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          startTime: new Date(values.startTime).toISOString(),
          endTime: new Date(values.endTime).toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create booking");
      }

      const data = await response.json();
      toast.success("Booking created successfully!");
      form.reset();
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Booking</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="requestedBy"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>Name</Label>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="resource"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>Resource</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a resource" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Room A">Room A</SelectItem>
                    <SelectItem value="Room B">Room B</SelectItem>
                    <SelectItem value="Room C">Room C</SelectItem>
                    <SelectItem value="Device X">Device X</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="startTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>Start Time</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (date) {
                            const currentTime = field.value
                              ? new Date(field.value)
                              : new Date();
                            const newDateTime = new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              currentTime.getHours(),
                              currentTime.getMinutes()
                            );
                            form.setValue(
                              "startTime",
                              newDateTime.toISOString().slice(0, 16)
                            );
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      onChange={(e) => {
                        if (startDate) {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDateTime = new Date(startDate);
                          newDateTime.setHours(
                            parseInt(hours),
                            parseInt(minutes)
                          );
                          form.setValue(
                            "startTime",
                            newDateTime.toISOString().slice(0, 16)
                          );
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="endTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>End Time</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          if (date) {
                            const currentTime = field.value
                              ? new Date(field.value)
                              : addMinutes(
                                  new Date(
                                    form.getValues("startTime") || new Date()
                                  ),
                                  15
                                );
                            const newDateTime = new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate(),
                              currentTime.getHours(),
                              currentTime.getMinutes()
                            );
                            form.setValue(
                              "endTime",
                              newDateTime.toISOString().slice(0, 16)
                            );
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      onChange={(e) => {
                        if (endDate) {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDateTime = new Date(endDate);
                          newDateTime.setHours(
                            parseInt(hours),
                            parseInt(minutes)
                          );
                          form.setValue(
                            "endTime",
                            newDateTime.toISOString().slice(0, 16)
                          );
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Booking
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addMinutes, differenceInMinutes } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, MapPin, Sparkles } from "lucide-react";

// Zod schema for form validation
const bookingSchema = z
  .object({
    requestedBy: z.string().min(1, "Name is required"),
    resource: z.enum(["Room A", "Room B", "Room C", "Device X"], {
      errorMap: () => ({ message: "Please select a resource" }),
    }),
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

// Type definitions for UI components
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

interface SelectProps {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

interface CalendarPickerProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

interface PopoverProps {
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
}

// UI Components
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Button: React.FC<ButtonProps> = ({ variant = "default", className = "", children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 hover:shadow-md",
    ghost: "hover:bg-slate-100"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} h-10 px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Label: React.FC<LabelProps> = ({ children, className = "" }) => (
  <label className={`text-sm font-medium leading-none text-slate-700 ${className}`}>
    {children}
  </label>
);

const Select: React.FC<SelectProps> = ({ onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const handleSelect = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{value || "Select a resource"}</span>
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="p-1">
            {["Room A", "Room B", "Room C", "Device X"].map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-slate-100"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CalendarPicker: React.FC<CalendarPickerProps> = ({ mode, selected, onSelect, className = "" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectDate = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onSelect?.(selectedDate);
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isSelected = selected && 
            selected.getDate() === day && 
            selected.getMonth() === currentDate.getMonth() && 
            selected.getFullYear() === currentDate.getFullYear();
          const isToday = today.getDate() === day && 
            today.getMonth() === currentDate.getMonth() && 
            today.getFullYear() === currentDate.getFullYear();
            
          return (
            <button
              key={day}
              type="button"
              onClick={() => selectDate(day)}
              className={`p-2 text-sm rounded-md hover:bg-blue-50 ${
                isSelected 
                  ? "bg-blue-500 text-white hover:bg-blue-600" 
                  : isToday 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "text-slate-700"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Popover: React.FC<PopoverProps> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ asChild, children }) => children;

const PopoverContent: React.FC<PopoverContentProps> = ({ children, className = "" }) => {
  return (
    <div className={`absolute z-50 mt-2 rounded-lg border bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default function CreateBookingPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      requestedBy: "",
      resource: undefined,
      startTime: "",
      endTime: "",
    },
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast("Booking created successfully!");
      reset();
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDateSelect = (date: Date) => {
    setStartDate(date);
    setStartCalendarOpen(false);
    if (date) {
      const currentStartTime = getValues("startTime");
      const timeMatch = currentStartTime ? currentStartTime.match(/T(\d{2}):(\d{2})/) : null;
      const hours = timeMatch ? parseInt(timeMatch[1]) : 9;
      const minutes = timeMatch ? parseInt(timeMatch[2]) : 0;
      
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes);
      setValue("startTime", newDateTime.toISOString().slice(0, 16));
    }
  };

  const handleEndDateSelect = (date: Date) => {
    setEndDate(date);
    setEndCalendarOpen(false);
    if (date) {
      const currentEndTime = getValues("endTime");
      const timeMatch = currentEndTime ? currentEndTime.match(/T(\d{2}):(\d{2})/) : null;
      const hours = timeMatch ? parseInt(timeMatch[1]) : 10;
      const minutes = timeMatch ? parseInt(timeMatch[2]) : 0;
      
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes);
      setValue("endTime", newDateTime.toISOString().slice(0, 16));
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (startDate) {
      const [hours, minutes] = e.target.value.split(":");
      const newDateTime = new Date(startDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      setValue("startTime", newDateTime.toISOString().slice(0, 16));
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (endDate) {
      const [hours, minutes] = e.target.value.split(":");
      const newDateTime = new Date(endDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      setValue("endTime", newDateTime.toISOString().slice(0, 16));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Create Booking</h1>
            <p className="text-slate-600">Reserve your space and time with ease</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
              <h2 className="text-xl font-semibold text-white">Booking Details</h2>
              <p className="text-blue-100 text-sm">Fill in the information below to make your reservation</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  Requested By
                </Label>
                <Input
                  placeholder="Enter your full name"
                  {...register("requestedBy")}
                  className={errors.requestedBy ? "border-red-500 focus:ring-red-500" : ""}
                />
                {errors.requestedBy && (
                  <p className="text-red-500 text-sm">{errors.requestedBy.message}</p>
                )}
              </div>

              {/* Resource Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Resource
                </Label>
                <Select
                  onValueChange={(value) => setValue("resource", value)}
                  defaultValue={getValues("resource")}
                />
                {errors.resource && (
                  <p className="text-red-500 text-sm">{errors.resource.message}</p>
                )}
              </div>

              {/* Start Time Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Start Time
                </Label>
                <div className="flex gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStartCalendarOpen(!startCalendarOpen)}
                        className="flex-1 justify-start text-left font-normal hover:shadow-md"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {startDate ? format(startDate, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    {startCalendarOpen && (
                      <PopoverContent className="w-auto p-0 left-0">
                        <CalendarPicker
                          mode="single"
                          selected={startDate}
                          onSelect={handleStartDateSelect}
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                  <Input
                    type="time"
                    className="w-32"
                    onChange={handleStartTimeChange}
                    defaultValue={startDate ? format(new Date(getValues("startTime") || startDate), "HH:mm") : "09:00"}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-red-500 text-sm">{errors.startTime.message}</p>
                )}
              </div>

              {/* End Time Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  End Time
                </Label>
                <div className="flex gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEndCalendarOpen(!endCalendarOpen)}
                        className="flex-1 justify-start text-left font-normal hover:shadow-md"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {endDate ? format(endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    {endCalendarOpen && (
                      <PopoverContent className="w-auto p-0 left-0">
                        <CalendarPicker
                          mode="single"
                          selected={endDate}
                          onSelect={handleEndDateSelect}
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                  <Input
                    type="time"
                    className="w-32"
                    onChange={handleEndTimeChange}
                    defaultValue={endDate ? format(new Date(getValues("endTime") || addMinutes(endDate, 60)), "HH:mm") : "10:00"}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-red-500 text-sm">{errors.endTime.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Booking...
                  </div>
                ) : (
                  "Create Booking"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
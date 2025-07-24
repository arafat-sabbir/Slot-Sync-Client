"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";

import { differenceInMinutes } from "date-fns";
import { useState } from "react";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import {
  getInputClassNames,
  getLabelClassNames,
  getSelectTriggerClassName,
} from "@/styles";
import Link from "next/link";
import { BookingFormValues } from "@/app/types";
import { bookSlot } from "@/actions/booking/book-slot";
import Container from "@/components/layout/Container";
import { resources } from "@/data";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { bookingSchema } from "@/validation";


export default function CreateBookingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      setLoading(true);
      const response = await bookSlot(values);
      if (response.error) {
        console.log(response?.error);
      }
      console.log({ response });
      toast.success(response?.message);
      router.push("/");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="h-[calc(100vh-92px)] relative flex items-center justify-center">
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
              {resources.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
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
              disabled={loading}
              className="w-full h-11 bg-c-action-brand mt-6 rounded-lg"
            >
              Submit Booking {loading && <Loader className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
    </Container>
  );
}

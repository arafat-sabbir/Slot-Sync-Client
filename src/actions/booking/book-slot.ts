"use server";
import { BookingFormValues } from "@/app/types";
import { axiosInstance } from "@/lib/axios";
import handleAxiosError from "@/lib/axiosErrorHandler";

export const bookSlot = async (data: BookingFormValues) => {
  try {
    const response = await axiosInstance.post(`/bookings`, data);
    return response?.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

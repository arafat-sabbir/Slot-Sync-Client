"use server";
import { BookingQueryParams } from "@/app/types";
import { axiosInstance } from "@/lib/axios";
import handleAxiosError from "@/lib/axiosErrorHandler";

export const getBookings = async (params: BookingQueryParams) => {
  try {
    const response = await axiosInstance.get(`/bookings`, {
      params,
    });
    return response?.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

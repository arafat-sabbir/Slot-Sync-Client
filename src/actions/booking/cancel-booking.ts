"use server";
import { axiosInstance } from "@/lib/axios";
import handleAxiosError from "@/lib/axiosErrorHandler";

export const cancelBookingAction = async (id: number | string) => {
  try {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response?.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

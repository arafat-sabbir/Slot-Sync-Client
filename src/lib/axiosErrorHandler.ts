/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

const handleAxiosError = ({
  request,
  response,
  message,
}: AxiosError<ErrorResponse> | any) => {
  if (response) {
    return {
      error:
        response?.data?.message ||
        "Something is wrong. Please try again later.",
    };
  }

  if (request) {
    return {
      error:
        request?.data?.message || "Something is wrong. Please try again later.",
    };
  }

  return { error: message };
};

export default handleAxiosError;

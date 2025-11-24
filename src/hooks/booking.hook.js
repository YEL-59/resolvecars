"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosPrivate } from "@/lib/api/axios";
import toast from "react-hot-toast";

/**
 * Create a booking
 * @param {Object} bookingData - Booking data
 * @param {number} bookingData.car_id - Car ID
 * @param {number} bookingData.pickup_location_id - Pickup location ID
 * @param {number} bookingData.return_location_id - Return location ID
 * @param {string} bookingData.pickup_datetime - Pickup datetime (YYYY-MM-DD HH:mm:ss)
 * @param {string} bookingData.return_datetime - Return datetime (YYYY-MM-DD HH:mm:ss)
 * @param {number} bookingData.package_id - Package ID (protection plan ID)
 * @param {Array} bookingData.addons - Array of addon objects with id and quantity
 */
export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (bookingData) => {
      try {
        const response = await axiosPrivate.post("/bookings", bookingData);
        return response.data;
      } catch (error) {
        // Enhanced error handling for 422 validation errors
        if (error.response?.status === 422) {
          const errorData = error.response.data;
          const errors = errorData.errors || {};
          const message = errorData.message || "Validation failed";
          
          // Log detailed error information
          console.error("Booking validation errors:", errors);
          console.error("Error message:", message);
          console.error("Full error response:", errorData);
          
          // Build detailed error message
          let errorMessage = message;
          if (Object.keys(errors).length > 0) {
            const errorDetails = Object.entries(errors)
              .map(([field, messages]) => {
                const fieldMessages = Array.isArray(messages) ? messages : [messages];
                return `${field}: ${fieldMessages.join(", ")}`;
              })
              .join("\n");
            errorMessage = `${message}\n\n${errorDetails}`;
          }
          
          // Create enhanced error object
          const enhancedError = new Error(errorMessage);
          enhancedError.response = error.response;
          enhancedError.errors = errors;
          enhancedError.message = errorMessage;
          
          throw enhancedError;
        }
        throw error;
      }
    },
    onError: (error) => {
      // Show toast notification with error details
      const errorMessage = error.message || 
        error.response?.data?.message || 
        "Failed to create booking. Please check your input and try again.";
      
      toast.error(errorMessage);
      
      // Log full error for debugging
      console.error("Booking creation error:", {
        message: error.message,
        response: error.response?.data,
        errors: error.errors,
        status: error.response?.status,
      });
    },
  });
};


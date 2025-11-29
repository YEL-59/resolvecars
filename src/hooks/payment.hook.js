"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosPrivate } from "@/lib/api/axios";
import toast from "react-hot-toast";

/**
 * Create Stripe payment intent
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.booking_id - Booking ID
 * @param {number} paymentData.amount - Payment amount in dollars (optional, backend may calculate from booking)
 * @param {number} paymentData.amount_cents - Payment amount in cents (optional)
 * @param {string} paymentData.success_url - Success redirect URL
 * @param {string} paymentData.cancel_url - Cancel redirect URL
 */
export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (paymentData) => {
      try {
        console.log("=== PAYMENT HOOK - Sending to API ===");
        console.log("Full payment data:", JSON.stringify(paymentData, null, 2));
        console.log("Amount value:", paymentData.amount);
        console.log("Total value:", paymentData.total);
        console.log("Amount in cents:", paymentData.amount_cents);
        console.log("=====================================");
        
        const response = await axiosPrivate.post("/payments/create-intent", paymentData);
        
        console.log("=== PAYMENT HOOK - API Response ===");
        console.log("Response data:", JSON.stringify(response.data, null, 2));
        console.log("===================================");
        
        return response.data;
      } catch (error) {
        // Enhanced error handling
        const errorData = error.response?.data || {};
        const status = error.response?.status;
        
        console.error("Payment intent creation error:", {
          status,
          errorData,
          fullError: error,
        });
        
        // Handle 422 validation errors
        if (status === 422) {
          const errors = errorData.errors || {};
          const message = errorData.message || "Payment validation failed";
          const errorMessage = errorData.error || errorData.message || "Payment validation failed";
          
          // Build detailed error message
          let detailedMessage = message;
          if (errorData.error && errorData.error !== message) {
            detailedMessage = `${message}: ${errorData.error}`;
          }
          
          if (Object.keys(errors).length > 0) {
            const errorDetails = Object.entries(errors)
              .map(([field, messages]) => {
                const fieldMessages = Array.isArray(messages) ? messages : [messages];
                return `${field}: ${fieldMessages.join(", ")}`;
              })
              .join("\n");
            detailedMessage = `${detailedMessage}\n\n${errorDetails}`;
          }
          
          const enhancedError = new Error(detailedMessage);
          enhancedError.response = error.response;
          enhancedError.errors = errors;
          enhancedError.error = errorData.error;
          enhancedError.message = detailedMessage;
          
          throw enhancedError;
        }
        
        // Handle other errors
        const errorMessage = errorData.error || 
          errorData.message || 
          error.message || 
          "Failed to create payment intent. Please try again.";
        
        const enhancedError = new Error(errorMessage);
        enhancedError.response = error.response;
        enhancedError.error = errorData.error;
        throw enhancedError;
      }
    },
    onError: (error) => {
      // Get error message from various possible locations
      const errorMessage = error.error || 
        error.message || 
        error.response?.data?.error ||
        error.response?.data?.message || 
        "Failed to create payment intent. Please try again.";
      
      toast.error(errorMessage);
      
      console.error("Payment intent creation error (onError):", {
        message: error.message,
        error: error.error,
        response: error.response?.data,
        errors: error.errors,
        status: error.response?.status,
      });
    },
  });
};


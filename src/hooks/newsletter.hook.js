"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { axiosPublic } from "@/lib/api/axios";
import { newsletterSchema } from "@/schemas/newsletter.schema";

// Newsletter Subscription Hook
export const useNewsletter = () => {
  const form = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      name: "",
      email: "",
      consent_given: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/newsletter/subscribe", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Successfully subscribed to our newsletter!"
      );
      // Reset form after successful subscription
      form.reset();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to subscribe. Please try again.";
      
      // Handle field-specific errors
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          if (field === "email") {
            form.setError("email", { message: errors[field][0] });
          } else if (field === "name") {
            form.setError("name", { message: errors[field][0] });
          } else if (field === "consent_given") {
            form.setError("consent_given", { message: errors[field][0] });
          }
        });
      } else if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else if (message.toLowerCase().includes("consent")) {
        form.setError("consent_given", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};


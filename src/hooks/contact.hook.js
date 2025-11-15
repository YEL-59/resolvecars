"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { axiosPublic } from "@/lib/api/axios";
import { contactSchema } from "@/schemas/contact.schema";

// Contact Form Hook
export const useContact = () => {
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      subject: "",
      message_text: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/contact", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Your message has been sent successfully!"
      );
      // Reset form after successful submission
      form.reset();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to send message. Please try again.";
      
      // Handle field-specific errors
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          if (field === "email") {
            form.setError("email", { message: errors[field][0] });
          } else if (field === "first_name") {
            form.setError("first_name", { message: errors[field][0] });
          } else if (field === "last_name") {
            form.setError("last_name", { message: errors[field][0] });
          } else if (field === "phone_number") {
            form.setError("phone_number", { message: errors[field][0] });
          } else if (field === "subject") {
            form.setError("subject", { message: errors[field][0] });
          } else if (field === "message_text") {
            form.setError("message_text", { message: errors[field][0] });
          }
        });
      } else if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else if (message.toLowerCase().includes("phone")) {
        form.setError("phone_number", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};


import * as z from "zod";

// Newsletter Subscription Schema
export const newsletterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  consent_given: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must give consent to subscribe to our newsletter",
    }),
});


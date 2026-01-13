"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { axiosPublic, axiosPrivate } from "@/lib/api/axios";
import { userStorage } from "@/lib/userStorage";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyCodeSchema,
} from "@/schemas/auth.schema";

// Sign Up Hook
export const useSignUp = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      password_confirmation: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/auth/register", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "User registered successfully");
      // Navigate to auth page and switch to login tab
      // Use replace to ensure URL updates even if already on /auth
      const params = new URLSearchParams();
      params.set("tab", "login");
      router.replace(`/auth?${params.toString()}`);
      // Dispatch custom event to ensure tab switches
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("authTabChange", { detail: { tab: "login" } }));
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to register user";
      
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
          } else if (field === "password") {
            form.setError("password", { message: errors[field][0] });
          }
        });
      } else if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};

// Sign In Hook
export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/auth/login", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Handle API response structure: data.data.token and data.data.user
      const responseData = data?.data || data;
      const token = responseData?.token || data?.token || data?.access_token;
      const user = responseData?.user || data?.user;

      // Store token if provided
      if (token) {
        userStorage.setToken(token);
        if (form.getValues("remember_me")) {
          localStorage.setItem("remember_me", "true");
        }
      }

      // Store user data if provided
      if (user) {
        userStorage.setUser(user);
        queryClient.setQueryData(["user"], user);
        // Dispatch custom event to update navbar
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("userLogin"));
        }
      }

      toast.success(data?.message || "Signed in successfully");
      
      // Refresh the page to update navbar
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to sign in";
      
      if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else if (message.toLowerCase().includes("password")) {
        form.setError("password", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};

// Forgot Password Hook
export const useForgotPassword = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/auth/forgot-password", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Password reset code sent to your email"
      );
      router.push("/auth/verify-code");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to send reset code";
      
      if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};

// Verify Code Hook
export const useVerifyCode = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/auth/verify-code", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Code verified successfully");
      // Store email for reset password step
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reset_email", form.getValues("email"));
      }
      router.push("/auth/reset-password");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Invalid verification code";
      
      if (message.toLowerCase().includes("code")) {
        form.setError("code", { message });
      } else if (message.toLowerCase().includes("email")) {
        form.setError("email", { message });
      } else {
        toast.error(message);
      }
    },
  });

  return { form, mutate, isPending };
};

// Reset Password Hook
export const useResetPassword = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      password: "",
      password_confirmation: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post("/auth/reset-password", payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully");
      router.push("/auth");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to reset password";
      
      // Handle field-specific errors
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          if (field === "email") {
            form.setError("email", { message: errors[field][0] });
          } else if (field === "code") {
            form.setError("code", { message: errors[field][0] });
          } else if (field === "password") {
            form.setError("password", { message: errors[field][0] });
          } else if (field === "password_confirmation") {
            form.setError("password_confirmation", { message: errors[field][0] });
          }
        });
      } else if (message.toLowerCase().includes("password")) {
        form.setError("password", { message });
      } else {
        toast.error(message);
      }
    },
  });

  // Load email from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = sessionStorage.getItem("reset_email");
      if (email) {
        form.setValue("email", email);
      }
    }
  }, [form]);

  return { form, mutate, isPending };
};

// Get Current User Hook
export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/user/me");
      return res.data;
    },
    staleTime: 0, // No cache - always consider data stale
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch when component mounts
    gcTime: 0, // No garbage collection time - remove from cache immediately
    enabled: typeof window !== "undefined" && !!localStorage.getItem("auth_token"),
    retry: false,
  });
};

// Sign Out Hook
export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosPrivate.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      userStorage.clear();
      queryClient.clear();
      // Dispatch custom event to update navbar
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("userLogout"));
      }
      toast.success("Signed out successfully");
      router.push("/auth");
      router.refresh();
    },
    onError: (error) => {
      // Even if API call fails, clear local storage
      userStorage.clear();
      queryClient.clear();
      // Dispatch custom event to update navbar
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("userLogout"));
      }
      toast.error(error?.response?.data?.message || "Failed to sign out");
      router.push("/auth");
      router.refresh();
    },
  });

  return { mutate, isPending };
};


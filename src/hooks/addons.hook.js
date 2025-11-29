"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/api/axios";

// Fetch addons hook
export const useAddons = () => {
  return useQuery({
    queryKey: ["addons"],
    queryFn: async () => {
      const res = await axiosPublic.get("/addons");
      // API response structure: { success: true, data: [...] }
      const addons = res.data?.data || res.data || [];
      return Array.isArray(addons) ? addons : [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 5 to ensure fresher data)
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Always refetch when component mounts
  });
};

// Get addon ID by name/slug
export const getAddonIdByName = (addons, name) => {
  if (!addons || !Array.isArray(addons) || !name) return null;
  const nameLower = name.toString().toLowerCase();
  const addon = addons.find(a => {
    const addonName = (a.name || "").toLowerCase();
    const addonSlug = (a.slug || "").toLowerCase();
    const addonId = a.id?.toString().toLowerCase();
    return addonName === nameLower || 
           addonSlug === nameLower || 
           addonId === nameLower ||
           addonName.includes(nameLower) ||
           nameLower.includes(addonName);
  });
  return addon?.id || null;
};


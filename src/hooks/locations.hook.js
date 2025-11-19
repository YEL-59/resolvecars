"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/api/axios";

// Fetch locations hook
export const useLocations = (params = {}) => {
  const { per_page = 15, page = 1, search = "", ...otherParams } = params;
  
  return useQuery({
    queryKey: ["locations", { per_page, page, search, ...otherParams }],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        per_page: per_page.toString(),
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(otherParams).map(([key, value]) => [key, String(value)])
        ),
      });
      
      // Add search parameter if provided
      if (search) {
        queryParams.append("search", search);
      }
      
      const res = await axiosPublic.get(`/locations?${queryParams.toString()}`);
      const responseData = res.data?.data || res.data;
      
      return {
        locations: responseData.data || [],
        pagination: {
          current_page: responseData.current_page || 1,
          last_page: responseData.last_page || 1,
          per_page: responseData.per_page || per_page,
          total: responseData.total || 0,
          from: responseData.from || 0,
          to: responseData.to || 0,
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};



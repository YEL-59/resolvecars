"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "@/lib/api/axios";

/**
 * Fetch user bookings with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.per_page - Number of bookings per page (default: 5)
 * @param {number} params.page - Page number (default: 1)
 */
export const useBookings = (params = {}) => {
  const { per_page = 5, page = 1, ...otherParams } = params;

  return useQuery({
    queryKey: ["bookings", { per_page, page, ...otherParams }],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        per_page: per_page.toString(),
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(otherParams).map(([key, value]) => [key, String(value)])
        ),
      });

      const res = await axiosPrivate.get(`/bookings?${queryParams.toString()}`);
      
      // Handle response structure: { success: true, data: {...} }
      const responseData = res.data?.data || res.data;
      
      return {
        bookings: responseData.data || [],
        pagination: {
          current_page: responseData.current_page || 1,
          last_page: responseData.last_page || 1,
          per_page: responseData.per_page || per_page,
          total: responseData.total || 0,
          from: responseData.from || 0,
          to: responseData.to || 0,
          links: responseData.links || [],
          next_page_url: responseData.next_page_url,
          prev_page_url: responseData.prev_page_url,
          first_page_url: responseData.first_page_url,
          last_page_url: responseData.last_page_url,
        },
      };
    },
    staleTime: 0, // No cache - always consider data stale
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch when component mounts
    gcTime: 0, // No garbage collection time - remove from cache immediately
  });
};


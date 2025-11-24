"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/api/axios";

// Transform API car data to component format
const transformCarData = (apiCar) => {
  const model = apiCar.model || {};
  const carType = model.car_type || {};
  const packages = apiCar.packages || [];
  
  // Get the first package (or premium if available) for default pricing
  const defaultPackage = packages.find(p => p.package_type === "premium") || packages[0] || {};
  
  // Use rental_calculation from package if available (from search API), otherwise use price_per_day
  const packageRentalCalc = defaultPackage.rental_calculation;
  const basePrice = packageRentalCalc?.base_rental_cost || packageRentalCalc?.daily_rate || defaultPackage.price_per_day || 0;
  
  // Combine all features from all packages
  const allFeatures = packages.flatMap(pkg => pkg.features || []);
  const uniqueFeatures = [...new Set(allFeatures)];
  
  return {
    id: apiCar.id,
    name: `${model.make || ""} ${model.model || ""}`.trim() || "Car",
    image: apiCar.image_url || "/assets/cars/bmw-3.png", // Fallback to a default car image
    type: carType.name?.toUpperCase() || "SEDAN",
    year: model.year || new Date().getFullYear(),
    price: basePrice,
    originalPrice: defaultPackage.original_price_per_day || defaultPackage.price_per_day || 0,
    discount: defaultPackage.discount_percentage || 0,
    rating: parseFloat(model.average_rating || "0"),
    reviews: model.review_count || 0,
    passengers: model.seats || 4,
    transmission: model.transmission_type || "automatic",
    fuelType: model.fuel_type || "gasoline",
    fuel: model.fuel_type || "gasoline",
    category: carType.name?.toUpperCase() || "SEDAN",
    features: uniqueFeatures,
    description: `${model.make || ""} ${model.model || ""} - ${carType.description || "Premium rental car"}`.trim(),
    location: apiCar.current_location?.name || "Airport Terminal",
    pickupInfo: apiCar.current_location?.address || "Rental Car Center",
    available: apiCar.status === "available" ? "Available 24/7" : "Unavailable",
    availability: apiCar.availability || null,
    available_date: apiCar.available_date || null, // Preserve available_date for availability checking
    available_start_date: apiCar.available_start_date || null, // Preserve available_start_date for availability checking
    available_end_date: apiCar.available_end_date || null, // Preserve available_end_date for availability checking
    // Keep original API data for reference
    _apiData: apiCar,
    packages: packages.map(pkg => ({
      id: pkg.id || pkg.package_type,
      package_type: pkg.package_type,
      package_type_display: pkg.package_type_display || pkg.package_type,
      features: pkg.features || [],
      price_per_day: pkg.price_per_day,
      original_price_per_day: pkg.original_price_per_day,
      discount_percentage: pkg.discount_percentage,
      has_discount: pkg.has_discount,
      display_price: pkg.display_price,
      original_display_price: pkg.original_display_price,
      is_active: pkg.is_active !== false,
      // Include rental_calculation if available (from search API)
      rental_calculation: pkg.rental_calculation || null,
      // Preserve all original package fields (including protection_plan_id if it exists)
      protection_plan_id: pkg.protection_plan_id || pkg.protectionPlanId || null,
      // Keep original API data for reference
      _original: pkg,
    })),
  };
};

// Fetch cars hook
export const useCars = (params = {}) => {
  const { per_page = 15, page = 1, ...otherParams } = params;
  
  return useQuery({
    queryKey: ["cars", { per_page, page, ...otherParams }],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        per_page: per_page.toString(),
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(otherParams).map(([key, value]) => [key, String(value)])
        ),
      });
      
      const res = await axiosPublic.get(`/cars?${queryParams.toString()}`);
      const responseData = res.data?.data || res.data;
      
      // Transform the cars data
      const transformedCars = (responseData.data || []).map(transformCarData);
      
      return {
        cars: transformedCars,
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
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Search cars hook
export const useSearchCars = (params = {}) => {
  const {
    pickup_location_id,
    return_location_id,
    pickup_date,
    pickup_time = "12:00",
    return_date,
    return_time = "12:00",
    ...otherParams
  } = params;

  return useQuery({
    queryKey: [
      "searchCars",
      {
        pickup_location_id,
        return_location_id,
        pickup_date,
        pickup_time,
        return_date,
        return_time,
        ...otherParams,
      },
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      // Required parameters
      if (pickup_location_id) {
        queryParams.append("pickup_location_id", pickup_location_id.toString());
      }
      if (pickup_date) {
        queryParams.append("pickup_date", pickup_date);
      }
      if (return_date) {
        queryParams.append("return_date", return_date);
      }

      // Optional parameters - always include return_location_id (use pickup if not provided)
      const finalReturnLocationId = return_location_id || pickup_location_id;
      if (finalReturnLocationId) {
        queryParams.append("return_location_id", finalReturnLocationId.toString());
      }
      
      // Include times if provided (default to 12:00)
      if (pickup_time && pickup_time !== "12:00") {
        queryParams.append("pickup_time", pickup_time);
      }
      if (return_time && return_time !== "12:00") {
        queryParams.append("return_time", return_time);
      }

      // Add any other params
      Object.entries(otherParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const res = await axiosPublic.get(`/cars/search?${queryParams.toString()}`);
      
      // Handle response structure: { success: true, data: [...], meta: {...} }
      const responseData = res.data;
      const carsArray = responseData?.data || [];
      const meta = responseData?.meta || {};

      // Transform the cars data
      const transformedCars = carsArray.map(transformCarData);

      return {
        cars: transformedCars,
        meta: {
          total_cars: meta.total_cars || transformedCars.length,
          rental_period: meta.rental_period || {},
          filters_applied: meta.filters_applied || {},
        },
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: carsArray.length,
          total: meta.total_cars || transformedCars.length,
          from: 1,
          to: transformedCars.length,
        },
      };
    },
    enabled:
      !!pickup_location_id && !!pickup_date && !!return_date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};


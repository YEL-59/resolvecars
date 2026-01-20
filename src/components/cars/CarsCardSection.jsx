"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Grid3X3, List } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useSearchParams } from "next/navigation";
import { useCars, useSearchCars } from "@/hooks/cars.hook";
// import { isCarUnavailable } from "./helpers/carHelpers";
// import CarGridView from "./components/CarGridView";
import CarFlexView from "./components/CarFlexView";
// import CarGridSkeleton from "./components/CarGridSkeleton";
import CarFlexSkeleton from "./components/CarFlexSkeleton";
// import FiltersDialog from "./components/FiltersDialog";
import Pagination from "./components/Pagination";

// Sample car data (fallback if needed)
const localCarsData = [
  {
    id: 1,
    name: "BMW 3 Series",
    image: "/assets/cars/bmw-3.png",
    type: "SEDAN",
    year: 2025,
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.0,
    passengers: 4,
    transmission: "automatic",
    fuelType: "gasoline",
    features: [
      "Premium Sound System",
      "BOSE Sound System",
      "Leather Seats",
      "Premium coverage included",
      "Fuel tank full/full",
    ],
    description:
      "Experience luxury and performance with the BMW 3 Series. Perfect for business trips...",
  },
  {
    id: 2,
    name: "Mercedes GLC",
    image: "/assets/cars/mercedes-glc.png",
    type: "SUV",
    year: 2025,
    price: 349,
    originalPrice: 449,
    discount: 20,
    rating: 4.5,
    passengers: 5,
    transmission: "automatic",
    fuelType: "hybrid",
    features: [
      "Premium Sound System",
      "Panoramic Sunroof",
      "Leather Seats",
      "Premium coverage included",
      "Fuel tank full/full",
    ],
    description:
      "Luxury SUV with advanced features and comfortable interior...",
  },
];

export default function CarsCardSection() {
  const searchParams = useSearchParams();
  // Filter functionality commented out
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("All Categories");
  // const [priceRange, setPriceRange] = useState([0, 500]);
  // const [sortBy, setSortBy] = useState("Name (A-Z)");
  const [rentalDays, setRentalDays] = useState(23);

  // Get search parameters from URL
  const pickupLocationId = searchParams.get("pickup_location_id");
  const returnLocationId = searchParams.get("return_location_id");
  const pickupDate = searchParams.get("pickup_date");
  const pickupTime = searchParams.get("pickup_time") || "12:00";
  const returnDate = searchParams.get("return_date");
  const returnTime = searchParams.get("return_time") || "12:00";

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Use search API if search parameters are present, otherwise use regular cars API
  const hasSearchParams = pickupLocationId && pickupDate && returnDate;

  const searchCarsQuery = useSearchCars(
    hasSearchParams
      ? {
        pickup_location_id: pickupLocationId,
        return_location_id: returnLocationId || undefined,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        return_date: returnDate,
        return_time: returnTime,
      }
      : { pickup_location_id: null, pickup_date: null, return_date: null }
  );

  const regularCarsQuery = useCars({ per_page: 5, page: currentPage });

  // Use search results if available, otherwise use regular cars
  const { data, isLoading, isError, error } = hasSearchParams
    ? searchCarsQuery
    : regularCarsQuery;

  // Reset price range when search params are present (search results may have different price ranges)
  // Filter functionality commented out
  // useEffect(() => {
  //   if (hasSearchParams && data?.cars && data.cars.length > 0) {
  //     // Calculate min and max prices from search results
  //     const prices = data.cars.map(car => car.price || 0).filter(p => p > 0);
  //     if (prices.length > 0) {
  //       const minPrice = Math.min(...prices);
  //       const maxPrice = Math.max(...prices);
  //       // Set price range to accommodate all search results (with some padding)
  //       const newPriceRange = [Math.max(0, Math.floor(minPrice * 0.9)), Math.ceil(maxPrice * 1.1)];
  //       setPriceRange(newPriceRange);
  //       console.log("Price range adjusted for search results:", newPriceRange, "based on prices:", prices);
  //     }
  //   }
  // }, [hasSearchParams, data?.cars]);

  // Debug: Log search API data
  useEffect(() => {
    if (hasSearchParams) {
      console.log("=== SEARCH API DEBUG ===");
      console.log("hasSearchParams:", hasSearchParams);
      console.log("Search params:", {
        pickup_location_id: pickupLocationId,
        return_location_id: returnLocationId,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        return_date: returnDate,
        return_time: returnTime,
      });
      console.log("Search query state:", {
        isLoading: searchCarsQuery.isLoading,
        isError: searchCarsQuery.isError,
        error: searchCarsQuery.error,
        data: searchCarsQuery.data,
      });
      console.log("Transformed cars:", searchCarsQuery.data?.cars);
      console.log("Total cars:", searchCarsQuery.data?.cars?.length);
      console.log("Meta:", searchCarsQuery.data?.meta);
      if (searchCarsQuery.data?.cars && searchCarsQuery.data.cars.length > 0) {
        console.log("Car prices:", searchCarsQuery.data.cars.map(c => ({ name: c.name, price: c.price })));
      }
      // console.log("Current price range:", priceRange);
      console.log("=========================");
    }
  }, [hasSearchParams, searchCarsQuery.data, searchCarsQuery.isLoading, searchCarsQuery.isError, pickupLocationId, returnLocationId, pickupDate, returnDate]);

  // Calculate rental days from search API meta, search params, or booking storage
  // Logic: After each 24-hour period, if there's any additional time (even 1 minute), charge an extra day
  useEffect(() => {
    // First, try to use rental_period.days from search API meta
    if (data?.meta?.rental_period?.days) {
      setRentalDays(data.meta.rental_period.days);
      return;
    }

    // Helper function to calculate days from dates and times
    const calculateDaysFromDateTime = (pickupDateStr, returnDateStr, pickupTimeStr, returnTimeStr) => {
      try {
        // Parse date strings (format: YYYY-MM-DD)
        const pickupDateParts = pickupDateStr.split("-");
        const returnDateParts = returnDateStr.split("-");
        
        // Parse time strings (format: HH:mm)
        const [pickupHour, pickupMin] = (pickupTimeStr || "12:00").split(":").map(Number);
        const [returnHour, returnMin] = (returnTimeStr || "12:00").split(":").map(Number);
        
        // Create complete datetime objects
        const pickupDateTime = new Date(
          parseInt(pickupDateParts[0]),
          parseInt(pickupDateParts[1]) - 1, // Month is 0-indexed
          parseInt(pickupDateParts[2]),
          pickupHour,
          pickupMin,
          0,
          0,
        );
        
        const returnDateTime = new Date(
          parseInt(returnDateParts[0]),
          parseInt(returnDateParts[1]) - 1, // Month is 0-indexed
          parseInt(returnDateParts[2]),
          returnHour,
          returnMin,
          0,
          0,
        );
        
        // Calculate total time difference in milliseconds
        const timeDiffMs = returnDateTime - pickupDateTime;
        
        // Convert to hours
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
        
        // Calculate days: divide by 24 and round up to nearest integer
        const diffDays = Math.ceil(timeDiffHours / 24);
        
        return diffDays > 0 ? diffDays : 1;
      } catch {
        return null;
      }
    };

    // Calculate from URL params if available
    if (pickupDate && returnDate) {
      const calculatedDays = calculateDaysFromDateTime(pickupDate, returnDate, pickupTime, returnTime);
      if (calculatedDays !== null) {
        setRentalDays(calculatedDays);
        return;
      }
      
      // Fallback to booking storage
      const step1Data = bookingStorage.getStep("step1") || {};
      if (step1Data.pickupDate && step1Data.dropoffDate) {
        // Extract date part from ISO string if needed
        const pickupDateStr = step1Data.pickupDate instanceof Date 
          ? step1Data.pickupDate.toISOString().split("T")[0]
          : step1Data.pickupDate.split("T")[0];
        const returnDateStr = step1Data.dropoffDate instanceof Date
          ? step1Data.dropoffDate.toISOString().split("T")[0]
          : step1Data.dropoffDate.split("T")[0];
        
        const calculatedDaysFromStorage = calculateDaysFromDateTime(
          pickupDateStr,
          returnDateStr,
          step1Data.pickup_time || "12:00",
          step1Data.return_time || "12:00"
        );
        if (calculatedDaysFromStorage !== null) {
          setRentalDays(calculatedDaysFromStorage);
          return;
        }
      }
      setRentalDays(23);
    } else {
      // Fallback to booking storage
      const step1Data = bookingStorage.getStep("step1") || {};
      if (step1Data.pickupDate && step1Data.dropoffDate) {
        // Extract date part from ISO string if needed
        const pickupDateStr = step1Data.pickupDate instanceof Date 
          ? step1Data.pickupDate.toISOString().split("T")[0]
          : step1Data.pickupDate.split("T")[0];
        const returnDateStr = step1Data.dropoffDate instanceof Date
          ? step1Data.dropoffDate.toISOString().split("T")[0]
          : step1Data.dropoffDate.split("T")[0];
        
        const calculatedDaysFromStorage = calculateDaysFromDateTime(
          pickupDateStr,
          returnDateStr,
          step1Data.pickup_time || "12:00",
          step1Data.return_time || "12:00"
        );
        if (calculatedDaysFromStorage !== null) {
          setRentalDays(calculatedDaysFromStorage);
          return;
        }
      }
      setRentalDays(23);
    }
  }, [pickupDate, returnDate, pickupTime, returnTime, data?.meta?.rental_period?.days]);

  // Get available categories from API data
  // Filter functionality commented out
  // const availableCategories = ["All Categories"];
  // if (data?.cars) {
  //   const categories = new Set(data.cars.map(car => car.category).filter(Boolean));
  //   availableCategories.push(...Array.from(categories));
  // }

  // Filter and sort cars
  // Note: The hooks (useCars and useSearchCars) already filter by status "available"
  // This is an additional safety check to ensure only available cars are shown
  const carsToFilter = (data?.cars || localCarsData).filter(car => {
    // Double-check status: only show "available" cars
    // This ensures filtering works even if the hook filtering somehow fails
    const carStatus = car.status || car._apiData?.status;
    if (!carStatus) return true; // If no status, show the car (fallback)
    const statusLower = carStatus.toLowerCase();
    return statusLower === "available";
  });

  // Debug: Log cars data
  // Filter functionality commented out
  // useEffect(() => {
  //   console.log("=== CARS FILTERING DEBUG ===");
  //   console.log("carsToFilter:", carsToFilter);
  //   console.log("carsToFilter length:", carsToFilter?.length);
  //   console.log("searchTerm:", searchTerm);
  //   console.log("selectedCategory:", selectedCategory);
  //   console.log("priceRange:", priceRange);
  //   if (carsToFilter && carsToFilter.length > 0) {
  //     console.log("First car sample:", carsToFilter[0]);
  //     console.log("First car price:", carsToFilter[0]?.price);
  //     console.log("First car name:", carsToFilter[0]?.name);
  //     console.log("First car category:", carsToFilter[0]?.category);
  //   }
  //   console.log("============================");
  // }, [carsToFilter, searchTerm, selectedCategory, priceRange]);

  // Filter functionality commented out - showing all cars without filtering
  // const filteredCars = carsToFilter
  //   .filter((car) => {
  //     // Fix: Allow empty search term to show all cars
  //     const matchesSearch = !searchTerm || (car.name
  //       ?.toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ?? true);
  //     const matchesCategory =
  //       selectedCategory === "All Categories" ||
  //       car.category === selectedCategory;
  //     // Fix: Handle cases where car.price might be undefined or very high
  //     const carPrice = car.price || 0;
  //     const matchesPrice =
  //       carPrice >= priceRange[0] && carPrice <= priceRange[1];

  //     // Debug individual car filtering (only for search results)
  //     if (hasSearchParams) {
  //       if (!matchesSearch && searchTerm) {
  //         console.log(`Car "${car.name}" filtered out by search term "${searchTerm}"`);
  //       }
  //       if (!matchesCategory) {
  //         console.log(`Car "${car.name}" filtered out by category (${car.category} !== ${selectedCategory})`);
  //       }
  //       if (!matchesPrice) {
  //         console.log(`Car "${car.name}" filtered out by price (${carPrice} not in range [${priceRange[0]}, ${priceRange[1]}])`);
  //       }
  //     }

  //     return matchesSearch && matchesCategory && matchesPrice;
  //   })
  //   .sort((a, b) => {
  //     switch (sortBy) {
  //       case "Price (Low to High)":
  //         return a.price - b.price;
  //       case "Price (High to Low)":
  //         return b.price - a.price;
  //       case "Rating":
  //         return b.rating - a.rating;
  //       default:
  //         return a.name.localeCompare(b.name);
  //     }
  //   });

  // Show all cars without filtering
  const displayedCars = carsToFilter;

  // Debug: Log filtered results
  // Filter functionality commented out
  // useEffect(() => {
  //   if (hasSearchParams) {
  //     console.log("=== FILTERED CARS DEBUG ===");
  //     console.log("filteredCars length:", filteredCars.length);
  //     console.log("displayedCars length:", displayedCars.length);
  //     console.log("filteredCars:", filteredCars);
  //     console.log("===========================");
  //   }
  // }, [filteredCars, displayedCars, hasSearchParams]);

  const pagination = data?.pagination;

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Available Cars</h2>

          {/* View Toggle and Filters commented out */}
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "flex" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("flex")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                List
              </Button>
            </div>

            <FiltersDialog
              isOpen={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              availableCategories={availableCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div> */}
        </div>

        {/* Loading State - Skeleton */}
        {isLoading && (
          <CarFlexSkeleton />
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">
              {error?.response?.data?.message || "Failed to load cars. Please try again."}
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Cars Display - List view only */}
        {!isLoading && !isError && (
          <>
            <CarFlexView
              cars={displayedCars}
              pickupDate={pickupDate}
              returnDate={returnDate}
              rentalDays={rentalDays}
            />

            {/* Pagination - Only show for regular cars listing (not search) */}
            {!hasSearchParams && (
              <Pagination pagination={pagination} currentPage={currentPage} />
            )}
          </>
        )}

        {/* No Cars Found */}
        {!isLoading && !isError && displayedCars.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 text-lg mb-2">No cars available at the moment.</p>
              <p className="text-gray-500 text-sm">
                {hasSearchParams
                  ? "Please try different dates or locations."
                  : "All cars may be currently rented. Please check back later."}
              </p>
              {data && data.totalCarsFromAPI > 0 && data.availableCarsCount === 0 && (
                <p className="text-gray-400 text-xs mt-4">
                  Note: {data.totalCarsFromAPI} car(s) were found in the API but filtered out (status: rented/unavailable).
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
